import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mo7medsa3d",
  description:
    "Premium portfolio of Mohamed Saad",

};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}