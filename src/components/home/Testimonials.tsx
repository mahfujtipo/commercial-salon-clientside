import { Quote, Star } from "lucide-react";

// Extra static section: social proof.
const testimonials = [
  {
    name: "Nadia Rahman",
    role: "Regular client",
    text: "Booking took less than a minute and my appointment was confirmed the same day. The stylist knew exactly what I wanted.",
  },
  {
    name: "Farhana Akter",
    role: "Bridal makeup",
    text: "I loved how simple it was to pick a time slot and pay online. The whole experience felt calm and professional.",
  },
  {
    name: "Samira Chowdhury",
    role: "Skincare client",
    text: "Clear service details, fair prices and no waiting around. SalonBook makes self-care easy to plan.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FFFCF8] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#A66C62]">
            Kind Words
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#49342D] sm:text-4xl">
            What our clients say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="relative rounded-2xl border border-[#EDE4DC] bg-white p-7 shadow-[0_2px_12px_rgba(73,52,45,0.04)]">
              <Quote size={28} className="absolute right-6 top-6 text-[#EEDBD3]" />
              <div className="mb-4 flex gap-1 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-sm leading-7 text-[#68534C]">“{item.text}”</blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-bold text-[#49342D]">{item.name}</p>
                <p className="text-xs text-[#82736C]">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
