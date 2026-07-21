import Nav from "@/components/Nav";
import ThemeToggle from "@/components/ThemeToggle";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Nav />
      <ThemeToggle />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Certifications />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
