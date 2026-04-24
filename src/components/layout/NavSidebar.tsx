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

const navItems = [
  { icon: MapPin, label: "EXPLORE", id: "explore", href: "/" },
  { icon: GitCompare, label: "COMPARE", id: "compare", href: "/compare" },
  { icon: Sparkles, label: "WHAT-IF", id: "what-if", href: "/what-if" },
  { icon: Bookmark, label: "BOOKMARKS", id: "bookmarks", href: "/bookmarks" },
  { icon: History, label: "HISTORY", id: "history", href: "/history" },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[84px] bg-[#06080C] flex flex-col items-center py-8 shrink-0 z-50 border-r border-white/[0.04] relative overflow-hidden h-screen">
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-white/[0.02] [background-size:16px_16px]" />
      
      {/* Top Menu Icon */}
      <div className="mb-16 relative z-10">
        <button className="text-white/20 hover:text-[#E5B152] transition-all duration-300 group">
          <div className="w-6 h-[2px] bg-current mb-1 group-hover:w-4 transition-all" />
          <div className="w-4 h-[2px] bg-current mb-1 group-hover:w-6 transition-all" />
          <div className="w-6 h-[2px] bg-current group-hover:w-4 transition-all" />
        </button>
      </div>

      <div className="flex flex-col gap-12 flex-1 relative z-10 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-3 transition-all duration-500 group w-full",
                isActive ? "text-[#E5B152]" : "text-[#4A5568] hover:text-zinc-300"
              )}
            >
              {/* Active Indicator Line - Flush Left */}
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-10 bg-[#E5B152] shadow-[2px_0_15px_rgba(229,177,82,0.6)]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Active Glow Backdrop */}
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-[#E5B152]/[0.02] blur-xl"
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
                "text-[8px] font-black tracking-[0.2em] uppercase transition-all duration-500 text-center",
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
          className={cn(
            "relative flex flex-col items-center gap-3 group w-full transition-all duration-500",
            pathname === "/settings" ? "text-[#E5B152]" : "text-[#4A5568] hover:text-zinc-300"
          )}
        >
          {pathname === "/settings" && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-10 bg-[#E5B152] shadow-[2px_0_15px_rgba(229,177,82,0.6)]"
            />
          )}
          <Settings className="w-5 h-5" />
          <span className="text-[8px] font-black tracking-[0.2em] uppercase">
            SETTINGS
          </span>
        </Link>
      </div>
    </aside>
  );
}
