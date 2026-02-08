"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PASSCODE } from "@/lib/constants";
import { isUnlockedByDate } from "@/lib/date";
import { setPasscodeVerified } from "@/lib/storage";
import { useAudio } from "@/components/AudioProvider";

export default function PasscodePage() {
  const router = useRouter();
  const { startMusic } = useAudio();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
  }, [router]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim() === PASSCODE) {
      setPasscodeVerified(true);
      startMusic();
      router.push("/bloom");
      return;
    }
    setError("Try again, love 💕");
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel w-full max-w-md"
      >
        <h1 className="mb-2 text-center text-3xl font-semibold text-pearl">One Last Secret</h1>
        <p className="mb-6 text-center text-pearl/75">Enter the passcode to open your Valentine surprise.</p>

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
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#ff7ca9] to-[#ff9abc] py-3 font-semibold text-[#32111e] transition hover:brightness-110"
          >
            Unlock 💗
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-blush">{error}</p>}
        <p className="mt-6 text-center text-xs text-pearl/50">Hint value in code: lib/constants.ts</p>
      </motion.section>
    </div>
  );
}
