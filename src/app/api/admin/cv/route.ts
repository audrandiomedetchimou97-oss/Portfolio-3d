import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getGithubConfig, putFile } from "@/lib/github";
import { profile } from "@/data/content";

// Chemin fixe : le CV garde toujours le même nom, seul le contenu change.
const CV_REL_PATH = profile.cv.replace(/^\//, ""); // ex: "CV_Anon_Tchimou.pdf"

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Le fichier doit être un PDF." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const githubConfig = getGithubConfig();

    if (githubConfig) {
      await putFile(
        githubConfig,
        `public/${CV_REL_PATH}`,
        buffer.toString("base64"),
        "chore(cv): update CV PDF"
      );
    } else {
      const localPath = path.join(
        /* turbopackIgnore: true */ process.cwd(),
        "public",
        CV_REL_PATH
      );
      await fs.writeFile(localPath, buffer);
    }

    return NextResponse.json({ ok: true, persistedTo: githubConfig ? "github" : "local" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
