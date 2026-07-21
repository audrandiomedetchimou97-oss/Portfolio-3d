"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="section-shell">
      <SectionHeading eyebrow="Parcours" title="Expériences professionnelles" />
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--accent-2)] to-transparent sm:left-[11px]" />
        <div className="flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="relative pl-8 sm:pl-12"
            >
              <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] sm:h-[22px] sm:w-[22px] sm:top-0" />
              <div className="glass rounded-2xl p-6 sm:p-8">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold sm:text-xl">{exp.company}</h3>
                  {exp.period && (
                    <span className="text-xs text-foreground-muted">{exp.period}</span>
                  )}
                </div>
                <p className="mb-4 text-sm text-gradient font-medium">{exp.role}</p>
                <ul className="flex flex-col gap-2">
                  {exp.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-foreground-muted sm:text-base"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-2)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
