"use client";

import { useDashboardUser } from "@/components/dashboard/DashboardProvider";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";
import CustomerOverview from "@/components/dashboard/customer/CustomerOverview";

// One dashboard route, role decides the content.
export default function DashboardPage() {
  const { user } = useDashboardUser();

  return user.role === "admin" ? <AdminOverview /> : <CustomerOverview />;
}
