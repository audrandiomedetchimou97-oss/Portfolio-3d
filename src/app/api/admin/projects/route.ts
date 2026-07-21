import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getGithubConfig, getFileContent, putFile } from "@/lib/github";
import type { Project } from "@/data/content";

const PROJECTS_JSON_PATH = "src/data/projects.json";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function readExistingProjects(
  githubConfig: ReturnType<typeof getGithubConfig>
): Promise<Project[]> {
  if (githubConfig) {
    const file = await getFileContent(githubConfig, PROJECTS_JSON_PATH);
    return file ? (JSON.parse(file.content) as Project[]) : [];
  }
  const jsonPath = path.join(process.cwd(), PROJECTS_JSON_PATH);
  const raw = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(raw) as Project[];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
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

    const githubConfig = getGithubConfig();
    const existingProjects = await readExistingProjects(githubConfig);

    let slug = slugify(title);
    if (!slug) slug = "projet";
    let suffix = 1;
    const baseSlug = slug;
    while (existingProjects.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const cleanLinks: Project["links"] = {};
    for (const [key, value] of Object.entries(links)) {
      if (typeof value === "string" && value.trim()) {
        (cleanLinks as Record<string, string>)[key] = value.trim();
      }
    }

    const imagePaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const fileName = `${i + 1}.${ext}`;
      const relPath = `projects/${slug}/${fileName}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (githubConfig) {
        await putFile(
          githubConfig,
          `public/${relPath}`,
          buffer.toString("base64"),
          `feat(projects): add image for ${title}`
        );
      } else {
        const localPath = path.join(process.cwd(), "public", relPath);
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, buffer);
      }
      imagePaths.push(`/${relPath}`);
    }

    const newProject: Project = {
      slug,
      title,
      description,
      longDescription,
      tags,
      images: imagePaths,
      links: cleanLinks,
    };

    const updatedProjects = [...existingProjects, newProject];
    const jsonContent = JSON.stringify(updatedProjects, null, 2) + "\n";

    if (githubConfig) {
      await putFile(
        githubConfig,
        PROJECTS_JSON_PATH,
        Buffer.from(jsonContent, "utf-8").toString("base64"),
        `feat(projects): add ${title}`
      );
    } else {
      const jsonPath = path.join(process.cwd(), PROJECTS_JSON_PATH);
      await fs.writeFile(jsonPath, jsonContent, "utf-8");
    }

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
