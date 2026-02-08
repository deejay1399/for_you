"use client";

import { AudioProvider } from "@/components/AudioProvider";
import MusicDock from "@/components/MusicDock";
import StarryBackground from "@/components/StarryBackground";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <StarryBackground />
      <main className="relative min-h-screen text-pearl">{children}</main>
      <MusicDock />
    </AudioProvider>
  );
}
