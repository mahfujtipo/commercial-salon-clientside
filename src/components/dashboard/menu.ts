import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Scissors,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Role-based navigation: ONE dashboard, different menu per role.
export const menuByRole: Record<Role, MenuItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Manage Services", href: "/dashboard/services", icon: Scissors },
    { label: "Manage Appointments", href: "/dashboard/appointments", icon: CalendarCheck },
    { label: "Manage Users", href: "/dashboard/users", icon: Users },
    { label: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { label: "My Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  customer: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Appointments", href: "/dashboard/appointments", icon: CalendarCheck },
    { label: "My Profile", href: "/dashboard/profile", icon: UserRound },
  ],
};

export function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string, role: Role) {
  const match = menuByRole[role].find((item) => isActivePath(pathname, item.href));
  return match?.label ?? "Dashboard";
}
