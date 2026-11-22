"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { signOutAndClearTokenCache } from "@/lib/clientsidejwt";
import { useDashboardUser } from "./DashboardProvider";
import { getPageTitle } from "./menu";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function DashboardHeader({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useDashboardUser();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOutAndClearTokenCache();

      toast.success("Logged out successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-[#EDE4DC] bg-[#FFFCF8]/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-xl border border-[#EDE4DC] bg-white p-2.5 text-[#49342D] transition-colors hover:bg-[#F8F2ED]"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <p className="hidden text-xs text-[#82736C] sm:block">
            Dashboard
            <span className="mx-1.5">/</span>
            <span className="capitalize">{user.role}</span>
          </p>
          <h1 className="truncate text-lg font-bold text-[#49342D]">
            {getPageTitle(pathname, user.role)}
          </h1>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 rounded-full border border-[#EDE4DC] bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:bg-[#F8F2ED]"
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAE3] text-[#A66C62]">
              <UserRound size={18} />
            </span>
          )}

          <span className="hidden text-left sm:block">
            <span className="block max-w-[130px] truncate text-sm font-semibold text-[#49342D]">
              {user.name}
            </span>
            <span className="block text-[10px] font-medium capitalize text-[#82736C]">
              {user.role}
            </span>
          </span>

          <ChevronDown
            size={15}
            className={`text-[#82736C] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-[#EDE4DC] bg-white shadow-[0_15px_45px_rgba(73,52,45,0.13)]"
          >
            <div className="border-b border-[#EDE4DC] bg-[#F8F2ED] px-4 py-3">
              <p className="truncate text-sm font-bold text-[#49342D]">
                {user.name}
              </p>
              <p className="truncate text-xs text-[#82736C]">{user.email}</p>
            </div>

            <div className="p-2">
              <Link
                href="/dashboard/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#49342D] hover:bg-[#F8F2ED]"
              >
                <UserRound size={17} className="text-[#A66C62]" /> My Profile
              </Link>
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#49342D] hover:bg-[#F8F2ED]"
              >
                <LayoutDashboard size={17} className="text-[#A66C62]" />{" "}
                Dashboard
              </Link>
              <Link
                href="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#49342D] hover:bg-[#F8F2ED]"
              >
                <Globe size={17} className="text-[#A66C62]" /> Back to website
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut size={17} /> {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
