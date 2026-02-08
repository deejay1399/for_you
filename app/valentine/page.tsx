"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { isUnlockedByDate } from "@/lib/date";
import { getPasscodeVerified, getResponse, setResponse } from "@/lib/storage";

type Heart = {
  id: number;
  left: number;
  duration: number;
  size: number;
  symbol: string;
};

export default function ValentinePage() {
  const router = useRouter();
  const [answer, setAnswer] = useState<string | null>(null);
  const [burstCount, setBurstCount] = useState(0);
  const [burstMode, setBurstMode] = useState<"yes" | "always">("yes");

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
    if (!getPasscodeVerified()) {
      router.replace("/passcode");
      return;
    }
    setAnswer(getResponse());
  }, [router]);

  const burst = useMemo<Heart[]>(
    () =>
      Array.from({ length: burstMode === "yes" ? 20 : 48 }, (_, index) => ({
        id: index + burstCount * 100,
        left: Math.random() * 100,
        duration: burstMode === "yes" ? 2.3 + Math.random() * 1.2 : 2 + Math.random() * 2.3,
        size: burstMode === "yes" ? 18 + Math.random() * 14 : 14 + Math.random() * 24,
        symbol:
          burstMode === "yes" ? (index % 2 === 0 ? "💖" : "💗") : ["💖", "💗", "✨", "💞"][index % 4]
      })),
    [burstCount, burstMode]
  );

  const choose = (value: string, mode: "yes" | "always") => {
    setResponse(value);
    setAnswer(value);
    setBurstMode(mode);
    setBurstCount((prev) => prev + 1);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
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
        className="panel z-10 w-full max-w-2xl text-center shadow-glow"
      >
        <h1 className="font-script text-6xl text-blush md:text-7xl">Will you be my Valentine? 💌</h1>
        <p className="mx-auto mt-3 max-w-lg text-pearl/80">
          Every page was a little reminder: I choose you in every timeline.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => choose("Yes 💖", "yes")}
            className="rounded-full bg-gradient-to-r from-[#ff729f] to-[#ff9fbc] px-7 py-3 font-semibold text-[#40152a]"
          >
            Yes 💖
          </button>
          <button
            onClick={() => choose("Always 💕", "always")}
            className="rounded-full border border-blush/80 bg-transparent px-7 py-3 font-semibold text-blush"
          >
            Always 💕
          </button>
        </div>

        {answer && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-xl font-semibold text-pearl"
          >
            {answer === "Yes 💖" ? "My heart is glowing brighter already." : "That answer deserves a confetti sky."}{" "}
            <span className="text-blush">Your answer: {answer}</span>
          </motion.p>
        )}
      </motion.section>
    </div>
  );
}
