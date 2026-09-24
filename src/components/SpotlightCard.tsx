'use client';

import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.18)',
  borderColor = 'rgba(52, 211, 153, 0.4)',
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* GLOW DE FUNDO RADIAL SPOTLIGHT */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[inherit] z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* BORDA DE DESTAQUE DINÂMICA */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent transition-opacity duration-300 z-10"
        style={{
          opacity,
          WebkitMask: `radial-gradient(280px circle at ${position.x}px ${position.y}px, black, transparent)`,
          mask: `radial-gradient(280px circle at ${position.x}px ${position.y}px, black, transparent)`,
          borderColor: borderColor,
        }}
      />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
