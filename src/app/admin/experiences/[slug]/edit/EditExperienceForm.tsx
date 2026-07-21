"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "@/data/content";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function EditExperienceForm({ experience }: { experience: Experience }) {
  const router = useRouter();
  const [company, setCompany] = useState(experience.company);
  const [role, setRole] = useState(experience.role);
  const [period, setPeriod] = useState(experience.period);
  const [bullets, setBullets] = useState(experience.bullets.join("\n"));
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("company", company);
    formData.set("role", role);
    formData.set("period", period);
    formData.set("bullets", bullets);

    const res = await fetch(`/api/admin/experiences/${experience.slug}`, {
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
    if (!confirm(`Supprimer définitivement « ${experience.company} » ?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/experiences/${experience.slug}`, {
      method: "DELETE",
    });
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
        placeholder="Entreprise / structure"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className={inputClass}
      />
      <input
        required
        placeholder="Poste occupé"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Période (optionnel)"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className={inputClass}
      />
      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          Missions / réalisations (une par ligne)
        </label>
        <textarea
          rows={6}
          value={bullets}
          onChange={(e) => setBullets(e.target.value)}
          className={inputClass}
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
          {deleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </form>
  );
}
