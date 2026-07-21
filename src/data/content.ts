// Toutes les infos "modifiables" du portfolio centralisées ici.
// Remplace les valeurs `""` par tes vrais liens quand tu les as.

export const profile = {
  name: "Anon Tchimou",
  role: "Business & Data Analyst",
  photo: "/photo.jpg",
  cv: "/CV_Anon_Tchimou.pdf",
  tagline:
    "Je transforme des données brutes en décisions claires : reporting BI, dashboards décisionnels et automatisation.",
};

export const socials = {
  github: "https://github.com/audrandiomedetchimou97-oss",
  linkedin: "https://www.linkedin.com/in/anon-audran-d-tchimou-b2ba32235/",
  email: "audrandiomede.tchimou97@gmail.com",
  calendly: "https://calendly.com/audrandiomede-tchimou97/30min",
};

export const about = {
  parcours:
    "Formé à l'analyse de données et au pilotage de la performance, j'ai développé mon expertise en environnement exigeant chez SNCF Voyageurs et à la Maison d'Accueil L'Îlot, où j'ai conçu des reportings BI et des dashboards décisionnels utilisés au quotidien.",
  vision:
    "Pour moi, la donnée n'a de valeur que si elle aide à décider plus vite et mieux. Chaque dashboard doit répondre à une question métier précise, pas seulement afficher des chiffres.",
  profil:
    "Rigoureux, orienté résultat et à l'aise autant avec les outils techniques (SQL, Python, Power BI) que dans le dialogue avec les équipes métier, en méthodologie Agile Scrum.",
};

// Les expériences vivent dans experiences.json (lu/écrit aussi par l'admin).
import experiencesData from "./experiences.json";

export type Experience = {
  slug: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export const experiences: Experience[] = experiencesData as Experience[];

export const skills: string[] = [
  "Power BI",
  "SQL",
  "Python",
  "Tableau",
  "Excel",
  "AWS S3",
  "VBA",
  "Power Query",
  "Power Pivot",
  "Jira",
  "Trello",
  "Product Owner",
  "Agile Scrum",
  "Business Analysis",
];

// Les projets vivent dans projects.json (lu/écrit aussi par l'admin /admin/projects/new).
import projectsData from "./projects.json";

export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  // Galerie de captures d'écran, chemins dans /public (ex: "/projects/mon-projet/1.png").
  images: string[];
  links: {
    github?: string;
    linkedin?: string;
    demo?: string;
    documentation?: string;
  };
};

export const projects: Project[] = projectsData as Project[];

// Les certifications vivent dans certifications.json (lu/écrit aussi par l'admin).
import certificationsData from "./certifications.json";

export type Certification = {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  // Chemin vers le visuel du badge/certificat dans /public (ex: "/certifications/mon-cert/1.png").
  image?: string;
};

export const certifications: Certification[] = certificationsData as Certification[];

export const futureProjects: string[] = [
  "Mes projets Github",
  "Mes applications Streamlit",
  "Mes dashboards Power BI",
  "Mes projets IA",
  "Mes projets Machine Learning",
  "Mes projets Business Intelligence",
  "Mes études de cas Data",
];

const baseNavItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "experience", label: "Expériences" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Certifications n'apparaît dans la nav que si au moins une certification existe.
export const navItems =
  certifications.length > 0
    ? [
        ...baseNavItems.slice(0, 4),
        { id: "certifications", label: "Certifications" },
        ...baseNavItems.slice(4),
      ]
    : baseNavItems;
