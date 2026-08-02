import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"Mohamed Al-Shaer — Data Scientist & ML Engineer",description:"Premium portfolio of Mohamed Al-Shaer: data science, machine learning, automation and analytics engineering."};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
