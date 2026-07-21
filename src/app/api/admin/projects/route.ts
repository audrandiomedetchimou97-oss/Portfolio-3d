import { NextResponse } from "next/server";
import type { Project } from "@/data/content";
import {
  getStoreConfig,
  readProjects,
  writeProjects,
  saveProjectImages,
  slugify,
  cleanLinks,
} from "@/lib/projects-store";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = ((formData.get("title") as string) || "").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const longDescription = ((formData.get("longDescription") as string) || "").trim();
    const tags = JSON.parse((formData.get("tags") as string) || "[]") as string[];
    const links = JSON.parse((formData.get("links") as string) || "{}") as Record<
      string,
      string
    >;
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis." }, { status: 400 });
    }

    const githubConfig = getStoreConfig();
    const existingProjects = await readProjects(githubConfig);

    let slug = slugify(title) || "projet";
    let suffix = 1;
    const baseSlug = slug;
    while (existingProjects.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const imagePaths = await saveProjectImages(githubConfig, slug, files, 1, title);

    const newProject: Project = {
      slug,
      title,
      description,
      longDescription,
      tags,
      images: imagePaths,
      links: cleanLinks(links),
    };

    const updatedProjects = [...existingProjects, newProject];
    await writeProjects(githubConfig, updatedProjects, `feat(projects): add ${title}`);

    return NextResponse.json({
      ok: true,
      slug,
      persistedTo: githubConfig ? "github" : "local",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
