"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ThreeRoseBouquet from "@/components/ThreeRoseBouquet";

type RoseVisualProps = {
  explodeStart: number;
};

export default function RoseVisual({ explodeStart }: RoseVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setFailed(true);
      return;
    }

    let frameId = 0;

    const draw = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const dark = max < 42;
          const nearBlack = max < 64 && max - min < 18;
          if (dark || nearBlack) {
            pixels[i + 3] = 0;
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      frameId = window.requestAnimationFrame(draw);
    };

    const onLoadedMeta = () => {
      const target = Math.max(explodeStart - 0.15, 1);
      if (video.duration && Number.isFinite(video.duration)) {
        video.playbackRate = Math.max(video.duration / target, 0.4);
      }
      video.play().catch(() => setFailed(true));
    };

    const onCanPlay = () => {
      video.play().catch(() => setFailed(true));
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("canplay", onCanPlay);
    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [explodeStart]);

  if (failed) {
    return <ThreeRoseBouquet explodeStart={explodeStart} />;
  }

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: explodeStart, times: [0, 0.92, 1], ease: "easeInOut" }}>
      <video
        ref={videoRef}
        className="pointer-events-none absolute h-px w-px opacity-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
      >
        <source src="/assets/video/rose-source.webm" type="video/webm" />
      </video>
      <canvas ref={canvasRef} width={260} height={360} className="h-[360px] w-[260px]" />
    </motion.div>
  );
}
