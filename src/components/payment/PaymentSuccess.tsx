"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getPaymentStatus } from "@/lib/actions";
import { loginUrlWithRedirect } from "@/lib/redirect";
import Button from "@/components/ui/Button";
import { Spinner } from "@/components/ui/LoadingState";

type State = "verifying" | "paid" | "failed" | "processing" | "invalid";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The browser redirect from Stripe is NOT proof of payment. This page only asks the
// server whether the verified Stripe webhook has already marked the payment as paid.
function Verifier({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<State>("verifying");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      for (let attempt = 0; attempt < 10; attempt++) {
        try {
          const result = await getPaymentStatus(sessionId);

          if (cancelled) return;

          if (result.status === "paid" || result.status === "failed") {
            setState(result.status);
            return;
          }
        } catch {
          // keep trying; the webhook may not have arrived yet
        }

        await sleep(2000);
        if (cancelled) return;
      }

      setState("processing");
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner size={44} />
        <h1 className="text-2xl font-bold text-[#49342D]">Confirming your payment...</h1>
        <p className="max-w-sm text-sm leading-6 text-[#82736C]">
          Please wait while we receive the confirmation from Stripe. Do not close this page.
        </p>
      </div>
    );
  }

  const content = {
    paid: {
      icon: <CheckCircle2 size={56} className="text-emerald-600" />,
      title: "Payment successful",
      text: "Thank you! Your payment was verified and your appointment is now marked as paid.",
    },
    failed: {
      icon: <XCircle size={56} className="text-red-600" />,
      title: "Payment failed",
      text: "Your payment could not be completed. You were not charged. Please try again from My Appointments.",
    },
    processing: {
      icon: <Clock size={56} className="text-amber-500" />,
      title: "Payment is still processing",
      text: "We have not received the confirmation yet. Your appointment will update automatically once Stripe confirms the payment.",
    },
    invalid: {
      icon: <XCircle size={56} className="text-red-600" />,
      title: "Invalid payment link",
      text: "We could not find a payment session. Open My Appointments to check your payment status.",
    },
  }[state];

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {content.icon}
      <h1 className="text-2xl font-bold text-[#49342D]">{content.title}</h1>
      <p className="max-w-sm text-sm leading-6 text-[#82736C]">{content.text}</p>
      <Link href="/dashboard/appointments">
        <Button size="lg" className="mt-2">Go to My Appointments</Button>
      </Link>
    </div>
  );
}

export default function PaymentSuccess() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);

  // Read ?session_id=... in the browser (no Suspense boundary needed)
  const [sessionId] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.search).get("session_id") ?? ""),
  );

  useEffect(() => {
    if (!isPending && !isSignedIn) {
      router.replace(
        loginUrlWithRedirect(`/payment/success?session_id=${encodeURIComponent(sessionId)}`),
      );
    }
  }, [isPending, isSignedIn, sessionId, router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF8] px-6 pb-16 pt-32">
      {isPending || !isSignedIn ? (
        <Spinner size={40} />
      ) : (
        <Verifier sessionId={sessionId} />
      )}
    </main>
  );
}
