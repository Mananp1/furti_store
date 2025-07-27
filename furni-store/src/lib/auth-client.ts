import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5173",
  providers: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
    },
  },
});

export const { signIn, signUp, signOut, useSession, getSession, deleteUser } =
  authClient;
