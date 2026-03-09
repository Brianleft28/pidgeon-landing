import { writable, derived } from 'svelte/store';
import { translations, type Language } from './i18n';

export const lang = writable<Language>('ES');
export const t = derived(lang, ($lang) => translations[$lang]);

export const isContactModalOpen = writable(false);
export const contactPlan = writable<string | undefined>(undefined);

export const isPaymentModalOpen = writable(false);
export const paymentDetails = writable<{ name: string; amount: number }>({ name: '', amount: 0 });

// Auth stores
export const authToken = writable<string | null>(null);
export const currentUser = writable<{ id: string; email: string; roles: string[] } | null>(null);
export const isLoggedIn = derived(authToken, ($token) => !!$token);
export const isAuthModalOpen = writable(false);

export function openContactModal(planName?: string) {
  contactPlan.set(planName);
  isContactModalOpen.set(true);
}

export function openPaymentModal(planName: string, amount: number) {
  paymentDetails.set({ name: planName, amount });
  isPaymentModalOpen.set(true);
}

export function openAuthModal() {
  isAuthModalOpen.set(true);
}

export function closeAuthModal() {
  isAuthModalOpen.set(false);
}

export function parseJwtPayload(token: string): { sub: string; email: string; roles: string[]; exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: { id: string; email: string; roles: string[] }) {
  authToken.set(token);
  currentUser.set(user);
  localStorage.setItem('pidgeonAuthToken', token);
}

export function logout() {
  authToken.set(null);
  currentUser.set(null);
  localStorage.removeItem('pidgeonAuthToken');
}

export function initAuth() {
  const token = localStorage.getItem('pidgeonAuthToken');
  if (token) {
    const payload = parseJwtPayload(token);
    if (payload) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        logout();
        return;
      }
      authToken.set(token);
      currentUser.set({ id: payload.sub, email: payload.email, roles: payload.roles });
    } else {
      logout();
    }
  }
}
