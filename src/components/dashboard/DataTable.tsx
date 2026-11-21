import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/LoadingState";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Card layout used on small screens instead of the table */
  mobileCard?: (row: T) => ReactNode;
  empty?: ReactNode;
}

// Table on desktop/tablet, stacked cards on mobile.
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  mobileCard,
  empty,
}: DataTableProps<T>) {
  if (loading && rows.length === 0) {
    return (
      <div className="space-y-3 p-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <div className={mobileCard ? "hidden overflow-x-auto md:block" : "overflow-x-auto"}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#EDE4DC] bg-[#F8F2ED]/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#82736C] ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE4DC]">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-[#FFFCF8]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3.5 align-middle text-[#49342D] ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mobileCard && (
        <div className="divide-y divide-[#EDE4DC] md:hidden">
          {rows.map((row) => (
            <div key={rowKey(row)} className="p-4">
              {mobileCard(row)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
