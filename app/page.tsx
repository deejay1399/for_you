"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getValentineDate, isUnlockedByDate } from "@/lib/date";

function formatTime(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function HomePage() {
  const router = useRouter();
  const target = useMemo(() => getValentineDate(), []);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Date gate: once local time reaches Feb 14, skip countdown and continue to passcode.
    if (isUnlockedByDate()) {
      router.replace("/passcode");
      return;
    }

    // Initialize client-side time after mount to prevent SSR/client clock mismatch.
    setRemaining(target.getTime() - Date.now());

    const timer = window.setInterval(() => {
      const nextValue = target.getTime() - Date.now();
      setRemaining(nextValue);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [router, target]);

  const { days, hours, minutes, seconds } = formatTime(remaining ?? 0);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel w-full max-w-xl text-center shadow-glow"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blush/80">Valentine Countdown</p>
        <h1 className="mb-3 text-3xl font-semibold text-pearl md:text-4xl">This surprise blooms on February 14 🌙✨</h1>
        <p className="mb-8 text-sm text-pearl/75">Counting down in your local browser time.</p>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Minutes", value: minutes },
            { label: "Seconds", value: seconds }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/15 bg-black/20 p-3">
              <div className="text-2xl font-bold text-blush">
                {remaining === null ? "--" : String(item.value).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-wider text-pearl/70">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
