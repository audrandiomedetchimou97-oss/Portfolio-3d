import { NextResponse } from "next/server";
import type { Certification } from "@/data/content";
import {
  getStoreConfig,
  readCertifications,
  writeCertifications,
  saveCertificationImage,
  slugify,
} from "@/lib/certifications-store";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = ((formData.get("title") as string) || "").trim();
    const issuer = ((formData.get("issuer") as string) || "").trim();
    const date = ((formData.get("date") as string) || "").trim();
    const credentialUrl = ((formData.get("credentialUrl") as string) || "").trim();
    const imageFile = formData.get("image");

    if (!title || !issuer) {
      return NextResponse.json({ error: "Titre et organisme requis." }, { status: 400 });
    }

    const githubConfig = getStoreConfig();
    const existing = await readCertifications(githubConfig);

    let slug = slugify(title) || "certification";
    let suffix = 1;
    const baseSlug = slug;
    while (existing.some((c) => c.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    let image: string | undefined;
    if (imageFile instanceof File && imageFile.size > 0) {
      image = await saveCertificationImage(githubConfig, slug, imageFile, title);
    }

    const newCert: Certification = {
      slug,
      title,
      issuer,
      date,
      credentialUrl: credentialUrl || undefined,
      image,
    };

    const updated = [...existing, newCert];
    await writeCertifications(githubConfig, updated, `feat(certifications): add ${title}`);

    return NextResponse.json({ ok: true, slug, persistedTo: githubConfig ? "github" : "local" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
