"use client";

import Link from "next/link";

export function ThinFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-white/90 dark:bg-[#06080C]/90 backdrop-blur-md border-t border-black/5 dark:border-white/[0.04] z-50 flex items-center justify-between px-6 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
      <div className="flex items-center gap-4">
        <span>© 2026 UrbanLens</span>
        <span>v0.4.2</span>
      </div>
      
      <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <span>Made with</span>
        <span className="text-red-500">❤️</span>
        <span>in Rajshahi, Bangladesh</span>
      </div>

      <div className="flex items-center gap-4">
        <span>Data: © OpenStreetMap contributors</span>
        <div className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-800" />
        <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms</Link>
      </div>
    </footer>
  );
}
