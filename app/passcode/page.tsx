"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PASSCODE } from "@/lib/constants";
import { isUnlockedByDate } from "@/lib/date";
import { setPasscodeVerified } from "@/lib/storage";
import { useAudio } from "@/components/AudioProvider";

const TIMING = {
  beatStart: 0.3,
  beatDuration: 3,
  explosionStart: 3.3,
  burstStart: 3.4,
  petalsSpreadDuration: 2.2,
  petalsHold: 2.4,
  petalsFinish: 8.0,
  colorFloodStart: 7.8,
  petalsDropStart: 8.3,
  pageFadeOutStart: 8.9,
  routeToGallery: 10.2
} as const;
const BURST_CLICK_DELAY = 0.08;
const ROUTE_TO_MEMORIES_DELAY_MS = 2600;
const BURST_PETAL_COUNT = 180;
const CARPET_PETAL_COUNT = 260;

type BurstPetal = {
  id: number;
  rotate: number;
  spin: number;
  targetX: number;
  targetY: number;
  delay: number;
  scale: number;
};

type CarpetPetal = {
  id: number;
  left: string;
  top: string;
  rotate: number;
  scale: number;
  hueShift: number;
};

function buildBurstPetals(count: number): BurstPetal[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (((index * 137) % 360) * Math.PI) / 180;
    const radius = 360 + ((index * 73) % 760);
    const jitter = ((index * 29) % 120) - 60;
    const targetX = Math.cos(angle) * radius + Math.sin(angle * 3.7) * jitter;
    const targetY = Math.sin(angle) * radius + Math.cos(angle * 2.4) * jitter;
    return {
      id: index,
      rotate: -180 + ((index * 41) % 360),
      spin: -40 + ((index * 17) % 80),
      targetX,
      targetY,
      delay: (index % 24) * 0.014 + Math.floor(index / 24) * 0.008,
      scale: 0.72 + ((index * 13) % 16) * 0.075
    };
  });
}

function buildCarpetPetals(count: number): CarpetPetal[] {
  return Array.from({ length: count }, (_, index) => {
    const left = (((index * 97) % 1000) / 10) % 100;
    const top = (((index * 71) % 1000) / 10) % 100;
    return {
      id: index,
      left: `${left}%`,
      top: `${top}%`,
      rotate: ((index * 37) % 360) - 180,
      scale: 0.75 + ((index * 11) % 12) * 0.08,
      hueShift: -8 + ((index * 9) % 16)
    };
  });
}

