import { createAuthClient } from "better-auth/react";
import { getApiBase } from './apiBase';

export const authClient = createAuthClient({
    baseURL: `${getApiBase()}/auth`,
    fetchOptions: {
        credentials: "include",
    }
});

export const { useSession, signIn, signUp, signOut } = authClient;
