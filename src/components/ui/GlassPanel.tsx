"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export function GlassPanel({ children, className, animate = true, delay = 0 }: GlassPanelProps) {
  const content = (
    <div className={cn(
      "bg-white/70 dark:bg-[#0B0F17]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden",
      className
    )}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      {content}
    </motion.div>
  );
}
