"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/clientsidejwt";
import { getCurrentUser } from "@/lib/actions";
import { loginUrlWithRedirect } from "@/lib/redirect";
import { useAsyncData } from "@/hooks/useAsyncData";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import type { CurrentUser, Role } from "@/types";

interface DashboardContextValue {
  user: CurrentUser;
  refreshUser: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardUser() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboardUser must be used inside <DashboardProvider>");
  }

  return context;
}

/**
 * Loads the verified profile (role, blocked status) from the Express API.
 * The role is never read from localStorage or the URL.
 */
function ProfileGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    data: user,
    error,
    errorStatus,
    loading,
    reload,
  } = useAsyncData(getCurrentUser, "dashboard-user");

  const isBlocked = user?.isBlocked === true;
  const isUnauthorized = errorStatus === 401;

  useEffect(() => {
    if (!isBlocked) return;

    toast.error("Your account has been blocked. Please contact the salon.");
    clearTokenCache();
    authClient.signOut().finally(() => router.replace("/login"));
  }, [isBlocked, router]);

  useEffect(() => {
    if (!isUnauthorized) return;

    clearTokenCache();
    authClient
      .signOut()
      .finally(() => router.replace(loginUrlWithRedirect("/dashboard")));
  }, [isUnauthorized, router]);

  if (isBlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#FFFCF8] px-6 text-center">
        <ShieldAlert size={40} className="text-red-600" />
        <h1 className="text-xl font-bold text-[#49342D]">Account blocked</h1>
        <p className="max-w-sm text-sm text-[#82736C]">
          Your account has been blocked. Please contact the salon.
        </p>
      </div>
    );
  }

  if (error && !isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFCF8]">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  if (loading || isUnauthorized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFCF8]">
        <LoadingState label="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <ProfileProvider user={user} refreshUser={reload}>
      {children}
    </ProfileProvider>
  );
}

function ProfileProvider({
  user,
  refreshUser,
  children,
}: DashboardContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ user, refreshUser }), [user, refreshUser]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export default function DashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);

  // Unauthenticated users are redirected to Sign In (also after a page refresh)
  useEffect(() => {
    if (!isPending && !isSignedIn) {
      router.replace(loginUrlWithRedirect("/dashboard"));
    }
  }, [isPending, isSignedIn, router]);

  if (isPending || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFCF8]">
        <LoadingState label="Checking your session..." />
      </div>
    );
  }

  return <ProfileGate>{children}</ProfileGate>;
}

/**
 * Client-side guard for role-specific pages. This only improves the experience:
 * the Express API still verifies the role on every protected request.
 */
export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const router = useRouter();
  const { user } = useDashboardUser();
  const allowed = user.role === role;

  useEffect(() => {
    if (!allowed) {
      toast.error("You do not have access to that page.");
      router.replace("/dashboard");
    }
  }, [allowed, router]);

  if (!allowed) {
    return <LoadingState label="Redirecting..." />;
  }

  return <>{children}</>;
}
