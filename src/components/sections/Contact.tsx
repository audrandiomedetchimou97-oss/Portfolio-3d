"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile, socials } from "@/data/content";

type IconLink = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 015.73 0c2.18-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.8 1.18 1.83 1.18 3.09 0 4.41-2.7 5.39-5.26 5.67.41.36.78 1.08.78 2.17v3.22c0 .3.2.66.79.55A11.5 11.5 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3 6l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendlyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CvIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2.5h8l5 5v14a1 1 0 01-1 1H6a1 1 0 01-1-1v-18a1 1 0 011-1z" />
      <path d="M14 2.5v5h5" />
      <path d="M8 13h8M8 16.5h5" strokeLinecap="round" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const links: IconLink[] = [
    { key: "linkedin", label: "LinkedIn", href: socials.linkedin, icon: <LinkedinIcon /> },
    { key: "github", label: "Github", href: socials.github, icon: <GithubIcon /> },
    {
      key: "email",
      label: "Email",
      href: socials.email ? `mailto:${socials.email}` : "",
      icon: <EmailIcon />,
    },
    { key: "calendly", label: "Calendly", href: socials.calendly, icon: <CalendlyIcon /> },
    { key: "cv", label: "CV", href: profile.cv, icon: <CvIcon /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = socials.email || "";
    const subject = encodeURIComponent(`Contact portfolio — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center text-center sm:mb-16"
      >
        <span className="text-gradient mb-3 text-xs font-semibold uppercase tracking-[0.3em]">
          Restons en contact
        </span>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h2>
      </motion.div>

      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href || "#"}
              target={link.key === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-disabled={!link.href}
              title={link.href ? link.label : `${link.label} — lien à compléter`}
              className={`glass group flex h-14 w-14 items-center justify-center rounded-full transition-all hover:-translate-y-1 ${
                link.href ? "" : "opacity-40"
              }`}
              style={{ transition: "box-shadow .3s ease, transform .3s ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 24px 2px var(--accent-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass flex flex-col gap-4 rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Ton nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]"
            />
            <input
              required
              type="email"
              placeholder="Ton email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]"
            />
          </div>
          <textarea
            required
            rows={4}
            placeholder="Ton message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]"
          />
          <button
            type="submit"
            className="self-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Envoyer le message
          </button>
        </motion.form>
      </div>

      <p className="mt-16 text-center text-xs text-foreground-muted">
        © {new Date().getFullYear()} {profile.name} — {profile.role}
      </p>
    </section>
  );
}
