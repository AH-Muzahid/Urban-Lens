"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UrbanButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
}


export function UrbanButton({ 
  children, 
  onClick, 
  className, 
  variant = "primary",
  size = "md",
  icon,
  disabled
}: UrbanButtonProps) {
  const variants = {
    primary: "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(255,184,0,0.2)] disabled:opacity-50 disabled:pointer-events-none",
    ghost: "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-transparent disabled:opacity-40 disabled:pointer-events-none",
    outline: "bg-transparent text-white border border-zinc-800 hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:pointer-events-none",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest transition-all duration-200 overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {/* Shine effect for primary */}
      {variant === "primary" && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
      )}
      
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span className="relative z-10">{children}</span>}
    </motion.button>
  );
}

