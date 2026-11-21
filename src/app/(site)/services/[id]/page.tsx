import { Suspense } from "react";
import type { Metadata } from "next";
import ServiceDetails from "@/components/services/ServiceDetails";
import LoadingState from "@/components/ui/LoadingState";

export const metadata: Metadata = {
  title: "Service Details",
};

type PageParams = { params: Promise<{ id: string }> };
async function ServiceDetailsContent({ params }: PageParams) {
  const { id } = await params;

  return <ServiceDetails id={id} />;
}

export default function ServiceDetailsPage({ params }: PageParams) {
  return (
    <Suspense
      fallback={<LoadingState label="Loading service..." className="py-32" />}
    >
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
