import {
  createJsonStore,
  getStoreConfig,
  saveImages,
  saveAttachments,
  deleteImage,
  type GithubConfig,
} from "@/lib/content-store";
import type { Certification } from "@/data/content";

export { getStoreConfig };
export { slugify } from "@/lib/slug";

const store = createJsonStore<Certification>("src/data/certifications.json");
export const readCertifications = store.read;
export const writeCertifications = store.write;

export async function saveCertificationImage(
  githubConfig: GithubConfig,
  slug: string,
  file: File,
  commitLabel: string
): Promise<string | undefined> {
  const [imagePath] = await saveImages(githubConfig, "certifications", slug, [file], 1, commitLabel);
  return imagePath;
}

export async function deleteCertificationImage(githubConfig: GithubConfig, relImagePath: string) {
  return deleteImage(githubConfig, relImagePath);
}

export async function saveCertificationAttachment(
  githubConfig: GithubConfig,
  slug: string,
  file: File,
  commitLabel: string
): Promise<{ name: string; url: string } | undefined> {
  const [attachment] = await saveAttachments(
    githubConfig,
    "certifications",
    slug,
    [file],
    commitLabel
  );
  return attachment;
}

export async function deleteCertificationAttachment(
  githubConfig: GithubConfig,
  relFileUrl: string
) {
  return deleteImage(githubConfig, relFileUrl);
}
