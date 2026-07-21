"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="section-shell">
      <SectionHeading eyebrow="Compétences" title="Skills" />
      <div className="flex flex-wrap justify-center gap-3">
        {skills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: i * 0.03, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="glass rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:text-[var(--accent-2)]"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
