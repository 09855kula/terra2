"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Header } from "@/components/Header";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = trpc.admin.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  if (isLoading || isError || !data) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AdminNav />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
