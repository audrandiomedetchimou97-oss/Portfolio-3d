import { notFound } from "next/navigation";
import { projects } from "@/data/content";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="section-shell !max-w-2xl !pt-24">
      <h1 className="mb-8 text-2xl font-semibold">Modifier « {project.title} »</h1>
      <EditProjectForm project={project} />
    </div>
  );
}
