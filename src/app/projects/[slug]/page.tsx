import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, type Project } from "@/data/content";
import Nav from "@/components/Nav";
import ThemeToggle from "@/components/ThemeToggle";

const linkLabels: Record<keyof Project["links"], string> = {
  github: "Github",
  linkedin: "LinkedIn",
  demo: "Demo",
  documentation: "Documentation",
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const linkEntries = Object.entries(project.links).filter(([, url]) => url);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Nav />
      <ThemeToggle />
      <main className="flex flex-1 flex-col">
        <div className="section-shell !max-w-4xl !pt-32">
          <Link
            href="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-[var(--accent-2)]"
          >
            ← Retour aux projets
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--glass-border)] px-3 py-1 text-xs text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.images.length > 0 ? (
            <div className="mt-10 flex flex-col gap-6">
              {project.images.map((src) => (
                <div
                  key={src}
                  className="glass relative h-64 w-full overflow-hidden rounded-2xl sm:h-[420px]"
                >
                  <Image src={src} alt={project.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass mt-10 flex h-64 w-full items-center justify-center rounded-2xl text-4xl">
              📊
            </div>
          )}

          <div className="glass mt-10 rounded-2xl p-6 sm:p-8">
            <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">
              {project.longDescription || project.description}
            </p>
          </div>

          {linkEntries.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {linkEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
                >
                  {linkLabels[key as keyof Project["links"]]}
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
