"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAppointment, getAvailability } from "@/lib/actions";
import { ApiError, getErrorMessage } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatPrice, formatTimeSlot, todayString } from "@/lib/format";
import { inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import type { Service } from "@/types";

function isPastSlot(date: string, slot: string) {
  if (date !== todayString()) return false;

  const [hours, minutes] = slot.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);

  return slotTime.getTime() <= Date.now();
}

export default function BookingForm({ service }: { service: Service }) {
  const router = useRouter();
  const today = todayString();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const availability = useAsyncData(
    async () => (date ? getAvailability(date) : null),
    `availability:${date}`,
  );

  const booked = availability.data?.bookedSlots ?? [];
  const allSlots = availability.data
    ? [...availability.data.availableSlots, ...availability.data.bookedSlots].sort()
    : [];

  const validate = () => {
    const next: Record<string, string> = {};

    if (!date) next.appointmentDate = "Please choose an appointment date.";
    else if (date < today) next.appointmentDate = "You cannot book a date in the past.";

    if (!slot) next.timeSlot = "Please choose a time slot.";
    if (message.length > 500) next.message = "Message must be 500 characters or less.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const result = await createAppointment({
        serviceId: service._id,
        appointmentDate: date,
        timeSlot: slot,
        message: message.trim(),
      });

      toast.success(result.message || "Appointment request submitted successfully.");
      router.push("/dashboard/appointments");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to submit your request."));

      if (error instanceof ApiError) {
        if (error.errors) setErrors(error.errors);

        // Slot taken by someone else: refresh availability and clear the choice
        if (error.status === 409) {
          setSlot("");
          availability.reload();
        }
      }

      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="Appointment date" htmlFor="appointmentDate" error={errors.appointmentDate} required>
        <input
          id="appointmentDate"
          type="date"
          min={today}
          value={date}
          onChange={(e) => { setDate(e.target.value); setSlot(""); }}
          className={inputClass}
        />
      </FormField>

      <FormField label="Available time slot" error={errors.timeSlot} required>
        {!date ? (
          <p className="rounded-xl bg-[#F8F2ED] px-4 py-3 text-sm text-[#82736C]">
            Choose a date to see available time slots.
          </p>
        ) : availability.loading ? (
          <div className="flex items-center gap-2 rounded-xl bg-[#F8F2ED] px-4 py-3 text-sm text-[#82736C]">
            <Loader2 size={16} className="animate-spin" /> Checking availability...
          </div>
        ) : availability.error ? (
          <p className="text-sm text-red-600">{availability.error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {allSlots.map((item) => {
              const unavailable = booked.includes(item) || isPastSlot(date, item);
              const selected = slot === item;

              return (
                <button
                  key={item}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSlot(item)}
                  aria-pressed={selected}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                    selected
                      ? "border-[#A66C62] bg-[#A66C62] text-white"
                      : unavailable
                        ? "cursor-not-allowed border-[#EDE4DC] bg-[#F8F2ED] text-[#B5A59D] line-through"
                        : "border-[#EDE4DC] bg-white text-[#49342D] hover:border-[#A66C62]"
                  }`}
                >
                  {formatTimeSlot(item)}
                </button>
              );
            })}
          </div>
        )}
      </FormField>

      <FormField label="Additional message (optional)" htmlFor="message" error={errors.message} hint={`${message.length}/500`}>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything the salon should know?"
          className={inputClass}
        />
      </FormField>

      <div className="rounded-xl bg-[#F8F2ED] p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#82736C]">Service price</span>
          <span className="font-bold text-[#49342D]">{formatPrice(service.price)}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#82736C]">
          Your request is sent as pending. You can pay once the salon confirms it.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <CalendarDays size={17} />
        {submitting ? "Submitting request..." : "Request Appointment"}
      </Button>
    </form>
  );
}
