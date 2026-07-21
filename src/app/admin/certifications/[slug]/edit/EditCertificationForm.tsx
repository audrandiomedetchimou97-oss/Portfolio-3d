"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Certification } from "@/data/content";

const inputClass =
  "rounded-xl border border-[var(--glass-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent-2)]";

export default function EditCertificationForm({
  certification,
}: {
  certification: Certification;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(certification.title);
  const [issuer, setIssuer] = useState(certification.issuer);
  const [date, setDate] = useState(certification.date);
  const [credentialUrl, setCredentialUrl] = useState(certification.credentialUrl || "");
  const [currentImage, setCurrentImage] = useState(certification.image);
  const [removeImage, setRemoveImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    formData.set("removeImage", String(removeImage));
    if (newImage) formData.set("image", newImage);

    const res = await fetch(`/api/admin/certifications/${certification.slug}`, {
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
    if (!confirm(`Supprimer définitivement « ${certification.title} » ?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/certifications/${certification.slug}`, {
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
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <input
        required
        placeholder="Organisme"
        value={issuer}
        onChange={(e) => setIssuer(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Lien de vérification"
        value={credentialUrl}
        onChange={(e) => setCredentialUrl(e.target.value)}
        className={inputClass}
      />

      {currentImage && !removeImage && (
        <div>
          <label className="mb-2 block text-xs text-foreground-muted">Badge actuel</label>
          <div className="group relative h-24 w-40 overflow-hidden rounded-lg">
            <Image src={currentImage} alt="" fill className="object-contain" />
            <button
              type="button"
              onClick={() => {
                setRemoveImage(true);
                setCurrentImage(undefined);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Retirer
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs text-foreground-muted">
          {currentImage ? "Remplacer le badge" : "Ajouter un badge"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
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
          {deleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </form>
  );
}
