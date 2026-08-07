import Link from 'next/link';

export const metadata = { title: 'Datenschutz & Anbieterhinweis | DuoNerds' };

export default function DatenschutzPage() {
  return <main><section className="container-wide legal-copy"><span className="eyebrow-duo">DuoNerds / Legal</span><h1>Datenschutz</h1><p>Diese Website speichert nur die Sprache und die notwendige Cookie-Auswahl lokal in deinem Browser. Wir setzen kein Analyse- oder Werbetracking ein.</p><h2>Kontakt</h2><p>Wenn du uns per E-Mail oder Discord kontaktierst, verwenden wir deine Angaben ausschließlich zur Bearbeitung deiner Anfrage. Eine Weitergabe an Dritte findet nicht statt, soweit dies nicht zur Bearbeitung ausdrücklich erforderlich ist.</p><h2 id="anbieter">Anbieterhinweis</h2><p>DuoNerds<br />Kontakt: <a href="mailto:contact@duonerds.online">contact@duonerds.online</a></p><p>Die vollständige Anbieterkennzeichnung wird vor dem öffentlichen Launch ergänzt. Bis dahin erreichst du uns direkt über Discord oder E-Mail.</p><h2>Externe Dienste</h2><p>Links zu Discord öffnen einen externen Dienst. Für dessen Datenschutz gelten die Hinweise des jeweiligen Anbieters. Schriftarten und Bilder werden aus dem lokalen Projekt geladen.</p><Link href="/" className="button-duo button-ghost">Zur Startseite</Link></section></main>;
}
