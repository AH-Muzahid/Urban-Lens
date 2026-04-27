"use client";

import { 
  Settings,
  History,
  GitCompare,
  Sparkles,
  Bookmark,
  MapPin,
  Layers3,
  Palette
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDashboard } from "@/context/DashboardContext";

const navItems = [
  { icon: MapPin, label: "EXPLORE", id: "explore", href: "/" },
  { icon: GitCompare, label: "COMPARE", id: "compare", href: "/compare" },
  { icon: Sparkles, label: "WHAT-IF", id: "what-if", href: "/what-if" },
  { icon: Bookmark, label: "BOOKMARKS", id: "bookmarks", href: "/bookmarks" },
  { icon: History, label: "HISTORY", id: "history", href: "/history" },
];

export function NavSidebar() {
  const pathname = usePathname();
  const {
    toggleSidebar,
    setIsSidebarOpen,
    isMapOverlaysVisible,
    mapOverlayMode,
    setIsMapOverlaysVisible,
    setMapOverlayMode,
  } = useDashboard();

  const mapPanelItems = [
    { id: "theme", label: "THEME", icon: Palette, mode: "theme" as const },
    { id: "layers", label: "LAYERS", icon: Layers3, mode: "layers" as const },
  ];

  return (
    <aside className="w-20 bg-white dark:bg-[#0a0f1a] flex flex-col items-center shrink-0 z-50 border-r border-black/5 dark:border-white/[0.04] relative overflow-hidden h-full">
      
      <div className="flex flex-col gap-3 flex-1 relative z-10 w-full mt-4">
        {mapPanelItems.map((item) => {
          const isActive = pathname === "/" && isMapOverlaysVisible && mapOverlayMode === item.mode;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setIsSidebarOpen(true);
                setIsMapOverlaysVisible(true);
                setMapOverlayMode(item.mode);
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 transition-all duration-300 group w-full py-3",
                isActive ? "text-[#facc15]" : "text-zinc-500 hover:text-zinc-900 dark:text-[#64748b] dark:hover:text-zinc-300"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="map-panel-glow"
                  className="absolute inset-y-0 left-0 right-0 mx-2 rounded-lg bg-gradient-to-r from-[#facc15]/10 dark:from-[#facc15]/[0.08] to-transparent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {isActive && (
                <motion.div
                  layoutId="map-panel-indicator"
                  className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-12 bg-[#facc15] shadow-[2px_0_10px_rgba(250,204,21,0.5)] rounded-r-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10">
                <item.icon className={cn(
                  "w-[22px] h-[22px] transition-all duration-300",
                  isActive ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300"
                )} />
              </div>
              <span
                className={cn(
                  "relative z-10 text-[8px] font-black tracking-[0.12em] leading-none",
                  isActive ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  toggleSidebar();
                } else {
                  setIsSidebarOpen(true);
                }
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 transition-all duration-300 group w-full py-3",
                isActive ? "text-[#facc15]" : "text-zinc-500 hover:text-zinc-900 dark:text-[#64748b] dark:hover:text-zinc-300"
              )}
            >
              {/* Active Glow Backdrop for item */}
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-y-0 left-0 right-0 mx-2 rounded-lg bg-gradient-to-r from-[#facc15]/10 dark:from-[#facc15]/[0.08] to-transparent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Active Indicator Line - Flush Left */}
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-12 bg-[#facc15] shadow-[2px_0_10px_rgba(250,204,21,0.5)] rounded-r-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10">
                <item.icon className={cn(
                  "w-[22px] h-[22px] transition-all duration-300", 
                  isActive ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300"
                )} />
              </div>
              <span
                className={cn(
                  "relative z-10 text-[8px] font-black tracking-[0.12em] leading-none",
                  isActive ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Settings at Bottom */}
      <div className="mt-auto relative z-10 w-full pt-8 border-t border-black/5 dark:border-white/[0.02]">
        <Link
          href="/settings"
          onClick={(e) => {
            if (pathname === "/settings") {
              e.preventDefault();
              toggleSidebar();
            } else {
              setIsSidebarOpen(true);
            }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 group w-full py-4 transition-all duration-300",
            pathname === "/settings" ? "text-[#facc15]" : "text-zinc-500 hover:text-zinc-900 dark:text-[#64748b] dark:hover:text-zinc-300"
          )}
        >
          {pathname === "/settings" && (
            <motion.div 
              layoutId="nav-glow"
              className="absolute inset-y-0 left-0 right-0 mx-2 rounded-lg bg-gradient-to-r from-[#facc15]/10 dark:from-[#facc15]/[0.08] to-transparent"
            />
          )}
          {pathname === "/settings" && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-12 bg-[#facc15] shadow-[2px_0_10px_rgba(250,204,21,0.5)] rounded-r-full"
            />
          )}
          <Settings className={cn("w-[22px] h-[22px] relative z-10", pathname === "/settings" ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300")} />
          <span
            className={cn(
              "relative z-10 text-[8px] font-black tracking-[0.12em] leading-none",
              pathname === "/settings" ? "text-[#facc15]" : "text-zinc-500 group-hover:text-zinc-900 dark:text-[#64748b] dark:group-hover:text-zinc-300"
            )}
          >
            SETTINGS
          </span>
        </Link>
      </div>
    </aside>
  );
}

