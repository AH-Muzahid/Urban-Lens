"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  index?: number;
}

export function PremiumCard({ children, className, hoverEffect = true, index = 0 }: PremiumCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || !hoverEffect) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const spotlightBackground = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(800px circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, rgba(255,184,0,0.08), transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        rotateX: hoverEffect ? rotateX : 0,
        rotateY: hoverEffect ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] border border-white/[0.04] bg-[#0D1117]/40 backdrop-blur-3xl transition-all duration-700",
        hoverEffect && "hover:border-primary/30 hover:bg-[#0D1117]/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {/* Dynamic Shine Effect */}
      {hoverEffect && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: spotlightBackground,
          }}
        />
      )}

      {/* Internal Bezel / Edge Highlight */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.02] pointer-events-none" />
      
      {/* Subtle Bottom Glow on Hover */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
