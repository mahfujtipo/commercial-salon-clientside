"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Scissors, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE5DC] bg-[#FFFCF8]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F4038] text-white">
            <Scissors size={21} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#39251F]">
              Salon<span className="text-[#B77970]">Book.</span>
            </h1>
            <p className="text-[9px] font-medium uppercase tracking-[2.5px] text-[#9A8178]">
              Beauty. Booked.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#68534C] transition-colors hover:text-[#B77970]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#5C4038] transition-colors hover:text-[#B77970]"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-[#6F4038] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#513029]"
          >
            Get Started
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#513029] hover:bg-[#F3EAE3] md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#EDE5DC] bg-[#FFFCF8] px-5 py-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#513029] transition-colors hover:text-[#B77970]"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#EDE5DC] pt-5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[#D9C5BB] py-3 text-center text-sm font-semibold text-[#513029]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#6F4038] py-3 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
