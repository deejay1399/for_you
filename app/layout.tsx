import type { Metadata } from "next";
import { Dancing_Script, Nunito } from "next/font/google";
import AppShell from "@/components/AppShell";
import "./globals.css";

const bodyFont = Nunito({ subsets: ["latin"] });
const scriptFont = Dancing_Script({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "Valentine Bloom",
  description: "A time-locked Valentine greeting web app."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/music/romantic.mp3" as="audio" type="audio/mpeg" />
      </head>
      <body className={`${bodyFont.className} ${scriptFont.variable} bg-midnight`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
