import {
  createJsonStore,
  getStoreConfig,
  saveImages,
  deleteImage,
  type GithubConfig,
} from "@/lib/content-store";
import type { Project } from "@/data/content";

export { getStoreConfig };
export { slugify } from "@/lib/slug";

const store = createJsonStore<Project>("src/data/projects.json");
export const readProjects = store.read;
export const writeProjects = store.write;

export async function saveProjectImages(
  githubConfig: GithubConfig,
  slug: string,
  files: File[],
  startIndex: number,
  commitLabel: string
) {
  return saveImages(githubConfig, "projects", slug, files, startIndex, commitLabel);
}

export async function deleteProjectImage(githubConfig: GithubConfig, relImagePath: string) {
  return deleteImage(githubConfig, relImagePath);
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
