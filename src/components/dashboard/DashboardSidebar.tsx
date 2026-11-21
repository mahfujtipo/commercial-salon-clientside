"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Scissors, X } from "lucide-react";
import { useDashboardUser } from "./DashboardProvider";
import { isActivePath, menuByRole } from "./menu";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function DashboardSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useDashboardUser();
  const items = menuByRole[user.role];

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#30221E]/50 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#EDE4DC] bg-[#F8F2ED] transition-all duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[84px]" : "lg:w-64"}`}
      >
        {/* Brand */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#EDE4DC] px-4">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A66C62] text-white">
              <Scissors size={20} strokeWidth={1.8} />
            </span>
            <span
              className={`whitespace-nowrap text-lg font-bold tracking-tight text-[#49342D] ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Salon<span className="text-[#A66C62]">Book.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="rounded-lg p-2 text-[#82736C] hover:bg-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role indicator */}
        <div className={`px-4 pt-5 ${collapsed ? "lg:px-3" : ""}`}>
          <div
            className={`rounded-xl bg-white px-3 py-2.5 ring-1 ring-[#EDE4DC] ${
              collapsed ? "lg:text-center" : ""
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-wider text-[#82736C] ${collapsed ? "lg:hidden" : ""}`}>
              Signed in as
            </p>
            <p className="text-sm font-bold capitalize text-[#A66C62]">
              {collapsed ? (
                <>
                  <span className="hidden lg:inline">{user.role.charAt(0)}</span>
                  <span className="lg:hidden">{user.role}</span>
                </>
              ) : (
                user.role
              )}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-3">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#A66C62] text-white shadow-sm"
                    : "text-[#49342D] hover:bg-white"
                } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
              >
                <Icon size={19} className="shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse (desktop) */}
        <div className="hidden border-t border-[#EDE4DC] p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#82736C] transition-colors hover:bg-white ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            {collapsed ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
