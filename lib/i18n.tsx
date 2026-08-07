'use client';

import de from '@/i18n/de.json';
import en from '@/i18n/en.json';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'de' | 'en';
type Messages = typeof de;
type I18nContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (path: string) => string; messages: Messages };

const dictionaries: Record<Locale, Messages> = { de, en };
const I18nContext = createContext<I18nContextValue | null>(null);

function getPathValue(messages: Messages, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) return (current as Record<string, unknown>)[segment];
    return undefined;
  }, messages);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'de';
    const stored = window.localStorage.getItem('duonerds-locale');
    return stored === 'en' ? 'en' : 'de';
  });
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem('duonerds-locale', next);
    document.documentElement.lang = next;
  };
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    messages: dictionaries[locale],
    t: (path) => {
      const value = getPathValue(dictionaries[locale], path);
      return typeof value === 'string' ? value : path;
    },
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}

export function useMessageArray(path: 'workflow.steps' | 'stack.items') {
  const { messages } = useI18n();
  if (path === 'stack.items') return messages.stack.items;
  return messages.workflow.steps;
}
