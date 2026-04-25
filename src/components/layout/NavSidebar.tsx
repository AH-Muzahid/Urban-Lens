"use client";

import { 
  Settings,
  History,
  GitCompare,
  Sparkles,
  Bookmark,
  MapPin
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
  const { toggleSidebar, setIsSidebarOpen } = useDashboard();

  return (
    <aside className="w-16 bg-[#06080C] flex flex-col items-center py-4 shrink-0 z-50 border-r border-white/[0.04] relative overflow-hidden h-full">
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-white/[0.02] [background-size:16px_16px]" />
      


      <div className="flex flex-col gap-1 flex-1 relative z-10 w-full mt-4">
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
                "relative flex flex-col items-center justify-center gap-1.5 transition-all duration-500 group w-full py-1.5",
                isActive ? "text-[#E5B152]" : "text-[#4A5568] hover:text-zinc-300"
              )}
            >
              {/* Active Indicator Line - Flush Left */}
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-8 bg-[#E5B152] shadow-[2px_0_10px_rgba(229,177,82,0.5)] rounded-r-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Active Glow Backdrop */}
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-gradient-to-r from-[#E5B152]/[0.15] to-transparent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative">
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-500", 
                  isActive ? "text-[#E5B152]" : "text-[#4A5568] group-hover:text-zinc-400"
                )} />
                {isActive && (
                  <>
                    <div className="absolute inset-0 blur-md bg-[#E5B152]/20 -z-10" />
                    <motion.div 
                      layoutId={`nav-dot-${item.id}`}
                      className="absolute -top-1 -right-1 w-1 h-1 bg-[#E5B152] rounded-full"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                )}
              </div>
              
              <span className={cn(
                "text-[8px] font-bold tracking-widest uppercase transition-all duration-500 text-center leading-tight px-1",
                isActive ? "text-[#E5B152]" : "text-[#4A5568]"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Settings at Bottom */}
      <div className="mt-auto relative z-10 w-full pt-8 border-t border-white/[0.02]">
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
            "relative flex flex-col items-center justify-center gap-2 group w-full py-4 transition-all duration-500",
            pathname === "/settings" ? "text-[#E5B152]" : "text-[#4A5568] hover:text-zinc-300"
          )}
        >
          {pathname === "/settings" && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-8 bg-[#E5B152] shadow-[2px_0_10px_rgba(229,177,82,0.5)] rounded-r-full"
            />
          )}
          {pathname === "/settings" && (
            <motion.div 
              layoutId="nav-glow"
              className="absolute inset-0 bg-gradient-to-r from-[#E5B152]/[0.15] to-transparent"
            />
          )}
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-widest uppercase">
            SETTINGS
          </span>
        </Link>
      </div>
    </aside>
  );
}
