// Shared TypeScript types. They mirror the Express API responses.

export type Role = "admin" | "customer";

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  role: Role;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ServiceStatus = "active" | "inactive";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Appointment {
  _id: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceSnapshot: {
    serviceName: string;
    category: string;
    image: string;
    price: number;
    duration: number;
  };
  servicePrice: number;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  message: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledBy?: "admin" | "customer";
}

export interface RecentAppointment {
  _id: string;
  customerName: string;
  serviceSnapshot: { serviceName: string };
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type TransactionStatus = "paid" | "failed";

export interface Transaction {
  _id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: TransactionStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paged<T> {
  items: T[];
  pagination: Pagination;
}

export interface CategorySummary {
  category: string;
  count: number;
}

export interface Availability {
  date: string;
  bookedSlots: string[];
  availableSlots: string[];
}

export interface CustomerStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

export interface AdminStats {
  totalCustomers: number;
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalSuccessfulPayments: number;
}

export type PriceSort = "price_asc" | "price_desc" | "newest";

export interface ServiceQuery {
  search?: string;
  category?: string;
  sort?: PriceSort;
  status?: ServiceStatus | "";
  page?: number;
  limit?: number;
}

export interface PaymentStatusResult {
  status: "paid" | "failed" | "processing";
  appointmentId?: string;
}
