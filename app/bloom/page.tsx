"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isUnlockedByDate } from "@/lib/date";
import { getPasscodeVerified } from "@/lib/storage";

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

export default function BloomPage() {
  const router = useRouter();
  const [clicked, setClicked] = useState(true);
  const petals = useMemo(() => buildBurstPetals(340), []);
  const carpetPetals = useMemo(() => buildCarpetPetals(680), []);

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
      className="bloom-scene relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: TIMING.routeToGallery,
        times: [0, 0.08, TIMING.pageFadeOutStart / TIMING.routeToGallery, 1],
        ease: "easeInOut"
      }}
    >
      <div className="bloom-vignette pointer-events-none absolute inset-0" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.35, 0.8, 1] }}
        transition={{
          delay: TIMING.colorFloodStart,
          duration: TIMING.routeToGallery - TIMING.colorFloodStart - 0.1,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        }}
        style={{
          background:
            "radial-gradient(120% 90% at 50% 35%, rgba(255,132,160,0.95) 0%, rgba(237,57,104,0.9) 38%, rgba(181,22,61,0.94) 72%, rgba(111,8,34,0.98) 100%)"
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[15]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.45, 0.85, 1] }}
        transition={{
          delay: TIMING.burstStart + 0.2,
          duration: TIMING.petalsSpreadDuration + TIMING.petalsHold - 0.1,
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

      <motion.div
        className="pointer-events-none absolute inset-0 z-[16]"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 0, 0.42, 1, 1, 0], y: [0, 0, 0, 0, 0, -50] }}
        transition={{
          delay: TIMING.petalsDropStart,
          duration: TIMING.routeToGallery - TIMING.petalsDropStart - 0.1,
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

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: [0, 1, 1, 0], y: [14, 0, 0, -6] }}
        transition={{
          duration: TIMING.routeToGallery,
          times: [0, 0.12, TIMING.pageFadeOutStart / TIMING.routeToGallery, 1],
          ease: "easeInOut"
        }}
        className="panel bloom-panel relative z-10 w-full max-w-lg text-center"
      >
        <h1 className="mb-3 text-3xl font-semibold">For You</h1>
        <p className="mb-8 text-pearl/70">{clicked ? "Welcome to another world..." : "Ready to enter?"}</p>

        <div className="mx-auto flex h-[360px] w-[300px] items-center justify-center">
          {/* Enter link - triggers world portal effect */}
          <motion.button
            onClick={() => !clicked && setClicked(true)}
            disabled={clicked}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1],
              opacity: [0, 1],
              y: [20, 0]
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className={`relative px-8 py-3 text-2xl font-semibold transition-all ${
              clicked
                ? "cursor-default text-blush/50"
                : "cursor-pointer text-blush hover:text-white hover:scale-110 hover:tracking-wider"
            }`}
          >
            ✨ {clicked ? "Entering..." : "Enter"}
          </motion.button>

          {/* Explosion effect flash - becomes portal effect */}
          {clicked && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{
                delay: TIMING.explosionStart,
                duration: 0.5,
                ease: "easeOut"
              }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,150,100,0.9) 0%, rgba(255,100,50,0.5) 40%, transparent 100%)"
              }}
            />
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={clicked ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
          transition={
            clicked
              ? {
                  delay: TIMING.burstStart,
                  duration: TIMING.petalsSpreadDuration + TIMING.petalsHold,
                  times: [0, 0.22, 0.82, 1]
                }
              : {}
          }
          className="mt-3 text-sm text-blush"
        >
          ✨ Entering another world...
        </motion.p>
      </motion.section>

      <div className="pointer-events-none absolute inset-0 z-20">
        {clicked &&
          petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute h-16 w-12 transform-gpu"
              style={{ left: "50%", top: "56%" }}
              initial={{ opacity: 0, scale: 0.2, rotate: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.94],
                scale: [0.08, petal.scale * 1.18, petal.scale, petal.scale * 0.96],
                rotate: [0, petal.rotate, petal.rotate + petal.spin],
                x: [0, petal.targetX * 0.24, petal.targetX, petal.targetX * 1.05],
                y: [0, petal.targetY * 0.2 - 36, petal.targetY, petal.targetY * 1.03]
              }}
              transition={{
                delay: TIMING.burstStart + petal.delay,
                duration: TIMING.petalsSpreadDuration + TIMING.petalsHold + 0.25,
                times: [0, 0.22, 0.84, 1],
                ease: [0.12, 0.86, 0.25, 1]
              }}
            >
              <svg viewBox="0 0 60 90" className="h-full w-full drop-shadow-[0_2px_8px_rgba(80,0,20,0.62)]">
                <defs>
                  <linearGradient id={`giftPetal-${petal.id}`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#ff95b5" />
                    <stop offset="52%" stopColor="#df2e59" />
                    <stop offset="100%" stopColor="#6f071f" />
                  </linearGradient>
                </defs>
                <path d="M30 5 C13 20 8 43 15 63 C20 78 27 87 30 89 C33 87 40 78 45 63 C52 43 47 20 30 5 Z" fill={`url(#giftPetal-${petal.id})`} />
                <path d="M30 12 C18 24 15 45 20 61 C23 72 27 79 30 82 C33 79 37 72 40 61 C45 45 42 24 30 12 Z" fill="#ffaccd" opacity="0.62" />
                <path d="M30 14 C30 30 29 58 30 84" stroke="#ffd8e8" strokeWidth="1.7" strokeLinecap="round" opacity="0.68" />
              </svg>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}
