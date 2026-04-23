"use client";

import { 
  Map as MapIcon, 
  GitCompare, 
  Zap, 
  Bookmark, 
  History, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: MapIcon, label: "EXPLORE", id: "explore", active: true },
  { icon: GitCompare, label: "COMPARE", id: "compare" },
  { icon: Zap, label: "WHAT-IF", id: "what-if" },
  { icon: Bookmark, label: "BOOKMARKS", id: "bookmarks" },
  { icon: History, label: "HISTORY", id: "history" },
];

export function NavSidebar() {
  return (
    <aside className="w-[80px] border-r border-zinc-800 bg-[#0B0F17] flex flex-col items-center py-6 shrink-0 z-30">
      <div className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-200 group",
              item.active ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              item.active ? "bg-primary/10" : "group-hover:bg-zinc-800/50"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>

      <button className="flex flex-col items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-all group">
        <div className="p-2 rounded-xl group-hover:bg-zinc-800/50">
          <Settings className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-wider">SETTINGS</span>
      </button>
    </aside>
  );
}
