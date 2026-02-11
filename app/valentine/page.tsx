"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { isUnlockedByDate } from "@/lib/date";
import { getPasscodeVerified } from "@/lib/storage";

type Heart = {
  id: number;
  left: number;
  duration: number;
  size: number;
  symbol: string;
};

export default function ValentinePage() {
  const router = useRouter();
  const [burstCount, setBurstCount] = useState(0);

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
    if (!getPasscodeVerified()) {
      router.replace("/passcode");
      return;
    }

    const timer = window.setTimeout(() => {
      setBurstCount((prev) => prev + 1);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [router]);

  const burst = useMemo<Heart[]>(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        id: index + burstCount * 100,
        left: Math.random() * 100,
        duration: 2 + Math.random() * 2.3,
        size: 14 + Math.random() * 24,
        symbol: ["💖", "💗", "✨", "💞"][index % 4]
      })),
    [burstCount]
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:p-6 md:p-8">
      <AnimatePresence>
        {burstCount > 0 &&
          burst.map((heart) => (
            <motion.span
              key={heart.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0], y: -420 }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeOut" }}
              className="pointer-events-none absolute"
              style={{ left: `${heart.left}%`, bottom: "-10px", fontSize: `${heart.size}px` }}
            >
              {heart.symbol}
            </motion.span>
          ))}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel z-10 w-full max-w-2xl p-5 text-center shadow-glow sm:p-6 md:p-8"
      >
        <h1 className="font-script text-4xl text-blush sm:text-5xl md:text-7xl">I Love You 💖</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-pearl/80 sm:text-base">
          Every page was a little reminder: I choose you in every timeline.
        </p>
      </motion.section>
    </div>
  );
}
