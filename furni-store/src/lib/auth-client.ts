import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5001",
  plugins: [magicLinkClient()],
});

export const { signIn, signUp, signOut, useSession, getSession, deleteUser } =
  authClient;
