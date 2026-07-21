"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/content";
import { useTheme } from "@/context/theme-context";

const ParticleScene = dynamic(() => import("@/components/Scene/ParticleScene"), {
  ssr: false,
});

const nameLetters = profile.name.split("");

export default function Hero() {
  const { theme } = useTheme();
  const accent = theme === "dark" ? "#7c5cff" : "#6a3df5";
  const accent2 = theme === "dark" ? "#4fd8ff" : "#0ea5c4";

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <ParticleScene accent={accent} accent2={accent2} />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, transparent, var(--background) 90%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28"
        >
          <Image
            src={profile.photo}
            alt={profile.name}
            width={112}
            height={112}
            className="h-full w-full object-cover"
            priority
          />
        </motion.div>

        <h1 className="flex flex-wrap justify-center text-4xl font-semibold tracking-tight sm:text-6xl">
          {nameLetters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: "easeOut" }}
              className={letter === " " ? "w-3" : "text-gradient"}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-lg text-foreground-muted sm:text-xl"
        >
          {profile.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="max-w-lg text-sm text-foreground-muted sm:text-base"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={profile.cv}
            download
            className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            Télécharger mon CV
          </a>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="glass rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Contact
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-foreground-muted"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border border-[var(--glass-border)] p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
