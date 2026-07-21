import { notFound } from "next/navigation";
import { experiences } from "@/data/content";
import EditExperienceForm from "./EditExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = experiences.find((e) => e.slug === slug);

  if (!experience) {
    notFound();
  }

  return (
    <div className="section-shell !max-w-2xl !pt-24">
      <h1 className="mb-8 text-2xl font-semibold">Modifier « {experience.company} »</h1>
      <EditExperienceForm experience={experience} />
    </div>
  );
}
