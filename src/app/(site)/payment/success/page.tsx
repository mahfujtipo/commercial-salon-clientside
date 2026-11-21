import type { Metadata } from "next";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
