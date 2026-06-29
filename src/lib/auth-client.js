import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://assignment10-client-site-rcvy.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;