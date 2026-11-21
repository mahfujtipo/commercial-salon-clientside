import Link from "next/link";
import { Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFFCF8] px-6 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A66C62] text-white">
        <Scissors size={26} strokeWidth={1.8} />
      </span>

      <p className="text-sm font-semibold uppercase tracking-[3px] text-[#A66C62]">
        Error 404
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-[#49342D] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-[#82736C]">
        The page you are looking for does not exist or may have been moved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-[#A66C62] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8F584F]"
        >
          Back to home
        </Link>
        <Link
          href="/services"
          className="rounded-xl border border-[#EDE4DC] bg-white px-6 py-3 text-sm font-semibold text-[#49342D] transition-colors hover:bg-[#F8F2ED]"
        >
          Browse services
        </Link>
      </div>
    </main>
  );
}
