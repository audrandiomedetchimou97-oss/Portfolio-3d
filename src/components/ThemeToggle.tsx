"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Basculer le mode jour/nuit"
      className="glass fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              stroke="var(--accent-2)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="4.5" stroke="var(--accent)" strokeWidth="1.6" />
            <g stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 2.5v2" />
              <path d="M12 19.5v2" />
              <path d="M4.2 4.2l1.4 1.4" />
              <path d="M18.4 18.4l1.4 1.4" />
              <path d="M2.5 12h2" />
              <path d="M19.5 12h2" />
              <path d="M4.2 19.8l1.4-1.4" />
              <path d="M18.4 5.6l1.4-1.4" />
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
