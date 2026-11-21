import { apiRequest } from "./api";
import type {
  AdminStats,
  Appointment,
  Availability,
  CategorySummary,
  CurrentUser,
  CustomerStats,
  Paged,
  PaymentStatusResult,
  RecentAppointment,
  Service,
  ServiceInput,
  ServiceQuery,
  ServiceStatus,
  Transaction,
} from "@/types";

// Every API call used by the client lives here.

async function paged<T>(path: string, query: Record<string, string | number | undefined>) {
  const result = await apiRequest<T[]>(path, { query });

  return {
    items: result.data,
    pagination: result.pagination ?? {
      total: result.data.length,
      page: 1,
      limit: result.data.length || 1,
      totalPages: 1,
    },
  } satisfies Paged<T>;
}

/* ------------------------------- Users -------------------------------- */

export const getCurrentUser = async (options?: { signal?: AbortSignal }) =>
  (await apiRequest<CurrentUser>("/users/me", { signal: options?.signal })).data;

export const updateProfile = async (payload: {
  name?: string;
  image?: string;
  phone?: string;
}) =>
  apiRequest<CurrentUser>("/users/me", { method: "PATCH", body: payload });

export const getUsers = (query: {
  search?: string;
  isBlocked?: string;
  page?: number;
  limit?: number;
}) => paged<CurrentUser>("/users", query);

export const blockUser = (id: string) =>
  apiRequest<CurrentUser>(`/users/${id}/block`, { method: "PATCH" });

export const unblockUser = (id: string) =>
  apiRequest<CurrentUser>(`/users/${id}/unblock`, { method: "PATCH" });

/* ------------------------------ Services ------------------------------ */

export const getServices = (query: ServiceQuery) =>
  apiRequest<Service[]>("/services", { auth: false, query: { ...query } }).then(
    (r) => ({
      items: r.data,
      pagination: r.pagination!,
    }),
  );

export const getFeaturedServices = async (limit = 6) =>
  (await apiRequest<Service[]>("/services/featured", { auth: false, query: { limit } })).data;

export const getCategories = async () =>
  (await apiRequest<CategorySummary[]>("/services/categories", { auth: false })).data;

export const getServiceById = async (id: string) =>
  (await apiRequest<Service>(`/services/${id}`, { auth: false })).data;

export const getAdminServices = (query: ServiceQuery) =>
  paged<Service>("/services/admin/all", { ...query });

export const getAdminServiceById = async (id: string) =>
  (await apiRequest<Service>(`/services/admin/${id}`)).data;

export const createService = (payload: ServiceInput) =>
  apiRequest<Service>("/services", { method: "POST", body: payload });

export const updateService = (id: string, payload: Partial<ServiceInput>) =>
  apiRequest<Service>(`/services/${id}`, { method: "PATCH", body: payload });

export const deleteService = (id: string) =>
  apiRequest<null>(`/services/${id}`, { method: "DELETE" });

export const setServiceStatus = (id: string, status: ServiceStatus) =>
  apiRequest<Service>(`/services/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

/* ---------------------------- Appointments ---------------------------- */

export const getTimeSlots = async () =>
  (await apiRequest<string[]>("/appointments/time-slots", { auth: false })).data;

export const getAvailability = async (date: string) =>
  (await apiRequest<Availability>("/appointments/availability", { query: { date } })).data;

export const createAppointment = (payload: {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}) => apiRequest<Appointment>("/appointments", { method: "POST", body: payload });

export const getMyAppointments = (query: {
  status?: string;
  page?: number;
  limit?: number;
}) => paged<Appointment>("/appointments/my-appointments", query);

export const getAllAppointments = (query: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => paged<Appointment>("/appointments", query);

export const confirmAppointment = (id: string) =>
  apiRequest<Appointment>(`/appointments/${id}/confirm`, { method: "PATCH" });

export const cancelAppointment = (id: string) =>
  apiRequest<Appointment>(`/appointments/${id}/cancel`, { method: "PATCH" });

/* ------------------------------ Dashboard ----------------------------- */

export const getCustomerStats = async () =>
  (await apiRequest<CustomerStats>("/dashboard/customer-stats")).data;

export const getAdminStats = async () =>
  (await apiRequest<AdminStats>("/dashboard/admin-stats")).data;

export const getRecentAppointments = async (limit = 5) =>
  (await apiRequest<RecentAppointment[]>("/dashboard/recent-appointments", { query: { limit } })).data;

/* ------------------------------- Upload ------------------------------- */

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const result = await apiRequest<{ url: string }>("/upload/image", {
    method: "POST",
    body: formData,
  });

  return result.data.url;
}

/* ------------------------------ Payments ------------------------------ */

export const createCheckoutSession = async (appointmentId: string) =>
  (await apiRequest<{ url: string }>("/payments/checkout-session", {
    method: "POST",
    body: { appointmentId },
  })).data;

export const getPaymentStatus = async (sessionId: string) =>
  (await apiRequest<PaymentStatusResult>("/payments/status", { query: { session_id: sessionId } })).data;

export const getTransactions = (query: { page?: number; limit?: number }) =>
  paged<Transaction>("/transactions", query);
