"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicRoute) {
      router.replace("/login");
    }

    if (user && isPublicRoute) {
      router.replace("/");
    }
  }, [user, loading, isPublicRoute, pathname, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated on protected route — don't render children
  if (!user && !isPublicRoute) {
    return null;
  }

  // Authenticated on public route — don't render children (redirecting)
  if (user && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
