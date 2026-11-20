import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationData } from "@/types";

export default function Pagination({
  pagination,
  onPageChange,
}: {
  pagination?: PaginationData;
  onPageChange: (page: number) => void;
}) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total } = pagination;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EDE4DC] px-4 py-4 sm:flex-row">
      <p className="text-xs text-[#82736C]">
        Page {page} of {totalPages} · {total} total
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-[#EDE4DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#49342D] transition-colors hover:bg-[#F8F2ED] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-[#EDE4DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#49342D] transition-colors hover:bg-[#F8F2ED] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
