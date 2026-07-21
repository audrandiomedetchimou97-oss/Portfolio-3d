"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function NewExperienceForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [bullets, setBullets] = useState("");
  const [loading, setLoading] = useState(false);
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

    const res = await fetch("/api/admin/experiences", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur lors de l'ajout.");
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
        placeholder="Période (ex: 2023 — 2025, optionnel)"
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
          placeholder={"Reporting BI pour le pilotage de la performance\nGestion des indicateurs clés (KPI)"}
          value={bullets}
          onChange={(e) => setBullets(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer self-start rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter l'expérience"}
      </button>
    </form>
  );
}
