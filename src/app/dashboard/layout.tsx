import { Suspense } from "react";
import type { Metadata } from "next";
import DashboardProvider from "@/components/dashboard/DashboardProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import LoadingState from "@/components/ui/LoadingState";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Opt out of instant navigation validation for this dashboard segment.
export const instant = false;

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <LoadingState label="Loading dashboard..." className="min-h-screen" />
      }
    >
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </Suspense>
  );
}
