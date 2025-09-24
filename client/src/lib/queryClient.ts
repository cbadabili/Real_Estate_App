import { QueryClient } from "@tanstack/react-query";
import { getToken } from "./storage";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  // If you pass an object here, it will be JSON.stringified
  body?: unknown;
  // Optional signal for aborting
  signal?: AbortSignal;
};

/**
 * Build Authorization header for same-origin requests only to avoid token leakage.
 * If a fully-qualified URL is passed and its origin differs from window.location.origin,
 * no Authorization header is added.
 */
export const authHeaders = (url?: string): HeadersInit => {
  const token = getToken();
  if (!token) return {};

  if (url) {
    const u = new URL(url, window.location.origin);
    if (u.origin !== window.location.origin) {
      return {};
    }
  }
  return { Authorization: `Bearer ${token}` };
};

/**
 * Lightweight fetch wrapper:
 * - Adds JSON headers
 * - Merges guarded auth headers
 * - Stringifies object bodies
 * - Throws on !res.ok with basic error info
 * - Returns parsed JSON (or null on 204)
 */
export const apiRequest = async <T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { method = "GET", headers = {}, body, signal } = options;

  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(url),
    ...headers,
  };

  const init: RequestInit = {
    method,
    headers: baseHeaders,
    signal,
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(url, init);

  // 204 No Content
  if (res.status === 204) return null as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  const parseJson = contentType.includes("application/json");

  if (!res.ok) {
    let errorPayload: unknown = undefined;
    try {
      errorPayload = parseJson ? await res.json() : await res.text();
    } catch {
      // ignore parse error
    }
    const err = new Error(
      `Request failed: ${res.status} ${res.statusText}`
    ) as Error & { status?: number; data?: unknown; url?: string };
    err.status = res.status;
    err.data = errorPayload;
    err.url = url;
    throw err;
  }

  return (parseJson ? await res.json() : ((await res.text()) as unknown)) as T;
};

// A shared react-query client for the app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // avoid accidental refetch storms in CI
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
