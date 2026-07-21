import { about } from "@/data/content";
import FloatingCard from "@/components/FloatingCard";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="section-shell">
      <SectionHeading eyebrow="À propos" title="About Me" />
      <div className="grid gap-6 sm:grid-cols-3">
        <FloatingCard title="Parcours">{about.parcours}</FloatingCard>
        <FloatingCard title="Vision du métier">{about.vision}</FloatingCard>
        <FloatingCard title="Profil professionnel">{about.profil}</FloatingCard>
      </div>
    </section>
  );
}
