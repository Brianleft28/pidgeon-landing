import { writable, derived } from 'svelte/store';
import { translations, type Language } from './i18n';

export const lang = writable<Language>('ES');
export const t = derived(lang, ($lang) => translations[$lang]);

export const isContactModalOpen = writable(false);
export const contactPlan = writable<string | undefined>(undefined);

export function openContactModal(planName?: string) {
  contactPlan.set(planName);
  isContactModalOpen.set(true);
}
