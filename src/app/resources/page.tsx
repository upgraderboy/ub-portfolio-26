"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import ResourcesPage from "@/components/resources/ResourcesPage";
import Footer from "@/components/footer/Footer";

export default function ResourcesListing() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute="/resources" navigate={navigate} />
      <ResourcesPage navigate={navigate} />
      <Footer navigate={navigate} />
    </>
  );
}
