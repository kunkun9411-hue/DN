'use client';

import Link from 'next/link';
import { ArrowRight, Check, Clock3, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCalculatorStore } from '@/lib/calculator-store';

const bases = [
  { id: 'metin2' as const, de: 'Metin2 System / UI', en: 'Metin2 system / UI', price: 260, days: 10 },
  { id: 'palworld' as const, de: 'Palworld Mod / Helper', en: 'Palworld mod / helper', price: 180, days: 7 },
  { id: 'minecraft' as const, de: 'Minecraft Plugin', en: 'Minecraft plugin', price: 220, days: 8 },
  { id: 'web' as const, de: 'Website / Dashboard', en: 'Website / dashboard', price: 320, days: 12 },
];
const extras = [
  { id: 'dashboard' as const, de: 'Web-Dashboard oder Statusseite', en: 'Web dashboard or status page', price: 120, days: 3 },
  { id: 'automation' as const, de: 'Automation / Discord Flow', en: 'Automation / Discord flow', price: 90, days: 2 },
  { id: 'support' as const, de: 'Begleitung nach der Uebergabe', en: 'Support after handover', price: 80, days: 4 },
];

export function CalculatorClient() {
  const { locale, t } = useI18n();
  const state = useCalculatorStore();
  const base = bases.find((item) => item.id === state.base) ?? bases[0];
  const selectedExtras = extras.filter((item) => state[item.id]);
  const total = base.price + selectedExtras.reduce((sum, item) => sum + item.price, 0) + (state.rush ? 90 : 0);
  const days = base.days + selectedExtras.reduce((sum, item) => sum + item.days, 0) - (state.rush ? 2 : 0);
  const currency = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  return <main><section className="section-block calculator-page"><div className="container-wide"><span className="eyebrow-duo">{t('calculator.eyebrow')}</span><h1 className="section-title">{t('calculator.title')}</h1><p className="muted-copy">{t('calculator.text')}</p><div className="calculator-grid"><div className="calculator-panel surface"><h2>{t('calculator.base')}</h2><div className="calculator-options">{bases.map((item) => <label key={item.id} className={`calculator-option ${state.base === item.id ? 'active' : ''}`}><input type="radio" name="base" checked={state.base === item.id} onChange={() => state.setBase(item.id)} /><span>{locale === 'de' ? item.de : item.en}</span><strong>{currency.format(item.price)}</strong></label>)}</div><h2 className="mt-8">{t('calculator.addons')}</h2><div className="calculator-options">{extras.map((item) => <label key={item.id} className={`calculator-option ${state[item.id] ? 'active' : ''}`}><input type="checkbox" checked={state[item.id]} onChange={() => state.toggle(item.id)} /><span>{locale === 'de' ? item.de : item.en}</span><strong>+{currency.format(item.price)}</strong></label>)}<label className={`calculator-option ${state.rush ? 'active' : ''}`}><input type="checkbox" checked={state.rush} onChange={() => state.toggle('rush')} /><span>{t('calculator.rush')}</span><strong>+{currency.format(90)}</strong></label></div></div><aside className="calculator-summary surface"><span className="eyebrow-duo">{t('calculator.result')}</span><div className="calculator-total">{currency.format(total)}</div><div className="summary-line"><Clock3 size={15} /> {days} {locale === 'de' ? 'Werktage Orientierung' : 'working days estimate'}</div><p>{t('calculator.disclaimer')}</p><a className="button-duo button-primary" href={`https://discord.com/app?estimate=${total}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {t('calculator.send')}</a><Link href="/shop" className="summary-link">{t('actions.buy')} <ArrowRight size={14} /></Link><div className="summary-check"><Check size={14} /> {t('hero.proofThree')}</div></aside></div></div></section></main>;
}
