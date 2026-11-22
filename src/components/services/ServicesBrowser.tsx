"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { getCategories, getServices } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { inputClass } from "@/components/ui/styles";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import type { PriceSort } from "@/types";
import ServiceCard, { ServiceCardSkeleton } from "./ServiceCard";

export default function ServicesBrowser() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";

  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<PriceSort>("newest");
  const [pageState, setPageState] = useState({ category, page: 1 });
  const page = pageState.category === category ? pageState.page : 1;
  const setPage = (nextPage: number) => setPageState({ category, page: nextPage });

  const selectCategory = (nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory) params.set("category", nextCategory);
    else params.delete("category");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setPage(1);
  };

  const search = useDebouncedValue(searchInput.trim());

  const services = useAsyncData(
    () => getServices({ search, category, sort, page, limit: 9 }),
    `services:${search}:${category}:${sort}:${page}`,
  );

  const categories = useAsyncData(getCategories, "public-categories");

  const resetFilters = () => {
    setSearchInput("");
    selectCategory("");
    setSort("newest");
    setPage(1);
  };

  const items = services.data?.items ?? [];

  return (
    <div>
      {/* Search + sort */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#82736C]" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            placeholder="Search services by name"
            aria-label="Search services by name"
            className={`${inputClass} pl-11`}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as PriceSort); setPage(1); }}
          aria-label="Sort services by price"
          className={`${inputClass} md:w-56`}
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[{ category: "", count: 0 }, ...(categories.data ?? [])].map((item) => {
          const active = category === item.category;

          return (
            <button
              key={item.category || "all"}
              type="button"
              onClick={() => selectCategory(item.category)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                active
                  ? "bg-[#A66C62] text-white"
                  : "border border-[#EDE4DC] bg-white text-[#49342D] hover:bg-[#F8F2ED]"
              }`}
            >
              {item.category || "All services"}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="mt-8">
        {services.error ? (
          <ErrorState message={services.error} onRetry={services.reload} />
        ) : services.loading && items.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<SearchX size={26} />}
            title="No services found"
            description="Try a different search or category."
            action={<Button variant="secondary" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <>
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${services.loading ? "opacity-60 transition-opacity" : ""}`}>
              {items.map((service) => <ServiceCard key={service._id} service={service} />)}
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#EDE4DC] bg-white">
              <Pagination pagination={services.data?.pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
