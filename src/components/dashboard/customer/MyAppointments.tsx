"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarX2, CreditCard, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { cancelAppointment, createCheckoutSession, getMyAppointments } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cardClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatBookingDate, formatDate, formatPrice, formatTimeSlot } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/types";
import DataTable, { type Column } from "../DataTable";
import PageHeader from "../PageHeader";
import AppointmentDetailsModal from "../AppointmentDetailsModal";

const filters: { label: string; value: "" | AppointmentStatus }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyAppointments() {
  const [status, setStatus] = useState<"" | AppointmentStatus>("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data, error, loading, reload } = useAsyncData(
    () => getMyAppointments({ status, page, limit: 8 }),
    `my-appointments:${status}:${page}`,
  );

  const handleCancel = async () => {
    if (!toCancel) return;

    setCancelling(true);

    try {
      const result = await cancelAppointment(toCancel._id);
      toast.success(result.message || "Appointment cancelled successfully.");
      setToCancel(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to cancel the appointment."));
      setToCancel(null);
      reload();
    } finally {
      setCancelling(false);
    }
  };

  const handlePay = async (appointment: Appointment) => {
    setPayingId(appointment._id);

    try {
      const { url } = await createCheckoutSession(appointment._id);
      // Hand over to Stripe Checkout (payment is confirmed later by a verified webhook)
      window.location.assign(url);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to start the payment."));
      setPayingId(null);
    }
  };

  const actions = (a: Appointment) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" onClick={() => setSelected(a)}>
        <Eye size={14} /> Details
      </Button>

      {a.status === "pending" && (
        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setToCancel(a)}>
          <X size={14} /> Cancel
        </Button>
      )}

      {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
        <Button size="sm" loading={payingId === a._id} disabled={payingId !== null} onClick={() => handlePay(a)}>
          <CreditCard size={14} /> Pay Now
        </Button>
      )}
    </div>
  );

  const columns: Column<Appointment>[] = [
    {
      key: "service",
      header: "Service",
      render: (a) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.serviceSnapshot.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0">
            <p className="max-w-[200px] truncate font-semibold">{a.serviceSnapshot.serviceName}</p>
            <p className="text-xs text-[#82736C]">{a.serviceSnapshot.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "when",
      header: "Date & Time",
      render: (a) => (
        <div>
          <p className="font-medium">{formatBookingDate(a.appointmentDate)}</p>
          <p className="text-xs text-[#82736C]">{formatTimeSlot(a.timeSlot)}</p>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (a) => <span className="font-semibold">{formatPrice(a.servicePrice)}</span> },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "payment", header: "Payment", render: (a) => <StatusBadge status={a.paymentStatus} /> },
    { key: "requested", header: "Requested", render: (a) => <span className="whitespace-nowrap text-xs text-[#82736C]">{formatDate(a.createdAt)}</span> },
    { key: "actions", header: "Actions", render: actions },
  ];

  return (
    <div>
      <PageHeader
        title="My Appointments"
        description="Track your appointment requests, cancel pending ones and pay for confirmed ones."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              status === filter.value
                ? "bg-[#A66C62] text-white"
                : "border border-[#EDE4DC] bg-white text-[#49342D] hover:bg-[#F8F2ED]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={cardClass}>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(a) => a._id}
              loading={loading}
              empty={
                <EmptyState
                  icon={<CalendarX2 size={26} />}
                  title="No appointments found"
                  description={status ? `You have no ${status} appointments.` : "You have not requested any appointment yet."}
                  action={<Link href="/services"><Button>Browse services</Button></Link>}
                />
              }
              mobileCard={(a) => (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.serviceSnapshot.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#49342D]">{a.serviceSnapshot.serviceName}</p>
                      <p className="text-xs text-[#82736C]">{a.serviceSnapshot.category}</p>
                    </div>
                    <p className="font-bold text-[#49342D]">{formatPrice(a.servicePrice)}</p>
                  </div>
                  <p className="text-sm text-[#49342D]">
                    {formatBookingDate(a.appointmentDate)} · {formatTimeSlot(a.timeSlot)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={a.status} />
                    <StatusBadge status={a.paymentStatus} />
                    <span className="text-xs text-[#82736C]">Requested {formatDate(a.createdAt)}</span>
                  </div>
                  {actions(a)}
                </div>
              )}
            />
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} />

      <ConfirmModal
        open={Boolean(toCancel)}
        title="Cancel this appointment request?"
        description="This pending request will be cancelled and the time slot will be released. This cannot be undone."
        confirmLabel="Yes, cancel request"
        tone="danger"
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setToCancel(null)}
      />
    </div>
  );
}
