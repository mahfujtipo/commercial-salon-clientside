"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";
import { readRedirectFromUrl } from "@/lib/redirect";
import { clearTokenCache } from "@/lib/clientsidejwt";

// Runs right after Sign In (email or Google): loads the verified profile from the
// Express API, blocks blocked users and sends everyone to the right place.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort(
        new Error("Account verification timed out. Please try signing in again."),
      );
    }, 20_000);

    clearTokenCache();

    const handleAuthRedirect = async () => {
      try {
        const user = await getCurrentUser({ signal: controller.signal });
        if (!active) return;

        if (user.isBlocked) {
          toast.error(
            "Your account has been blocked. Please contact the salon.",
          );
          clearTokenCache();
          await authClient.signOut();
          router.replace("/login");
          return;
        }

        toast.success("Login successful!");

        // Admins always land on the dashboard. Customers return to the page
        // they were trying to open (for example a service details page).
        const returnTo = user.role === "admin" ? null : readRedirectFromUrl();

        router.replace(returnTo ?? "/dashboard");
      } catch (error) {
        if (!active) return;
        console.error("Authentication redirect error:", error);

        toast.error(
          getErrorMessage(
            error,
            "Authentication failed. Please sign in again.",
          ),
        );

        router.replace("/login");
      }
    };

    handleAuthRedirect();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCF8]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EDE4DC] border-t-[#A66C62]" />
        <p className="mt-5 text-sm font-medium text-[#49342D]">
          Verifying your account...
        </p>
      </div>
    </main>
  );
}
