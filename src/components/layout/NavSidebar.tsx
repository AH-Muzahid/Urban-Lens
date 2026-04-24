"use client";

import { 
  Search, 
  Database, 
  BarChart3, 
  Settings,
  LayoutGrid,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutGrid, label: "HUB", id: "hub", href: "/" },
  { icon: Search, label: "ANALYZE", id: "analyze", href: "/analyze" },
  { icon: Database, label: "LAYERS", id: "layers", href: "/layers" },
  { icon: BarChart3, label: "STATS", id: "stats", href: "/stats" },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 bg-[#06080C] flex flex-col items-center py-6 shrink-0 z-30 border-r border-white/[0.03]">
      <div className="mb-12">
        <button className="w-12 h-12 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1.5 transition-all duration-300 group",
                isActive ? "text-primary" : "text-zinc-600 hover:text-zinc-300"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                isActive 
                  ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,184,0,0.1)]" 
                  : "group-hover:bg-white/[0.03]"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-600 group-hover:text-zinc-300")} />
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -left-5 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(255,184,0,0.5)]" 
                  />
                )}
              </div>
              <span className={cn(
                "text-[8px] font-black tracking-widest uppercase transition-all",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-600 hover:text-white hover:bg-white/[0.03] transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
        </button>
      </div>
    </aside>
  );
}
