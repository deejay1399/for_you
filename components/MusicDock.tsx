"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";

export default function MusicDock() {
  const { isPlaying, toggleMusic } = useAudio();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleMusic}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-pearl backdrop-blur-md hover:bg-white/20"
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? "Music: On ♪" : "Music: Off"}
    </motion.button>
  );
}
