import type { Metadata } from "next";
import ServiceDetails from "@/components/services/ServiceDetails";

export const metadata: Metadata = {
  title: "Service Details",
};

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ServiceDetails id={id} />;
}
