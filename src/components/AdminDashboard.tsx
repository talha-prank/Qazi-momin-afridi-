import React, { useState, useEffect } from 'react';
import {
  Profile,
  TimelineItem,
  Activity,
  NewsArticle,
  GalleryItem,
  GalleryAlbum,
  VideoItem,
  SocialLinks,
  ContactMessage,
  SiteSettings,
  ActivityCategory,
  GalleryCategory
} from '../types';
import {
  Shield,
  Lock,
  User,
  Clock,
  Briefcase,
  Newspaper,
  Image,
  Video,
  Share2,
  Mail,
  Settings,
  Key,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Search,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
  initialProfile: Profile;
  initialTimeline: TimelineItem[];
  initialActivities: Activity[];
  initialNews: NewsArticle[];
  initialGallery: GalleryItem[];
  initialAlbums: GalleryAlbum[];
  initialVideos: VideoItem[];
  initialSocialLinks: SocialLinks;
  initialSiteSettings: SiteSettings;
}

type AdminTab =
  | 'profile'
  | 'timeline'
  | 'activities'
  | 'news'
  | 'gallery'
  | 'videos'
  | 'social'
  | 'messages'
  | 'settings'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
  initialProfile,
  initialTimeline,
  initialActivities,
  initialNews,
  initialGallery,
  initialAlbums,
  initialVideos,
  initialSocialLinks,
  initialSiteSettings
}) => {
  // Authentication states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('qma_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('MominKhyber2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable models
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialSocialLinks);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageSearch, setMessageSearch] = useState('');

  // Editing modals/states for sub-entities
  const [editingTimelineItem, setEditingTimelineItem] = useState<TimelineItem | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync state if props change
  useEffect(() => {
    setProfile(initialProfile);
    setTimeline(initialTimeline);
    setActivities(initialActivities);
    setNews(initialNews);
    setGallery(initialGallery);
    setAlbums(initialAlbums);
    setVideos(initialVideos);
    setSocialLinks(initialSocialLinks);
    setSiteSettings(initialSiteSettings);
  }, [
    initialProfile,
    initialTimeline,
    initialActivities,
    initialNews,
    initialGallery,
    initialAlbums,
    initialVideos,
    initialSocialLinks,
    initialSiteSettings
  ]);

  // Load messages if authenticated
  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setToken(data.token);
      localStorage.setItem('qma_admin_token', data.token);
      showToast('Welcome, Administrator. Session authorized.');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('qma_admin_token');
  };

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              dataUrl: reader.result,
              filename: file.name
            })
          });
          const data = await res.json();
          if (res.ok && data.url) {
            resolve(data.url);
          } else {
            // fallback to data url
            resolve(reader.result as string);
          }
        } catch {
          resolve(reader.result as string);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ---------------- SAVE HANDLERS ----------------
  const saveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        showToast('Profile updated successfully');
        onDataUpdated();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const saveSocialLinks = async () => {
    try {
      const res = await fetch('/api/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(socialLinks)
      });
      if (res.ok) {
        showToast('Social links updated');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const saveSiteSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(siteSettings)
      });
      if (res.ok) {
        showToast('Site settings updated');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const changeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Timeline handlers
  const saveTimelineItem = async (item: TimelineItem) => {
    try {
      const isNew = !timeline.some((t) => t.id === item.id);
      const url = isNew ? '/api/timeline' : `/api/timeline/${item.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setTimeline([...timeline, saved]);
        } else {
          setTimeline(timeline.map((t) => (t.id === saved.id ? saved : t)));
        }
        setEditingTimelineItem(null);
        showToast('Timeline updated');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteTimelineItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) return;
    try {
      const res = await fetch(`/api/timeline/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTimeline(timeline.filter((t) => t.id !== id));
        showToast('Timeline entry removed');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Activities handlers
  const saveActivityItem = async (act: Activity) => {
    try {
      const isNew = !activities.some((a) => a.id === act.id);
      const url = isNew ? '/api/activities' : `/api/activities/${act.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(act)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setActivities([saved, ...activities]);
        } else {
          setActivities(activities.map((a) => (a.id === saved.id ? saved : a)));
        }
        setEditingActivity(null);
        showToast('Public service activity saved');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteActivity = async (id: string) => {
    if (!confirm('Delete this public service activity?')) return;
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActivities(activities.filter((a) => a.id !== id));
        showToast('Activity removed');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // News Handlers
  const saveNewsItem = async (art: NewsArticle) => {
    try {
      const isNew = !news.some((n) => n.id === art.id);
      const url = isNew ? '/api/news' : `/api/news/${art.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(art)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setNews([saved, ...news]);
        } else {
          setNews(news.map((n) => (n.id === saved.id ? saved : n)));
        }
        setEditingArticle(null);
        showToast('Article published / saved');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteNewsItem = async (id: string) => {
    if (!confirm('Delete this news release?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
        showToast('Article removed');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Gallery Handlers
  const saveGalleryItem = async (item: GalleryItem) => {
    try {
      const isNew = !gallery.some((g) => g.id === item.id);
      const url = isNew ? '/api/gallery' : `/api/gallery/${item.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setGallery([saved, ...gallery]);
        } else {
          setGallery(gallery.map((g) => (g.id === saved.id ? saved : g)));
        }
        setEditingGalleryItem(null);
        showToast('Photograph saved to archive');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Remove this photo from archive?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setGallery(gallery.filter((g) => g.id !== id));
        showToast('Photo removed');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Video Handlers
  const saveVideoItem = async (vid: VideoItem) => {
    try {
      const isNew = !videos.some((v) => v.id === vid.id);
      const url = isNew ? '/api/videos' : `/api/videos/${vid.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vid)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setVideos([saved, ...videos]);
        } else {
          setVideos(videos.map((v) => (v.id === saved.id ? saved : v)));
        }
        setEditingVideo(null);
        showToast('Video item saved');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
        showToast('Video removed');
        onDataUpdated();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Messages Handlers
  const markMessageRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        showToast('Message removed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#04140e] border border-emerald-700/60 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-emerald-800/50 flex items-center justify-between bg-[#030d0a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-amber-400/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide">
                Secretariat Content Management & Administration
              </h2>
              <span className="text-[11px] text-emerald-400">
                Authorized Portal for Qazi Momin Afridi Public Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Status Bar */}
        {statusMessage && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-900/80 text-emerald-200 border-b border-emerald-700'
                : 'bg-red-950 text-red-200 border-b border-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Body */}
        {!token ? (
          /* LOGIN SCREEN */
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-emerald-800/40">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950">
                  <Lock className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Administrator Sign In
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter authorized administrator credentials to manage public profile data.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-300 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#020b08] border border-emerald-800/60 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#020b08] border border-emerald-800/60 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-900/40 text-[11px] text-slate-400">
                  <span className="text-amber-300 font-semibold">Pre-set Admin Credentials:</span>
                  <div className="mt-0.5">Username: <code className="text-white">admin</code></div>
                  <div>Password: <code className="text-white">MominKhyber2026!</code></div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {authLoading ? 'Verifying...' : 'Sign In To Dashboard'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED TABS & PANELS */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Tabs */}
            <aside className="w-full md:w-56 bg-[#030d0a] border-r border-emerald-900/40 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
              {[
                { id: 'profile', label: 'Profile & Bio', icon: <User className="w-4 h-4" /> },
                { id: 'timeline', label: 'Timeline Milestones', icon: <Clock className="w-4 h-4" /> },
                { id: 'activities', label: 'Public Activities', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'news', label: 'News & Media', icon: <Newspaper className="w-4 h-4" /> },
                { id: 'gallery', label: 'Photo Archive', icon: <Image className="w-4 h-4" /> },
                { id: 'videos', label: 'Speeches & Video', icon: <Video className="w-4 h-4" /> },
                { id: 'social', label: 'Social Channels', icon: <Share2 className="w-4 h-4" /> },
                {
                  id: 'messages',
                  label: `Messages (${messages.filter((m) => !m.isRead).length})`,
                  icon: <Mail className="w-4 h-4" />
                },
                { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
                { id: 'security', label: 'Password Security', icon: <Key className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-900/80 text-amber-300 border border-emerald-700/60 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/40'
                  }`}
                >
                  <span className="text-emerald-400 flex-shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </aside>

            {/* Tab Content Panel */}
            <main className="flex-1 p-6 overflow-y-auto bg-[#04120d]">
              
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Edit Official Public Profile
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage names, biographies, and descriptions across English, Urdu, and Pashto.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Full Name (English)
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Full Name (Urdu - اردو)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profile.fullNameUr}
                        onChange={(e) => setProfile({ ...profile, fullNameUr: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Full Name (Pashto - پښتو)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profile.fullNamePs}
                        onChange={(e) => setProfile({ ...profile, fullNamePs: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Public Role (English)
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Role (Urdu)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profile.roleUr}
                        onChange={(e) => setProfile({ ...profile, roleUr: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Role (Pashto)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profile.rolePs}
                        onChange={(e) => setProfile({ ...profile, rolePs: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Photo URLs or Local Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Profile Portrait Photo URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profile.profilePhoto}
                          onChange={(e) => setProfile({ ...profile, profilePhoto: e.target.value })}
                          className="flex-1 px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                        />
                        <label className="px-3 py-2 rounded bg-emerald-900 hover:bg-emerald-800 text-xs cursor-pointer flex items-center gap-1 text-slate-200">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const url = await handleFileUpload(f);
                                setProfile({ ...profile, profilePhoto: url });
                                showToast('Profile image uploaded');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Cover / Landscape Photo URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profile.coverPhoto}
                          onChange={(e) => setProfile({ ...profile, coverPhoto: e.target.value })}
                          className="flex-1 px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                        />
                        <label className="px-3 py-2 rounded bg-emerald-900 hover:bg-emerald-800 text-xs cursor-pointer flex items-center gap-1 text-slate-200">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const url = await handleFileUpload(f);
                                setProfile({ ...profile, coverPhoto: url });
                                showToast('Cover image uploaded');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Biographies */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Biography (English - Verified Record)
                      </label>
                      <textarea
                        rows={4}
                        value={profile.bioEn}
                        onChange={(e) => setProfile({ ...profile, bioEn: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Biography (Urdu - اردو)
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={profile.bioUr}
                        onChange={(e) => setProfile({ ...profile, bioUr: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Biography (Pashto - پښتو)
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={profile.bioPs}
                        onChange={(e) => setProfile({ ...profile, bioPs: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Political / Civic Representation Status (Verified)
                    </label>
                    <input
                      type="text"
                      value={profile.verifiedPartyAffiliation}
                      onChange={(e) =>
                        setProfile({ ...profile, verifiedPartyAffiliation: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Political & Civic Journey Timeline
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add, edit, or delete documented chronological milestones.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTimelineItem({
                          id: `tl-${Date.now()}`,
                          year: new Date().getFullYear().toString(),
                          titleEn: '',
                          titleUr: '',
                          titlePs: '',
                          descriptionEn: '',
                          descriptionUr: '',
                          descriptionPs: '',
                          category: 'Civic',
                          source: 'Public Record',
                          sourceUrl: '',
                          order: timeline.length + 1
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timeline.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#020b08] border border-emerald-800/40 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-xs">
                              {item.year}
                            </span>
                            <span className="text-[11px] text-emerald-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{item.titleEn}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.descriptionEn}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Source: {item.source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingTimelineItem(item)}
                            className="p-2 rounded bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-700/50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTimelineItem(item.id)}
                            className="p-2 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITIES */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Public Service & Community Activities
                      </h3>
                      <p className="text-xs text-slate-400">
                        Documented community initiatives with date, location, and verifiable source.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingActivity({
                          id: `act-${Date.now()}`,
                          titleEn: '',
                          titleUr: '',
                          titlePs: '',
                          category: 'Community Development',
                          descriptionEn: '',
                          descriptionUr: '',
                          descriptionPs: '',
                          imageUrl: '/src/assets/images/community_jirga_1790944393982.jpg',
                          date: new Date().toISOString().split('T')[0],
                          location: 'District Khyber',
                          source: 'District Administrative Release'
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Activity</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-xl bg-[#020b08] border border-emerald-800/40 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-amber-300 mb-2">
                            <span>{act.category}</span>
                            <span className="text-slate-400">{act.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{act.titleEn}</h4>
                          <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-light">
                            {act.descriptionEn}
                          </p>
                          <div className="text-[11px] text-slate-500">
                            Location: {act.location} • Source: {act.source}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-emerald-900/40 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingActivity(act)}
                            className="px-2.5 py-1 rounded bg-emerald-950 text-amber-300 hover:bg-emerald-900 text-xs flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteActivity(act.id)}
                            className="px-2.5 py-1 rounded bg-red-950 text-red-300 hover:bg-red-900 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: NEWS */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        News Releases & Press Statements
                      </h3>
                      <p className="text-xs text-slate-400">
                        Create, edit, and publish verified articles with external references.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingArticle({
                          id: `news-${Date.now()}`,
                          titleEn: '',
                          titleUr: '',
                          titlePs: '',
                          excerptEn: '',
                          excerptUr: '',
                          excerptPs: '',
                          contentEn: '',
                          contentUr: '',
                          contentPs: '',
                          category: 'Press Release',
                          date: new Date().toISOString().split('T')[0],
                          source: 'Regional Press Outlet',
                          sourceUrl: '',
                          imageUrl: '/src/assets/images/community_jirga_1790944393982.jpg',
                          isFeatured: false,
                          isPublished: true
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Article</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#020b08] border border-emerald-800/40 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="text-emerald-400 font-semibold">{item.category}</span>
                            <span className="text-slate-500">• {item.date}</span>
                            {item.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                                FEATURED
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                item.isPublished
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {item.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{item.titleEn}</h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Source: {item.source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingArticle(item)}
                            className="p-2 rounded bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-700/50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteNewsItem(item.id)}
                            className="p-2 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Documentary Photo Archive
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload and manage photos across Jirgas, Youth Events, and Assemblies.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingGalleryItem({
                          id: `gal-${Date.now()}`,
                          titleEn: '',
                          titleUr: '',
                          titlePs: '',
                          category: 'Public Events',
                          imageUrl: '/src/assets/images/community_jirga_1790944393982.jpg',
                          date: new Date().toISOString().split('T')[0],
                          location: 'District Khyber',
                          captionEn: '',
                          captionUr: '',
                          captionPs: ''
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-xl overflow-hidden bg-[#020b08] border border-emerald-800/40 relative group"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-950">
                          <img
                            src={photo.imageUrl}
                            alt={photo.titleEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-white truncate">{photo.titleEn}</h4>
                          <span className="text-[10px] text-amber-300 block">{photo.category}</span>
                          <div className="mt-2 flex items-center justify-between pt-2 border-t border-emerald-900/40">
                            <button
                              type="button"
                              onClick={() => setEditingGalleryItem(photo)}
                              className="text-slate-400 hover:text-amber-300"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteGalleryItem(photo.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Speeches & Public Video Archive
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage recorded video speeches from YouTube or Facebook.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingVideo({
                          id: `vid-${Date.now()}`,
                          titleEn: '',
                          titleUr: '',
                          titlePs: '',
                          descriptionEn: '',
                          descriptionUr: '',
                          descriptionPs: '',
                          videoUrl: '',
                          platform: 'youtube',
                          thumbnailUrl: '/src/assets/images/community_jirga_1790944393982.jpg',
                          date: new Date().toISOString().split('T')[0],
                          source: 'Official Channel'
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Video</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="p-4 rounded-xl bg-[#020b08] border border-emerald-800/40 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-amber-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                            {vid.platform}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">{vid.titleEn}</h4>
                          <span className="text-xs text-slate-400 block truncate max-w-md">
                            URL: {vid.videoUrl}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingVideo(vid)}
                            className="p-2 rounded bg-emerald-950 hover:bg-emerald-900 text-amber-300 border border-emerald-700/50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteVideo(vid.id)}
                            className="p-2 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SOCIAL MEDIA */}
              {activeTab === 'social' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Official Social Media Links
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add only verified and authentic public accounts.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={saveSocialLinks}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Social Links</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Facebook Official Page URL
                      </label>
                      <input
                        type="url"
                        value={socialLinks.facebook}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, facebook: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        X (formerly Twitter) Handle / URL
                      </label>
                      <input
                        type="url"
                        value={socialLinks.twitter}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, twitter: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={socialLinks.instagram}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, instagram: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        YouTube Official Channel URL
                      </label>
                      <input
                        type="url"
                        value={socialLinks.youtube}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, youtube: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        TikTok Official Handle URL
                      </label>
                      <input
                        type="url"
                        value={socialLinks.tiktok}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, tiktok: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        WhatsApp Secretariat Direct Link
                      </label>
                      <input
                        type="url"
                        value={socialLinks.whatsapp}
                        onChange={(e) =>
                          setSocialLinks({ ...socialLinks, whatsapp: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Constituent Contact Inquiries
                      </h3>
                      <p className="text-xs text-slate-400">
                        Messages submitted via the public contact portal.
                      </p>
                    </div>

                    <div className="relative w-64">
                      <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                        placeholder="Search sender, email, subject..."
                        className="w-full pl-8 pr-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-400">
                        No messages received yet.
                      </div>
                    ) : (
                      messages
                        .filter(
                          (m) =>
                            m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                            m.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                            m.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                            m.message.toLowerCase().includes(messageSearch.toLowerCase())
                        )
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-4 rounded-xl border transition-colors ${
                              msg.isRead
                                ? 'bg-[#020b08]/70 border-emerald-900/40 text-slate-400'
                                : 'bg-[#051c13] border-amber-500/40 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{msg.name}</span>
                                <span className="text-[11px] text-emerald-400">({msg.email})</span>
                                {msg.phone && (
                                  <span className="text-[11px] text-slate-400">
                                    • Tel: {msg.phone}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-amber-300 mb-1">
                              Subject: {msg.subject}
                            </h4>
                            <p className="text-xs leading-relaxed text-slate-300 bg-[#020b08] p-3 rounded-lg border border-emerald-950 mb-3 whitespace-pre-wrap">
                              {msg.message}
                            </p>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-900/30">
                              <div className="flex items-center gap-2">
                                {!msg.isRead && (
                                  <button
                                    type="button"
                                    onClick={() => markMessageRead(msg.id)}
                                    className="px-2.5 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-[11px]"
                                  >
                                    Mark As Read
                                  </button>
                                )}
                                <a
                                  href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(
                                    msg.subject
                                  )}`}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px]"
                                >
                                  Reply via Email
                                </a>
                              </div>

                              <button
                                type="button"
                                onClick={() => deleteMessage(msg.id)}
                                className="text-red-400 hover:text-red-300 text-xs p-1"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 9: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Global Website & Secretariat Settings
                      </h3>
                      <p className="text-xs text-slate-400">
                        Site title, hero captions, office address, and contact numbers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={saveSiteSettings}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Settings</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Portal Title (HTML & SEO Title)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.siteTitle}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, siteTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Hero Mountain Background URL
                      </label>
                      <input
                        type="text"
                        value={siteSettings.heroImage}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, heroImage: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Contact Official Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, contactEmail: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Office Direct Phone
                      </label>
                      <input
                        type="text"
                        value={siteSettings.contactPhone}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, contactPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Secretariat Address (English)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.officeAddressEn}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, officeAddressEn: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Secretariat Address (Urdu - اردو)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={siteSettings.officeAddressUr}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, officeAddressUr: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Secretariat Address (Pashto - پښتو)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={siteSettings.officeAddressPs}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, officeAddressPs: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: SECURITY */}
              {activeTab === 'security' && (
                <div className="max-w-md space-y-6">
                  <div className="pb-3 border-b border-emerald-900/50">
                    <h3 className="text-base font-bold text-white font-serif">
                      Administrator Password Security
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update master secret key for this administrative portal.
                    </p>
                  </div>

                  <form onSubmit={changeAdminPassword} className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        New Password (Minimum 8 chars)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Update Admin Password
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* SUB-MODAL: Edit Timeline Item */}
      {editingTimelineItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#051a12] border border-emerald-700/60 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
              <h4 className="text-sm font-bold text-white font-serif">
                {editingTimelineItem.titleEn ? 'Edit Milestone' : 'Add New Milestone'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingTimelineItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Year / Range (e.g. 2023)
                </label>
                <input
                  type="text"
                  required
                  value={editingTimelineItem.year}
                  onChange={(e) =>
                    setEditingTimelineItem({ ...editingTimelineItem, year: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={editingTimelineItem.category}
                  onChange={(e) =>
                    setEditingTimelineItem({
                      ...editingTimelineItem,
                      category: e.target.value as any
                    })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                >
                  <option value="Civic">Civic</option>
                  <option value="Community">Community</option>
                  <option value="Peace">Peace</option>
                  <option value="Public Representation">Public Representation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Title (English)
              </label>
              <input
                type="text"
                required
                value={editingTimelineItem.titleEn}
                onChange={(e) =>
                  setEditingTimelineItem({ ...editingTimelineItem, titleEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Title (Urdu)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingTimelineItem.titleUr}
                  onChange={(e) =>
                    setEditingTimelineItem({ ...editingTimelineItem, titleUr: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Title (Pashto)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingTimelineItem.titlePs}
                  onChange={(e) =>
                    setEditingTimelineItem({ ...editingTimelineItem, titlePs: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Description (English)
              </label>
              <textarea
                rows={3}
                value={editingTimelineItem.descriptionEn}
                onChange={(e) =>
                  setEditingTimelineItem({
                    ...editingTimelineItem,
                    descriptionEn: e.target.value
                  })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Verifiable Source
                </label>
                <input
                  type="text"
                  required
                  value={editingTimelineItem.source}
                  onChange={(e) =>
                    setEditingTimelineItem({ ...editingTimelineItem, source: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Source Reference Link
                </label>
                <input
                  type="url"
                  value={editingTimelineItem.sourceUrl || ''}
                  onChange={(e) =>
                    setEditingTimelineItem({ ...editingTimelineItem, sourceUrl: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={() => setEditingTimelineItem(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveTimelineItem(editingTimelineItem)}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Edit Activity */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#051a12] border border-emerald-700/60 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
              <h4 className="text-sm font-bold text-white font-serif">
                {editingActivity.titleEn ? 'Edit Activity' : 'Add Activity'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={editingActivity.category}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      category: e.target.value as ActivityCategory
                    })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                >
                  <option value="Community Development">Community Development</option>
                  <option value="Youth Engagement">Youth Engagement</option>
                  <option value="Peace & Community Initiatives">
                    Peace & Community Initiatives
                  </option>
                  <option value="Local Issues">Local Issues</option>
                  <option value="Education">Education</option>
                  <option value="Employment">Employment</option>
                  <option value="Development of Merged Districts">
                    Development of Merged Districts
                  </option>
                  <option value="Public Awareness">Public Awareness</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingActivity.date}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, date: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Title (English)
              </label>
              <input
                type="text"
                required
                value={editingActivity.titleEn}
                onChange={(e) =>
                  setEditingActivity({ ...editingActivity, titleEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Description (English)
              </label>
              <textarea
                rows={3}
                value={editingActivity.descriptionEn}
                onChange={(e) =>
                  setEditingActivity({ ...editingActivity, descriptionEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Location (e.g. Landi Kotal)
                </label>
                <input
                  type="text"
                  value={editingActivity.location}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, location: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Documented Source
                </label>
                <input
                  type="text"
                  value={editingActivity.source}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, source: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveActivityItem(editingActivity)}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Edit News Article */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#051a12] border border-emerald-700/60 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
              <h4 className="text-sm font-bold text-white font-serif">
                {editingArticle.titleEn ? 'Edit Article' : 'Create Article'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, category: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingArticle.date}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, date: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Headline (English)
              </label>
              <input
                type="text"
                required
                value={editingArticle.titleEn}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, titleEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Excerpt (English)
              </label>
              <textarea
                rows={2}
                value={editingArticle.excerptEn}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, excerptEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Full Article Content (English)
              </label>
              <textarea
                rows={4}
                value={editingArticle.contentEn}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, contentEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Documented Source Outlet
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.source}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, source: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  External Article Link
                </label>
                <input
                  type="url"
                  value={editingArticle.sourceUrl || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, sourceUrl: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.isFeatured}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })
                  }
                  className="rounded bg-emerald-950 border-emerald-800"
                />
                <span>Pin as Featured Headline</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingArticle.isPublished}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, isPublished: e.target.checked })
                  }
                  className="rounded bg-emerald-950 border-emerald-800"
                />
                <span>Published on Public Portal</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveNewsItem(editingArticle)}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Edit Gallery Item */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#051a12] border border-emerald-700/60 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
              <h4 className="text-sm font-bold text-white font-serif">Add / Edit Photograph</h4>
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Photograph Title (English)
              </label>
              <input
                type="text"
                required
                value={editingGalleryItem.titleEn}
                onChange={(e) =>
                  setEditingGalleryItem({ ...editingGalleryItem, titleEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={editingGalleryItem.category}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      category: e.target.value as GalleryCategory
                    })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                >
                  <option value="Jirgas">Jirgas</option>
                  <option value="Youth Events">Youth Events</option>
                  <option value="Public Events">Public Events</option>
                  <option value="Community Meetings">Community Meetings</option>
                  <option value="Political Activities">Political Activities</option>
                  <option value="Public Speeches">Public Speeches</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingGalleryItem.date}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, date: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Photo URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={editingGalleryItem.imageUrl}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
                <label className="px-3 py-1.5 rounded bg-emerald-900 text-xs cursor-pointer flex items-center gap-1 text-slate-200">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = await handleFileUpload(f);
                        setEditingGalleryItem({ ...editingGalleryItem, imageUrl: url });
                        showToast('Photo uploaded');
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Caption
              </label>
              <textarea
                rows={2}
                value={editingGalleryItem.captionEn}
                onChange={(e) =>
                  setEditingGalleryItem({ ...editingGalleryItem, captionEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveGalleryItem(editingGalleryItem)}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Edit Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#051a12] border border-emerald-700/60 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
              <h4 className="text-sm font-bold text-white font-serif">Add / Edit Video</h4>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Video Title
              </label>
              <input
                type="text"
                required
                value={editingVideo.titleEn}
                onChange={(e) => setEditingVideo({ ...editingVideo, titleEn: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Platform
                </label>
                <select
                  value={editingVideo.platform}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, platform: e.target.value as any })
                  }
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                >
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="direct">Direct Upload / Link</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingVideo.date}
                  onChange={(e) => setEditingVideo({ ...editingVideo, date: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Video URL (YouTube link, Facebook video link, etc.)
              </label>
              <input
                type="url"
                required
                value={editingVideo.videoUrl}
                onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                value={editingVideo.thumbnailUrl}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                Description / Context
              </label>
              <textarea
                rows={3}
                value={editingVideo.descriptionEn}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, descriptionEn: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded bg-[#020b08] border border-emerald-800 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveVideoItem(editingVideo)}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
              >
                Save Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
