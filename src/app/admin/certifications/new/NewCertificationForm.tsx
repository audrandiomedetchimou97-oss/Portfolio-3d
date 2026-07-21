"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function NewCertificationForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("issuer", issuer);
    formData.set("date", date);
    formData.set("credentialUrl", credentialUrl);
    if (image) formData.set("image", image);

    const res = await fetch("/api/admin/certifications", {
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
        placeholder="Titre (ex: PL-300: Microsoft Power BI Data Analyst)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <input
        required
        placeholder="Organisme (ex: Microsoft)"
        value={issuer}
        onChange={(e) => setIssuer(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Date (ex: 2025)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Lien de vérification (optionnel)"
        value={credentialUrl}
        onChange={(e) => setCredentialUrl(e.target.value)}
        className={inputClass}
      />

      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          Badge / visuel (optionnel)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer self-start rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter la certification"}
      </button>
    </form>
  );
}
