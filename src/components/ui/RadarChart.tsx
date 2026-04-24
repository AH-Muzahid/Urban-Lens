"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RadarData {
  label: string;
  value: number;
  fullLabel?: string;
}

interface RadarChartProps {
  dataA: RadarData[];
  dataB?: RadarData[];
  confidenceA?: number;
  confidenceB?: number;
  size?: number;
  className?: string;
}

export function RadarChart({ 
  dataA, 
  dataB, 
  confidenceA = 100, 
  confidenceB = 100, 
  size = 300,
  className 
}: RadarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const angleStep = (Math.PI * 2) / dataA.length;

  const getPoints = (data: RadarData[]) => {
    return data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (Math.max(5, d.value) / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        value: d.value,
        label: d.label
      };
    });
  };

  const pointsA = getPoints(dataA);
  const pointsB = dataB ? getPoints(dataB) : null;

  const pointsStringA = pointsA.map(p => `${p.x},${p.y}`).join(" ");
  const pointsStringB = pointsB?.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible drop-shadow-2xl">
        <defs>
          <radialGradient id="radarGradientA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((factor, i) => (
          <polygon
            key={i}
            points={dataA.map((_, idx) => {
              const angle = idx * angleStep - Math.PI / 2;
              const r = radius * factor;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(" ")}
            className="fill-none stroke-white/5 stroke-[0.5]"
          />
        ))}

        {/* Axis Lines */}
        {dataA.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              className="stroke-white/5 stroke-[0.5]"
            />
          );
        })}

        {/* Data Shape B (Background location) */}
        {pointsStringB && (
          <motion.polygon
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            points={pointsStringB}
            className={cn(
              "fill-white/5 stroke-white/20 stroke-1 transition-all duration-500",
              confidenceB < 70 && "stroke-dasharray-2 opacity-50"
            )}
            style={{ strokeDasharray: confidenceB < 70 ? "4 4" : "none" }}
          />
        )}

        {/* Data Shape A (Primary location) */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          points={pointsStringA}
          className={cn(
            "fill-primary/20 stroke-primary stroke-2 transition-all duration-500",
            confidenceA < 70 && "stroke-dasharray-4"
          )}
          style={{ 
            filter: "url(#glow)",
            strokeDasharray: confidenceA < 70 ? "6 3" : "none" 
          }}
        />

        {/* Interactive Zones & Data Points */}
        {pointsA.map((p, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelX = center + (radius + 25) * Math.cos(angle);
          const labelY = center + (radius + 25) * Math.sin(angle);

          return (
            <g key={i} className="group cursor-crosshair">
              {/* Invisible touch target */}
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                className="fill-transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              
              {/* Actual Point A */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 3}
                className="fill-primary shadow-glow transition-all"
              />

              {/* Point B */}
              {pointsB && (
                <motion.circle
                  cx={pointsB[i].x}
                  cy={pointsB[i].y}
                  r={hoveredIdx === i ? 4 : 2}
                  className="fill-white/40 transition-all"
                />
              )}

              {/* Label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                  hoveredIdx === i ? "fill-white" : "fill-zinc-500"
                )}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute pointer-events-none z-10"
            style={{ 
              top: center - 10,
              left: center
            }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl min-w-[120px] -translate-x-1/2 -translate-y-full mb-4">
              <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1 border-b border-white/5 pb-1">
                {dataA[hoveredIdx].fullLabel || dataA[hoveredIdx].label}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[8px] font-bold text-primary uppercase">Current</span>
                  <span className="text-sm font-black text-white">{dataA[hoveredIdx].value}%</span>
                </div>
                {dataB && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase">Compared</span>
                    <span className="text-sm font-black text-zinc-300">{dataB[hoveredIdx].value}%</span>
                  </div>
                )}
              </div>
            </div>
            {/* Tooltip Tail */}
            <div className="w-2 h-2 bg-black/80 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Detail */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
          Analysis
        </div>
      </div>
    </div>
  );
}
