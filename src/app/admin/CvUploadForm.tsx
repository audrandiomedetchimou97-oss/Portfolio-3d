"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CvUploadForm({ currentCv }: { currentCv: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.set("cv", file);

    const res = await fetch("/api/admin/cv", { method: "POST", body: formData });
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setFile(null);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur lors de l'envoi.");
    }
  };

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-lg font-semibold">CV</h2>
      <form onSubmit={handleSubmit} className="glass flex flex-wrap items-center gap-4 rounded-xl p-4">
        <a
          href={currentCv}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--accent-2)] hover:underline"
        >
          Voir le CV actuel →
        </a>
        <span className="text-foreground-muted">·</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="cursor-pointer rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Remplacer le CV"}
        </button>
        {success && <span className="text-sm text-green-400">CV mis à jour ✓</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </form>
      <p className="mt-2 text-xs text-foreground-muted">
        Le nouveau fichier remplace l&apos;ancien au même endroit — les boutons "Télécharger mon
        CV" sur le site restent branchés automatiquement.
      </p>
    </section>
  );
}
