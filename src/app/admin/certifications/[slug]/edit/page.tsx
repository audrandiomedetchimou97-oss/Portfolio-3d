import { notFound } from "next/navigation";
import { certifications } from "@/data/content";
import EditCertificationForm from "./EditCertificationForm";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certification = certifications.find((c) => c.slug === slug);

  if (!certification) {
    notFound();
  }

  return (
    <div className="section-shell !max-w-2xl !pt-24">
      <h1 className="mb-8 text-2xl font-semibold">Modifier « {certification.title} »</h1>
      <EditCertificationForm certification={certification} />
    </div>
  );
}
