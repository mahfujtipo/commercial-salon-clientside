"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Scissors,
  Users,
} from "lucide-react";
import { getAdminStats, getRecentAppointments, getTransactions } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cardClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/LoadingState";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatAmount, formatBookingDate, formatDate, formatTimeSlot } from "@/lib/format";
import StatsCard from "../StatsCard";
import PageHeader from "../PageHeader";
import { RequireRole } from "../DashboardProvider";

function Overview() {
  const stats = useAsyncData(getAdminStats, "admin-stats");
  const recent = useAsyncData(() => getRecentAppointments(5), "admin-recent-appointments");
  const transactions = useAsyncData(() => getTransactions({ limit: 5 }), "admin-recent-transactions");

  return (
    <div>
      <PageHeader title="Admin Overview" description="Live numbers from your salon database." />

      {stats.error ? (
        <div className={cardClass}>
          <ErrorState message={stats.error} onRetry={stats.reload} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatsCard label="Total Registered Customers" value={stats.data?.totalCustomers} icon={Users} loading={stats.loading} />
          <StatsCard label="Total Active Services" value={stats.data?.activeServices} icon={Scissors} tone="emerald" loading={stats.loading} />
          <StatsCard label="Total Appointment Requests" value={stats.data?.totalAppointments} icon={ClipboardList} tone="sky" loading={stats.loading} />
          <StatsCard label="Pending Appointments" value={stats.data?.pendingAppointments} icon={CalendarClock} tone="amber" loading={stats.loading} />
          <StatsCard label="Confirmed Appointments" value={stats.data?.confirmedAppointments} icon={CalendarCheck} tone="sky" loading={stats.loading} />
          <StatsCard label="Total Successful Payments" value={stats.data?.totalSuccessfulPayments} icon={BadgeCheck} tone="emerald" loading={stats.loading} />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Recent appointments */}
        <section className={cardClass}>
          <div className="flex items-center justify-between border-b border-[#EDE4DC] px-5 py-4">
            <h3 className="font-bold text-[#49342D]">Recent appointments</h3>
            <Link href="/dashboard/appointments" className="text-xs font-semibold text-[#A66C62] hover:underline">
              View details
            </Link>
          </div>

          {recent.error ? (
            <ErrorState message={recent.error} onRetry={recent.reload} />
          ) : recent.loading ? (
            <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (recent.data ?? []).length === 0 ? (
            <EmptyState title="No appointment requests yet" />
          ) : (
            <ul className="divide-y divide-[#EDE4DC]">
              {recent.data!.map((a) => (
                <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#49342D]">{a.customerName}</p>
                    <p className="truncate text-xs text-[#82736C]">
                      {a.serviceSnapshot.serviceName} · {formatBookingDate(a.appointmentDate)} · {formatTimeSlot(a.timeSlot)}
                    </p>
                  </div>
                  <span className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    <StatusBadge status={a.paymentStatus} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent transactions */}
        <section className={cardClass}>
          <div className="flex items-center justify-between border-b border-[#EDE4DC] px-5 py-4">
            <h3 className="font-bold text-[#49342D]">Recent transactions</h3>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-[#A66C62] hover:underline">
              View all
            </Link>
          </div>

          {transactions.error ? (
            <ErrorState message={transactions.error} onRetry={transactions.reload} />
          ) : transactions.loading ? (
            <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (transactions.data?.items ?? []).length === 0 ? (
            <EmptyState title="No transactions yet" description="Payments appear here after Stripe confirms them." />
          ) : (
            <ul className="divide-y divide-[#EDE4DC]">
              {transactions.data!.items.map((t) => (
                <li key={t._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#49342D]">{t.customerName}</p>
                    <p className="truncate text-xs text-[#82736C]">
                      {t.serviceName} · {formatDate(t.createdAt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#49342D]">{formatAmount(t.amount, t.currency)}</span>
                    <StatusBadge status={t.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/services/new"><Button>Add a service</Button></Link>
        <Link href="/dashboard/appointments"><Button variant="secondary">Review appointments</Button></Link>
        <Link href="/dashboard/users"><Button variant="secondary">Manage users</Button></Link>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <RequireRole role="admin">
      <Overview />
    </RequireRole>
  );
}
