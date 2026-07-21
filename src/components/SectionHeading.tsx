"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 flex flex-col items-center text-center sm:mb-16"
    >
      <span className="text-gradient mb-3 text-xs font-semibold uppercase tracking-[0.3em]">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </motion.div>
  );
}
