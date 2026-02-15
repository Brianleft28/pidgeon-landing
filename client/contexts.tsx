import React, { createContext, useContext } from 'react';
import { Language, translations } from './i18n';

export interface LanguageContextType {
  lang: Language;
  t: typeof translations.EN;
  setLang: (lang: Language) => void;
}

export interface ModalContextType {
  openContactModal: (planName?: string) => void;
  openPaymentModal: (planName: string, amount: number) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};

export default {} as any;
