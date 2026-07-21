import { NextResponse } from "next/server";
import type { Experience } from "@/data/content";
import { getStoreConfig, readExperiences, writeExperiences } from "@/lib/experiences-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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
    const experiences = await readExperiences(githubConfig);
    const index = experiences.findIndex((e) => e.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Expérience introuvable." }, { status: 404 });
    }

    const updated: Experience = { slug, company, role, period, bullets };
    const updatedList = [...experiences];
    updatedList[index] = updated;
    await writeExperiences(githubConfig, updatedList, `feat(experiences): update ${company}`);

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
    const experiences = await readExperiences(githubConfig);
    const target = experiences.find((e) => e.slug === slug);

    if (!target) {
      return NextResponse.json({ error: "Expérience introuvable." }, { status: 404 });
    }

    const updated = experiences.filter((e) => e.slug !== slug);
    await writeExperiences(githubConfig, updated, `feat(experiences): remove ${target.company}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue." },
      { status: 500 }
    );
  }
}
