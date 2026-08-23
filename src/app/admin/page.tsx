"use client";

import { useRouter } from "next/navigation";
import Admin from "@/components/admin/Admin";

export default function AdminPage() {
  const router = useRouter();
  const navigate = (to: string) => router.push(to);

  return <Admin navigate={navigate} />;
}
