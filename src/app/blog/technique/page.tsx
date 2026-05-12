import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technique & OSINT | Blog CocuOuPas",
  description:
    "Méthodes numériques, OSINT et outils pour retrouver un profil sur les applications de rencontre anonymement.",
};

const ACCENT = "#ef4444";

const articles = [
  {
    slug: "comment-trouver-profil-tinder-sans-compte",
    title: "Comment trouver un profil Tinder sans avoir de compte",
    excerpt:
      "Il existe plusieurs méthodes pour vérifier la présence de quelqu'un sur Tinder sans créer de compte. On vous explique les techniques utilisées et leurs limites.",
    date: "12 mai 2025",
    readTime: "6 min",
    tag: "Tinder",
    featured: true,
  },
  {
    slug: "osint-recherche-profil-rencontre",
    title: "OSINT : les bases pour rechercher un profil sur les apps de rencontre",
    excerpt:
      "L'OSINT permet de collecter des informations publiquement disponibles. Voici comment cette discipline s'applique aux profils de rencontre.",
    date: "8 mai 2025",
    readTime: "8 min",
    tag: "OSINT",
    featured: false,
  },
  {
    slug: "reverse-image-search-profils",
    title: "Recherche inversée d'image : retrouver un profil de rencontre",
    excerpt:
      "Google Images, TinEye, PimEyes — comparaison de leur efficacité pour détecter les profils de rencontre depuis une photo.",
    date: "3 mai 2025",
    readTime: "5 min",
    tag: "Outils",
    featured: false,
  },
  {
    slug: "comment-fonctionnent-algorithmes-tinder",
    title: "Comment fonctionnent les algorithmes de Tinder en 2025",
    excerpt:
      "L'algorithme de Tinder a évolué. Comprendre son fonctionnement permet de savoir pourquoi certains profils apparaissent ou disparaissent.",
    date: "28 avril 2025",
    readTime: "7 min",
    tag: "Algorithme",
    featured: false,
  },
];

export default function TechniquePage() {
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
        <Link href="/blog" style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#52525b", textDecoration: "none" }}>
          Blog
        </Link>
        <span style={{ color: "#27272a", fontSize: "0.65rem" }}>›</span>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: ACCENT }}>
          Technique
        </span>
      </div>

      {/* ── Header ── */}
      <section style={{ marginBottom: "3.5rem", paddingBottom: "3.5rem", borderBottom: "1px solid #1f1f1f" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "0.55rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: ACCENT,
            background: `${ACCENT}15`,
            border: `1px solid ${ACCENT}33`,
            padding: "4px 10px",
            borderRadius: "4px",
            marginBottom: "1.25rem",
          }}
        >
          TECH
        </span>
        <h1
          style={{
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          TECHNIQUE
          <span style={{ color: ACCENT }}>.</span>
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#71717a", maxWidth: "440px", lineHeight: 1.7 }}>
          Méthodes numériques et OSINT pour retrouver un profil sur les apps de rencontre anonymement.
        </p>
      </section>

      {/* ── Featured Article ── */}
      <section style={{ marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#52525b", marginBottom: "1rem" }}>
          Article principal
        </p>
        <Link
          href={`/blog/technique/${featured.slug}`}
          style={{
            display: "block",
            textDecoration: "none",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 100%)",
            border: `1px solid #27272a`,
            borderRadius: "1.25rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = ACCENT;
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: ACCENT, border: `1px solid ${ACCENT}55`, padding: "3px 10px", borderRadius: "4px", background: `${ACCENT}11` }}>
              {featured.tag}
            </span>
            <span style={{ fontSize: "0.7rem", color: "#52525b" }}>{featured.date} · {featured.readTime} de lecture</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1rem", maxWidth: "600px" }}>
            {featured.title}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#71717a", lineHeight: 1.7, maxWidth: "540px", marginBottom: "1.5rem" }}>
            {featured.excerpt}
          </p>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ACCENT }}>
            Lire l'article →
          </span>
        </Link>
      </section>

      {/* ── Remaining Articles ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#52525b", whiteSpace: "nowrap" }}>
            Tous les articles
          </p>
          <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {rest.map((article, i) => (
            <Link
              key={article.slug}
              href={`/blog/technique/${article.slug}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "2rem",
                padding: "1.75rem 0",
                borderBottom: i < rest.length - 1 ? "1px solid #1a1a1a" : "none",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: ACCENT, border: `1px solid ${ACCENT}44`, padding: "2px 8px", borderRadius: "3px" }}>
                    {article.tag}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#3f3f46" }}>{article.date} · {article.readTime}</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#e4e4e7", letterSpacing: "-0.02em", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#52525b", lineHeight: 1.6 }}>
                  {article.excerpt}
                </p>
              </div>
              <span style={{ flexShrink: 0, fontSize: "1.2rem", color: "#27272a", paddingTop: "0.2rem", transition: "color 0.15s" }}>→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
