'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, ExternalLink, Search, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { categoryLabels, products, type Product, type ProductCategory } from '@/lib/data/products';
import { ScrollReveal } from '@/components/site-layout';

const categories: Array<'all' | ProductCategory> = ['all', 'metin2', 'palworld', 'minecraft', 'web', 'bots', 'custom'];

export function ShopClient() {
  const { locale, t } = useI18n();
  const [category, setCategory] = useState<'all' | ProductCategory>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const haystack = `${product.title} ${product.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [category, query]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <main>
    <section className="section-block shop-intro"><div className="container-wide"><span className="eyebrow-duo">{t('shop.eyebrow')}</span><h1 className="section-title">{t('shop.title')}</h1><p className="muted-copy">{t('shop.text')}</p></div></section>
    <section className="container-wide shop-catalog" aria-label="Shop">
      <div className="shop-toolbar"><div><span className="eyebrow-duo">{t('shop.filter')}</span><div className="filter-list" role="tablist" aria-label={t('shop.filter')}>{categories.map((item) => <button key={item} className={`filter-button ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item === 'all' ? t('actions.all') : categoryLabels[item][locale]}</button>)}</div></div><label className="search-box"><Search size={15} /><span className="sr-only">{t('shop.search')}</span><input className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('shop.search')} /></label></div>
      {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <ScrollReveal key={product.id}><ProductCard product={product} locale={locale} onOpen={() => setSelected(product)} t={t} index={index} /></ScrollReveal>)}</div> : <div className="empty-state surface">{t('shop.empty')}</div>}
    </section>
    {selected && <ProductModal product={selected} locale={locale} onClose={() => setSelected(null)} t={t} />}
  </main>;
}

function ProductCard({ product, locale, onOpen, t, index }: { product: Product; locale: 'de' | 'en'; onOpen: () => void; t: (path: string) => string; index: number }) {
  return <article className="product-card surface"><div className="product-media"><Image src={product.image} alt={product.title} fill sizes="(max-width: 720px) 100vw, 33vw" />{product.badge && <span className="product-badge">{product.badge}</span>}<span className="image-index">0{index + 1}</span></div><div className="product-body"><span className="eyebrow-duo">{categoryLabels[product.category][locale]}</span><h2>{product.title}</h2><p>{product.description}</p><div className="product-meta"><span className="product-price">{product.price}</span><span className="muted-mono">{product.duration}</span></div><div className="product-actions"><button className="button-duo button-primary" onClick={onOpen}>{t('actions.details')} <ArrowRight size={13} /></button><Link className="button-duo button-ghost" href={`/shop/${product.id}`} aria-label={`${product.title} ${t('actions.details')}`}><ExternalLink size={14} /></Link></div></div></article>;
}

function ProductModal({ product, locale, onClose, t }: { product: Product; locale: 'de' | 'en'; onClose: () => void; t: (path: string) => string }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="product-modal surface" role="dialog" aria-modal="true" aria-labelledby="product-title"><button className="modal-close" onClick={onClose} aria-label={t('actions.close')}><X size={16} /></button><div className="modal-image"><Image src={product.image} alt="" fill sizes="(max-width: 720px) 100vw, 35vw" /></div><div className="modal-copy"><span className="eyebrow-duo">{categoryLabels[product.category][locale]}</span><h2 id="product-title">{product.title}</h2><p>{product.description}</p><div className="product-meta"><span className="product-price">{product.price}</span><span className="muted-mono">{product.duration}</span></div><h3>{t('shop.includes')}</h3><ul className="modal-list">{product.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><h3>{t('shop.requirements')}</h3><ul className="modal-list">{product.requirements.map((requirement) => <li key={requirement}><Check size={14} />{requirement}</li>)}</ul><a className="button-duo button-primary mt-6" href={`https://discord.com/app?product=${encodeURIComponent(product.id)}`} target="_blank" rel="noreferrer">{t('actions.buy')} <ArrowRight size={14} /></a></div></div></div>;
}

export function ProductDetail({ id }: { id: string }) {
  const { locale, t } = useI18n();
  const product = products.find((item) => item.id === id) ?? products[0];
  return <main><section className="section-block"><div className="container-wide product-detail surface"><div className="product-detail-image"><Image src={product.image} alt={product.title} fill sizes="(max-width: 720px) 100vw, 50vw" /></div><div className="product-detail-copy"><Link href="/shop" className="back-link">{t('actions.back')}</Link><span className="eyebrow-duo">{categoryLabels[product.category][locale]}</span><h1>{product.title}</h1><p className="muted-copy">{product.description}</p><div className="detail-price"><strong>{product.price}</strong><span>{product.duration}</span></div><h2>{t('shop.includes')}</h2><ul className="modal-list">{product.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><a className="button-duo button-primary mt-7" href={`https://discord.com/app?product=${encodeURIComponent(product.id)}`} target="_blank" rel="noreferrer">{t('actions.buy')} <ArrowRight size={14} /></a></div></div></section></main>;
}
