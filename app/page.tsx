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
  const targetLabel = useMemo(
    () =>
      target.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
    [target]
  );
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (isUnlockedByDate()) {
      router.replace("/passcode");
      return;
    }

    setRemaining(target.getTime() - Date.now());

    const timer = window.setInterval(() => {
      const nextValue = target.getTime() - Date.now();
      setRemaining(nextValue);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [router, target]);

  const { days, hours, minutes, seconds } = formatTime(remaining ?? 0);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:p-6 md:p-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel w-full max-w-2xl p-5 text-center shadow-glow sm:p-6 md:p-8"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blush/80 sm:mb-4 sm:text-sm sm:tracking-[0.35em]">
          Valentine Countdown
        </p>
        <h1 className="mb-3 text-2xl font-semibold leading-tight text-pearl sm:text-3xl md:text-4xl">
          This surprise blooms on {targetLabel}
        </h1>
        <p className="mb-6 text-sm text-pearl/75 sm:mb-8">Counting down in your local browser time.</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Minutes", value: minutes },
            { label: "Seconds", value: seconds }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/15 bg-black/20 p-3 sm:p-4">
              <div className="text-2xl font-bold text-blush sm:text-3xl">
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
