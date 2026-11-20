// Safe "return to" handling for login redirects.

const REDIRECT_PARAM = "redirect";

/** Accepts only internal paths such as /services/123 (blocks //evil.com etc.). */
export function sanitizeRedirect(value: string | null | undefined) {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value.startsWith("/login") || value.startsWith("/register")) return null;
  return value;
}

/** Reads ?redirect=/some/path from the current URL (browser only). */
export function readRedirectFromUrl() {
  if (typeof window === "undefined") return null;

  return sanitizeRedirect(
    new URLSearchParams(window.location.search).get(REDIRECT_PARAM),
  );
}

export function loginUrlWithRedirect(path: string) {
  return `/login?${REDIRECT_PARAM}=${encodeURIComponent(path)}`;
}

export function callbackUrlWithRedirect(path: string | null) {
  return path
    ? `/auth/callback?${REDIRECT_PARAM}=${encodeURIComponent(path)}`
    : "/auth/callback";
}
