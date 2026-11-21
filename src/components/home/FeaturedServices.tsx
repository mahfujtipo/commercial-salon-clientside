"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedServices } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ServiceCard, { ServiceCardSkeleton } from "@/components/services/ServiceCard";

// Dynamic section 1: latest ACTIVE services straight from the database.
export default function FeaturedServices() {
  const { data, error, loading, reload } = useAsyncData(
    () => getFeaturedServices(6),
    "featured-services",
  );

  return (
    <section className="bg-[#FFFCF8] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#A66C62]">
              Featured Services
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[#49342D] sm:text-4xl">
              Treatments our clients love
            </h2>
          </div>

          <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#A66C62]">
            View all services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : (data ?? []).length === 0 ? (
          <EmptyState title="Services coming soon" description="Our salon services will appear here shortly." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data!.map((service) => <ServiceCard key={service._id} service={service} />)}
          </div>
        )}
      </div>
    </section>
  );
}
