/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Language,
  Profile,
  TimelineItem,
  Activity,
  NewsArticle,
  GalleryItem,
  GalleryAlbum,
  VideoItem,
  SocialLinks,
  SiteSettings
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { TimelineSection } from './components/TimelineSection';
import { NewsSection } from './components/NewsSection';
import { VideosSection } from './components/VideosSection';
import { GallerySection } from './components/GallerySection';
import { SourcesSection } from './components/SourcesSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { SectionReveal3D } from './components/ScrollReveal3D';

// Fallback verified state in case network hydration is loading
const defaultProfile: Profile = {
  id: 'profile-qazi-momin',
  fullName: 'Qazi Momin Afridi',
  fullNameUr: 'قاضی مومن آفریدی',
  fullNamePs: 'قاضی مومن اپریدی',
  location: 'District Khyber, Khyber Pakhtunkhwa, Pakistan',
  locationUr: 'ضلع خیبر، خیبر پختونخوا، پاکستان',
  locationPs: 'خیبر ولسوالۍ، خیبر پښتونخوا، پاکستان',
  role: 'Public Figure & Community Representative',
  roleUr: 'عوامی و سماجی نمائندہ',
  rolePs: 'ولسی او ټولنیز استازی',
  verifiedPartyAffiliation: 'Independent Community Representative (Documented Civic Record)',
  bioEn:
    'Qazi Momin Afridi is a public figure and dedicated community representative from District Khyber, Khyber Pakhtunkhwa. His public engagement centers on grassroots community advocacy, peaceful conflict resolution through traditional tribal jirgas, educational equity, and the socio-economic mainstreaming of the merged tribal districts.',
  bioUr:
    'قاضی مومن آفریدی ضلع خیبر، خیبر پختونخوا سے تعلق رکھنے والے ایک نمایاں عوامی اور سماجی رہنما ہیں۔ ان کی عوامی خدمات کا بنیادی محور قبائلی اضلاع کے انضمام کے بعد عوام کے بنیادی حقوق، تعلیمی اصلاحات، روایتی جرگہ نظام کے ذریعے قبائلی امن و آشتی کا فروغ، اور نوجوانوں کے لیے روزگار کے مواقع پیدا کرنا ہے۔',
  bioPs:
    'قاضی مومن اپریدی د خیبر پښتونخوا د خیبر ولسوالۍ یو پیژندل شوی ولسی او ټولنیز مشر دی. د ده هڅې او فعالیتونه د ادغام شویو سیمو د پرمختګ، روایتي جرګو له لارې د سولې ټینګښت، او د ځوانانو د روزنې لپاره دي.',
  profilePhoto: 'https://i.postimg.cc/qq9dHzdG/FB-IMG-1790968641902.jpg',
  coverPhoto: '/src/assets/images/khyber_mountains_1790944376566.jpg',
  languages: ['Pashto (Native)', 'Urdu (Fluent)', 'English (Professional)'],
  educationVerified: [
    'Documented Academic Credentials Verified by Institutional Records'
  ],
  experience: [
    'Community Representation & Public Service Advocate, Khyber District',
    'Organizer & Participant in Civic Development Assemblies and Peace Jirgas',
    'Youth Empowerment Initiatives Coordinator in Newly Merged Districts'
  ],
  verifiedDesignations: [
    'Public Representative & Social Advocate',
    'Convenor of Khyber Community Welfare Initiatives'
  ]
};

const defaultSiteSettings: SiteSettings = {
  siteTitle: 'Qazi Momin Afridi | Official Public Profile',
  siteSubtitleEn: 'Public Profile • Community Service • District Khyber',
  siteSubtitleUr: 'عوامی پروفائل • سماجی خدمت • ضلع خیبر',
  siteSubtitlePs: 'ولسي پېژندنه • ټولنیز خدمت • خیبر ولسوالۍ',
  heroImage: '/src/assets/images/khyber_mountains_1790944376566.jpg',
  heroQuoteEn:
    'True public service is rooted in listening to our community, preserving honor, and advancing justice without compromise.',
  heroQuoteUr:
    'حقیقی عوامی خدمت اپنے لوگوں کی آواز سننے، وقار کی پاسداری اور غیر متزلزل انصاف کے حصول کا نام ہے۔',
  heroQuotePs:
    'ریښتینی ولسی خدمت د خپلو خلکو غږ اوریدلو، د عزت ساتلو او تلپاتې عدالت ته د ژمنتیا نوم دی.',
  contactEmail: 'secretariat@qazimominafridi.pk',
  contactPhone: '+92 91 5000000',
  officeAddressEn:
    'Community Secretariat, Main Road, Landi Kotal & Jamrud, District Khyber, KP, Pakistan',
  officeAddressUr:
    'پبلک سیکریٹریٹ، مین روڈ، لنڈی کوتل و جمرود، ضلع خیبر، خیبر پختونخوا، پاکستان',
  officeAddressPs:
    'ولسي دارالانشاء، عمومي سړک، لنډي کوتل او جمرود، خیبر ولسوالۍ، پاکستان',
  publicNoticeEn:
    'Notice of Verification: Every public statement and civic milestone published here is maintained under strict factual documentation.',
  publicNoticeUr:
    'تصدیقی وضاحت: اس پلیٹ فارم پر درج ہر عوامی سرگرمی اور سنگ میل مصدقہ عوامی ریکارڈ پر مبنی ہے۔',
  publicNoticePs:
    'د تصدیق یادښت: په دې رسمي پاڼه کې ټول خپاره شوي معلومات په کره او باوري اسنادو ولاړ دي.',
  sourcesNoteEn:
    'Our Public Record & Sources archive allows complete verification of every documented community initiative, official address, and civic undertaking.',
  sourcesNoteUr:
    'ہمارا پبلک ریکارڈ اور ذرائع سیکشن ہر درج شدہ عوامی اقدام، خطاب اور سرگرمی کی آزادانہ تصدیق کا موقع فراہم کرتا ہے۔',
  sourcesNotePs:
    'زموږ د سرچینو او اسنادو برخه هر چا ته اجازه ورکوي چې د ټولو فعالیتونو کره والی په خپله وګوري.'
};

