"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Home from "@/components/home/Home";
import Terminal from "@/components/terminal/Terminal";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Services from "@/components/services/Services";
import Qualification from "@/components/qualification/Qualification";
import Memories from "@/components/memories/Memories";
import Project from "@/components/portfolio/Project";
import BlogsSection from "@/components/blogs/BlogsSection";
import ResourcesSection from "@/components/resources/ResourcesSection";
import Testimonials from "@/components/testimonials/Testimonials";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";

export default function LandingPage() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute="/" navigate={navigate} />
      <main>
        <Home />
        <Terminal />
        <About />
        <Skills />
        <Services />
        <Qualification />
        <Memories navigate={navigate} />
        <Project navigate={navigate} />
        <BlogsSection navigate={navigate} />
        <ResourcesSection navigate={navigate} />
        <Testimonials />
        <Contact />
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
