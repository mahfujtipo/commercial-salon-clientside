"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { RequireRole } from "@/components/dashboard/DashboardProvider";
import ServiceForm from "@/components/dashboard/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <RequireRole role="admin">
      <PageHeader title="Add Service" description="Create a new salon service." />
      <ServiceForm />
    </RequireRole>
  );
}
