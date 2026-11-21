import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#FFFCF8] px-6 pb-16 pt-32 text-center">
      <XCircle size={56} className="text-amber-500" />
      <h1 className="text-2xl font-bold text-[#49342D]">Payment cancelled</h1>
      <p className="max-w-sm text-sm leading-6 text-[#82736C]">
        You left the checkout page before paying. No money was taken, and your
        appointment is still waiting for payment.
      </p>
      <Link
        href="/dashboard/appointments"
        className="mt-2 rounded-xl bg-[#A66C62] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8F584F]"
      >
        Back to My Appointments
      </Link>
    </main>
  );
}
