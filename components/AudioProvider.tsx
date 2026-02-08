"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { getMusicEnabled, setMusicEnabled } from "@/lib/storage";

type AudioContextValue = {
  isPlaying: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Never autoplay on first load; only resume if user had already opted in.
    const storedState = getMusicEnabled();
    if (storedState) {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0.25;
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    setMusicEnabled(true);
    if (!audio) {
      setIsPlaying(true);
      return;
    }
    audio.volume = 0.25;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const toggleMusic = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      setMusicEnabled(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      toggleMusic,
      startMusic
    }),
    [isPlaying, startMusic, toggleMusic]
  );

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} src="/music/romantic.mp3" loop preload="auto" />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider.");
  }
  return context;
}
