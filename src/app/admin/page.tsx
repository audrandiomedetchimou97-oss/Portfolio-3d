import Link from "next/link";
import { projects } from "@/data/content";
import LogoutButton from "./LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="section-shell !max-w-3xl !pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Projets</h1>
        <LogoutButton />
      </div>

      <Link
        href="/admin/projects/new"
        className="mb-8 inline-block rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
      >
        + Ajouter un projet
      </Link>

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="glass flex items-center justify-between rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-xs text-foreground-muted">/projects/{project.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/projects/${project.slug}/edit`}
                className="text-sm text-[var(--accent-2)] hover:underline"
              >
                Éditer
              </Link>
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="text-sm text-foreground-muted hover:underline"
              >
                Voir →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
