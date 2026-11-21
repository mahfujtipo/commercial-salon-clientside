"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  formatBookingDate,
  formatDateTime,
  formatDuration,
  formatPrice,
  formatTimeSlot,
} from "@/lib/format";
import type { Appointment } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="shrink-0 text-[#82736C]">{label}</dt>
      <dd className="text-right font-medium text-[#49342D]">{children}</dd>
    </div>
  );
}

export default function AppointmentDetailsModal({
  appointment,
  showCustomer,
  onClose,
}: {
  appointment: Appointment | null;
  /** Admin view also shows the customer's information */
  showCustomer?: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={Boolean(appointment)}
      title="Appointment details"
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {appointment && (
        <div>
          <div className="mb-4 flex items-center gap-4 rounded-xl bg-[#F8F2ED] p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={appointment.serviceSnapshot.image}
              alt={appointment.serviceSnapshot.serviceName}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-bold text-[#49342D]">
                {appointment.serviceSnapshot.serviceName}
              </p>
              <p className="text-xs text-[#82736C]">
                {appointment.serviceSnapshot.category}
              </p>
            </div>
          </div>

          <dl className="divide-y divide-[#EDE4DC]">
            {showCustomer && (
              <>
                <Row label="Customer">{appointment.customerName}</Row>
                <Row label="Email">{appointment.customerEmail}</Row>
                {appointment.customerPhone && (
                  <Row label="Phone">{appointment.customerPhone}</Row>
                )}
              </>
            )}
            <Row label="Appointment date">{formatBookingDate(appointment.appointmentDate)}</Row>
            <Row label="Time slot">{formatTimeSlot(appointment.timeSlot)}</Row>
            <Row label="Duration">{formatDuration(appointment.serviceSnapshot.duration)}</Row>
            <Row label="Service price">{formatPrice(appointment.servicePrice)}</Row>
            <Row label="Appointment status">
              <StatusBadge status={appointment.status} />
            </Row>
            <Row label="Payment status">
              <StatusBadge status={appointment.paymentStatus} />
            </Row>
            <Row label="Requested on">{formatDateTime(appointment.createdAt)}</Row>
            {appointment.confirmedAt && (
              <Row label="Confirmed on">{formatDateTime(appointment.confirmedAt)}</Row>
            )}
            {appointment.cancelledAt && (
              <Row label="Cancelled on">
                {formatDateTime(appointment.cancelledAt)}
                {appointment.cancelledBy ? ` (by ${appointment.cancelledBy})` : ""}
              </Row>
            )}
          </dl>

          <div className="mt-4">
            <p className="mb-1.5 text-sm text-[#82736C]">Customer message</p>
            <p className="rounded-xl bg-[#FFFCF8] p-3 text-sm leading-6 text-[#49342D] ring-1 ring-[#EDE4DC]">
              {appointment.message || "No message provided."}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
