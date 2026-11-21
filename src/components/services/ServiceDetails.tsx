"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, ShieldAlert, Tag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser, getServiceById } from "@/lib/actions";
import { loginUrlWithRedirect } from "@/lib/redirect";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatDuration, formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import BookingForm from "./BookingForm";

function Content({ id }: { id: string }) {
  const service = useAsyncData(() => getServiceById(id), `service:${id}`);
  const profile = useAsyncData(getCurrentUser, "service-details-user");

  if (service.loading || profile.loading) {
    return <LoadingState label="Loading service..." className="py-32" />;
  }

  if (service.error || !service.data) {
    return (
      <div className="py-16">
        <ErrorState message="This service could not be found or is no longer available." />
        <div className="text-center">
          <Link href="/services"><Button variant="secondary">Back to services</Button></Link>
        </div>
      </div>
    );
  }

  const item = service.data;
  const user = profile.data;

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="overflow-hidden rounded-3xl border border-[#EDE4DC] bg-[#F3EAE3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.serviceName} className="aspect-[16/10] w-full object-cover" />
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEDBD3] px-3 py-1 text-xs font-semibold text-[#6F4038]">
            <Tag size={12} /> {item.category}
          </span>

          <h1 className="mt-4 font-serif text-3xl font-medium text-[#49342D] sm:text-4xl">
            {item.serviceName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            <p className="text-3xl font-bold text-[#A66C62]">{formatPrice(item.price)}</p>
            <p className="flex items-center gap-2 text-sm font-medium text-[#82736C]">
              <Clock size={17} /> Estimated duration: {formatDuration(item.duration)}
            </p>
          </div>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-[#49342D]">About this service</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#82736C]">{item.description}</p>
        </div>
      </div>

      <aside className="lg:col-span-2">
        <div className="rounded-3xl border border-[#EDE4DC] bg-white p-6 shadow-[0_10px_40px_rgba(73,52,45,0.07)] lg:sticky lg:top-28">
          <h2 className="text-xl font-bold text-[#49342D]">Book an appointment</h2>
          <p className="mb-5 mt-1 text-sm text-[#82736C]">Pick a date and time that suits you.</p>

          {profile.error || !user ? (
            <ErrorState message={profile.error ?? "Unable to load your account."} onRetry={profile.reload} />
          ) : user.role === "admin" ? (
            <div className="flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              <ShieldAlert size={18} className="mt-0.5 shrink-0" />
              Admins cannot submit customer appointment requests.
            </div>
          ) : user.isBlocked ? (
            <div className="flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <ShieldAlert size={18} className="mt-0.5 shrink-0" />
              Your account has been blocked. Please contact the salon.
            </div>
          ) : item.status !== "active" ? (
            <div className="rounded-xl bg-stone-100 p-4 text-sm text-stone-600">
              This service is currently not available for booking.
            </div>
          ) : (
            <BookingForm service={item} />
          )}
        </div>
      </aside>
    </div>
  );
}

// Protected page: unauthenticated visitors are sent to Sign In and return here afterwards.
export default function ServiceDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);

  useEffect(() => {
    if (!isPending && !isSignedIn) {
      router.replace(loginUrlWithRedirect(`/services/${id}`));
    }
  }, [isPending, isSignedIn, id, router]);

  return (
    <div className="bg-[#FFFCF8]">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#A66C62] hover:underline">
          <ArrowLeft size={16} /> Back to services
        </Link>

        {isPending || !isSignedIn ? (
          <LoadingState label="Checking your session..." className="py-32" />
        ) : (
          <Content id={id} />
        )}
      </div>
    </div>
  );
}
