"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import ProjectsPage from "@/components/portfolio/ProjectsPage";
import Footer from "@/components/footer/Footer";

export default function ProjectsListing() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute="/projects" navigate={navigate} />
      <ProjectsPage navigate={navigate} />
      <Footer navigate={navigate} />
    </>
  );
}
