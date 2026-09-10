import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mohamed Saad — Data Scientist & ML Engineer",
    template: "%s | Mohamed Saad",
  },
  description:
    "Mohamed Saad is a Computer and Data Science student at Alexandria University building ML systems, predictive analytics, automation pipelines, and BI dashboards that hold up in production.",
  keywords: [
    "Mohamed Saad",
    "Data Scientist",
    "Machine Learning Engineer",
    "Alexandria University",
    "Predictive Analytics",
    "Power BI",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Mohamed Saad", url: "https://github.com/mo7medSa3d" }],
  creator: "Mohamed Saad",
  metadataBase: new URL("https://mo7medsa3d-portfolio.vercel.app"),
  openGraph: {
    type: "website",
    title: "Mohamed Saad — Data Scientist & ML Engineer",
    description:
      "ML systems, predictive analytics, automation, and BI dashboards. Based in Alexandria, Egypt.",
    siteName: "Mohamed Saad Portfolio",
    images: [{ url: "/images/profile.webp", width: 600, height: 734 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Saad — Data Scientist & ML Engineer",
    description:
      "Building production-minded ML, analytics, and automation systems.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D0C" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}