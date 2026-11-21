"use client";

import { useState } from "react";
import { CalendarX2, Check, Eye, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cancelAppointment, confirmAppointment, getAllAppointments } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cardClass, inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatBookingDate, formatDate, formatPrice, formatTimeSlot } from "@/lib/format";
import type { Appointment } from "@/types";
import DataTable, { type Column } from "../DataTable";
import PageHeader from "../PageHeader";
import AppointmentDetailsModal from "../AppointmentDetailsModal";
import { RequireRole } from "../DashboardProvider";

type Pending = { appointment: Appointment; action: "confirm" | "cancel" } | null;

function Manage() {
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [working, setWorking] = useState(false);

  const search = useDebouncedValue(searchInput.trim());

  const { data, error, loading, reload } = useAsyncData(
    () => getAllAppointments({ status, paymentStatus, search, page, limit: 8 }),
    `admin-appointments:${status}:${paymentStatus}:${search}:${page}`,
  );

  const runAction = async () => {
    if (!pending) return;

    setWorking(true);

    try {
      const { appointment, action } = pending;
      const result =
        action === "confirm"
          ? await confirmAppointment(appointment._id)
          : await cancelAppointment(appointment._id);

      toast.success(result.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWorking(false);
      setPending(null);
      reload();
    }
  };

  const actions = (a: Appointment) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" onClick={() => setSelected(a)}>
        <Eye size={14} /> Details
      </Button>
      {a.status === "pending" && (
        <Button size="sm" onClick={() => setPending({ appointment: a, action: "confirm" })}>
          <Check size={14} /> Confirm
        </Button>
      )}
      {(a.status === "pending" || a.status === "confirmed") && a.paymentStatus === "unpaid" && (
        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setPending({ appointment: a, action: "cancel" })}>
          <X size={14} /> Cancel
        </Button>
      )}
    </div>
  );

  const columns: Column<Appointment>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (a) => (
        <div className="min-w-0">
          <p className="max-w-[170px] truncate font-semibold">{a.customerName}</p>
          <p className="max-w-[170px] truncate text-xs text-[#82736C]">{a.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      render: (a) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.serviceSnapshot.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          <p className="max-w-[150px] truncate font-medium">{a.serviceSnapshot.serviceName}</p>
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
      <PageHeader title="Manage Appointments" description="Review customer requests, confirm or cancel them." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82736C]" />
          <input
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            placeholder="Search by customer or service"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={`${inputClass} sm:w-44`}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }} className={`${inputClass} sm:w-44`}>
          <option value="">All payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
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
              empty={<EmptyState icon={<CalendarX2 size={26} />} title="No appointments found" description="Try changing the filters." />}
              mobileCard={(a) => (
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#49342D]">{a.customerName}</p>
                      <p className="truncate text-xs text-[#82736C]">{a.customerEmail}</p>
                    </div>
                    <p className="font-bold text-[#49342D]">{formatPrice(a.servicePrice)}</p>
                  </div>
                  <p className="text-sm text-[#49342D]">
                    {a.serviceSnapshot.serviceName} · {formatBookingDate(a.appointmentDate)} · {formatTimeSlot(a.timeSlot)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={a.status} />
                    <StatusBadge status={a.paymentStatus} />
                  </div>
                  {actions(a)}
                </div>
              )}
            />
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <AppointmentDetailsModal appointment={selected} showCustomer onClose={() => setSelected(null)} />

      <ConfirmModal
        open={Boolean(pending)}
        title={pending?.action === "confirm" ? "Confirm this appointment?" : "Cancel this appointment?"}
        description={
          pending?.action === "confirm"
            ? `${pending.appointment.customerName} will be able to pay for this appointment.`
            : "The appointment will be cancelled and the time slot released. This cannot be undone."
        }
        confirmLabel={pending?.action === "confirm" ? "Confirm appointment" : "Yes, cancel it"}
        tone={pending?.action === "confirm" ? "primary" : "danger"}
        loading={working}
        onConfirm={runAction}
        onClose={() => setPending(null)}
      />
    </div>
  );
}

export default function ManageAppointments() {
  return (
    <RequireRole role="admin">
      <Manage />
    </RequireRole>
  );
}
