"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { RequireRole } from "@/components/dashboard/DashboardProvider";
import ServiceForm from "@/components/dashboard/admin/ServiceForm";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { getAdminServiceById } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";

function EditService({ id }: { id: string }) {
  const { data, error, loading, reload } = useAsyncData(
    () => getAdminServiceById(id),
    `admin-service:${id}`,
  );

  if (loading) return <LoadingState label="Loading service..." />;
  if (error || !data) {
    return <ErrorState message={error ?? "Service not found."} onRetry={reload} />;
  }

  return <ServiceForm service={data} />;
}

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <RequireRole role="admin">
      <PageHeader title="Update Service" description="Change the service information." />
      <EditService id={id} />
    </RequireRole>
  );
}
