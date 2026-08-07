import Link from 'next/link';

export const metadata = { title: 'Datenschutz & Anbieterhinweis | DuoNerds' };

export default function DatenschutzPage() {
  return <main><section className="container-wide legal-copy"><span className="eyebrow-duo">DuoNerds / Legal</span><h1>Datenschutz</h1><p>Diese Website speichert die gewÃ¤hlte Sprache und die notwendige Cookie-Auswahl lokal in deinem Browser. Wir setzen auf der Ã¶ffentlichen Website kein Analyse- oder Werbetracking ein.</p><h2>Kontakt</h2><p>Wenn du uns per E-Mail oder Discord kontaktierst, verwenden wir deine Angaben ausschlieÃŸlich zur Bearbeitung deiner Anfrage und zur Kommunikation Ã¼ber das Projekt. Eine Weitergabe erfolgt nur, wenn sie fÃ¼r die Bearbeitung erforderlich ist oder du sie ausdrÃ¼cklich wÃ¼nschst.</p><h2 id="anbieter">Anbieterhinweis</h2><p>DuoNerds<br />Kontakt: <a href="mailto:contact@duonerds.online">contact@duonerds.online</a></p><p>FÃ¼r Datenschutzfragen oder eine Anfrage zur Ã„nderung beziehungsweise LÃ¶schung deiner Angaben erreichst du uns Ã¼ber diese Adresse.</p><h2>Externe Dienste</h2><p>Links zu Discord Ã¶ffnen einen externen Dienst. FÃ¼r dessen Datenschutz gelten die Hinweise des jeweiligen Anbieters. Schriftarten und Bilder der Ã¶ffentlichen Website werden aus dem lokalen Projekt geladen.</p><Link href="/" className="button-duo button-ghost">Zur Startseite</Link></section></main>;
}

