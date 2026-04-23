"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  index?: number;
}

export function PremiumCard({ children, className, hoverEffect = true, index = 0 }: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-[#161B22]/40 backdrop-blur-md transition-all duration-300",
        hoverEffect && "hover:border-primary/30 hover:bg-[#161B22]/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className
      )}
    >
      {/* Subtle top-left light source */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
