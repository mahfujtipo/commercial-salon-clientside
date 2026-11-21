import { authClient } from "./auth-client";

// Returns the Better Auth JWT for the signed-in user (undefined when signed out).
export const clientsidejwt = async () => {
  const { data } = await authClient.token();
  return data?.token;
};
