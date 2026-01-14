"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores";
import { usePathname, useRouter } from "next/navigation";
import { ErrorScreen } from "./ErrorScreen";
import Loader from "../ui/Loader";

// Routes accessible without authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/",
];

// Routes accessible both with and without authentication
const MIXED_ACCESS_ROUTES = [
  "/verify-email",
  "/complete-registration",
  "/accept-invitation",
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  // Debounced redirect logic to prevent rapid navigation
  const handleRedirect = useCallback(
    (redirectPath: string) => {
      // Only redirect if we're not already on that path
      if (pathname !== redirectPath) {
        console.log(`🔄 Redirecting to: ${redirectPath}`);
        router.replace(redirectPath);
      }
    },
    [router, pathname]
  );

  // Handle authentication check
  useEffect(() => {
    const performAuthCheck = async () => {
      if (isInitialCheck) {
        try {
          console.log("🔐 Starting initial auth check...");
          await checkAuth();
          console.log("✅ Auth check completed");
        } catch (err) {
          console.error("❌ Auth check error:", err);
          setError("Authentication check failed. Please try again.");
        } finally {
          setIsInitialCheck(false);
        }
      }
    };
    performAuthCheck();
  }, [checkAuth, isInitialCheck]);

  // Handle routing logic based on auth state
  useEffect(() => {
    if (!isCheckingAuth && !isInitialCheck) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isMixedAccessRoute = MIXED_ACCESS_ROUTES.includes(pathname);

      // Clear any previous errors when state changes
      setError(null);

      if (!authUser && !isPublicRoute && !isMixedAccessRoute) {
        // Not authenticated and trying to access protected route
        handleRedirect("/login");
      } else if (authUser && isPublicRoute) {
        // Already authenticated and trying to access auth-only route
        handleRedirect("/dashboard");
      }
      // Allow mixed access routes for both authenticated and unauthenticated users
    }
  }, [authUser, isCheckingAuth, isInitialCheck, pathname, handleRedirect]);

  // Handle retry logic
  const handleRetry = useCallback(async () => {
    setError(null);
    setIsInitialCheck(true);
  }, []);

  // Show loading state during initial auth check
  if (isCheckingAuth || isInitialCheck) {
    return <Loader text="Loading..." />;
  }

  // Show error state if something went wrong
  if (error) {
    return <ErrorScreen error={error} onRetry={handleRetry} />;
  }

  // Check if current route is valid based on auth state
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isMixedAccessRoute = MIXED_ACCESS_ROUTES.includes(pathname);

  const shouldShowContent =
    (authUser && !isPublicRoute) || // Authenticated on protected/mixed route
    (!authUser && (isPublicRoute || isMixedAccessRoute)) || // Not authenticated on public/mixed route
    isMixedAccessRoute; // Always allow mixed access routes

  // If we shouldn't show content (e.g., in-between redirect state), show loading
  if (!shouldShowContent) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="min-h-screen">
      {children}
      {/* Optional: Error toast for non-critical errors */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
