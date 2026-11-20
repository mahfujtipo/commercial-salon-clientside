"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleAuthRedirect = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Unable to retrieve authentication token.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to fetch user profile.");
        }

        const user = result.data;

        if (user.isBlocked) {
          toast.error("Your account has been blocked.");
          await authClient.signOut();
          router.replace("/login");
          return;
        }

        toast.success("Login successful!");

        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/customer/dashboard");
        }
      } catch (error) {
        console.error("Authentication redirect error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Authentication failed. Please sign in again.",
        );

        router.replace("/login");
      }
    };

    handleAuthRedirect();
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
