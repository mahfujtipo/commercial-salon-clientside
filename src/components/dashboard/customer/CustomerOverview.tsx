"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  ClipboardList,
  Wallet,
} from "lucide-react";
import { getCustomerStats, getMyAppointments } from "@/lib/actions";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cardClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/LoadingState";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatBookingDate, formatDateTime, formatPrice, formatTimeSlot, todayString } from "@/lib/format";
import StatsCard from "../StatsCard";
import PageHeader from "../PageHeader";
import { useDashboardUser } from "../DashboardProvider";

export default function CustomerOverview() {
  const { user } = useDashboardUser();
  const stats = useAsyncData(getCustomerStats, "customer-stats");
  const appointments = useAsyncData(
    () => getMyAppointments({ limit: 100 }),
    "customer-overview-appointments",
  );

  const items = appointments.data?.items ?? [];
  const today = todayString();

  const upcoming = items
    .filter((a) => a.status !== "cancelled" && a.appointmentDate >= today)
    .sort((a, b) =>
      `${a.appointmentDate}${a.timeSlot}`.localeCompare(`${b.appointmentDate}${b.timeSlot}`),
    )
    .slice(0, 4);

  const recent = items.slice(0, 5);
  const awaitingPayment = items.filter((a) => a.status === "confirmed" && a.paymentStatus === "unpaid");
  const paid = items.filter((a) => a.paymentStatus === "paid");

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here is a summary of your appointment requests."
        action={
          <Link href="/services">
            <Button>Browse services</Button>
          </Link>
        }
      />

      {stats.error ? (
        <div className={cardClass}>
          <ErrorState message={stats.error} onRetry={stats.reload} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Total Appointment Requests" value={stats.data?.totalAppointments} icon={ClipboardList} loading={stats.loading} />
          <StatsCard label="Pending Appointments" value={stats.data?.pendingAppointments} icon={CalendarClock} tone="amber" loading={stats.loading} />
          <StatsCard label="Confirmed Appointments" value={stats.data?.confirmedAppointments} icon={CalendarCheck} tone="sky" loading={stats.loading} />
          <StatsCard label="Cancelled Appointments" value={stats.data?.cancelledAppointments} icon={CalendarX} tone="red" loading={stats.loading} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Upcoming */}
        <section className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between border-b border-[#EDE4DC] px-5 py-4">
            <h3 className="font-bold text-[#49342D]">Upcoming appointments</h3>
            <Link href="/dashboard/appointments" className="text-xs font-semibold text-[#A66C62] hover:underline">
              View all
            </Link>
          </div>

          {appointments.error ? (
            <ErrorState message={appointments.error} onRetry={appointments.reload} />
          ) : appointments.loading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming appointments"
              description="Explore our services and request your next appointment."
              action={<Link href="/services"><Button>Explore services</Button></Link>}
            />
          ) : (
            <ul className="divide-y divide-[#EDE4DC]">
              {upcoming.map((a) => (
                <li key={a._id} className="flex items-center gap-4 px-5 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.serviceSnapshot.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#49342D]">{a.serviceSnapshot.serviceName}</p>
                    <p className="text-xs text-[#82736C]">
                      {formatBookingDate(a.appointmentDate)} · {formatTimeSlot(a.timeSlot)} · {formatPrice(a.servicePrice)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Payments */}
        <section className={cardClass}>
          <div className="border-b border-[#EDE4DC] px-5 py-4">
            <h3 className="font-bold text-[#49342D]">Payment overview</h3>
          </div>

          {appointments.loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4">
                <Wallet size={22} className="text-orange-600" />
                <div>
                  <p className="text-xl font-bold text-[#49342D]">{awaitingPayment.length}</p>
                  <p className="text-xs text-[#82736C]">Confirmed, waiting for payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                <CheckCircle2 size={22} className="text-emerald-600" />
                <div>
                  <p className="text-xl font-bold text-[#49342D]">{paid.length}</p>
                  <p className="text-xs text-[#82736C]">Paid appointments</p>
                </div>
              </div>
              {awaitingPayment.length > 0 && (
                <Link href="/dashboard/appointments" className="block">
                  <Button className="w-full">Pay now</Button>
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Recent activity */}
      <section className={`${cardClass} mt-6`}>
        <div className="border-b border-[#EDE4DC] px-5 py-4">
          <h3 className="font-bold text-[#49342D]">Recent appointment activity</h3>
        </div>

        {appointments.loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState title="No activity yet" description="Your appointment requests will appear here." />
        ) : (
          <ul className="divide-y divide-[#EDE4DC]">
            {recent.map((a) => (
              <li key={a._id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm">
                <span className="font-medium text-[#49342D]">
                  {a.serviceSnapshot.serviceName}
                  <span className="ml-2 text-xs font-normal text-[#82736C]">requested {formatDateTime(a.createdAt)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.paymentStatus} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
