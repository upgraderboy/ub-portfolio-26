"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import BlogsPage from "@/components/blogs/BlogsPage";
import Footer from "@/components/footer/Footer";

export default function BlogsListing() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute="/blogs" navigate={navigate} />
      <BlogsPage navigate={navigate} />
      <Footer navigate={navigate} />
    </>
  );
}
