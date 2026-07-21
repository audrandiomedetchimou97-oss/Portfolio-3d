import Link from "next/link";
import { projects, certifications, experiences, profile } from "@/data/content";
import LogoutButton from "./LogoutButton";
import CvUploadForm from "./CvUploadForm";

export default function AdminDashboard() {
  return (
    <div className="section-shell !max-w-3xl !pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <LogoutButton />
      </div>

      <CvUploadForm currentCv={profile.cv} />

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Expériences</h2>
          <Link
            href="/admin/experiences/new"
            className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            + Ajouter une expérience
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {experiences.map((exp) => (
            <div key={exp.slug} className="glass flex items-center justify-between rounded-xl p-4">
              <div>
                <p className="font-medium">{exp.company}</p>
                <p className="text-xs text-foreground-muted">{exp.role}</p>
              </div>
              <Link
                href={`/admin/experiences/${exp.slug}/edit`}
                className="text-sm text-[var(--accent-2)] hover:underline"
              >
                Éditer
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projets</h2>
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            + Ajouter un projet
          </Link>
        </div>

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
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Certifications</h2>
          <Link
            href="/admin/certifications/new"
            className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            + Ajouter une certification
          </Link>
        </div>

        {certifications.length === 0 ? (
          <p className="glass rounded-xl p-4 text-sm text-foreground-muted">
            Aucune certification pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.slug}
                className="glass flex items-center justify-between rounded-xl p-4"
              >
                <div>
                  <p className="font-medium">{cert.title}</p>
                  <p className="text-xs text-foreground-muted">
                    {cert.issuer} — {cert.date}
                  </p>
                </div>
                <Link
                  href={`/admin/certifications/${cert.slug}/edit`}
                  className="text-sm text-[var(--accent-2)] hover:underline"
                >
                  Éditer
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
