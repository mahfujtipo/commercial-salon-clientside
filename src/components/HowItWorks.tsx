import Link from "next/link";
import Image from "next/image";
import {
  Search,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a Service",
    description:
      "Browse available salon services and choose the one that matches your needs.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=85",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Request an Appointment",
    description:
      "Select your preferred service and submit an appointment request.",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=85",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Get Confirmation",
    description:
      "Wait for the salon to review and confirm your appointment request.",
    image:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=85",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Enjoy Your Visit",
    description:
      "Visit the salon at your scheduled time and enjoy your selected service.",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=85",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F8F4EF] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#E8B6A7]/50 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#A66C62]">
            Simple Process
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-[#49342D] sm:text-4xl lg:text-5xl">
            Your Appointment,
            <span className="text-[#A66C62]"> Made Easy.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#82736C] sm:text-base">
            From choosing a service to visiting the salon, booking your next
            appointment is simple and convenient.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group overflow-hidden rounded-2xl border border-[#EDE4DC] bg-[#FFFCF8] shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#E8B6A7] hover:shadow-[0_20px_45px_rgba(73,52,45,0.18)]"
              >
                <div className="relative h-48 overflow-hidden bg-[#EDE4DC]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={800}
                    height={400}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#211613]/60 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-5 text-sm font-semibold tracking-widest text-white">
                    STEP {step.number}
                  </span>

                  <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/50 bg-white text-[#A66C62] shadow-lg">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-[#49342D]">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#82736C]">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1 w-10 rounded-full bg-[#E8B6A7] transition-all duration-300 group-hover:w-20 group-hover:bg-[#A66C62]" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A66C62] transition-colors duration-300 hover:text-[#49342D]"
          >
            Explore available services
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
