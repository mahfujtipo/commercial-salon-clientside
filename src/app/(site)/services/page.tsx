import { Suspense } from "react";
import type { Metadata } from "next";
import ServicesBrowser from "@/components/services/ServicesBrowser";
import LoadingState from "@/components/ui/LoadingState";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Explore SalonBook's haircuts, coloring, skincare, makeup, nails and spa services.",
};

export default function ServicesPage() {
  return (
    <div className="bg-[#FFFCF8]">
      <section className="border-b border-[#EDE4DC] bg-[#F8F2ED] px-5 pb-12 pt-28 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-[#A66C62]">
          Our Services
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-[#49342D] sm:text-5xl">
          Find your perfect treatment
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#82736C]">
          Browse our professional salon services. Search by name, filter by
          category and sort by price.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <Suspense fallback={<LoadingState label="Loading services..." />}>
          <ServicesBrowser />
        </Suspense>
      </section>
    </div>
  );
}
