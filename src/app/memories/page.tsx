"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import MemoriesPage from "@/components/memories/MemoriesPage";
import Footer from "@/components/footer/Footer";

export default function MemoriesListing() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute="/memories" navigate={navigate} />
      <MemoriesPage navigate={navigate} />
      <Footer navigate={navigate} />
    </>
  );
}
