"use client";

import { 
  Map as MapIcon, 
  GitCompare, 
  Zap, 
  Bookmark, 
  History, 
  Settings 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: MapIcon, label: "EXPLORE", id: "explore", href: "/" },
  { icon: GitCompare, label: "COMPARE", id: "compare", href: "/compare" },
  { icon: Zap, label: "WHAT-IF", id: "what-if", href: "/what-if" },
  { icon: Bookmark, label: "BOOKMARKS", id: "bookmarks", href: "/bookmarks" },
  { icon: History, label: "HISTORY", id: "history", href: "/history" },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[80px] border-r border-zinc-800 bg-[#0B0F17] flex flex-col items-center py-6 shrink-0 z-30">
      <div className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1.5 transition-all duration-300 group",
                isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute -left-6 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_15px_rgba(255,184,0,0.5)]" 
                />
              )}

              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10 text-primary" : "group-hover:bg-white/5"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black tracking-tighter uppercase opacity-60">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <button className="text-zinc-600 hover:text-zinc-200 transition-colors p-2 rounded-xl hover:bg-white/5">
        <Settings className="w-5 h-5" />
      </button>
    </aside>
  );
}
