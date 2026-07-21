"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { futureProjects, projects, type Project } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";

const linkLabels: Record<keyof Project["links"], string> = {
  github: "Github",
  linkedin: "LinkedIn",
  demo: "Demo",
  documentation: "Documentation",
};

export default function Projects() {
  return (
    <section id="projects" className="section-shell">
      <SectionHeading eyebrow="Réalisations" title="Projects" />

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => {
          const linkEntries = Object.entries(project.links).filter(([, url]) => url);
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="glass flex flex-col gap-4 rounded-2xl p-6 sm:p-8"
            >
              <Link href={`/projects/${project.slug}`} className="flex flex-col gap-4">
                {project.images[0] ? (
                  <div className="relative -mx-6 -mt-6 h-44 overflow-hidden rounded-t-2xl sm:-mx-8 sm:-mt-8 sm:h-52">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="-mx-6 -mt-6 flex h-32 items-center justify-center rounded-t-2xl bg-gradient-to-br from-[var(--accent)]/15 to-[var(--accent-2)]/15 text-2xl sm:-mx-8 sm:-mt-8 sm:h-36">
                    📊
                  </div>
                )}
                <h3 className="text-lg font-semibold hover:text-[var(--accent-2)] sm:text-xl">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground-muted sm:text-base">
                  {project.description}
                </p>
              </Link>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--glass-border)] px-3 py-1 text-xs text-foreground-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-105"
                >
                  Voir le projet
                </Link>
                {linkEntries.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-full px-4 py-2 text-xs font-medium transition-transform hover:scale-105"
                  >
                    {linkLabels[key as keyof Project["links"]]}
                  </a>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="glass mt-8 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-gradient mb-4 text-sm font-semibold uppercase tracking-[0.15em]">
          Futurs projets
        </h3>
        <div className="flex flex-wrap gap-2">
          {futureProjects.map((item) => (
            <span
              key={item}
              className="rounded-full border border-dashed border-[var(--glass-border)] px-4 py-2 text-xs text-foreground-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
