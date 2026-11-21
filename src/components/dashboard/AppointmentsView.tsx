"use client";

import { useDashboardUser } from "./DashboardProvider";
import ManageAppointments from "./admin/ManageAppointments";
import MyAppointments from "./customer/MyAppointments";

// Admin sees every request, customers only see their own.
export default function AppointmentsView() {
  const { user } = useDashboardUser();

  return user.role === "admin" ? <ManageAppointments /> : <MyAppointments />;
}
