"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isUnlockedByDate } from "@/lib/date";
import { getPasscodeVerified } from "@/lib/storage";

const TIMING = {
  bloomFinish: 5.4,
  explodeStart: 5.6,
  petalsCoverDuration: 2.3,
  petalsHold: 1.45,
  pageFadeOutStart: 9.45,
  routeToGallery: 10.05
} as const;

type CoverPetal = {
  id: number;
  left: string;
  top: string;
  rotate: number;
  driftX: number;
  driftY: number;
  delay: number;
  scale: number;
};

function buildCoverPetals(count: number): CoverPetal[] {
  return Array.from({ length: count }, (_, index) => {
    const col = index % 8;
    const row = Math.floor(index / 8);
    const left = 7 + col * 12 + ((row % 2) * 4 + (index % 3) * 1.2);
    const top = 10 + row * 14 + ((index % 2) * 4.5);
    return {
      id: index,
      left: `${Math.min(left, 94)}%`,
      top: `${Math.min(top, 92)}%`,
      rotate: -130 + ((index * 37) % 260),
      driftX: -28 + ((index * 19) % 56),
      driftY: -22 + ((index * 17) % 58),
      delay: (index % 9) * 0.06 + Math.floor(index / 9) * 0.04,
      scale: 0.72 + ((index * 7) % 9) * 0.08
    };
  });
}

export default function BloomPage() {
  const router = useRouter();
  const coverPetals = useMemo(() => buildCoverPetals(56), []);

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
    if (!getPasscodeVerified()) {
      router.replace("/passcode");
      return;
    }

    const timer = window.setTimeout(() => router.push("/memories"), TIMING.routeToGallery * 1000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_26%,_#3a0f2d_0%,_#170915_44%,_#070307_100%)] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: TIMING.routeToGallery,
        times: [0, 0.08, TIMING.pageFadeOutStart / TIMING.routeToGallery, 1],
        ease: "easeInOut"
      }}
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel w-full max-w-lg text-center">
        <h1 className="mb-3 text-3xl font-semibold">For You</h1>
        <p className="mb-8 text-pearl/70">Watch this rose bloom before the petals carry us into the gallery.</p>

        <div className="mx-auto flex justify-center">
          <svg viewBox="0 0 220 320" className="h-[360px] w-[260px]">
            <defs>
              <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#84dc9f" />
                <stop offset="100%" stopColor="#2a6f47" />
              </linearGradient>
              <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#90e3ad" />
                <stop offset="100%" stopColor="#3c8d5c" />
              </linearGradient>
              <radialGradient id="petalCore" cx="50%" cy="52%" r="56%">
                <stop offset="0%" stopColor="#ffb5cf" />
                <stop offset="58%" stopColor="#dd4f83" />
                <stop offset="100%" stopColor="#7f1b43" />
              </radialGradient>
              <radialGradient id="petalOuter" cx="50%" cy="36%" r="75%">
                <stop offset="0%" stopColor="#ffc4d9" />
                <stop offset="64%" stopColor="#ea6797" />
                <stop offset="100%" stopColor="#a22e5a" />
              </radialGradient>
            </defs>
            <motion.path
              d="M109 304 C111 282 108 246 110 211 C112 174 111 146 105 109"
              stroke="url(#stemGradient)"
              strokeWidth="9"
              fill="transparent"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M108 194 C137 176 149 184 165 199 C148 210 132 206 112 197"
              fill="url(#leafGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              style={{ transformOrigin: "112px 197px" }}
            />
            <motion.path
              d="M106 166 C79 147 67 153 54 168 C71 177 85 175 104 170"
              fill="url(#leafGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.35, duration: 1 }}
              style={{ transformOrigin: "104px 170px" }}
            />
            <motion.g
              initial={{ scale: 0.04, opacity: 0, rotate: -14 }}
              animate={{
                scale: [0.04, 0.16, 0.34, 0.56, 0.78, 0.94, 1, 0],
                opacity: [0, 0.35, 0.6, 0.8, 0.95, 1, 1, 0],
                rotate: [-14, -11, -8, -5, -2, 0, 1, 10]
              }}
              transition={{
                delay: 0.55,
                duration: TIMING.explodeStart - 0.1,
                times: [0, 0.12, 0.26, 0.4, 0.56, 0.72, 0.9, 1],
                ease: "easeInOut"
              }}
              style={{ transformOrigin: "110px 94px" }}
            >
              <path d="M110 98 C93 88 93 64 109 53 C126 63 127 88 110 98" fill="url(#petalCore)" />
              <path d="M111 100 C84 95 78 68 94 55 C111 44 130 62 111 100" fill="url(#petalOuter)" />
              <path d="M108 100 C130 102 144 84 140 66 C137 50 120 45 108 100" fill="url(#petalOuter)" />
              <path d="M109 101 C95 111 78 106 72 91 C66 75 82 63 109 101" fill="#d74579" />
              <path d="M111 99 C126 111 146 102 150 84 C153 70 141 57 111 99" fill="#cf3d70" />
              <path d="M110 107 C98 103 95 94 101 86 C107 79 116 79 120 88 C124 96 120 106 110 107" fill="#ffccdd" />
            </motion.g>
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            delay: TIMING.explodeStart,
            duration: TIMING.petalsCoverDuration + TIMING.petalsHold,
            times: [0, 0.2, 0.75, 1]
          }}
          className="mt-3 text-sm text-blush"
        >
          Petals everywhere... opening gallery.
        </motion.p>
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        {coverPetals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute h-10 w-7"
            style={{ left: "50%", top: "38%" }}
            initial={{ opacity: 0, scale: 0.2, rotate: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.2, petal.scale, petal.scale],
              rotate: [0, petal.rotate],
              left: ["50%", "50%", petal.left],
              top: ["38%", "38%", petal.top],
              x: [0, petal.driftX, 0],
              y: [0, petal.driftY, 0]
            }}
            transition={{
              delay: TIMING.explodeStart + petal.delay,
              duration: TIMING.petalsCoverDuration + TIMING.petalsHold,
              times: [0, 0.24, 0.82, 1],
              ease: "easeOut"
            }}
          >
            <svg viewBox="0 0 60 90" className="h-full w-full drop-shadow-[0_2px_6px_rgba(255,125,171,0.38)]">
              <path
                d="M30 5 C13 20 8 43 15 63 C20 78 27 87 30 89 C33 87 40 78 45 63 C52 43 47 20 30 5 Z"
                fill={petal.id % 3 === 0 ? "#ff7fae" : petal.id % 3 === 1 ? "#f56597" : "#ea5b8d"}
              />
              <path
                d="M30 12 C18 24 15 45 20 61 C23 72 27 79 30 82 C33 79 37 72 40 61 C45 45 42 24 30 12 Z"
                fill={petal.id % 2 === 0 ? "#ff9fc3" : "#ffb1ce"}
                opacity="0.7"
              />
              <path d="M30 14 C30 30 29 58 30 84" stroke="#ffd3e3" strokeWidth="1.8" strokeLinecap="round" opacity="0.68" />
            </svg>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
