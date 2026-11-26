export type ProjectCategory = "Machine Learning" | "BI & Analytics" | "Automation";

export interface ProjectItem {
  title: string;
  category: ProjectCategory;
  metric: string;
  label: string;
  summary: string;
  tech: string[];
  color: string;
  github: string;
  image: string;
  highlights: string[];
}

export const PROFILE = {
  firstName: "Mohamed",
  lastName: "Saad",
  fullName: "Mohamed Saad",
  initials: "MS",
  email: "mosaadx229@gmail.com",
  city: "Alexandria",
  country: "Egypt",
  university: "Alexandria University — Faculty of Computer & Data Science",
  degree: "B.Sc. Computer & Information Science (2028)",
  roles: [
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Automation Engineer",
    "Analytics Engineer",
  ],
  bio: "Computer and Data Science student at Alexandria University building production-minded AI, predictive analytics, automation, and business intelligence systems.",
  github: "https://github.com/mo7medSa3d",
  linkedin: "https://www.linkedin.com/in/mo7medsa3d",
  resume: "/resume.pdf",
} as const;

export const HERO = {
  headingLine1: PROFILE.firstName,
  headingLine2: `${PROFILE.lastName}.`,
  subHeading: "Currently focused on",
  primaryButtonText: "Explore work",
  secondaryButtonText: "Get in touch",
  resumeButtonLabel: "Download résumé",
  metrics: [
    { value: "175K+", label: "Records modeled" },
    { value: "7", label: "End-to-end systems" },
    { value: "CS & DS", label: "Alexandria University" },
  ],
} as const;

export const NAVIGATION_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const ABOUT = {
  headingStart: "Engineering intelligence for",
  headingEnd: "real business problems.",
  description:
    "I specialize in machine learning, predictive analytics, data engineering, automation, and business intelligence — turning raw, messy datasets into systems people can actually act on.",
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
      title: "Data Analytics & BI",
      items: ["Power BI", "DAX", "SQL", "Excel", "Dashboard Design"],
    },
    {
      title: "Automation",
      items: ["Playwright", "Selenium", "Web Scraping", "ETL Pipelines"],
    },
    {
      title: "Deployment",
      items: ["FastAPI", "Flask", "Docker", "Linux CLI"],
    },
  ],
} as const;

export const EXPERTISE = {
  headingStart: "A connected",
  headingEnd: "intelligence stack.",
  subtitle:
    "From raw data acquisition and feature pipelines to trained models, interactive dashboards, and containerized APIs.",
} as const;

export const PROJECT_CATEGORIES: readonly ("All" | ProjectCategory)[] = [
  "All",
  "Machine Learning",
  "BI & Analytics",
  "Automation",
] as const;

export const PROJECTS: ProjectItem[] = [
  {
    title: "Hotel Booking Cancellation Prediction",
    category: "Machine Learning",
    metric: "120K+",
    label: "Hotel bookings",
    summary:
      "End-to-end machine learning system for predicting hotel booking cancellations, covering EDA, feature engineering, model training, Flask deployment, and Docker containerization.",
    tech: ["Python", "Scikit-Learn", "Flask", "Docker"],
    color: "#14b8a6",
    github:
      "https://github.com/mo7medSa3d/Hotel-Booking-Cancellation-Prediction",
    image: "/images/projects/HBP.webp",
    highlights: [
      "Trained and evaluated cancellation classifiers across 120K+ real hotel booking records.",
      "Built an end-to-end preprocessing and feature engineering pipeline.",
      "Served real-time predictions via a Flask web interface.",
      "Containerized the full inference stack with Docker for reproducible deployment.",
    ],
  },
  {
    title: "Dubizzle Real Estate Price Prediction",
    category: "Machine Learning",
    metric: "4,500+",
    label: "Property listings",
    summary:
      "End-to-end predictive pricing pipeline combining automated web scraping, data cleaning, feature engineering, and gradient-boosted modeling.",
    tech: ["Python", "Pandas", "Scikit-Learn", "XGBoost"],
    color: "#38bdf8",
    github:
      "https://github.com/mo7medSa3d/Real-Estate-Price-Prediction-Project-in-Egypt-Dubizzle-",
    image: "/images/projects/Duz.webp",
    highlights: [
      "Acquired 4,500+ Egyptian property listings directly from Dubizzle.",
      "Cleaned inconsistent prices, locations, and property attributes with Pandas.",
      "Trained XGBoost and Scikit-Learn regressors to estimate fair market pricing.",
    ],
  },
  {
    title: "FIFA Player Analytics & Market Value Prediction",
    category: "Machine Learning",
    metric: "19.6K+",
    label: "Professional players",
    summary:
      "Machine learning system analyzing FIFA player statistics to predict market value and classify player tiers using regression, classification, and ensemble learning.",
    tech: ["Python", "Scikit-Learn", "Pandas", "Machine Learning"],
    color: "#22c55e",
    github: "https://github.com/mo7medSa3d/fifa-player-analytics-ml",
    image: "/images/projects/fifa.webp",
    highlights: [
      "Engineered hybrid models for market value regression and player tier segmentation.",
      "Applied Stacking, Random Forest, SVR, and KNN ensembles across ~20K player records.",
      "Improved R² by ~10% over baseline models through feature and error analysis.",
    ],
  },
  {
    title: "SMS Spam Detector",
    category: "Machine Learning",
    metric: "NLP",
    label: "Spam classification",
    summary:
      "AI-powered web application that classifies SMS messages as spam or legitimate using TensorFlow/Keras, provides confidence scores, and suggests automated replies via Flask.",
    tech: ["TensorFlow", "Keras", "Flask", "Python"],
    color: "#ec4899",
    github: "https://github.com/mo7medSa3d/SMS-Spam-Detector",
    image: "/images/projects/Spam.webp",
    highlights: [
      "Deep-learning NLP classifier built with TensorFlow and Keras.",
      "Outputs calibrated confidence scores alongside real-time spam predictions.",
      "Suggests automated replies inside a clean Flask web application.",
    ],
  },
  {
    title: "Hatla2ee Vehicle Scraper",
    category: "Automation",
    metric: "5,700+",
    label: "Vehicle listings",
    summary:
      "Fault-tolerant browser automation pipeline extracting and structuring Egyptian used-car listings into an analysis-ready dataset.",
    tech: ["Playwright", "Selenium", "Python", "Automation"],
    color: "#a78bfa",
    github:
      "https://github.com/mo7medSa3d/Hatla2ee-Car-Scraper-Market-Analysis",
    image: "/images/projects/Hatlaa2e.webp",
    highlights: [
      "Automated multi-page extraction across 5,700+ vehicle listings.",
      "Engineered resilient retry handling and clean schema normalization.",
      "Produced structured data ready for market pricing and trend analysis.",
    ],
  },
  {
    title: "Interactive HR Analytics Dashboard",
    category: "BI & Analytics",
    metric: "1.4K+",
    label: "HR records",
    summary:
      "Interactive Microsoft Power BI dashboard analyzing employee demographics, workforce distribution, salary insights, and attrition with custom DAX measures and dynamic filtering.",
    tech: ["Power BI", "DAX", "Power Query", "Data Modeling"],
    color: "#eab308",
    github:
      "https://github.com/mo7medSa3d/Interactive-HR-Analytics-Dashboard",
    image: "/images/projects/HR.webp",
    highlights: [
      "Tracks workforce demographics, compensation bands, and attrition drivers.",
      "Built custom DAX measures and Power Query transformation pipelines.",
      "Designed executive drill-down filters for fast HR decision-making.",
    ],
  },
  {
    title: "Healthcare Analytics Dashboard",
    category: "BI & Analytics",
    metric: "23.8K+",
    label: "Healthcare records",
    summary:
      "Interactive Power BI decision system surfacing clinical KPIs, operational trends, and drill-down intelligence across 23.8K+ records.",
    tech: ["Power BI", "DAX", "SQL", "Data Modeling"],
    color: "#fb923c",
    github: "https://github.com/mo7medSa3d/PowerBI-Sales-Dashboard",
    image: "/images/projects/HCA.webp",
    highlights: [
      "Modeled 23.8K+ records with SQL preprocessing and star-schema relationships.",
      "Delivered executive KPI cards, longitudinal trends, and interactive drill-downs.",
    ],
  },
];

