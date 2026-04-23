"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export function RadarChart({ data, size = 200 }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  // Generate points for the shape
  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((factor, i) => (
          <polygon
            key={i}
            points={data.map((_, idx) => {
              const angle = idx * angleStep - Math.PI / 2;
              const r = radius * factor;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(" ")}
            className="fill-none stroke-white/5 stroke-[0.5]"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
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

        {/* Data Shape */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          points={pointsString}
          className="fill-primary/20 stroke-primary stroke-2"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            className="fill-primary shadow-glow"
          />
        ))}
      </svg>

      {/* Labels */}
      {data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + (radius + 20) * Math.cos(angle);
        const y = center + (radius + 20) * Math.sin(angle);
        return (
          <div
            key={i}
            className="absolute text-[8px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap"
            style={{ 
              left: x, 
              top: y, 
              transform: "translate(-50%, -50%)" 
            }}
          >
            {d.label}
          </div>
        );
      })}
    </div>
  );
}
