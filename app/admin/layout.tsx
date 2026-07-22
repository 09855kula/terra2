"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = trpc.admin.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  if (isLoading || isError || !data) return <LoadingScreen />;

  return <div className="min-h-screen flex flex-col">{children}</div>;
}
