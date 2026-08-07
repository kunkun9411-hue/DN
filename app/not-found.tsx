import Link from 'next/link';

export default function NotFound() {
  return <main><section className="container-wide legal-copy"><span className="eyebrow-duo">404 / nicht gefunden</span><h1>Diese Seite ist noch kein Baustein.</h1><p>Der Link passt gerade nicht zu unserem Projektplan. Zurück zur Übersicht?</p><Link href="/" className="button-duo button-primary">Zur Startseite</Link></section></main>;
}
