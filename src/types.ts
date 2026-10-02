export type Language = 'en' | 'ur' | 'ps';

export interface Profile {
  id: string;
  fullName: string;
  fullNameUr: string;
  fullNamePs: string;
  location: string;
  locationUr: string;
  locationPs: string;
  role: string;
  roleUr: string;
  rolePs: string;
  verifiedPartyAffiliation: string;
  bioEn: string;
  bioUr: string;
  bioPs: string;
  profilePhoto: string;
  coverPhoto: string;
  languages: string[];
  educationVerified: string[];
  experience: string[];
  verifiedDesignations: string[];
}

export interface TimelineItem {
  id: string;
  year: string;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  descriptionEn: string;
  descriptionUr: string;
  descriptionPs: string;
  category: 'Community' | 'Civic' | 'Peace' | 'Public Representation';
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  order: number;
}

export type ActivityCategory =
  | 'Community Development'
  | 'Youth Engagement'
  | 'Peace & Community Initiatives'
  | 'Local Issues'
  | 'Education'
  | 'Employment'
  | 'Development of Merged Districts'
  | 'Public Awareness';

export interface Activity {
  id: string;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  category: ActivityCategory;
  descriptionEn: string;
  descriptionUr: string;
  descriptionPs: string;
  imageUrl: string;
  date: string;
  location: string;
  source: string;
  sourceUrl?: string;
}

export interface NewsArticle {
  id: string;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  excerptEn: string;
  excerptUr: string;
  excerptPs: string;
  contentEn: string;
  contentUr: string;
  contentPs: string;
  category: string;
  date: string;
  source: string;
  sourceUrl?: string;
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export type GalleryCategory =
  | 'Public Events'
  | 'Community Meetings'
  | 'Political Activities'
  | 'Jirgas'
  | 'Youth Events'
  | 'Public Speeches'
  | 'Other';

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  albumId?: string;
  category: GalleryCategory;
  imageUrl: string;
  date: string;
  location: string;
  captionEn: string;
  captionUr: string;
  captionPs: string;
}

export interface GalleryAlbum {
  id: string;
  nameEn: string;
  nameUr: string;
  namePs: string;
  descriptionEn: string;
  descriptionUr: string;
  descriptionPs: string;
  coverUrl: string;
}

export interface VideoItem {
  id: string;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  descriptionEn: string;
  descriptionUr: string;
  descriptionPs: string;
  videoUrl: string;
  platform: 'youtube' | 'facebook' | 'direct';
  thumbnailUrl: string;
  date: string;
  source: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitleEn: string;
  siteSubtitleUr: string;
  siteSubtitlePs: string;
  logoUrl?: string;
  heroImage: string;
  heroQuoteEn: string;
  heroQuoteUr: string;
  heroQuotePs: string;
  contactEmail: string;
  contactPhone: string;
  officeAddressEn: string;
  officeAddressUr: string;
  officeAddressPs: string;
  publicNoticeEn: string;
  publicNoticeUr: string;
  publicNoticePs: string;
  sourcesNoteEn: string;
  sourcesNoteUr: string;
  sourcesNotePs: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin';
  name: string;
}

export interface DatabaseSchema {
  profile: Profile;
  timeline: TimelineItem[];
  activities: Activity[];
  news: NewsArticle[];
  gallery: GalleryItem[];
  albums: GalleryAlbum[];
  videos: VideoItem[];
  socialLinks: SocialLinks;
  contactMessages: ContactMessage[];
  siteSettings: SiteSettings;
  users: User[];
}
