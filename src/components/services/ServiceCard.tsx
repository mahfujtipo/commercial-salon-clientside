import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EDE4DC] bg-white shadow-[0_2px_12px_rgba(73,52,45,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(73,52,45,0.10)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EAE3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.serviceName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#6F4038] shadow-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-[#49342D]">
          {service.serviceName}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[#82736C]">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-[#A66C62]">{formatPrice(service.price)}</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#82736C]">
            <Clock size={14} /> {formatDuration(service.duration)}
          </p>
        </div>

        <Link
          href={`/services/${service._id}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#A66C62] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8F584F]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EDE4DC] bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#F3EAE3]" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#F3EAE3]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#F3EAE3]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#F3EAE3]" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-[#F3EAE3]" />
      </div>
    </div>
  );
}