const defaultSocialLinks: SocialLinks = {
  facebook: 'https://www.facebook.com/share/14qgxW8VNEj/',
  twitter: 'https://x.com/QaziMominAfridi',
  instagram: 'https://www.instagram.com/qazimominafridi?stkn=M3J2ODl4dG14ejg5',
  youtube: 'https://youtube.com/@QaziMominAfridiOfficial',
  tiktok: 'https://www.tiktok.com/@qazimominkhan4941?_r=1&_t=ZS-9AE7dae5vT6',
  whatsapp: 'https://wa.me/923000000000'
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [adminOpen, setAdminOpen] = useState(false);

  // Application Data States
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  // Sync RTL and lang attribute
  useEffect(() => {
    const isRtl = currentLang === 'ur' || currentLang === 'ps';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Fetch Public Data from Backend
  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.timeline) setTimeline(data.timeline);
        if (data.activities) setActivities(data.activities);
        if (data.news) setNews(data.news);
        if (data.gallery) setGallery(data.gallery);
        if (data.albums) setAlbums(data.albums);
        if (data.videos) setVideos(data.videos);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
      }
    } catch (err) {
      console.warn('Could not fetch /api/public-data, using local state', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#030d0a] text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAdmin={() => setAdminOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Main Public Service Sections */}
      <main className="flex-1">
        {/* Hero Section with Parallax Depth & Khyber Mountains */}
        <HeroSection
          currentLang={currentLang}
          profile={profile}
          siteSettings={siteSettings}
        />

        {/* Factual Biography & 3D Profile Card */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <AboutSection currentLang={currentLang} profile={profile} />
        </SectionReveal3D>

        {/* Documented Public Service Activities */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <ActivitiesSection currentLang={currentLang} activities={activities} />
        </SectionReveal3D>

        {/* Political & Civic Journey 3D Vertical Timeline */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <TimelineSection currentLang={currentLang} timeline={timeline} />
        </SectionReveal3D>

        {/* News & Official Statements */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <NewsSection currentLang={currentLang} news={news} />
        </SectionReveal3D>

        {/* Speeches & Media Archive */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <VideosSection currentLang={currentLang} videos={videos} />
        </SectionReveal3D>

        {/* Masonry Photo Gallery */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <GallerySection currentLang={currentLang} gallery={gallery} />
        </SectionReveal3D>

        {/* Public Record & Sources (Trust Index) */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <SourcesSection
            currentLang={currentLang}
            activities={activities}
            timeline={timeline}
            news={news}
            siteSettings={siteSettings}
          />
        </SectionReveal3D>

        {/* Official Verified Social Handles */}
        <SectionReveal3D depth={-90} rotateX={4}>
          <SocialMediaSection currentLang={currentLang} socialLinks={socialLinks} />
        </SectionReveal3D>

        {/* Official Contact & Secretariat */}
        <SectionReveal3D depth={-100} rotateX={4}>
          <ContactSection currentLang={currentLang} siteSettings={siteSettings} />
        </SectionReveal3D>
      </main>

      {/* Premium Footer */}
      <Footer
        currentLang={currentLang}
        socialLinks={socialLinks}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Full Administrator Dashboard Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataUpdated={loadData}
        initialProfile={profile}
        initialTimeline={timeline}
        initialActivities={activities}
        initialNews={news}
        initialGallery={gallery}
        initialAlbums={albums}
        initialVideos={videos}
        initialSocialLinks={socialLinks}
        initialSiteSettings={siteSettings}
      />
    </div>
  );
}
