"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useCurrentUser();

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [hasHydrated, isAuthenticated, router]);

  return <div className="h-screen bg-background" />;
}
