"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/data/content";

export default function Nav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`glass fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2 transition-shadow ${
        scrolled ? "shadow-lg shadow-black/10" : ""
      }`}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`relative rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            active === item.id
              ? "text-white"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {active === item.id && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </motion.nav>
  );
}
