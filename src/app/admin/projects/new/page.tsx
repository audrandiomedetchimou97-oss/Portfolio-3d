import NewProjectForm from "./NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="section-shell !max-w-2xl !pt-24">
      <h1 className="mb-8 text-2xl font-semibold">Ajouter un projet</h1>
      <NewProjectForm />
    </div>
  );
}
