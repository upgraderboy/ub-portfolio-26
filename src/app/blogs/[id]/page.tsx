"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import BlogPostPage from "@/components/blogs/BlogPostPage";
import Footer from "@/components/footer/Footer";

export default function BlogPostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return (
    <>
      <Header currentRoute={`/blogs/${params.id}`} navigate={navigate} />
      <BlogPostPage blogId={params.id} navigate={navigate} />
      <Footer navigate={navigate} />
    </>
  );
}
