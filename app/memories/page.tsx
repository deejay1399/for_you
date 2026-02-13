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
    image: "/images/105612115_1788423961299996_3227210796571427872_n.jpg",
    title: "First Baby",
    story: "The day we became three, my heart grew twice as big. Our greatest adventure began in that moment."
  },
  {
    id: 2,
    image: "/images/126139940_1934193656723025_5112187826712982412_n.jpg",
    title: "Sea of Clouds",
    story: "Above the clouds and the world below, I found eternity in your eyes on that sacred day."
  },
  {
    id: 3,
    image: "/images/134980761_1969808093161581_4643444260976740354_n.jpg",
    title: "Beach Days",
    story: "Sand in our hair, sunshine on our skin, and you by my side—perfection in its purest form."
  },
  {
    id: 4,
    image: "/images/43450106_1269999056475825_533257431459823616_n.jpg",
    title: "Beach Getaway",
    story: "Beach nights with our loves and laughter echoing into the distance. These are the memories that matter most."
  },
  {
    id: 5,
    image: "/images/482204157_3206142169528161_2944184804137207702_n.jpg",
    title: "Your Smile",
    story: "That smile that could light up the darkest day and make everything worth it. Always my favorite view."
  },
  {
    id: 6,
    image: "/images/484308037_3214464578695920_1885033113538651110_n.jpg",
    title: "By the Water",
    story: "Still as the water, peaceful as the moment, holding you close and knowing I'm exactly where I belong."
  },
  {
    id: 7,
    image: "/images/490348203_3254565848019126_2681514104175395006_n.jpg",
    title: "Graduation Day",
    story: "Proud, excited, and so ready for the future—because you're walking into it with me by your side."
  },
  {
    id: 8,
    image: "/images/503307631_3305855419556835_1063977480077365800_n.jpg",
    title: "Travel Goals",
    story: "Every adventure is better with you. This is just the beginning of all the places we'll explore together."
  },
  {
    id: 9,
    image: "/images/506530092_3325171520958558_1782192333350087852_n.jpg",
    title: "First Date w/out Label",
    story: "The date that changed everything—where we stopped pretending and started believing in forever."
  },
  {
    id: 10,
    image: "/images/509432719_3330966820379028_6683136378372929935_n.jpg",
    title: "First Valentine Gift",
    story: "The first gift that told you I see you, I love you, and I want to make every moment count with you."
  },
  {
    id: 11,
    image: "/images/557636320_3455265961282446_5466332129867670447_n.jpg",
    title: "Our Growing Love",
    story: "Building a family, building dreams, building forever with you."
  },
  {
    id: 12,
    image: "/images/592376145_3515945731881135_6742562798550904870_n.jpg",
    title: "Little Moments",
    story: "In those tiny face moments, I see all the reasons I fell in love with you."
  },
  {
    id: 13,
    image: "/images/0f6be61d-ca3e-42a0-a30a-73cf4ae4a7fd.jpg",
    title: "Water Adventures",
    story: "Your happy smile in the sun is everything I needed to see. These are the moments I'll hold forever."
  },
  {
    id: 14,
    image: "/images/16583396-515b-4da7-8dcb-336cf81bb3ae.jpg",
    title: "Coffee & You",
    story: "Casual moments with you are my favorite kind of luxury—no fancy place needed when I'm with you."
  },
  {
    id: 15,
    image: "/images/204a2a86-be0a-428c-acaa-11231559bc5a.jpg",
    title: "Playing Around",
    story: "Laughing together, being silly—these are the memories that make life beautiful."
  },
  {
    id: 16,
    image: "/images/413f5d9a-92e4-4ba7-872c-fe501099ca47.jpg",
    title: "Achievement Unlocked",
    story: "So proud to stand beside you and celebrate every win, no matter how big or small."
  },
  {
    id: 17,
    image: "/images/559d7579-7f2f-4a63-9407-f71442b3200c.jpg",
    title: "Movie Nights",
    story: "Just you, me, and the comfort of being together. The movie doesn't matter when you're here."
  },
  {
    id: 18,
    image: "/images/5789bcac-9473-44e6-afed-93418a568298.jpg",
    title: "Getaway Vibes",
    story: "Escaping reality with you is all the vacation I need. Adventure awaits wherever you are."
  },
  {
    id: 19,
    image: "/images/627505953_1914727702769390_1662733156553247178_n.jpg",
    title: "Island Hopping",
    story: "From one island paradise to another, exploring the world with you and our family by our side."
  },
  {
    id: 20,
    image: "/images/76b2df99-1b04-4203-8ab0-b9f637aa3f2f.jpg",
    title: "Couple Shirts",
    story: "Matching outfits, matching hearts—showing the world that we're a perfectly coordinated team."
  },
  {
    id: 21,
    image: "/images/8676ff84-5f8f-4e14-834f-f87ba7daeb43.jpg",
    title: "Cooking Love",
    story: "Even in the kitchen, everything feels right when you're by my side."
    
  },
  {
    id: 22,
    image: "/images/8eda25fe-a66f-48ac-a7af-548e731a09e8.jpg",
    title: "Weekend Escape",
    story: "Sometimes it's just us against the world, and that's exactly how I like it."
  },
  {
    id: 23,
    image: "/images/98b07e6d-1c93-48ab-aedf-3247e7a27c82.jpg",
    title: "Movie Nights",
    story: "Popcorn, dim lights, and your hand in mine. The perfect way to end any day."
  },
  {
    id: 24,
    image: "/images/aecdcc4e-cad1-4cb5-9417-288b69a3b402.jpg",
    title: "Dining Together",
    story: "Our little ones, your love, and the life we're building together—this is everything."
  },
  {
    id: 25,
    image: "/images/b4a88c9a-5f75-4bcf-82e5-3769a5e5f0a3.jpg",
    title: "Backseat Snaps",
    story: "Watching you with our children fills my heart with so much love and gratitude."
  },
  {
    id: 26,
    image: "/images/e184455b-46a7-4cfe-8f98-17ce94e38f78.jpg",
    title: "Seffie Time",
    story: "With you by my side, every selfie captures pure joy. You're my favorite view."
  },
  {
    id: 27,
    image: "/images/e608c638-4625-41f6-80d8-e55654b43ff8.jpg",
    title: "Sacred Moments",
    story: "Together in faith and love, grateful for every blessing you bring to my life."
  
  },
  {
    id: 28,
    image: "/images/e75c2dc9-372a-4fec-b5ee-f8f24f7291ce.jpg",
    title: "Road Trips",
    story: "Every outing is an adventure when I'm with you and our growing family."
  },
  {
    id: 29,
    image: "/images/fcd3b18b-c1f8-47cc-846e-d4ad9ec8c937.jpg",
    title: "Achievements",
    story: "Every milestone with you fuels my drive to be better. You make me want to achieve the world."
  },
  {
    id: 30,
    image: "/images/fd2f8fc1-1683-491e-ae1c-21a1f12c0a40.jpg",
    title: "Me and You",
    story: "In the simplest moments with just us two, I find everything I've ever wanted."
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
                <Image
                  src={memory.image}
                  alt={memory.title}
                  fill
                  sizes="(max-width: 768px) 160px, 180px"
                  quality={62}
                  className="object-cover"
                />
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
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 680px"
                  quality={74}
                  className="object-cover"
                />
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
