// =====================================================
//  PROFILE – المعلومات الشخصية الأساسية
// =====================================================
export const PROFILE = {
  firstName: "Mohamed",
  lastName: "Saad",
  fullName: "Mohamed Saad",
  initials: "MS",
  name: "Mohamed Saad",            // للإستخدام مع whoami
  email: "mosaadx229@gmail.com",
  phone: "",
  city: "Alexandria",
  country: "Egypt",
  university: "Alexandria University",
  roles: [
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Automation Engineer",
    "Analytics Engineer",
  ],
  // الوصف الذي يظهر في الهيرو والـ Terminal whoami
  bio: "Computer and Data Science student at Alexandria University building production-minded AI, predictive analytics, automation and business intelligence systems.",
  github: "https://github.com/mo7medSa3d",
  linkedin: "https://www.linkedin.com/in/mo7medsa3d",
  resume: "/resume.pdf",
  availabilityStatus: "Available for high-impact opportunities",
};

// =====================================================
//  HERO – نصوص وأزرار القسم العلوي
// =====================================================
export const HERO = {
  badgeText: PROFILE.availabilityStatus,
  headingLine1: PROFILE.firstName,
  headingLine2: PROFILE.lastName + ".",
  subHeading: "Currently focused on",
  primaryButtonText: "Explore the work",
  secondaryButtonText: "Start a conversation",
  resumeButtonLabel: "Download résumé",
  scrollIndicator: "Scroll",
};

// =====================================================
//  NAVIGATION – عناصر القائمة الرئيسية
// =====================================================
export const NAVIGATION_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const NAV_LABELS = NAVIGATION_ITEMS.map((item) => item.label);

// =====================================================
//  ABOUT – قسم "نبذة عني"
// =====================================================
export const ABOUT = {
  headingStart: "Engineering intelligence for",
  headingEnd: "real business problems.",
  description:
    "I specialize in machine learning, predictive analytics, data engineering, automation and business intelligence — turning raw, messy datasets into systems people can actually act on.",
  sections: [
    {
      title: "Machine Learning",
      items: [
        "Regression",
        "Data Mining",
        "Model Evaluation",
        "Classification",
        "Feature Engineering",
      ],
    },
    {
      title: "Data Analytics",
      items: ["Power BI", "SQL", "Excel", "Dashboard Design"],
    },
    {
      title: "Automation",
      items: ["Playwright", "Selenium", "Web Scraping"],
    },
    {
      title: "Deployment",
      items: ["Flask", "FastAPI", "Docker"],
    },
  ],
};

// =====================================================
//  EXPERTISE – قسم المهارات (الكوكبة)
// =====================================================
export const EXPERTISE = {
  heading: "A connected intelligence stack.",
};

// =====================================================
//  PROJECTS – بيانات المشاريع
// =====================================================
export const PROJECTS = [
  {
    title: "Hotel Booking Cancellation Prediction",
    metric: "120K+",
    label: "Hotel bookings",
    summary:
      "End-to-end machine learning system for predicting hotel booking cancellations, covering EDA, feature engineering, model training, Flask deployment, and Docker containerization.",
    tech: ["Python", "Scikit-Learn", "Flask", "Docker"],
    color: "#14b8a6",
    github:
      "https://github.com/mo7medSa3d/Hotel-Booking-Cancellation-Prediction",
    image: "/images/projects/HBP.webp",
  },
  {
    title: "Dubizzle Real Estate Price Prediction",
    metric: "4,500+",
    label: "Property listings",
    summary:
      "End-to-end predictive pricing pipeline with acquisition, Web Scraping ,Data Cleaning and modeling .",
    tech: ["Python", "Pandas", "Scikit-Learn", "XGBoost"],
    color: "#38d9ff",
    github:
      "https://github.com/mo7medSa3d/Real-Estate-Price-Prediction-Project-in-Egypt-Dubizzle-.git",
    image: "/images/projects/Duz.webp",
  },
  {
    title: "FIFA Player Analytics & Market Value Prediction",
    metric: "19.6K+",
    label: "Professional players",
    summary:
      "Machine learning project analyzing FIFA player statistics to predict market value and classify player performance using regression, classification, and ensemble learning techniques.",
    tech: ["Python", "Scikit-Learn", "Pandas", "Machine Learning"],
    color: "#22c55e",
    github: "https://github.com/mo7medSa3d/fifa-player-analytics-ml",
    image: "/images/projects/fifa.webp",
  },
  {
    title: "SMS Spam Detector",
    metric: "AI",
    label: "Spam Classification",
    summary:
      "AI-powered web application that classifies SMS messages as spam or legitimate using TensorFlow/Keras, provides confidence scores, and suggests automated replies through a Flask interface.",
    tech: ["TensorFlow", "Keras", "Flask", "Python"],
    color: "#ec4899",
    github: "https://github.com/mo7medSa3d/SMS-Spam-Detector",
    image: "/images/projects/Spam.webp",
  },
  {
    title: "Hatla2ee Vehicle Scraper",
    metric: "5,700+",
    label: "Vehicle listings",
    summary:
      "Fault-tolerant browser automation pipeline producing a clean structured dataset.",
    tech: ["Playwright", "Selenium", "Python", "Automation"],
    color: "#a78bfa",
    github: "https://github.com/mo7medSa3d/Hatla2ee-Car-Scraper-Market-Analysis",
    image: "/images/projects/Hatlaa2e.webp",
  },
  {
    title: "Interactive HR Analytics Dashboard",
    metric: "1.4K+",
    label: "HR records",
    summary:
      "Interactive Business Intelligence dashboard built with Microsoft Power BI to analyze employee demographics, workforce distribution, salary insights, and attrition. Features advanced DAX measures, Power Query transformations, data modeling, and dynamic filtering for executive HR decision-making.",
    tech: [
      "Power BI",
      "DAX",
      "Power Query",
      "Data Modeling",
      "Business Intelligence"
    ],
    color: "#F2C811",
    github:
      "https://github.com/mo7medSa3d/Interactive-HR-Analytics-Dashboard",
    image: "/images/projects/HR.webp",
  },
  {
    title: "Healthcare Analytics Dashboard",
    metric: "23.8K+",
    label: "Healthcare records",
    summary:
      "Interactive Power BI decision system with KPIs, trends and drill-down intelligence.",
    tech: ["Power BI", "DAX", "SQL", "Data Modeling"],
    color: "#fb923c",
    github: "https://github.com/mo7medSa3d/PowerBI-Sales-Dashboard",
    image: "/images/projects/HCA.webp",
  },
];