export default function PasscodePage() {
  const router = useRouter();
  const { startMusic } = useAudio();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [clicked, setClicked] = useState(false);
  const petals = useMemo(() => buildBurstPetals(BURST_PETAL_COUNT), []);
  const carpetPetals = useMemo(() => buildCarpetPetals(CARPET_PETAL_COUNT), []);

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (clicked) {
      const timer = window.setTimeout(() => router.push("/memories"), ROUTE_TO_MEMORIES_DELAY_MS);
      return () => window.clearTimeout(timer);
    }
  }, [clicked, router]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim() === PASSCODE) {
      setPasscodeVerified(true);
      startMusic();
      setClicked(true);
      return;
    }
    setError("Try again, bab 💕");
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
  };

  return (
    <motion.div
      className="passcode-scene relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: clicked ? TIMING.routeToGallery : 10,
        times: [0, 0.08, TIMING.pageFadeOutStart / TIMING.routeToGallery, 1],
        ease: "easeInOut"
      }}
    >
      <div className="pointer-events-none absolute inset-0" />

      {/* Color flood background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.35, 0.8, 1] }}
        transition={{
          delay: clicked ? TIMING.colorFloodStart : 100,
          duration: clicked ? TIMING.routeToGallery - TIMING.colorFloodStart - 0.1 : 0,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        }}
        style={{
          background:
            "radial-gradient(120% 90% at 50% 35%, rgba(255,132,160,0.95) 0%, rgba(237,57,104,0.9) 38%, rgba(181,22,61,0.94) 72%, rgba(111,8,34,0.98) 100%)"
        }}
      />

      {/* Petal patterns overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[15]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.45, 0.85, 1] }}
        transition={{
          delay: clicked ? TIMING.burstStart + 0.2 : 100,
          duration: clicked ? TIMING.petalsSpreadDuration + TIMING.petalsHold - 0.1 : 0,
          times: [0, 0.2, 0.52, 0.82, 1],
          ease: "easeInOut"
        }}
        style={{
          background: `
            radial-gradient(38px 26px at 7% 10%, #ff6a8f 0%, #de2a57 58%, #8f0c2e 100%),
            radial-gradient(44px 30px at 17% 28%, #ff7ea2 0%, #e8345f 56%, #8e0c2f 100%),
            radial-gradient(42px 28px at 29% 9%, #ff6d95 0%, #dd2552 58%, #84092a 100%),
            radial-gradient(48px 32px at 41% 23%, #ff789f 0%, #e42f5c 56%, #911032 100%),
            radial-gradient(40px 28px at 55% 11%, #ff7297 0%, #db2451 60%, #85092a 100%),
            radial-gradient(48px 30px at 67% 26%, #ff86a9 0%, #e93966 56%, #901031 100%),
            radial-gradient(42px 28px at 80% 13%, #ff6b93 0%, #de2a56 58%, #890d2d 100%),
            radial-gradient(45px 30px at 92% 23%, #ff7ba1 0%, #e33462 57%, #8a0e2f 100%),
            radial-gradient(40px 26px at 11% 44%, #ff7098 0%, #da2450 60%, #840827 100%),
            radial-gradient(50px 34px at 25% 58%, #ff86aa 0%, #e73a66 55%, #911130 100%),
            radial-gradient(42px 28px at 38% 45%, #ff6f96 0%, #db2450 60%, #860a2a 100%),
            radial-gradient(48px 34px at 52% 61%, #ff84a8 0%, #e63764 56%, #901130 100%),
            radial-gradient(44px 30px at 65% 46%, #ff7098 0%, #db2551 58%, #880b2c 100%),
            radial-gradient(49px 34px at 77% 62%, #ff88ac 0%, #e93d69 56%, #921232 100%),
            radial-gradient(42px 28px at 89% 47%, #ff7399 0%, #dc2753 58%, #8a0c2d 100%),
            radial-gradient(50px 36px at 8% 78%, #ff86ab 0%, #e83a67 56%, #901030 100%),
            radial-gradient(42px 28px at 20% 89%, #ff7098 0%, #db2551 58%, #870a2a 100%),
            radial-gradient(49px 34px at 34% 76%, #ff85a9 0%, #e73a66 56%, #901130 100%),
            radial-gradient(44px 30px at 47% 91%, #ff759b 0%, #dd2854 58%, #8a0b2d 100%),
            radial-gradient(50px 34px at 60% 80%, #ff89ac 0%, #ea3f6a 56%, #931333 100%),
            radial-gradient(42px 28px at 73% 92%, #ff739a 0%, #dc2753 58%, #890b2c 100%),
            radial-gradient(48px 34px at 86% 79%, #ff84a9 0%, #e73965 56%, #901130 100%),
            radial-gradient(44px 30px at 96% 92%, #ff6e96 0%, #db2551 59%, #86092a 100%)
          `,
          backgroundColor: "#6f081f",
          mixBlendMode: "screen"
        }}
      />

      {/* Carpet petals overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[16]"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 0, 0.42, 1, 1, 0], y: [0, 0, 0, 0, 0, -50] }}
        transition={{
          delay: clicked ? TIMING.petalsDropStart : 100,
          duration: clicked ? TIMING.routeToGallery - TIMING.petalsDropStart - 0.1 : 0,
          times: [0, 0.15, 0.35, 0.62, 0.62, 1],
          ease: "easeInOut"
        }}
      >
        {carpetPetals.map((petal) => (
          <div
            key={petal.id}
            className="absolute h-14 w-12"
            style={{
              left: petal.left,
              top: petal.top,
              transform: `translate(-50%, -50%) rotate(${petal.rotate}deg) scale(${petal.scale})`
            }}
          >
            <svg
              viewBox="0 0 60 90"
              className="h-full w-full drop-shadow-[0_2px_6px_rgba(40,0,10,0.72)]"
              style={{ filter: `hue-rotate(${petal.hueShift}deg) saturate(1.08)` }}
            >
              <defs>
                <linearGradient id={`carpetPetal-${petal.id}`} x1="46%" y1="0%" x2="56%" y2="100%">
                  <stop offset="0%" stopColor="#ff8aa8" />
                  <stop offset="44%" stopColor="#df2750" />
                  <stop offset="100%" stopColor="#6b0319" />
                </linearGradient>
              </defs>
              <path d="M30 5 C13 20 8 43 15 63 C20 78 27 87 30 89 C33 87 40 78 45 63 C52 43 47 20 30 5 Z" fill={`url(#carpetPetal-${petal.id})`} />
              <path d="M30 14 C19 26 15 44 20 60 C23 71 27 78 30 81 C33 78 37 71 40 60 C45 44 41 26 30 14 Z" fill="#ff6d94" opacity="0.58" />
            </svg>
          </div>
        ))}
      </motion.div>

      <div className="flex min-h-screen items-center justify-center p-6">
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={clicked ? { opacity: [1, 1, 1, 0], scale: [1, 1, 1, 0.95] } : { opacity: 1, scale: 1 }}
          transition={
            clicked
              ? {
                  delay: 0,
                  duration: TIMING.routeToGallery,
                  times: [0, 0.5, TIMING.pageFadeOutStart / TIMING.routeToGallery, 1],
                  ease: "easeInOut"
                }
              : {}
          }
          className="panel w-full max-w-md relative z-20"
        >
          <h1 className="mb-2 text-center text-3xl font-semibold text-pearl">My Gift</h1>
          <p className="mb-6 text-center text-pearl/75">
            {clicked ? "✨ Entering another world..." : "Enter the passcode to open your Valentine surprise."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className={`w-full rounded-xl border border-white/20 bg-black/25 p-3 text-center text-lg text-pearl outline-none focus:border-blush ${
                shake ? "shake" : ""
              }`}
              type="password"
              placeholder="Passcode"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              disabled={clicked}
            />
            <button
              type="submit"
              disabled={clicked}
              className={`w-full rounded-xl py-3 font-semibold transition ${
                clicked
                  ? "cursor-default bg-gradient-to-r from-[#ff7ca9]/50 to-[#ff9abc]/50 text-[#32111e]/50"
                  : "bg-gradient-to-r from-[#ff7ca9] to-[#ff9abc] text-[#32111e] hover:brightness-110"
              }`}
            >
              {clicked ? "Unlocking..." : "Unlock 💗"}
            </button>
          </form>

          {error && <p className="mt-4 text-center text-sm text-blush">{error}</p>}
          <p className="mt-6 text-center text-xs text-pearl/50">Hint value in code: The day it all began</p>
        </motion.section>
      </div>

      {/* Burst petals */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {clicked &&
          petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute h-16 w-12 transform-gpu"
              style={{ left: "50%", top: "56%", willChange: "transform, opacity" }}
              initial={{ opacity: 0, scale: 0.2, rotate: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.94],
                scale: [0.2, petal.scale, petal.scale, 0.8],
                rotate: [petal.rotate, petal.rotate, petal.rotate + petal.spin * 240],
                x: petal.targetX,
                y: petal.targetY
              }}
              transition={{
                delay: BURST_CLICK_DELAY + petal.delay * 0.32,
                duration: TIMING.petalsSpreadDuration + TIMING.petalsHold + 0.2,
                times: [
                  0,
                  0.15,
                  Math.min(
                    1,
                    (TIMING.petalsFinish - TIMING.burstStart) /
                      (TIMING.petalsSpreadDuration + TIMING.petalsHold + 0.2)
                  ),
                  1
                ],
                ease: "easeOut"
              }}
            >
              <svg viewBox="0 0 60 90" className="h-full w-full drop-shadow-[0_4px_12px_rgba(40,0,10,0.85)]">
                <defs>
                  <linearGradient id={`petal-${petal.id}`} x1="35%" y1="0%" x2="65%" y2="100%">
                    <stop offset="0%" stopColor="#ff8aa8" />
                    <stop offset="35%" stopColor="#e84055" />
                    <stop offset="100%" stopColor="#6b0319" />
                  </linearGradient>
                </defs>
                <path d="M30 8 C16 22 10 45 18 68 C23 82 28 88 30 89 C32 88 37 82 42 68 C50 45 44 22 30 8 Z" fill={`url(#petal-${petal.id})`} />
                <path d="M30 18 C20 30 16 50 22 70 C25 80 28 85 30 87 C32 85 35 80 38 70 C44 50 40 30 30 18 Z" fill="#ff6d94" opacity="0.62" />
              </svg>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}
