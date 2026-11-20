import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We believe every customer deserves a comfortable, convenient, and personalized salon booking experience.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Reliability",
    description:
      "We make appointment management more transparent with clear booking statuses and organized information.",
  },
  {
    icon: Sparkles,
    title: "Quality Experience",
    description:
      "We help customers discover salon services that match their preferences and personal needs.",
  },
  {
    icon: Clock3,
    title: "Convenience",
    description:
      "We simplify the appointment process so customers can spend less time arranging bookings.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#FFFCF8]">
      {/* Hero Section */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden bg-[#30221E] px-5 py-24 sm:px-8 lg:min-h-[540px] lg:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-[#211613]/35" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block rounded-full border border-[#E8B6A7]/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B6A7] backdrop-blur-sm">
              Get to Know Us
            </span>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Beauty Begins With
              <span className="block text-[#E8B6A7]">a Better Experience.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-white/85 sm:text-base">
              SalonBook is designed to make discovering salon services and
              managing appointments easier, more convenient, and more organized.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#B77970] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#A66C62] hover:shadow-lg"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About SalonBook */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative pb-5 pr-3 sm:pr-6">
            <div className="relative h-[350px] overflow-hidden rounded-3xl shadow-xl sm:h-[450px]">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85"
                alt="Modern beauty salon interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-1 -right-1 rounded-2xl bg-[#A66C62] p-6 text-white shadow-xl sm:-right-2 sm:p-8">
              <Sparkles size={27} className="mb-3 text-[#F5D8CC]" />
              <p className="text-2xl font-semibold">SalonBook</p>
              <p className="mt-1 text-xs text-white/80">
                Your beauty, your schedule.
              </p>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66C62]">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#49342D] sm:text-4xl">
              A Simpler Way to
              <span className="text-[#A66C62]"> Experience Beauty.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#82736C] sm:text-base">
              SalonBook is a salon appointment booking platform that connects
              customers with salon services through one convenient digital
              experience.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#82736C] sm:text-base">
              Instead of dealing with complicated booking arrangements,
              customers can explore available services, submit appointment
              requests, and track their booking status from their account.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#82736C] sm:text-base">
              Our goal is to make salon appointment management simple for
              customers while helping administrators organize services and
              appointments efficiently.
            </p>

            <div className="mt-8 flex items-center gap-3 border-t border-[#EDE4DC] pt-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F0EB] text-[#A66C62]">
                <CalendarCheck size={21} />
              </div>
              <p className="text-sm font-semibold text-[#49342D]">
                Simple Booking. Better Experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#F8F4EF] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66C62]">
              Our Mission
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#49342D] sm:text-4xl">
              Making Every
              <span className="text-[#A66C62]"> Appointment Easier.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#82736C] sm:text-base">
              We aim to simplify the way people discover and book salon
              services. By bringing service information and appointment
              management together, SalonBook helps create a more organized
              booking experience.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#82736C] sm:text-base">
              We want customers to feel confident when choosing services and
              administrators to have a straightforward way to manage their salon
              operations.
            </p>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-lg sm:h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=85"
              alt="Beautiful modern salon interior"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66C62]">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-semibold text-[#49342D] sm:text-4xl">
              The Values Behind
              <span className="text-[#A66C62]"> SalonBook.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#82736C] sm:text-base">
              Every part of our platform is guided by a commitment to
              convenience, reliability, and a better customer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-[#EDE4DC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#E8B6A7] hover:shadow-[0_20px_45px_rgba(73,52,45,0.12)]"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-[0.15em] text-[#B77970]">
                      0{index + 1}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F0EB] text-[#A66C62] transition-all duration-300 group-hover:bg-[#A66C62] group-hover:text-white">
                      <Icon size={25} strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#49342D]">
                    {value.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#82736C]">
                    {value.description}
                  </p>

                  <div className="mt-7 h-1 w-10 rounded-full bg-[#E8B6A7] transition-all duration-300 group-hover:w-20 group-hover:bg-[#A66C62]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#30221E] px-6 py-16 text-center shadow-lg sm:px-12 sm:py-20">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#A66C62]/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#E8B6A7]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B6A7]">
              Your Next Chapter Starts Here
            </span>

            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ready for Your
              <span className="text-[#E8B6A7]"> Next Salon Visit?</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
              Discover salon services and make your next appointment through
              SalonBook.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#B77970] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#A66C62] hover:shadow-xl"
            >
              Browse Salon Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
