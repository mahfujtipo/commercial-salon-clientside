"use client";

import { useDashboardUser } from "@/components/dashboard/DashboardProvider";
import ManageAppointments from "@/components/dashboard/admin/ManageAppointments";
import MyAppointments from "@/components/dashboard/customer/MyAppointments";

// Admin sees every request, customers only see their own.
export default function AppointmentsPage() {
  const { user } = useDashboardUser();

  return user.role === "admin" ? <ManageAppointments /> : <MyAppointments />;
}
