"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { certifications } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";

export default function Certifications() {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="section-shell">
      <SectionHeading eyebrow="Preuves" title="Certifications" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <motion.a
            key={cert.slug}
            href={cert.credentialUrl || undefined}
            target={cert.credentialUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className={`glass flex flex-col gap-4 rounded-2xl p-6 ${
              cert.credentialUrl ? "hover:-translate-y-1 transition-transform" : ""
            }`}
          >
            {cert.image ? (
              <div className="relative h-32 w-full overflow-hidden rounded-xl bg-black/10">
                <Image src={cert.image} alt={cert.title} fill className="object-contain" />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/15 to-[var(--accent-2)]/15 text-3xl">
                🏅
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold sm:text-base">{cert.title}</h3>
              <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
                {cert.issuer} — {cert.date}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
