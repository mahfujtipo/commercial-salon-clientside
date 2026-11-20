import { clientsidejwt } from "./clientsidejwt";
import type { Pagination } from "@/types";

// Base URL of the Express API (see NEXT_PUBLIC_SERVER_URL in .env)
const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000"
}/api/v1`;

export class ApiError extends Error {
  status: number;
  errors: Record<string, string> | null;

  constructor(
    status: number,
    message: string,
    errors: Record<string, string> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type QueryValue = string | number | boolean | undefined | null;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Attach the Better Auth JWT. Defaults to true. Use false for public endpoints. */
  auth?: boolean;
}

export interface ApiResult<T> {
  data: T;
  message: string;
  pagination?: Pagination;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Single place for every request to the Express API:
 * base URL, Authorization header, JSON parsing and consistent errors.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, query, auth = true }: RequestOptions = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {};

  if (auth) {
    const token = await clientsidejwt();

    if (!token) {
      throw new ApiError(401, "Please sign in to continue.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      cache: "no-store",
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "Unable to reach the server. Please check your connection and try again.",
    );
  }

  let json: {
    success?: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string> | null;
    pagination?: Pagination;
  } | null = null;

  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok || !json?.success) {
    throw new ApiError(
      response.status,
      json?.message || "Something went wrong. Please try again.",
      json?.errors ?? null,
    );
  }

  return {
    data: json.data as T,
    message: json.message ?? "",
    pagination: json.pagination,
  };
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
