"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/content";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [longDescription, setLongDescription] = useState(project.longDescription || "");
  const [tags, setTags] = useState(project.tags.join(", "));
  const [github, setGithub] = useState(project.links.github || "");
  const [linkedin, setLinkedin] = useState(project.links.linkedin || "");
  const [demo, setDemo] = useState(project.links.demo || "");
  const [documentation, setDocumentation] = useState(project.links.documentation || "");
  const [existingImages, setExistingImages] = useState(project.images);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const toggleRemoveImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setRemoveImages((prev) => [...prev, img]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("longDescription", longDescription);
    formData.set(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    formData.set("links", JSON.stringify({ github, linkedin, demo, documentation }));
    formData.set("removeImages", JSON.stringify(removeImages));
    if (newImages) {
      Array.from(newImages).forEach((file) => formData.append("images", file));
    }

    const res = await fetch(`/api/admin/projects/${project.slug}`, {
      method: "PUT",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement « ${project.title} » ?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/projects/${project.slug}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur lors de la suppression.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass flex flex-col gap-4 rounded-2xl p-6 sm:p-8">
      <input
        required
        placeholder="Titre du projet"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <textarea
        required
        rows={2}
        placeholder="Description courte"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <textarea
        rows={5}
        placeholder="Description longue"
        value={longDescription}
        onChange={(e) => setLongDescription(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Tags séparés par des virgules"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={inputClass}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          placeholder="Lien Github"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Lien LinkedIn"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Lien Demo"
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Lien Documentation"
          value={documentation}
          onChange={(e) => setDocumentation(e.target.value)}
          className={inputClass}
        />
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="mb-2 block text-xs text-foreground-muted">Images actuelles</label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existingImages.map((img) => (
              <div key={img} className="group relative aspect-video overflow-hidden rounded-lg">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => toggleRemoveImage(img)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          Ajouter de nouvelles images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNewImages(e.target.files)}
          className="text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="cursor-pointer text-sm text-red-400 hover:underline disabled:opacity-50"
        >
          {deleting ? "Suppression..." : "Supprimer le projet"}
        </button>
      </div>
    </form>
  );
}
