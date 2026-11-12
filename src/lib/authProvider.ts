import type { AuthProvider } from '@refinedev/core';

/**
 * Headless auth provider scaffold for Q UI.
 * This is intentionally UI-agnostic so Q UI components work with any backend.
 * Wire `login/logout/check` to your API / Supabase / Appwrite / custom here.
 */
export interface QCredentials {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: unknown;
}

export const qAuthProvider: AuthProvider = {
  async login({ email, username, password }: QCredentials) {
    // TODO: replace with real auth call
    if (!password) {
      return { success: false, error: { message: 'Password required', name: 'LoginError' } };
    }
    localStorage.setItem('q-auth', JSON.stringify({ email: email ?? username }));
    return { success: true, redirectTo: '/' };
  },

  async logout() {
    localStorage.removeItem('q-auth');
    return { success: true, redirectTo: '/login' };
  },

  async check() {
    const raw = localStorage.getItem('q-auth');
    if (raw) return { authenticated: true };
    return {
      authenticated: false,
      redirectTo: '/login',
      logout: true,
    };
  },

  async getPermissions() {
    return null;
  },

  async getIdentity() {
    const raw = localStorage.getItem('q-auth');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return { id: data.email ?? 'user', ...data };
  },

  async onError(error: unknown) {
    const httpError = error as { statusCode?: number } | null;
    if (httpError && httpError.statusCode === 401) {
      return { logout: true, redirectTo: '/login', error: new Error('Unauthorized') };
    }
    return { error: error as Error | undefined };
  },
};

export const qDataProvider = undefined;
