import { Language } from '../types';

export interface Translations {
  nav: {
    home: string;
    about: string;
    activities: string;
    journey: string;
    news: string;
    gallery: string;
    videos: string;
    sources: string;
    contact: string;
    admin: string;
  };
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
    exploreProfile: string;
    publicActivities: string;
    districtKhyber: string;
    verifiedFactualNotice: string;
  };
  about: {
    sectionTitle: string;
    sectionSubtitle: string;
    fullProfile: string;
    closeProfile: string;
    biographyTitle: string;
    keyDetails: string;
    location: string;
    role: string;
    affiliation: string;
    languages: string;
    academicRecord: string;
    experienceTitle: string;
    designations: string;
    downloadBrief: string;
    verifiedNotice: string;
  };
  activities: {
    sectionTitle: string;
    sectionSubtitle: string;
    allCategories: string;
    sourceLabel: string;
    viewSource: string;
    filterBy: string;
  };
  journey: {
    sectionTitle: string;
    sectionSubtitle: string;
    viewDocumentation: string;
  };
  news: {
    sectionTitle: string;
    sectionSubtitle: string;
    featuredStory: string;
    searchPlaceholder: string;
    readFullArticle: string;
    sourceLabel: string;
    shareArticle: string;
    copied: string;
    allArticles: string;
  };
  gallery: {
    sectionTitle: string;
    sectionSubtitle: string;
    allPhotos: string;
    viewImage: string;
    close: string;
    date: string;
    location: string;
  };
  videos: {
    sectionTitle: string;
    sectionSubtitle: string;
    watchVideo: string;
    platform: string;
    source: string;
    closeModal: string;
  };
  sources: {
    sectionTitle: string;
    sectionSubtitle: string;
    description: string;
    transparencyPledge: string;
    claim: string;
    publication: string;
    date: string;
    verificationLink: string;
  };
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendMessage: string;
    sending: string;
    successMessage: string;
    officeAddress: string;
    officialChannels: string;
    directLine: string;
    spamProtected: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    officialNotice: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    designedWithRespect: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      activities: 'Public Service',
      journey: 'Civic Journey',
      news: 'News & Media',
      gallery: 'Gallery',
      videos: 'Speeches & Media',
      sources: 'Public Record',
      contact: 'Contact',
      admin: 'Admin Portal'
    },
    hero: {
      title: 'QAZI MOMIN AFRIDI',
      subtitle: 'Public Profile • Community Service • Khyber',
      tagline: 'Committed to grassroots civic advocacy, transparent community welfare, and the development of District Khyber.',
      exploreProfile: 'Explore Profile',
      publicActivities: 'Public Activities',
      districtKhyber: 'District Khyber, KP, Pakistan',
      verifiedFactualNotice: 'Strict Factual Standard: Documented Public Record'
    },
    about: {
      sectionTitle: 'About Qazi Momin Afridi',
      sectionSubtitle: 'Dignified community representation grounded in dialogue, peace initiatives, and public welfare.',
      fullProfile: 'Read Full Profile',
      closeProfile: 'Close Profile',
      biographyTitle: 'Factual Biography & Public Background',
      keyDetails: 'Verified Key Details',
      location: 'Location',
      role: 'Public Role',
      affiliation: 'Documented Civic Role',
      languages: 'Languages',
      academicRecord: 'Academic & Institutional Record',
      experienceTitle: 'Documented Public Experience',
      designations: 'Verified Designations',
      downloadBrief: 'Print Official Profile Brief',
      verifiedNotice: 'Notice: This profile contains only verifiable factual milestones.'
    },
    activities: {
      sectionTitle: 'Documented Public Service',
      sectionSubtitle: 'Verifiable public initiatives, community resolutions, and civic engagements across District Khyber.',
      allCategories: 'All Initiatives',
      sourceLabel: 'Verification Record',
      viewSource: 'Inspect Source',
      filterBy: 'Filter Initiatives'
    },
    journey: {
      sectionTitle: 'Political & Civic Journey',
      sectionSubtitle: 'Chronological timeline of documented public representation, peace assemblies, and regional advocacy.',
      viewDocumentation: 'View Source Record'
    },
    news: {
      sectionTitle: 'News & Media Coverage',
      sectionSubtitle: 'Factual press dispatches, community addresses, and media statements regarding District Khyber.',
      featuredStory: 'Featured Statement',
      searchPlaceholder: 'Search media coverage...',
      readFullArticle: 'Read Full Statement',
      sourceLabel: 'Source Outlet',
      shareArticle: 'Share',
      copied: 'Link Copied',
      allArticles: 'All News Releases'
    },
    gallery: {
      sectionTitle: 'Photo Archive',
      sectionSubtitle: 'Documentary photography of community meetings, tribal jirgas, and public welfare events.',
      allPhotos: 'All Photographs',
      viewImage: 'Enlarge',
      close: 'Close',
      date: 'Date',
      location: 'Location'
    },
    videos: {
      sectionTitle: 'Speeches & Media Records',
      sectionSubtitle: 'Documented public addresses, conference remarks, and broadcast dialogues on local affairs.',
      watchVideo: 'Watch Video',
      platform: 'Platform',
      source: 'Source',
      closeModal: 'Close Video'
    },
    sources: {
      sectionTitle: 'Public Record & Sources',
      sectionSubtitle: 'Our transparency index: verifiable citations and public references for every documented civic initiative.',
      description: 'In accordance with our strict factual standard, all public engagements and claims are supported by documented references, institutional press releases, or traditional council archives.',
      transparencyPledge: 'Transparency & Verification Standard',
      claim: 'Initiative / Public Engagement',
      publication: 'Documenting Source / Organization',
      date: 'Record Date',
      verificationLink: 'Reference Link'
    },
    contact: {
      sectionTitle: 'Official Contact & Secretariat',
      sectionSubtitle: 'Direct line for constituents, community representatives, and official inquiries.',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone Number (Optional)',
      subjectLabel: 'Subject of Inquiry',
      messageLabel: 'Your Message / Representation',
      sendMessage: 'Send Message',
      sending: 'Submitting...',
      successMessage: 'Your message has been safely delivered to the secretariat.',
      officeAddress: 'Secretariat Address',
      officialChannels: 'Official Public Channels',
      directLine: 'Office Inquiries',
      spamProtected: 'Spam protected & validated submission'
    },
    footer: {
      tagline: 'Public Profile & Community Activities • District Khyber, Khyber Pakhtunkhwa',
      quickLinks: 'Quick Navigation',
      officialNotice: 'This public service portal is maintained factually and neutrally for public record and constituent communication.',
      allRightsReserved: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Use',
      designedWithRespect: 'Crafted with dignified Khyber heritage & modern engineering'
    }
  },
  ur: {
    nav: {
      home: 'مرکزی صفحہ',
      about: 'تعارف',
      activities: 'عوامی خدمات',
      journey: 'سماجی سفر',
      news: 'خبریں و بیانات',
      gallery: 'تصویری البم',
      videos: 'تقاریر و ویڈیوز',
      sources: 'مصدقہ ریکارڈ',
      contact: 'رابطہ',
      admin: 'ایڈمن پورٹل'
    },
    hero: {
      title: 'قاضی مومن آفریدی',
      subtitle: 'عوامی پروفائل • سماجی خدمت • ضلع خیبر',
      tagline: 'ضلع خیبر کی پائیدار ترقی، عوامی فلاح، اور قبائلی امن و آشتی کے لیے پرعزم عوامی قیادت۔',
      exploreProfile: 'تفصیلی پروفائل',
      publicActivities: 'عوامی خدمات',
      districtKhyber: 'ضلع خیبر، خیبر پختونخوا، پاکستان',
      verifiedFactualNotice: 'مصدقہ اور دستاویزی عوامی ریکارڈ'
    },
    about: {
      sectionTitle: 'قاضی مومن آفریدی کا تعارف',
      sectionSubtitle: 'مفاہمت، جرگہ روایات اور پسماندہ عوام کی فلاح و بہبود پر مبنی عوامی خدمات۔',
      fullProfile: 'مکمل پروفائل پڑھیں',
      closeProfile: 'پروفائل بند کریں',
      biographyTitle: 'سوانح حیات و عوامی پس منظر',
      keyDetails: 'مصدقہ بنیادی کوائف',
      location: 'مقام و علاقہ',
      role: 'عوامی ذمہ داری',
      affiliation: 'عوامی حیثیت',
      languages: 'زبانیں',
      academicRecord: 'تعلیمی کوائف',
      experienceTitle: 'عوامی و سماجی تجربہ',
      designations: 'سرکاری و سماجی مناصب',
      downloadBrief: 'پروفائل کا خلاصہ محفوظ کریں',
      verifiedNotice: 'وضاحت: اس پروفائل میں صرف مصدقہ اور دستاویزی حقائق شامل ہیں۔'
    },
    activities: {
      sectionTitle: 'مستند عوامی خدمات',
      sectionSubtitle: 'ضلع خیبر کے عوام کے حقوق، تعلیم، صحت اور ترقیاتی منصوبوں کے لیے اٹھائے گئے ٹھوس اقدامات۔',
      allCategories: 'تمام خدمات',
      sourceLabel: 'تصدیقی حوالہ',
      viewSource: 'حوالہ دیکھیں',
      filterBy: 'زمرہ منتخب کریں'
    },
    journey: {
      sectionTitle: 'سیاسی و سماجی سفر',
      sectionSubtitle: 'قبائلی انضمام، امن جرگوں اور عوامی نمائندگی پر مبنی تاریخی سنگ میل۔',
      viewDocumentation: 'دستاویز ملاحظہ کریں'
    },
    news: {
      sectionTitle: 'خبریں، بیانات و میڈیا',
      sectionSubtitle: 'اہم عوامی بیانات، سرحدی تجارت اور علاقائی مسائل پر پریس کوریج۔',
      featuredStory: 'نمایاں بیان',
      searchPlaceholder: 'خبریں تلاش کریں...',
      readFullArticle: 'مکمل بیان پڑھیں',
      sourceLabel: 'حوالہ نشریات',
      shareArticle: 'شیئر کریں',
      copied: 'لنک کاپی ہو گیا',
      allArticles: 'تمام پریس ریلیز'
    },
    gallery: {
      sectionTitle: 'تصویری گیلری',
      sectionSubtitle: 'قبائلی جرگوں، عوامی اجتماعات اور فلاحی سرگرمیوں کی عکاسی۔',
      allPhotos: 'تمام تصاویر',
      viewImage: 'بڑی تصویر',
      close: 'بند کریں',
      date: 'تاریخ',
      location: 'مقام'
    },
    videos: {
      sectionTitle: 'تقاریر و ویڈیو ریکارڈز',
      sectionSubtitle: 'اہم موضوعات پر عوامی خطابات، سیمینارز اور میڈیا انٹرویوز۔',
      watchVideo: 'ویڈیو دیکھیں',
      platform: 'پلیٹ فارم',
      source: 'حوالہ',
      closeModal: 'ویڈیو بند کریں'
    },
    sources: {
      sectionTitle: 'پبلک ریکارڈ اور مصدقہ ذرائع',
      sectionSubtitle: 'شفافیت کی بنیاد: ہر عوامی اقدام اور بیان کا تصدیق شدہ حوالہ۔',
      description: 'ہمارے شفافیت کے اصول کے مطابق، ہر سرگرمی اور سنگ میل مصدقہ پریس ریلیز، جرگہ رجسٹر اور متعلقہ اداروں کے ریکارڈ کے ساتھ پیش کی جاتی ہے۔',
      transparencyPledge: 'شفافیت اور حقائق کا عہد',
      claim: 'عوامی سرگرمی / اقدام',
      publication: 'دستاویزی ادارہ / ذریعہ',
      date: 'تاریخ اندراج',
      verificationLink: 'تصدیقی لنک'
    },
    contact: {
      sectionTitle: 'سرکاری رابطہ و سیکریٹریٹ',
      sectionSubtitle: 'ضلع خیبر کے عوام، عمائدین اور میڈیا کے لیے براہ راست رابطہ کا ذریعہ۔',
      nameLabel: 'پورا نام',
      emailLabel: 'ای میل ایڈریس',
      phoneLabel: 'فون نمبر (اختیاری)',
      subjectLabel: 'موضوع',
      messageLabel: 'اپنا پیغام یا مسئلہ تحریر کریں',
      sendMessage: 'پیغام بھیجیں',
      sending: 'ارسال ہو رہا ہے...',
      successMessage: 'آپ کا پیغام کامیابی سے سیکریٹریٹ کو موصول ہو چکا ہے۔',
      officeAddress: 'سیکریٹریٹ کا پتہ',
      officialChannels: 'سرکاری سوشل میڈیا اکاؤنٹس',
      directLine: 'دفتری اوقات و رابطہ',
      spamProtected: 'محفوظ و تصدیق شدہ فارم'
    },
    footer: {
      tagline: 'عوامی پروفائل و سماجی خدمات • ضلع خیبر، خیبر پختونخوا',
      quickLinks: 'فوری روابط',
      officialNotice: 'یہ پورٹل مصدقہ عوامی ریکارڈ اور شفاف عوامی رابطے کے لیے قائم کیا گیا ہے۔',
      allRightsReserved: 'جملہ حقوق محفوظ ہیں۔',
      privacyPolicy: 'پرائیویسی پالیسی',
      termsOfService: 'شرائط و ضوابط',
      designedWithRespect: 'خیبر کے روایتی وقار اور جدید ٹیکنالوجی سے آراستہ'
    }
  },
  ps: {
    nav: {
      home: 'لومړی مخ',
      about: 'پېژندنه',
      activities: 'ولسي خدمتونه',
      journey: 'ولسي سفر',
      news: 'خبرونه او بیانونه',
      gallery: 'انځورونه',
      videos: 'ویناوې او ویډیو',
      sources: 'مستند اسناد',
      contact: 'اړیکه',
      admin: 'د مدیر پاڼه'
    },
    hero: {
      title: 'قاضی مومن اپریدی',
      subtitle: 'ولسي پېژندنه • ټولنیز خدمت • خیبر ولسوالۍ',
      tagline: 'د خیبر ولسوالۍ د ولس د سوکالۍ، د قومي جرګو له لارې د سولې او ټولنیز پرمختګ ژمن استازی.',
      exploreProfile: 'پېژندنه وګورئ',
      publicActivities: 'ولسي هلې ځلې',
      districtKhyber: 'خیبر ولسوالۍ، خیبر پښتونخوا، پاکستان',
      verifiedFactualNotice: 'د باوري او مستندو اسنادو پر بنسټ'
    },
    about: {
      sectionTitle: 'د قاضی مومن اپریدي پېژندنه',
      sectionSubtitle: 'د خیبر د ولس او مشرانو په مشوره د امن، عدالت او د ځوانانو د روزنې ملاتړی.',
      fullProfile: 'بشپړه پېژندنه ولولئ',
      closeProfile: 'پېژندنه بندول',
      biographyTitle: 'ژوندلیک او ولسي مخینه',
      keyDetails: 'مستند بنسټیز معلومات',
      location: 'سیمه او استوګنه',
      role: 'ولسي مسوولیت',
      affiliation: 'ولسي رول',
      languages: 'ژبې',
      academicRecord: 'د زده کړو اسناد',
      experienceTitle: 'ولسي او ټولنیزه تجربه',
      designations: 'رسمي او ټولنیز منصبونه',
      downloadBrief: 'د لنډیز چاپول',
      verifiedNotice: 'یادښت: ټول معلومات په باوري او رسمي اسنادو ولاړ دي.'
    },
    activities: {
      sectionTitle: 'مستند ټولنیز خدمتونه',
      sectionSubtitle: 'د خیبر ولسوالۍ د بیارغونې، پوهنې او د خلکو د ستونزو د حل لپاره عملي ګامونه.',
      allCategories: 'ټول خدمتونه',
      sourceLabel: 'د اسنادو سرچینه',
      viewSource: 'سرچینه لیدل',
      filterBy: 'د برخې له مخې'
    },
    journey: {
      sectionTitle: 'ولسي او ټولنیز بهیر',
      sectionSubtitle: 'د ادغام شویو سیمو د حقونو، دودیزو جرګو او ولسی خدمتونو تاریخي پړاوونه.',
      viewDocumentation: 'باوري اسناد وګورئ'
    },
    news: {
      sectionTitle: 'خبرونه او مطبوعاتي بیانات',
      sectionSubtitle: 'د سرحدي سوداګرۍ، پوهنې او ولسي مسایلو په اړه مهم خبرونه او غونډې.',
      featuredStory: 'مهمه وینا',
      searchPlaceholder: 'خبرونه لټول...',
      readFullArticle: 'پوره خبر ولولئ',
      sourceLabel: 'د خپریدو سرچینه',
      shareArticle: 'شریکول',
      copied: 'لینک کاپي شو',
      allArticles: 'ټول مطبوعاتي راپورونه'
    },
    gallery: {
      sectionTitle: 'انځوریز البم',
      sectionSubtitle: 'د قومي جرګو، ولسی غونډو او پرمختیایي پروګرامونو رښتیني انځورونه.',
      allPhotos: 'ټول انځورونه',
      viewImage: 'لوی انځور',
      close: 'بندول',
      date: 'نیټه',
      location: 'ځای'
    },
    videos: {
      sectionTitle: 'ویناوې او ولسي ویډیوګانې',
      sectionSubtitle: 'په مهمو سیمه ییزو او ولسي غونډو کې د ثبت شویو ویناوو ویډیویي ټولګه.',
      watchVideo: 'ویډیو کتل',
      platform: 'پلیټ فارم',
      source: 'سرچینه',
      closeModal: 'ویډیو بندول'
    },
    sources: {
      sectionTitle: 'مستند اسناد او سرچینې',
      sectionSubtitle: 'د روڼتیا او باوري توب ډاډ: د هر اقدام کره سرچینه او شواهد.',
      description: 'د رښتینولۍ د اصولو له مخې، دلته یاد شوي ټول اقدامات او فعالیتونه له رسمي سرچینو او قومي اسنادو سره مل دي.',
      transparencyPledge: 'د رښتینولۍ او حقیقت تضمین',
      claim: 'ولسي اقدام / فعالیت',
      publication: 'ثبت شوې مرجع / اداره',
      date: 'نیټه',
      verificationLink: 'د تایید لینک'
    },
    contact: {
      sectionTitle: 'رسمي دارالانشاء او اړیکه',
      sectionSubtitle: 'د سیمې د ولس او مشرانو لپاره د مستقیمې اړیکې اسانه لار.',
      nameLabel: 'بشپړ نوم',
      emailLabel: 'برېښنالیک',
      phoneLabel: 'ټیلیفون (اختیاري)',
      subjectLabel: 'موضوع',
      messageLabel: 'خپل پیغام یا وړاندیز ولیکئ',
      sendMessage: 'پیغام واستوئ',
      sending: 'استول کیږي...',
      successMessage: 'ستاسو پیغام په بریالیتوب سره دفتر ته ورسید.',
      officeAddress: 'د دفتر پته',
      officialChannels: 'رسمي پاڼې',
      directLine: 'د اړیکې شمیره',
      spamProtected: 'خوندي او باوري فورمه'
    },
    footer: {
      tagline: 'ولسي پېژندنه او ټولنیز فعالیتونه • خیبر ولسوالۍ، خیبر پښتونخوا',
      quickLinks: 'چټکې اړیکې',
      officialNotice: 'دا رسمي ولسي پاڼه د باوري معلوماتو او د ولس سره د مستقیمې اړیکې لپاره جوړه شوې ده.',
      allRightsReserved: 'ټول حقونه خوندي دي.',
      privacyPolicy: 'د پټتیا تګلاره',
      termsOfService: 'د کارونې شرایط',
      designedWithRespect: 'د خیبر د تاریخي ویاړ او پرمختللې ټکنالوجۍ په ملګرتیا'
    }
  }
};
