"use client";

import Link from "next/link";
import {
  Brush,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { getCategories } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/LoadingState";

function iconFor(category: string): LucideIcon {
  const name = category.toLowerCase();

  if (name.includes("color")) return Palette;
  if (name.includes("treatment")) return Waves;
  if (name.includes("hair")) return Scissors;
  if (name.includes("facial") || name.includes("skin")) return Sparkles;
  if (name.includes("makeup")) return Brush;
  if (name.includes("mani") || name.includes("pedi") || name.includes("nail")) return Hand;
  if (name.includes("spa") || name.includes("massage")) return Flower2;

  return Sparkles;
}

// Dynamic section 2: categories that really exist in the database.
export default function ServiceCategories() {
  const { data, error, loading, reload } = useAsyncData(getCategories, "home-categories");

  return (
    <section className="bg-[#F8F2ED] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#A66C62]">
            Service Categories
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#49342D] sm:text-4xl">
            Explore by category
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#82736C]">
            Choose a category to see every treatment we offer in that area.
          </p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
        ) : (data ?? []).length === 0 ? (
          <EmptyState title="No categories yet" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data!.map((item) => {
              const Icon = iconFor(item.category);

              return (
                <Link
                  key={item.category}
                  href={`/services?category=${encodeURIComponent(item.category)}`}
                  className="group flex flex-col items-center rounded-2xl border border-[#EDE4DC] bg-white p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(73,52,45,0.10)]"
                >
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E4DE] text-[#A66C62] transition-colors group-hover:bg-[#A66C62] group-hover:text-white">
                    <Icon size={26} />
                  </span>
                  <h3 className="font-bold text-[#49342D]">{item.category}</h3>
                  <p className="mt-1 text-xs text-[#82736C]">
                    {item.count} {item.count === 1 ? "service" : "services"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
