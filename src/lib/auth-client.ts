import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [jwtClient()],
});

export const refreshAuthSession = async () => {
  const sessionStore = authClient.$store.atoms.session;
  await sessionStore.get().refetch({
    query: { disableCookieCache: true },
  });
  return sessionStore.get();
};
