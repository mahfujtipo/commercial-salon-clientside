import type { Metadata } from "next";
import DashboardProvider from "@/components/dashboard/DashboardProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Shared dashboard layout for Admin and Customer.
// It sits outside the (site) route group, so there is no public Navbar/Footer here.
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
