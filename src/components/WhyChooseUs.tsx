import {
  CalendarCheck,
  Users,
  Clock3,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Book your favorite salon services with a simple and convenient appointment request process.",
  },
  {
    number: "02",
    icon: Users,
    title: "Professional Services",
    description:
      "Discover a variety of salon services and find the right treatment for your personal needs.",
  },
  {
    number: "03",
    icon: Clock3,
    title: "Time Convenience",
    description:
      "Choose an appointment time that fits your schedule and make better use of your day.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Reliable Booking",
    description:
      "Keep track of your appointment requests and stay updated on their confirmation status.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#FFFCF8] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[#E8B6A7]/50 bg-[#F8F4EF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#A66C62]">
            The SalonBook Advantage
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-[#49342D] sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-[#A66C62]">SalonBook?</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#82736C] sm:text-base">
            We make finding and booking salon services easier, more convenient,
            and more organized.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-2xl border border-[#EDE4DC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#E8B6A7] hover:shadow-[0_20px_45px_rgba(73,52,45,0.13)]"
              >
                {/* Top Row */}
                <div className="mb-9 flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-[0.15em] text-[#B77970]">
                    {feature.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F0EB] text-[#A66C62] transition-all duration-300 group-hover:bg-[#A66C62] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-[#49342D]">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-[#82736C]">
                  {feature.description}
                </p>

                {/* Bottom Decoration */}
                <div className="mt-7 flex items-center justify-between">
                  <div className="h-1 w-10 rounded-full bg-[#E8B6A7] transition-all duration-300 group-hover:w-20 group-hover:bg-[#A66C62]" />

                  <ArrowUpRight
                    size={19}
                    className="text-[#C9B8AE] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#A66C62]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-14 text-center">
          <p className="text-sm text-[#82736C]">
            Your time matters. Your experience matters.
            <span className="font-semibold text-[#A66C62]">
              {" "}
              Make every appointment count.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
