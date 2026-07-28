import { NextResponse } from "next/server";
import type { Certification } from "@/data/content";
import {
  getStoreConfig,
  readCertifications,
  writeCertifications,
  saveCertificationImage,
  saveCertificationAttachment,
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
    const attachmentFile = formData.get("attachment");

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

    let attachment: { name: string; url: string } | undefined;
    if (attachmentFile instanceof File && attachmentFile.size > 0) {
      attachment = await saveCertificationAttachment(githubConfig, slug, attachmentFile, title);
    }

    const newCert: Certification = {
      slug,
      title,
      issuer,
      date,
      credentialUrl: credentialUrl || undefined,
      image,
      attachment,
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
