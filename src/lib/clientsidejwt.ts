import { authClient } from "./auth-client";

// Cache the JWT for a short time.
const CACHE_MS = 30_000;

let cached: { token: string; expires: number } | null = null;
let inflight: Promise<string | undefined> | null = null;
let signOutInflight: Promise<void> | null = null;
let generation = 0;

export const clearTokenCache = () => {
  generation += 1;
  cached = null;
  inflight = null;
};

const performSignOut = async () => {
  clearTokenCache();

  let signOutError: Error | undefined;

  try {
    const { data, error } = await authClient.signOut();

    if (!error && data?.success) {
      clearTokenCache();
      return;
    }

    if (error) signOutError = new Error(error.message || "Logout failed.");
  } catch (error) {
    signOutError =
      error instanceof Error ? error : new Error("Logout failed.");
  }

  clearTokenCache();

  const { data: session, error: sessionError } = await authClient.getSession({
    query: { disableCookieCache: true },
  });

  if (sessionError || session) {
    throw (
      signOutError ||
      new Error(sessionError?.message || "Unable to confirm logout.")
    );
  }

  // signOut may have cleared the server session before its response failed.
  // Notify Better Auth's shared session store after confirming no session exists.
  authClient.$store.notify("$sessionSignal");
};

export const signOutAndClearTokenCache = () => {
  if (signOutInflight) return signOutInflight;

  signOutInflight = performSignOut().finally(() => {
    signOutInflight = null;
  });

  return signOutInflight;
};

export const clientsidejwt = async (signal?: AbortSignal) => {
  if (cached && cached.expires > Date.now()) return cached.token;

  const startedAt = generation;
  const fetchToken = async (requestSignal?: AbortSignal) => {
    const { data, error } = await authClient.token(
      requestSignal ? { fetchOptions: { signal: requestSignal } } : undefined,
    );

    if (error) {
      throw requestSignal?.aborted && requestSignal.reason instanceof Error
        ? requestSignal.reason
        : new Error(error.message || "Unable to retrieve an authentication token.");
    }

    const token = data?.token;
    if (token && startedAt === generation) {
      cached = { token, expires: Date.now() + CACHE_MS };
    }
    return token;
  };

  // A caller-provided signal must not cancel a token request shared with other callers.
  if (signal) return fetchToken(signal);
  if (inflight) return inflight;

  const request = (async () => {
    try {
      return await fetchToken();
    } finally {
      if (startedAt === generation) inflight = null;
    }
  })();

  inflight = request;
  return request;
};
