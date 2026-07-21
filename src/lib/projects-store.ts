import { promises as fs } from "fs";
import path from "path";
import { getGithubConfig, getFileContent, putFile, deleteFile } from "@/lib/github";
import type { Project } from "@/data/content";

const PROJECTS_JSON_PATH = "src/data/projects.json";

export type GithubConfig = ReturnType<typeof getGithubConfig>;

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getStoreConfig() {
  return getGithubConfig();
}

export async function readProjects(githubConfig: GithubConfig): Promise<Project[]> {
  if (githubConfig) {
    const file = await getFileContent(githubConfig, PROJECTS_JSON_PATH);
    return file ? (JSON.parse(file.content) as Project[]) : [];
  }
  const jsonPath = path.join(process.cwd(), PROJECTS_JSON_PATH);
  const raw = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(raw) as Project[];
}

export async function writeProjects(
  githubConfig: GithubConfig,
  projects: Project[],
  commitMessage: string
) {
  const jsonContent = JSON.stringify(projects, null, 2) + "\n";
  if (githubConfig) {
    await putFile(
      githubConfig,
      PROJECTS_JSON_PATH,
      Buffer.from(jsonContent, "utf-8").toString("base64"),
      commitMessage
    );
  } else {
    const jsonPath = path.join(process.cwd(), PROJECTS_JSON_PATH);
    await fs.writeFile(jsonPath, jsonContent, "utf-8");
  }
}

export async function saveProjectImages(
  githubConfig: GithubConfig,
  slug: string,
  files: File[],
  startIndex: number,
  commitLabel: string
): Promise<string[]> {
  const imagePaths: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileName = `${startIndex + i}.${ext}`;
    const relPath = `projects/${slug}/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (githubConfig) {
      await putFile(
        githubConfig,
        `public/${relPath}`,
        buffer.toString("base64"),
        `feat(projects): add image for ${commitLabel}`
      );
    } else {
      const localPath = path.join(process.cwd(), "public", relPath);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, buffer);
    }
    imagePaths.push(`/${relPath}`);
  }
  return imagePaths;
}

export async function deleteProjectImage(githubConfig: GithubConfig, relImagePath: string) {
  // relImagePath ex: "/projects/mon-slug/1.png"
  const cleanRel = relImagePath.replace(/^\//, "");
  if (githubConfig) {
    await deleteFile(githubConfig, `public/${cleanRel}`, `feat(projects): remove image ${cleanRel}`);
  } else {
    const localPath = path.join(process.cwd(), "public", cleanRel);
    await fs.rm(localPath, { force: true });
  }
}

export function cleanLinks(links: Record<string, string>): Project["links"] {
  const result: Project["links"] = {};
  for (const [key, value] of Object.entries(links)) {
    if (typeof value === "string" && value.trim()) {
      (result as Record<string, string>)[key] = value.trim();
    }
  }
  return result;
}
