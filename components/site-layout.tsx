'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, ChevronDown, Globe2, Menu, MessageCircle, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const navItems = [
    { href: '/services/game-servers', label: t('nav.services') },
    { href: '/metin2', label: t('nav.games') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/calculator', label: t('nav.calculator') },
    { href: '/#kontakt', label: t('nav.contact') },
  ];
  return <header className={`topbar ${open ? 'nav-open' : ''}`}>
    <Link href="/" className="brand-lockup" onClick={() => setOpen(false)} aria-label="DuoNerds Startseite">
      <span className="brand-mark">DN</span>
      <span><span className="brand-name">{t('brand.name')}</span><span className="brand-tagline">{t('brand.tagline')}</span></span>
    </Link>
    <nav className="main-nav" aria-label="Hauptnavigation">
      {navItems.map((item) => <Link key={item.href} href={item.href} data-active={pathname === item.href || (item.href === '/metin2' && pathname.startsWith('/metin2'))} onClick={() => setOpen(false)}>{item.label}</Link>)}
    </nav>
    <div className="topbar-actions">
      <div className="locale-switcher">
        <button className="locale-trigger" onClick={() => setLanguageOpen((value) => !value)} aria-expanded={languageOpen} aria-label="Sprache wechseln"><Globe2 size={14} /> {locale === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'} <ChevronDown size={12} /></button>
        {languageOpen && <div className="locale-menu"><button onClick={() => { setLocale('de'); setLanguageOpen(false); }}>🇩🇪 Deutsch</button><button onClick={() => { setLocale('en'); setLanguageOpen(false); }}>🇬🇧 English</button></div>}
      </div>
      <a className="button-duo button-primary" href="https://discord.com/app" target="_blank" rel="noreferrer"><MessageCircle size={15} /> <span className="hidden sm:inline">{t('actions.discord')}</span></a>
      <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label={t('nav.menu')} aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button>
    </div>
  </header>;
}

export function SiteFooter() {
  const { t } = useI18n();
  return <footer className="footer-duo container-wide">
    <Link href="/" className="brand-lockup"><span className="brand-mark">DN</span><span><span className="brand-name">{t('brand.name')}</span><span className="brand-tagline">{t('footer.text')}</span></span></Link>
    <nav className="footer-links" aria-label="Footer"><Link href="/shop">{t('nav.shop')}</Link><Link href="/tools">Web &amp; Tools</Link><Link href="/datenschutz">{t('footer.privacy')}</Link><Link href="/datenschutz#anbieter">{t('footer.imprint')}</Link></nav>
    <span className="footer-status"><span /> {t('footer.open')}</span>
  </footer>;
}

export function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && !window.localStorage.getItem('duonerds-cookie-choice'));
  if (!visible) return null;
  const close = () => { window.localStorage.setItem('duonerds-cookie-choice', 'accepted'); setVisible(false); };
  return <aside className="cookie-banner" aria-label="Cookies & Datenschutz"><div><strong>Cookies &amp; Datenschutz</strong><p>{t('legal.privacyText')}</p></div><div className="cookie-actions"><button className="button-duo button-ghost" onClick={close}>Nur notwendige</button><button className="button-duo button-primary" onClick={close}><Check size={14} /> Verstanden</button></div></aside>;
}

export function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .12 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>{children}</div>;
}

export function BackLink({ href = '/' }: { href?: string }) {
  const { t } = useI18n();
  return <Link href={href} className="inline-flex items-center gap-2 text-sm text-muted hover:text-amber"><ArrowRight size={14} className="rotate-180" /> {t('actions.back')}</Link>;
}
