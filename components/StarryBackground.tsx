"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export default function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate hearts only on the client after mount to avoid hydration mismatches.
    setStars(
      Array.from({ length: 90 }, (_, index) => ({
        id: index,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 10 + 8,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-midnight via-navy to-[#05070f]">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute select-none text-[#ffd0e0]/85 heart-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            fontSize: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        >
          ❤
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,150,190,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(130,160,255,0.15),transparent_35%)]" />
    </div>
  );
}
