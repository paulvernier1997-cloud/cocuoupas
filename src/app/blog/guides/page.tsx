"use client";

import Link from "next/link";

const ACCENT = "#a855f7";

const articles = [
  { slug: "8-signes-partenaire-trompe", title: "8 Signes Infaillibles que Votre Partenaire Mène une Double Vie", excerpt: "L'infidélité moderne ne laisse plus de parfum sur une chemise. Elle se cache dans les données chiffrées, les micro-absences et la ségrégation numérique.", date: "13 mai 2026", readTime: "7 min", tag: "Détection", featured: true },
  { slug: "guide-complet-tinder-2026", title: "Guide complet Tinder 2026 : fonctionnement, algorithme et profils", excerpt: "Tout ce qu'il faut savoir sur Tinder : comment les profils sont affichés, comment fonctionne le matching, et comment détecter un compte actif.", date: "13 mai 2026", readTime: "10 min", tag: "Tinder", featured: false },
  { slug: "bumble-vs-tinder-differences", title: "Bumble vs Tinder : quelles différences pour détecter un profil ?", excerpt: "Ces deux apps fonctionnent très différemment. On compare leurs mécaniques de visibilité, d'activité et les traces qu'elles laissent.", date: "6 mai 2025", readTime: "6 min", tag: "Bumble", featured: false },
  { slug: "hinge-guide-complet", title: "Hinge : le guide complet pour comprendre l'application", excerpt: "Hinge se présente comme l'app \"designed to be deleted\". En réalité, ses fonctionnalités permettent de savoir si quelqu'un est actif dessus.", date: "1 mai 2025", readTime: "7 min", tag: "Hinge", featured: false },
  { slug: "profil-inactif-vs-actif-rencontre", title: "Profil inactif vs profil actif : comment faire la différence ?", excerpt: "Un profil peut rester en ligne même sans activité récente. On explique les indicateurs qui distinguent un compte dormant d'un compte utilisé régulièrement.", date: "25 avril 2025", readTime: "5 min", tag: "Détection", featured: false },
];

export default function GuidesPage() {
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);
  return (
    <main>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
        <Link href="/blog" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#52525b", textDecoration: "none" }}>Blog</Link>
        <span style={{ color: "#27272a" }}>›</span>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: ACCENT }}>Guides</span>
      </div>
      <section style={{ marginBottom: "3.5rem", paddingBottom: "3.5rem", borderBottom: "1px solid #1f1f1f" }}>
        <span style={{ display: "inline-block", fontSize: "0.55rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: ACCENT, background: `${ACCENT}15`, border: `1px solid ${ACCENT}33`, padding: "4px 10px", borderRadius: "4px", marginBottom: "1.25rem" }}>GUIDE</span>
        <h1 style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", color: "#fff", marginBottom: "1rem" }}>
          GUIDES<span style={{ color: ACCENT }}>.</span>
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#71717a", maxWidth: "440px", lineHeight: 1.7 }}>Le fonctionnement interne de Tinder, Bumble et Hinge — pour comprendre ce que ces apps révèlent (ou cachent).</p>
      </section>
      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#52525b", marginBottom: "1rem" }}>Article principal</p>
        <Link
          href={`/blog/guides/${featured.slug}`}
          style={{ display: "block", textDecoration: "none", background: "linear-gradient(135deg, #0f0f0f 0%, #0d0714 100%)", border: "1px solid #27272a", borderRadius: "1.25rem", padding: "2.5rem", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#27272a"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: ACCENT, border: `1px solid ${ACCENT}55`, padding: "3px 10px", borderRadius: "4px", background: `${ACCENT}11` }}>{featured.tag}</span>
            <span style={{ fontSize: "0.7rem", color: "#52525b" }}>{featured.date} · {featured.readTime} de lecture</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1rem", maxWidth: "600px" }}>{featured.title}</h2>
          <p style={{ fontSize: "0.9rem", color: "#71717a", lineHeight: 1.7, maxWidth: "540px", marginBottom: "1.5rem" }}>{featured.excerpt}</p>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ACCENT }}>Lire l'article →</span>
        </Link>
      </section>
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#52525b", whiteSpace: "nowrap" }}>Tous les articles</p>
          <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rest.map((article, i) => (
            <Link key={article.slug} href={`/blog/guides/${article.slug}`} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", padding: "1.75rem 0", borderBottom: i < rest.length - 1 ? "1px solid #1a1a1a" : "none", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: ACCENT, border: `1px solid ${ACCENT}44`, padding: "2px 8px", borderRadius: "3px" }}>{article.tag}</span>
                  <span style={{ fontSize: "0.7rem", color: "#3f3f46" }}>{article.date} · {article.readTime}</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#e4e4e7", letterSpacing: "-0.02em", lineHeight: 1.35, marginBottom: "0.5rem" }}>{article.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "#52525b", lineHeight: 1.6 }}>{article.excerpt}</p>
              </div>
              <span style={{ flexShrink: 0, fontSize: "1.2rem", color: "#27272a", paddingTop: "0.2rem" }}>→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}