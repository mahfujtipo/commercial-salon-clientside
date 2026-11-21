"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { getTransactions } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cardClass } from "@/components/ui/styles";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatAmount, formatBookingDate, formatDateTime, shortenId } from "@/lib/format";
import type { Transaction } from "@/types";
import DataTable, { type Column } from "../DataTable";
import PageHeader from "../PageHeader";
import { RequireRole } from "../DashboardProvider";

// Read-only: payment records are created only by the verified Stripe webhook.
function List() {
  const [page, setPage] = useState(1);

  const { data, error, loading, reload } = useAsyncData(
    () => getTransactions({ page, limit: 10 }),
    `transactions:${page}`,
  );

  const columns: Column<Transaction>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (t) => (
        <div>
          <p className="max-w-[170px] truncate font-semibold">{t.customerName}</p>
          <p className="max-w-[170px] truncate text-xs text-[#82736C]">{t.customerEmail}</p>
        </div>
      ),
    },
    { key: "service", header: "Service", render: (t) => <span className="max-w-[170px] truncate">{t.serviceName}</span> },
    { key: "date", header: "Appointment Date", render: (t) => <span className="whitespace-nowrap">{t.appointmentDate ? formatBookingDate(t.appointmentDate) : "—"}</span> },
    { key: "amount", header: "Amount", render: (t) => <span className="font-semibold">{formatAmount(t.amount, t.currency)}</span> },
    { key: "currency", header: "Currency", render: (t) => <span className="uppercase">{t.currency}</span> },
    { key: "session", header: "Stripe Session", render: (t) => <code className="rounded bg-[#F8F2ED] px-1.5 py-0.5 text-xs" title={t.stripeSessionId}>{shortenId(t.stripeSessionId)}</code> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "created", header: "Transaction Date", render: (t) => <span className="whitespace-nowrap text-xs text-[#82736C]">{formatDateTime(t.createdAt)}</span> },
  ];

  return (
    <div>
      <PageHeader title="Transactions" description="Payments confirmed by verified Stripe webhook events (read-only)." />

      <div className={cardClass}>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(t) => t._id}
              loading={loading}
              empty={<EmptyState icon={<CreditCard size={26} />} title="No transactions yet" description="Paid appointments will appear here." />}
              mobileCard={(t) => (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#49342D]">{t.customerName}</p>
                      <p className="truncate text-xs text-[#82736C]">{t.serviceName}</p>
                    </div>
                    <p className="font-bold text-[#49342D]">{formatAmount(t.amount, t.currency)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#82736C]">
                    <StatusBadge status={t.status} />
                    <span>{formatDateTime(t.createdAt)}</span>
                  </div>
                  <code className="block text-xs text-[#82736C]">{shortenId(t.stripeSessionId)}</code>
                </div>
              )}
            />
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

export default function Transactions() {
  return (
    <RequireRole role="admin">
      <List />
    </RequireRole>
  );
}
