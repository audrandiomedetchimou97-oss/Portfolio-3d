import { promises as fs } from "fs";
import path from "path";
import { getGithubConfig, getFileContent, putFile, deleteFile } from "@/lib/github";

export type GithubConfig = ReturnType<typeof getGithubConfig>;

export function getStoreConfig() {
  return getGithubConfig();
}

export function createJsonStore<T>(jsonRelPath: string) {
  async function read(githubConfig: GithubConfig): Promise<T[]> {
    if (githubConfig) {
      const file = await getFileContent(githubConfig, jsonRelPath);
      return file ? (JSON.parse(file.content) as T[]) : [];
    }
    const jsonPath = path.join(/* turbopackIgnore: true */ process.cwd(), jsonRelPath);
    const raw = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(raw) as T[];
  }

  async function write(githubConfig: GithubConfig, items: T[], commitMessage: string) {
    const jsonContent = JSON.stringify(items, null, 2) + "\n";
    if (githubConfig) {
      await putFile(
        githubConfig,
        jsonRelPath,
        Buffer.from(jsonContent, "utf-8").toString("base64"),
        commitMessage
      );
    } else {
      const jsonPath = path.join(/* turbopackIgnore: true */ process.cwd(), jsonRelPath);
      await fs.writeFile(jsonPath, jsonContent, "utf-8");
    }
  }

  return { read, write };
}

export async function saveImages(
  githubConfig: GithubConfig,
  folder: string,
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
    const relPath = `${folder}/${slug}/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (githubConfig) {
      await putFile(
        githubConfig,
        `public/${relPath}`,
        buffer.toString("base64"),
        `feat: add image for ${commitLabel}`
      );
    } else {
      const localPath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", relPath);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, buffer);
    }
    imagePaths.push(`/${relPath}`);
  }
  return imagePaths;
}

export type Attachment = { name: string; url: string };

export async function saveAttachments(
  githubConfig: GithubConfig,
  folder: string,
  slug: string,
  files: File[],
  commitLabel: string
): Promise<Attachment[]> {
  const attachments: Attachment[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeBase =
      file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "fichier";
    const fileName = `${Date.now()}-${safeBase}.${ext}`;
    const relPath = `${folder}/${slug}/files/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (githubConfig) {
      await putFile(
        githubConfig,
        `public/${relPath}`,
        buffer.toString("base64"),
        `feat: add attachment for ${commitLabel}`
      );
    } else {
      const localPath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", relPath);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, buffer);
    }
    attachments.push({ name: file.name, url: `/${relPath}` });
  }
  return attachments;
}

export async function deleteImage(githubConfig: GithubConfig, relImagePath: string) {
  const cleanRel = relImagePath.replace(/^\//, "");
  if (githubConfig) {
    await deleteFile(githubConfig, `public/${cleanRel}`, `feat: remove image ${cleanRel}`);
  } else {
    const localPath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", cleanRel);
    await fs.rm(localPath, { force: true });
  }
}
