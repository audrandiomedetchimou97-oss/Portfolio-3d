"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function NewProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [tags, setTags] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [demo, setDemo] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (images) {
      Array.from(images).forEach((file) => formData.append("images", file));
    }
    if (attachments) {
      Array.from(attachments).forEach((file) => formData.append("attachments", file));
    }

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur lors de l'ajout du projet.");
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
        placeholder="Description courte (affichée sur la carte)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <textarea
        rows={5}
        placeholder="Description longue (affichée sur la fiche projet)"
        value={longDescription}
        onChange={(e) => setLongDescription(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Tags séparés par des virgules (ex: Power BI, SQL)"
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

      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          Captures d&apos;écran / images du projet
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          Documents joints (PDF, PowerPoint, Excel, etc.)
        </label>
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv"
          multiple
          onChange={(e) => setAttachments(e.target.files)}
          className="text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer self-start rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter le projet"}
      </button>
    </form>
  );
}