// =====================================================
//  PROJECTS SECTION – عناوين و نصوص القسم
// =====================================================
export const PROJECTS_SECTION = {
  headingStart: "Selected",
  headingEnd: "case studies.",
  caseStudyPrefix: "Case study — ",
  codeButton: "Code",
  discussProject: "Discuss this project",
};

// =====================================================
//  CONTACT – قسم التواصل
// =====================================================
export const CONTACT_SECTION = {
  headingStart: "Let's build the next",
  headingEnd: "intelligent product.",
};

// =====================================================
//  FOOTER – تذييل الصفحة
// =====================================================
export const FOOTER = {
  name: PROFILE.fullName,
  role: "Data Scientist · Machine Learning Engineer",
  location: `${PROFILE.city}, ${PROFILE.country}`,
  tagline: "DATA. MODELS. AUTOMATION.",
};

// =====================================================
//  TERMINAL – نصوص الوحدة الطرفية
// =====================================================
export const TERMINAL = {
  welcome: [
    "MOHAMED SAAD // NEURAL-ENGINE v2.0",
    "Type 'help' to see available commands.",
  ],
  secureInterface: "mohamed@neural-engine: ~",
  placeholder: "Enter a command…",
  prompt: "$",
  helpOutput: [
    "Available commands:",
    "• whoami – About me",
    "• skills – My technical skills",
    "• projects – List case studies",
    "• email – My email address",
    "• github – My GitHub profile",
    "• linkedin – My LinkedIn profile",
    "• resume – Download my resume",
    "• theme – Toggle light / dark mode",
    "• date – Current date & time",
    "• clear – Clear terminal",
    "↑ / ↓ browse history · Tab to autocomplete",
  ],
  whoamiName: PROFILE.name,
  whoamiBio: PROFILE.bio,
  whoamiUniversity: PROFILE.university,
  skillsLabel: "Skills:",
  emailLabel: "Email:",
  githubLabel: "GitHub:",
  linkedinLabel: "LinkedIn:",
  resumeLabel: "Resume:",
  resumeDownload: "Download",
  themeToggled: "Theme toggled.",
  errorPrefix: 'Command not found: "',
  errorSuffix: '". Type \'help\' for available commands.',
  projectItemPrefix: " — ",
};

// =====================================================
//  SKILLS – قائمة المهارات و أنماط التصنيف
// =====================================================
export const SKILLS = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "SQL",
  "Power BI",
  "Excel",
  "Tableau",
  "Pandas",
  "NumPy",
  "Scikit-Learn",
  "FastAPI",
  "Flask",
  "Docker",
  "Playwright",
  "Selenium",
  "Web Scraping",
];

export const SKILL_CATEGORIES = [
  {
    name: "Data",
    pattern: /(pandas|numpy|sql|etl|spark|airflow|data)/i,
  },
  {
    name: "Modeling",
    pattern: /(sklearn|scikit|tensorflow|pytorch|xgboost|ml|regression|cluster)/i,
  },
  {
    name: "Product",
    pattern: /(react|next|node|typescript|javascript|api|web)/i,
  },
  { name: "Core Stack", pattern: /.*/ }, // fallback
];

// =====================================================
//  LOADER – شاشة التحميل
// =====================================================
export const LOADER = {
  tagline: "Calibrating signal core…",
  headingLine1: "MOHAMED",
  headingLine2: "Saad",
};

// =====================================================
//  UI CONSTANTS – أرقام وسلاسل ثابتة
// =====================================================
export const UI = {
  loaderTickMs: 90,
  loaderStep: 11,
  loaderExitDelayMs: 450,
  roleRotateMs: 3000,
  scrollCompactThreshold: 40,
  cursorViewLabel: "VIEW",
  cursorExploreLabel: "EXPLORE",
  cursorContactLabel: "CONTACT",
  cursorCodeLabel: "CODE",
  cursorOpenLabel: "OPEN",
  signalCoreLive: "Signal Core / Live",
};

// =====================================================
//  SOCIALS – وسائل التواصل الاجتماعي
// =====================================================
export const SOCIALS = {
  github: PROFILE.github,
  linkedin: PROFILE.linkedin,
  email: PROFILE.email,
};