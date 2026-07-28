import { NextResponse } from "next/server";
import type { Certification } from "@/data/content";
import {
  getStoreConfig,
  readCertifications,
  writeCertifications,
  saveCertificationImage,
  deleteCertificationImage,
  saveCertificationAttachment,
  deleteCertificationAttachment,
} from "@/lib/certifications-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formData = await request.formData();
    const title = ((formData.get("title") as string) || "").trim();
    const issuer = ((formData.get("issuer") as string) || "").trim();
    const date = ((formData.get("date") as string) || "").trim();
    const credentialUrl = ((formData.get("credentialUrl") as string) || "").trim();
    const removeImage = formData.get("removeImage") === "true";
    const imageFile = formData.get("image");
    const removeAttachment = formData.get("removeAttachment") === "true";
    const attachmentFile = formData.get("attachment");

    if (!title || !issuer) {
      return NextResponse.json({ error: "Titre et organisme requis." }, { status: 400 });
    }

    const githubConfig = getStoreConfig();
    const certifications = await readCertifications(githubConfig);
    const index = certifications.findIndex((c) => c.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Certification introuvable." }, { status: 404 });
    }

    const current = certifications[index];
    let image = current.image;

    if (removeImage && image) {
      await deleteCertificationImage(githubConfig, image);
      image = undefined;
    }

    if (imageFile instanceof File && imageFile.size > 0) {
      if (image) await deleteCertificationImage(githubConfig, image);
      image = await saveCertificationImage(githubConfig, slug, imageFile, title);
    }

    let attachment = current.attachment;

    if (removeAttachment && attachment) {
      await deleteCertificationAttachment(githubConfig, attachment.url);
      attachment = undefined;
    }

    if (attachmentFile instanceof File && attachmentFile.size > 0) {
      if (attachment) await deleteCertificationAttachment(githubConfig, attachment.url);
      attachment = await saveCertificationAttachment(githubConfig, slug, attachmentFile, title);
    }

    const updated: Certification = {
      ...current,
      title,
      issuer,
      date,
      credentialUrl: credentialUrl || undefined,
      image,
      attachment,
    };

    const updatedList = [...certifications];
    updatedList[index] = updated;
    await writeCertifications(githubConfig, updatedList, `feat(certifications): update ${title}`);

    return NextResponse.json({ ok: true, slug, persistedTo: githubConfig ? "github" : "local" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const githubConfig = getStoreConfig();
    const certifications = await readCertifications(githubConfig);
    const target = certifications.find((c) => c.slug === slug);

    if (!target) {
      return NextResponse.json({ error: "Certification introuvable." }, { status: 404 });
    }

    if (target.image) {
      await deleteCertificationImage(githubConfig, target.image);
    }
    if (target.attachment) {
      await deleteCertificationAttachment(githubConfig, target.attachment.url);
    }

    const updated = certifications.filter((c) => c.slug !== slug);
    await writeCertifications(
      githubConfig,
      updated,
      `feat(certifications): remove ${target.title}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
