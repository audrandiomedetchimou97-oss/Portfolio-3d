import { NextResponse } from "next/server";
import type { Project } from "@/data/content";
import {
  getStoreConfig,
  readProjects,
  writeProjects,
  saveProjectImages,
  saveProjectAttachments,
  deleteProjectImage,
  deleteProjectAttachment,
  cleanLinks,
} from "@/lib/projects-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formData = await request.formData();
    const title = ((formData.get("title") as string) || "").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const longDescription = ((formData.get("longDescription") as string) || "").trim();
    const tags = JSON.parse((formData.get("tags") as string) || "[]") as string[];
    const links = JSON.parse((formData.get("links") as string) || "{}") as Record<
      string,
      string
    >;
    const removeImages = JSON.parse(
      (formData.get("removeImages") as string) || "[]"
    ) as string[];
    const removeAttachments = JSON.parse(
      (formData.get("removeAttachments") as string) || "[]"
    ) as string[];
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);
    const attachmentFiles = formData
      .getAll("attachments")
      .filter((f): f is File => f instanceof File);

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis." }, { status: 400 });
    }

    const githubConfig = getStoreConfig();
    const projects = await readProjects(githubConfig);
    const index = projects.findIndex((p) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const current = projects[index];

    for (const img of removeImages) {
      await deleteProjectImage(githubConfig, img);
    }
    const keptImages = current.images.filter((img) => !removeImages.includes(img));

    for (const url of removeAttachments) {
      await deleteProjectAttachment(githubConfig, url);
    }
    const keptAttachments = current.attachments.filter(
      (a) => !removeAttachments.includes(a.url)
    );

    const startIndex = Date.now();
    const newImages = await saveProjectImages(githubConfig, slug, files, startIndex, title);
    const newAttachments = await saveProjectAttachments(
      githubConfig,
      slug,
      attachmentFiles,
      title
    );

    const updated: Project = {
      ...current,
      title,
      description,
      longDescription,
      tags,
      images: [...keptImages, ...newImages],
      attachments: [...keptAttachments, ...newAttachments],
      links: cleanLinks(links),
    };

    const updatedProjects = [...projects];
    updatedProjects[index] = updated;
    await writeProjects(githubConfig, updatedProjects, `feat(projects): update ${title}`);

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
    const projects = await readProjects(githubConfig);
    const target = projects.find((p) => p.slug === slug);

    if (!target) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    for (const img of target.images) {
      await deleteProjectImage(githubConfig, img);
    }
    for (const a of target.attachments) {
      await deleteProjectAttachment(githubConfig, a.url);
    }

    const updatedProjects = projects.filter((p) => p.slug !== slug);
    await writeProjects(githubConfig, updatedProjects, `feat(projects): remove ${target.title}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
