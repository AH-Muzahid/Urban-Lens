"use client";

import { DashboardProvider } from "@/context/DashboardContext";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </NextThemesProvider>
  );
}