export const PROJECTS_SECTION = {
  headingStart: "Selected",
  headingEnd: "case studies.",
  subtitle:
    "Machine learning pipelines, fault-tolerant data scrapers, and executive BI systems built on real-world datasets.",
  caseStudyPrefix: "CASE — ",
} as const;

export const CONTACT_SECTION = {
  headingStart: "Let's build the next",
  headingEnd: "intelligent system.",
  subtitle:
    "Open to data science, machine learning engineering, and analytics roles — reach out directly or explore via the interactive terminal.",
} as const;

export const FOOTER = {
  name: PROFILE.fullName,
  role: "Data Scientist · Machine Learning Engineer",
  location: `${PROFILE.city}, ${PROFILE.country}`,
  tagline: "DATA. MODELS. AUTOMATION.",
} as const;

export const SKILLS = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "Scikit-Learn",
  "TensorFlow",
  "XGBoost",
  "Pandas",
  "NumPy",
  "SQL",
  "Power BI",
  "DAX",
  "Tableau",
  "Excel",
  "Playwright",
  "Selenium",
  "Web Scraping",
  "FastAPI",
  "Flask",
  "Docker",
] as const;

export const SKILL_GROUPS = [
  {
    name: "Machine Learning & AI",
    items: ["Python", "Machine Learning", "Deep Learning", "Scikit-Learn", "TensorFlow", "XGBoost"],
  },
  {
    name: "Data & Business Intelligence",
    items: ["Pandas", "NumPy", "SQL", "Power BI", "DAX", "Tableau", "Excel"],
  },
  {
    name: "Automation & Acquisition",
    items: ["Playwright", "Selenium", "Web Scraping"],
  },
  {
    name: "Backend & Deployment",
    items: ["FastAPI", "Flask", "Docker"],
  },
] as const;

export const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "email",
  "github",
  "linkedin",
  "resume",
  "theme",
  "date",
  "clear",
] as const;

export const TERMINAL = {
  welcome: [
    "MOHAMED SAAD // PORTFOLIO",
    "Type 'help' or click a command below. Use ↑/↓ for history and Tab to autocomplete.",
  ],
  promptLabel: "mohamed@portfolio:~",
  placeholder: "Enter a command (e.g. whoami, projects, date)…",
  helpLines: [
    "whoami    — Profile & education",
    "skills    — Core technical stack",
    "projects  — List all 7 case studies",
    "email     — Direct email address",
    "github    — GitHub repositories",
    "linkedin  — LinkedIn profile",
    "resume    — Download PDF résumé",
    "theme     — Toggle light / dark mode",
    "date      — Current local date & time",
    "clear     — Clear terminal output",
  ],
} as const;

export const UI = {
  roleRotateMs: 2800,
  scrollCompactThreshold: 40,
} as const;
