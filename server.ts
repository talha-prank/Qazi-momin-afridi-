import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './server/db.js';
import { DatabaseSchema, ContactMessage } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// Simple in-memory session token store (token -> username)
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function generateToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days validity
  activeSessions.set(token, {
    username,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  });
  return token;
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  // prolong session
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  (req as any).user = session.username;
  next();
}

// Rate limiter / Spam honeypot for contact form
const ipSubmissionTimestamps = new Map<string, number[]>();

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Public bundle data for fast one-request frontend hydration
app.get('/api/public-data', (_req: Request, res: Response) => {
  const db = getDb();
  // Filter out unpinned or unpublished news for public view, redact users and private messages
  const publicNews = db.news.filter(n => n.isPublished !== false);
  res.json({
    profile: db.profile,
    timeline: db.timeline.sort((a, b) => a.order - b.order),
    activities: db.activities,
    news: publicNews,
    gallery: db.gallery,
    albums: db.albums,
    videos: db.videos,
    socialLinks: db.socialLinks,
    siteSettings: db.siteSettings
  });
});

// Admin Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = getDb();
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const user = db.users.find(u => u.username === username && u.passwordHash === hash);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = generateToken(user.username);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/auth/verify', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const username = (req as any).user;
  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  res.json({
    valid: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.post('/api/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const db = getDb();
  const username = (req as any).user;
  const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');
  const userIndex = db.users.findIndex(u => u.username === username && u.passwordHash === currentHash);

  if (userIndex === -1) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }

  db.users[userIndex].passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  saveDb(db);
  res.json({ message: 'Password updated successfully' });
});

// Profile
app.get('/api/profile', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.profile);
});

app.put('/api/profile', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.profile = { ...db.profile, ...req.body };
  saveDb(db);
  res.json(db.profile);
});

// Timeline
app.get('/api/timeline', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.timeline.sort((a, b) => a.order - b.order));
});

app.post('/api/timeline', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newItem = {
    ...req.body,
    id: `tl-${Date.now()}`,
    order: db.timeline.length + 1
  };
  db.timeline.push(newItem);
  saveDb(db);
  res.status(201).json(newItem);
});

app.put('/api/timeline/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.timeline.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  db.timeline[index] = { ...db.timeline[index], ...req.body };
  saveDb(db);
  res.json(db.timeline[index]);
});

app.delete('/api/timeline/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.timeline = db.timeline.filter(t => t.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

app.put('/api/timeline-reorder', requireAuth, (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  const db = getDb();
  ids.forEach((id: string, index: number) => {
    const item = db.timeline.find(t => t.id === id);
    if (item) item.order = index + 1;
  });
  saveDb(db);
  res.json(db.timeline.sort((a, b) => a.order - b.order));
});

// Activities
app.get('/api/activities', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.activities);
});

app.post('/api/activities', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newActivity = {
    ...req.body,
    id: `act-${Date.now()}`
  };
  db.activities.unshift(newActivity);
  saveDb(db);
  res.status(201).json(newActivity);
});

app.put('/api/activities/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.activities.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Activity not found' });
  db.activities[index] = { ...db.activities[index], ...req.body };
  saveDb(db);
  res.json(db.activities[index]);
});

app.delete('/api/activities/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.activities = db.activities.filter(a => a.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// News
app.get('/api/news', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.news);
});

app.post('/api/news', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newArticle = {
    ...req.body,
    id: `news-${Date.now()}`,
    isPublished: req.body.isPublished !== false
  };
  db.news.unshift(newArticle);
  saveDb(db);
  res.status(201).json(newArticle);
});

app.put('/api/news/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.news.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Article not found' });
  db.news[index] = { ...db.news[index], ...req.body };
  saveDb(db);
  res.json(db.news[index]);
});

app.delete('/api/news/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.news = db.news.filter(n => n.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Gallery & Albums
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.gallery);
});

app.post('/api/gallery', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newItem = {
    ...req.body,
    id: `gal-${Date.now()}`
  };
  db.gallery.unshift(newItem);
  saveDb(db);
  res.status(201).json(newItem);
});

app.put('/api/gallery/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.gallery.findIndex(g => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  db.gallery[index] = { ...db.gallery[index], ...req.body };
  saveDb(db);
  res.json(db.gallery[index]);
});

app.delete('/api/gallery/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

app.get('/api/albums', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.albums);
});

app.post('/api/albums', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newAlbum = {
    ...req.body,
    id: `alb-${Date.now()}`
  };
  db.albums.push(newAlbum);
  saveDb(db);
  res.status(201).json(newAlbum);
});

app.delete('/api/albums/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.albums = db.albums.filter(a => a.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Videos
app.get('/api/videos', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.videos);
});

app.post('/api/videos', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const newVideo = {
    ...req.body,
    id: `vid-${Date.now()}`
  };
  db.videos.unshift(newVideo);
  saveDb(db);
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.videos.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });
  db.videos[index] = { ...db.videos[index], ...req.body };
  saveDb(db);
  res.json(db.videos[index]);
});

app.delete('/api/videos/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.videos = db.videos.filter(v => v.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// Social Links
app.get('/api/social-links', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.socialLinks);
});

app.put('/api/social-links', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.socialLinks = { ...db.socialLinks, ...req.body };
  saveDb(db);
  res.json(db.socialLinks);
});

// Site Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.siteSettings);
});

app.put('/api/settings', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  saveDb(db);
  res.json(db.siteSettings);
});

// Contact Messages & Public submission with anti-spam rate limiting & honeypot
app.get('/api/messages', requireAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.contactMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Generous rate limiting: max 60 messages per IP per 10 minutes
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  const now = Date.now();
  const timestamps = (ipSubmissionTimestamps.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (timestamps.length >= 60) {
    return res.status(429).json({ error: 'Too many submissions. Please wait a moment.' });
  }
  timestamps.push(now);
  ipSubmissionTimestamps.set(ip, timestamps);

  const db = getDb();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 100),
    phone: String(phone || '').slice(0, 30),
    subject: String(subject || 'General Inquiry').slice(0, 150),
    message: String(message).slice(0, 3000),
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.contactMessages.unshift(newMessage);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Message sent successfully' });
});

app.put('/api/messages/:id/read', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const message = db.contactMessages.find(m => m.id === req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found' });
  message.isRead = true;
  saveDb(db);
  res.json(message);
});

app.delete('/api/messages/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.contactMessages = db.contactMessages.filter(m => m.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// File upload endpoint (accepts base64 data and writes image file to /public/uploads)
app.post('/api/upload', requireAuth, (req: Request, res: Response) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'No dataUrl provided' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a URL, return it
      if (typeof dataUrl === 'string' && (dataUrl.startsWith('http') || dataUrl.startsWith('/'))) {
        return res.json({ url: dataUrl });
      }
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const base64Data = matches[2];
    const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : `upload_${Date.now()}`) + `.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    const url = `/uploads/${safeName}`;
    res.json({ url });
  } catch (err: any) {
    console.error('Upload error', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
