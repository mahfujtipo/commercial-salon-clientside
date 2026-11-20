"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Scissors,
  ArrowUpRight,
  UserRound,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role ?? "customer";

  // One shared dashboard for both roles (content changes by role)
  const dashboardLink = "/dashboard";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authClient.signOut();

      setProfileOpen(false);
      setMenuOpen(false);

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE5DC] bg-[#FFFCF8]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
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
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-[#F3EAE3]" />
          ) : user ? (
            <div className="relative" ref={profileRef}>
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2.5 rounded-full border px-2.5 py-1.5 transition-all duration-200 ${
                  profileOpen
                    ? "border-[#C9A69A] bg-[#F8F4EF]"
                    : "border-[#EDE5DC] bg-white hover:border-[#D9C5BB] hover:bg-[#F8F4EF]"
                }`}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-9 w-9 rounded-full border border-[#EDE5DC] object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAE3] text-[#6F4038]">
                    <UserRound size={19} />
                  </div>
                )}

                <div className="hidden text-left lg:block">
                  <p className="max-w-[110px] truncate text-sm font-semibold text-[#49342D]">
                    {user.name || "My Account"}
                  </p>
                  <p className="text-[10px] capitalize text-[#9A8178]">
                    {userRole}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`mr-1 text-[#82736C] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-[#EDE5DC] bg-[#FFFCF8] shadow-[0_15px_45px_rgba(73,52,45,0.13)] animate-in fade-in zoom-in-95 duration-150">
                  {/* User Information */}
                  <div className="border-b border-[#EDE5DC] bg-[#F8F4EF] px-4 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "Profile"}
                          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#6F4038] shadow-sm">
                          <UserRound size={21} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#49342D]">
                          {user.name || "My Account"}
                        </p>
                        <p className="truncate text-xs text-[#82736C]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-[#EEDBD3] px-3 py-1 text-[10px] font-semibold capitalize tracking-wide text-[#6F4038]">
                      {userRole} Account
                    </span>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">
                    <Link
                      href={dashboardLink}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#49342D] transition-colors hover:bg-[#F3EAE3]"
                    >
                      <LayoutDashboard size={18} className="text-[#A66C62]" />
                      <span>
                        {userRole === "admin"
                          ? "Admin Dashboard"
                          : "My Dashboard"}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
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
              {isPending ? (
                <div className="h-10 animate-pulse rounded-full bg-[#F3EAE3]" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-[#F8F4EF] p-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE5DC] text-[#6F4038]">
                        <UserRound size={19} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#49342D]">
                        {user.name || "My Account"}
                      </p>
                      <p className="truncate text-xs text-[#82736C]">
                        {user.email}
                      </p>
                      <p className="text-xs font-medium capitalize text-[#B77970]">
                        {userRole}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#6F4038] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#513029]"
                  >
                    <LayoutDashboard size={17} />
                    {userRole === "admin" ? "Admin Dashboard" : "My Dashboard"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-2 rounded-full border border-[#D9C5BB] py-3 text-sm font-semibold text-red-600 disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
