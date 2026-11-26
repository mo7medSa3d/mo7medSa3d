import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Saad — Data Scientist & Machine Learning Engineer",
  description:
    "Portfolio of Mohamed Saad: production-minded Machine Learning, Predictive Analytics, Data Automation, and Business Intelligence systems.",
  keywords: [
    "Mohamed Saad",
    "Data Scientist",
    "Machine Learning Engineer",
    "Analytics Engineer",
    "Python",
    "Power BI",
    "Alexandria University",
  ],
  authors: [{ name: "Mohamed Saad" }],
  openGraph: {
    title: "Mohamed Saad — Data Scientist & Machine Learning Engineer",
    description:
      "Production-minded AI, predictive analytics, automation, and business intelligence systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Saad — Data Scientist & ML Engineer",
    description:
      "Production-minded AI, predictive analytics, automation, and business intelligence systems.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070A" },
    { media: "(prefers-color-scheme: light)", color: "#F6F7F9" },
  ],
};

// Prevents light/dark flash before React hydration.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("mas-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
