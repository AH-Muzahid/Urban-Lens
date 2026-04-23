import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { DashboardProvider } from "@/context/DashboardContext";

export const metadata: Metadata = {
  title: "UrbanLens | Research-Grade Urban Analysis",
  description: "Transparency-first urban planning insights using OpenStreetMap data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, "dark")}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </body>
    </html>
  );
}
