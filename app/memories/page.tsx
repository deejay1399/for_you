"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { isUnlockedByDate } from "@/lib/date";
import { getPasscodeVerified } from "@/lib/storage";

type Memory = {
  id: number;
  image: string;
  title: string;
  story: string;
  top: number;
  left: number;
  rotate: number;
};

const baseMemories: Omit<Memory, "top" | "left" | "rotate">[] = [
  {
    id: 1,
    image: "/images/memory-1.svg",
    title: "First Smile",
    story: "That first smile stole my focus and rewrote the whole day."
  },
  {
    id: 2,
    image: "/images/memory-2.svg",
    title: "Coffee Date",
    story: "We stayed too long, laughed too much, and forgot the time."
  },
  {
    id: 3,
    image: "/images/memory-3.svg",
    title: "Rain Walk",
    story: "Even the rain felt soft when your hand was in mine."
  },
  {
    id: 4,
    image: "/images/memory-4.svg",
    title: "Late-Night Talks",
    story: "I still replay those quiet midnight conversations."
  },
  {
    id: 5,
    image: "/images/memory-5.svg",
    title: "Road Trip",
    story: "Wrong turns, loud songs, and the best company I could ask for."
  },
  {
    id: 6,
    image: "/images/memory-6.svg",
    title: "Us",
    story: "Every memory points me back to one answer: always you."
  }
];

export default function MemoriesPage() {
  const router = useRouter();
  const boardRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const [justDraggedId, setJustDraggedId] = useState<number | null>(null);
  const memories = useMemo<Memory[]>(
    () =>
      // Stable "random-like" scatter so layout stays consistent per load.
      baseMemories.map((memory, index) => ({
        ...memory,
        top: 8 + ((index * 13) % 65),
        left: 6 + ((index * 17) % 72),
        rotate: -12 + ((index * 9) % 25)
      })),
    []
  );

  useEffect(() => {
    if (!isUnlockedByDate()) {
      router.replace("/");
      return;
    }
    if (!getPasscodeVerified()) {
      router.replace("/passcode");
    }
  }, [router]);

  const handleMemoryClick = (memory: Memory) => {
    if (justDraggedId === memory.id) {
      setJustDraggedId(null);
      return;
    }
    setSelected(memory);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-pearl md:text-4xl">Our Love Story</h1>
            <p className="font-script text-2xl text-blush/90">Tap a memory to hold it closer.</p>
          </div>
          <Link
            href="/valentine"
            className="rounded-full border border-blush/60 bg-blush/20 px-5 py-2 text-sm text-pearl hover:bg-blush/30"
          >
            Final Surprise {"->"}
          </Link>
        </div>

        <div ref={boardRef} className="relative min-h-[620px] rounded-3xl border border-white/15 bg-black/20 p-5">
          {memories.map((memory) => (
            <motion.button
              key={memory.id}
              onClick={() => handleMemoryClick(memory)}
              drag
              dragConstraints={boardRef}
              dragElastic={0.08}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 260, bounceDamping: 22 }}
              onDragStart={() => setActiveDragId(memory.id)}
              onDragEnd={(_, info) => {
                setActiveDragId(null);
                const dragDistance = Math.hypot(info.offset.x, info.offset.y);
                if (dragDistance > 8) {
                  setJustDraggedId(memory.id);
                  window.setTimeout(() => {
                    setJustDraggedId((current) => (current === memory.id ? null : current));
                  }, 140);
                }
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 1.01, cursor: "grabbing" }}
              className="absolute w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-white p-2 text-left shadow-2xl md:w-[180px]"
              style={{
                top: `${memory.top}%`,
                left: `${memory.left}%`,
                rotate: `${memory.rotate}deg`,
                zIndex: activeDragId === memory.id ? 30 : 10,
                cursor: "grab"
              }}
            >
              <div className="relative h-[150px] w-full overflow-hidden rounded-sm bg-rose/15 md:h-[170px]">
                <Image src={memory.image} alt={memory.title} fill className="object-cover" />
              </div>
              <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-[#3d3046]">{memory.title}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl rounded-3xl border border-white/20 bg-[#fff7fc] p-5 text-[#2d1c2e]"
            >
              <div className="relative mb-4 h-[260px] w-full overflow-hidden rounded-xl">
                <Image src={selected.image} alt={selected.title} fill className="object-cover" />
              </div>
              <h2 className="text-2xl font-semibold">{selected.title}</h2>
              <p className="mt-2 font-script text-3xl leading-tight text-[#5d3f62]">{selected.story}</p>
              <button
                className="mt-5 rounded-full bg-[#45243f] px-4 py-2 text-sm text-white"
                onClick={() => setSelected(null)}
              >
                Back to gallery
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
