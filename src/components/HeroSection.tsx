import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[700px] overflow-hidden bg-[#F8F3ED] sm:min-h-[760px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=2200&q=90')",
        }}
      />

      {/* Light Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFFDF9]/85 to-[#FFFDF9]/15" />

      <div className="mx-auto flex min-h-[700px] max-w-7xl items-center px-5 py-24 sm:min-h-[760px] sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#B77970]" />
            <span className="text-[11px] font-semibold uppercase tracking-[3px] text-[#A66C62] sm:text-xs">
              A Beautiful You Begins Here
            </span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading font-serif text-5xl font-medium leading-[1.13] tracking-tight text-[#49342D] sm:text-6xl lg:text-[76px]">
            Your Beauty.
            <br />
            Your Moment.
            <br />
            <span className="italic text-[#B77970]">Your Way.</span>
          </h1>

          {/* Description */}
          <p className="hero-description mt-8 max-w-xl text-base leading-8 text-[#76665E] sm:text-lg">
            Discover exceptional salons, explore professional beauty treatments,
            and reserve a moment just for yourself. Experience effortless
            booking and beauty care made around you.
          </p>

          {/* Buttons */}
          <div className="hero-buttons mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-4 rounded-full bg-[#A66C62] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#A66C62]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#8F584F] hover:shadow-xl"
            >
              Explore Services
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-[#B77970]/40 bg-white/70 px-8 py-4 text-sm font-semibold text-[#49342D] backdrop-blur-sm transition-all duration-300 hover:border-[#B77970] hover:bg-white"
            >
              Join SalonBook
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-16 grid max-w-xl grid-cols-2 gap-6 border-t border-[#49342D]/15 pt-7">
            <div>
              <p className="font-serif text-xl text-[#49342D] sm:text-2xl">
                Effortless
              </p>
              <p className="mt-2 text-xs tracking-wide text-[#88776E] sm:text-sm">
                Simple appointment booking
              </p>
            </div>

            <div>
              <p className="font-serif text-xl text-[#49342D] sm:text-2xl">
                Exceptional
              </p>
              <p className="mt-2 text-xs tracking-wide text-[#88776E] sm:text-sm">
                Professional beauty services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Transition */}
      <div className="absolute bottom-0 left-0 h-8 w-full rounded-t-[50%] bg-[#FFFCF8]" />
    </section>
  );
}
