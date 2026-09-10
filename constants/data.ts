// =====================================================
//  PROFILE – core personal info
// =====================================================
export const PROFILE = {
  firstName: "Mohamed",
  lastName: "Saad",
  fullName: "Mohamed Saad",
  initials: "MS",
  name: "Mohamed Saad",
  email: "mosaadx229@gmail.com",
  phone: "",
  city: "Alexandria",
  country: "Egypt",
  university: "Alexandria University",
  degree: "B.Sc. Computer and Data Science",
  roles: [
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Automation Engineer",
    "Analytics Engineer",
  ],
  bio: "Final-year Computer and Data Science student at Alexandria University. I build machine learning models, analytics dashboards, and automation pipelines that work on real, messy data.",
  github: "https://github.com/mo7medSa3d",
  linkedin: "https://www.linkedin.com/in/mo7medsa3d",
  resume: "/resume.pdf",
  availabilityStatus: "Available for internships and junior roles",
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
  { label: "Background", href: "#background" },
  { label: "Stack", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const NAV_LABELS = NAVIGATION_ITEMS.map((item) => item.label);

// =====================================================
//  ABOUT
// =====================================================
export const ABOUT = {
  heading: "Messy data in, tools people trust out.",
  description:
    "I work across machine learning, analytics, and automation. Most projects start with raw exports or scraped listings and end as a model, dashboard, or pipeline someone can run.",
  sections: [
    {
      title: "Machine Learning",
      items: [
        "Regression",
        "Classification",
        "Feature Engineering",
        "Model Evaluation",
        "Data Mining",
      ],
    },
    {
      title: "Data Analytics",
      items: ["Power BI", "SQL", "Excel", "Dashboard Design", "DAX"],
    },
    {
      title: "Automation",
      items: ["Playwright", "Selenium", "Web Scraping", "Data Cleaning"],
    },
    {
      title: "Deployment",
      items: ["Flask", "FastAPI", "Docker", "Git"],
    },
  ],
};

// =====================================================
//  EXPERTISE
// =====================================================
export const EXPERTISE = {
  heading: "The stack I reach for first.",
  subheading: "Grouped by where each tool earns its keep.",
};

// =====================================================
//  EXPERIENCE – education and focus
// =====================================================
export const EXPERIENCE = [
  {
    period: "2022 to 2026",
    title: "B.Sc. Computer and Data Science",
    org: "Alexandria University",
    detail:
      "Statistics, databases, machine learning, and software engineering. Graduation project in applied ML.",
  },
  {
    period: "2023 to now",
    title: "Independent ML and analytics work",
    org: "Self-directed",
    detail:
      "Seven builds end to end: price prediction, cancellation prediction, spam detection, scraping pipelines, and Power BI dashboards. Code on GitHub.",
  },
  {
    period: "Ongoing",
    title: "What I do best",
    org: "Modeling, analytics, automation",
    detail:
      "Clean difficult datasets, compare models honestly, and ship a simple page or dashboard so results get used.",
  },
];

// =====================================================
//  PROJECTS
// =====================================================
export const PROJECTS = [
  {
    title: "Hotel Booking Cancellation Prediction",
    metric: "120K+",
    label: "Hotel bookings",
    summary:
      "Predicts which hotel bookings are likely to cancel. Covers exploratory analysis, feature engineering, and model comparison, with a Flask app in Docker so the model can be tried end to end.",
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
      "Estimates apartment prices in Egypt from Dubizzle listings. I scraped and cleaned around 4,500 listings, then trained and compared regression models on location and unit features.",
    tech: ["Python", "Pandas", "Scikit-Learn", "XGBoost"],
    color: "#38d9ff",
    github:
      "https://github.com/mo7medSa3d/Real-Estate-Price-Prediction-Project-in-Egypt-Dubizzle-.git",
    image: "/images/projects/Duz.webp",
  },
  {
    title: "FIFA Player Analytics and Market Value Prediction",
    metric: "19.6K+",
    label: "Professional players",
    summary:
      "Explores FIFA player data to estimate market value and group players by performance. Uses regression and classification with ensemble models, with attention to which stats drive value.",
    tech: ["Python", "Scikit-Learn", "Pandas", "Machine Learning"],
    color: "#22c55e",
    github: "https://github.com/mo7medSa3d/fifa-player-analytics-ml",
    image: "/images/projects/fifa.webp",
  },
  {
    title: "SMS Spam Detector",
    metric: "NLP",
    label: "Spam classification",
    summary:
      "Classifies SMS messages as spam or not, with a confidence score and a simple Flask page to try it. Built with TensorFlow and Keras.",
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
      "Collects used-car listings from Hatla2ee into a clean table for analysis. Handles retries, pagination, and inconsistent fields so the output is ready to model.",
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
      "Power BI dashboard for HR data covering headcount, hiring, pay, and attrition. Built with Power Query, a star-schema model, DAX measures, and filters for managers.",
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
      "Power BI dashboard for healthcare activity with KPIs, trends, and drill-downs by department and time. Built for quick answers, not just charts.",
    tech: ["Power BI", "DAX", "SQL", "Data Modeling"],
    color: "#fb923c",
    github: "https://github.com/mo7medSa3d/PowerBI-Sales-Dashboard",
    image: "/images/projects/HCA.webp",
  },
];

// =====================================================
//  PROJECTS SECTION
// =====================================================
export const PROJECTS_SECTION = {
  heading: "Selected work.",
  description:
    "Seven projects end to end in ML, scraping, and BI. Each starts from real data and ends with something you can run or open.",
  label: "Project notes",
  codeButton: "Code",
  discussProject: "Discuss this project",
};

// =====================================================
//  CONTACT
// =====================================================
export const CONTACT_SECTION = {
  heading: "Tell me what decision you need to make.",
  description:
    "Email works fastest. Send what you have and what you need to decide.",
};

// =====================================================
//  FOOTER
// =====================================================
export const FOOTER = {
  name: PROFILE.fullName,
  role: "Data scientist and machine learning engineer",
  location: `${PROFILE.city}, ${PROFILE.country}. Open to remote.`,
  tagline: "Set in Space Grotesk. Built with Next.js.",
};

// =====================================================
//  TERMINAL
// =====================================================
export const TERMINAL = {
  welcome: [
    "mohamed saad, portfolio terminal",
    "Type 'help' to see what you can ask.",
  ],
  secureInterface: "mohamed@portfolio",
  placeholder: "Type a command, try 'help'…",
  prompt: "$",
  helpOutput: [
    "Available commands:",
    "  whoami    About me",
    "  skills    Technical skills",
    "  projects  List projects",
    "  email     Email address",
    "  github    GitHub profile",
    "  linkedin  LinkedIn profile",
    "  resume    Download resume",
    "  theme     Toggle light and dark mode",
    "  date      Current date and time",
    "  clear     Clear terminal",
    "Tip: up and down arrows browse history, Tab completes.",
  ],
  whoamiName: PROFILE.name,
  whoamiBio: PROFILE.bio,
  whoamiUniversity: `${PROFILE.degree}, ${PROFILE.university}`,
  skillsLabel: "Skills:",
  emailLabel: "Email:",
  githubLabel: "GitHub:",
  linkedinLabel: "LinkedIn:",
  resumeLabel: "Resume:",
  resumeDownload: "Download",
  themeToggled: "Theme switched.",
  errorPrefix: 'No such command: "',
  errorSuffix: '". Type \'help\' to see options.',
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
    name: "Data and analytics",
    pattern: /(pandas|numpy|sql|power bi|tableau|excel|etl|data)/i,
  },
  {
    name: "Modeling",
    pattern: /(scikit|sklearn|tensorflow|keras|pytorch|xgboost|machine|deep|learning)/i,
  },
  {
    name: "Engineering and deploy",
    pattern: /(flask|fastapi|docker|api|git)/i,
  },
  {
    name: "Automation",
    pattern: /(playwright|selenium|scrap)/i,
  },
  { name: "Core", pattern: /.*/ },
];

// =====================================================
//  LOADER
// =====================================================
export const LOADER = {
  tagline: "Loading portfolio",
  headingLine1: "MOHAMED",
  headingLine2: "Saad",
};

// =====================================================
//  UI CONSTANTS
// =====================================================
export const UI = {
  loaderTickMs: 70,
  loaderStep: 12,
  loaderExitDelayMs: 350,
  roleRotateMs: 3000,
  scrollCompactThreshold: 40,
  cursorViewLabel: "VIEW",
  cursorExploreLabel: "OPEN",
  cursorContactLabel: "SAY HI",
  cursorCodeLabel: "CODE",
  cursorOpenLabel: "OPEN",
  signalCoreLive: "Open to work",
};

// =====================================================
//  SOCIALS – وسائل التواصل الاجتماعي
// =====================================================
export const SOCIALS = {
  github: PROFILE.github,
  linkedin: PROFILE.linkedin,
  email: PROFILE.email,
};