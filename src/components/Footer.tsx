"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Current year without calling setState inside an effect
  const currentYear = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026,
  );

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Sign In", href: "/login" },
    { label: "Create Account", href: "/register" },
  ];

  const services = [
    { label: "Hair Styling", category: "Haircut & Styling" },
    { label: "Hair Coloring", category: "Hair Coloring" },
    { label: "Facial Treatments", category: "Facial & Skincare" },
    { label: "Manicure & Pedicure", category: "Manicure & Pedicure" },
    { label: "Makeup Services", category: "Makeup" },
  ];

  const socials = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      path: "M13.5 22v-8.8h3l.45-3.45H13.5V7.55c0-1 .28-1.68 1.72-1.68h1.83V2.78A24 24 0 0 0 14.38 2c-2.65 0-4.47 1.62-4.47 4.6v2.56h-3v3.45h3V22h3.59Z",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/",
      path: "M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8 19H5V9h3v10ZM6.5 7.7a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.1c0-3.1-4-2.9-4 0V19H9V9h3v1.4c1.4-2.6 7-2.8 7 2.5V19Z",
    },
  ];

  return (
    <footer className="border-t border-[#E8B6A7]/10 bg-[#30221E] text-[#E8DED8]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 text-2xl font-bold tracking-tight text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8B6A7]/20 bg-[#E8B6A7]/10 text-[#E8B6A7]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 21 6 14" />
                  <path d="M6 10V3" />
                  <path d="M12 21v-9" />
                  <path d="M12 8V3" />
                  <path d="M18 21v-5" />
                  <path d="M18 12V3" />
                  <path d="M3 14h6" />
                  <path d="M9 8h6" />
                  <path d="M15 16h6" />
                </svg>
              </div>

              <span>
                Salon<span className="text-[#E8B6A7]">Book.</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-[#B7A69D]">
              Discover exceptional salon experiences, explore professional
              beauty services, and book your perfect appointment with ease.
            </p>

            <p className="max-w-sm text-sm leading-7 text-[#B7A69D]">
              <strong className="font-semibold text-white">Our Mission:</strong>{" "}
              To make beauty and self-care more accessible by connecting
              customers with professional salon services and convenient
              appointment booking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="flex flex-col gap-3 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#B7A69D] transition-colors hover:text-[#E8B6A7]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </h3>

            <ul className="flex flex-col gap-3 text-sm">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={`/services?category=${encodeURIComponent(service.category)}`}
                    className="text-[#B7A69D] transition-colors hover:text-[#E8B6A7]"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Stay Beautiful
            </h3>

            <p className="text-sm leading-6 text-[#B7A69D]">
              Get beauty tips, salon updates, and exclusive offers delivered to
              your inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-1 flex flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#98877E] focus:border-[#E8B6A7] focus:ring-1 focus:ring-[#E8B6A7]"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-[#B77970] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C98D82] focus:outline-none focus:ring-2 focus:ring-[#E8B6A7] focus:ring-offset-2 focus:ring-offset-[#30221E]"
              >
                Subscribe
              </button>

              {status === "success" && (
                <p className="text-xs leading-5 text-[#E8B6A7]">
                  Thank you for your interest! Newsletter registration will be
                  available soon.
                </p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-300">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Salon contact, address and opening hours */}
        <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8B6A7]/10 text-[#E8B6A7]">
              <Phone size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#B7A69D]">
                <li>
                  <a href="tel:+8801700000000" className="hover:text-[#E8B6A7]">
                    +880 1700-000000
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} />
                  <a href="mailto:hello@salonbook.com" className="hover:text-[#E8B6A7]">
                    hello@salonbook.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8B6A7]/10 text-[#E8B6A7]">
              <MapPin size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Salon Address
              </h3>
              <address className="mt-3 text-sm not-italic leading-6 text-[#B7A69D]">
                SalonBook Studio
                <br />
                123 Beauty Avenue, Downtown
                <br />
                Bangladesh
              </address>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8B6A7]/10 text-[#E8B6A7]">
              <Clock size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Opening Hours
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-[#B7A69D]">
                <li>Mon – Sat: 9:00 AM – 6:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-xs text-[#A18F85]">
            © {currentYear} SalonBook. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-[#A18F85] transition-colors hover:text-[#E8B6A7]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
