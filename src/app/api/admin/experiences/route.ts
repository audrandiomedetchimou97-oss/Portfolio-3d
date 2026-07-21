import { NextResponse } from "next/server";
import type { Experience } from "@/data/content";
import {
  getStoreConfig,
  readExperiences,
  writeExperiences,
  slugify,
} from "@/lib/experiences-store";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const company = ((formData.get("company") as string) || "").trim();
    const role = ((formData.get("role") as string) || "").trim();
    const period = ((formData.get("period") as string) || "").trim();
    const bullets = ((formData.get("bullets") as string) || "")
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    if (!company || !role) {
      return NextResponse.json(
        { error: "Entreprise et poste requis." },
        { status: 400 }
      );
    }

    const githubConfig = getStoreConfig();
    const existing = await readExperiences(githubConfig);

    let slug = slugify(company) || "experience";
    let suffix = 1;
    const baseSlug = slug;
    while (existing.some((e) => e.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const newExperience: Experience = { slug, company, role, period, bullets };
    const updated = [...existing, newExperience];
    await writeExperiences(githubConfig, updated, `feat(experiences): add ${company}`);

    return NextResponse.json({ ok: true, slug, persistedTo: githubConfig ? "github" : "local" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
