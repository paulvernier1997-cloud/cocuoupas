import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides d'Applications | Blog CocuOuPas",
  description:
    "Guides complets sur le fonctionnement de Tinder, Bumble, Hinge et les autres apps de rencontre.",
};

const articles = [
  {
    slug: "guide-complet-tinder-2025",
    title: "Guide complet Tinder 2025 : fonctionnement, algorithme et profils",
    excerpt:
      "Tout ce que vous devez savoir sur Tinder : comment les profils sont affichés, comment fonctionne le matching, et comment détecter un compte actif.",
    date: "11 mai 2025",
    readTime: "10 min",
    tag: "Tinder",
  },
  {
    slug: "bumble-vs-tinder-differences",
    title: "Bumble vs Tinder : quelles différences pour détecter un profil ?",
    excerpt:
      "Ces deux apps fonctionnent très différemment. On compare leurs mécaniques de visibilité, d'activité et les traces qu'elles laissent.",
    date: "6 mai 2025",
    readTime: "6 min",
    tag: "Bumble",
  },
  {
    slug: "hinge-guide-complet",
    title: "Hinge : le guide complet pour comprendre l'application",
    excerpt:
      "Hinge se présente comme l'app \"designed to be deleted\". En réalité, ses fonctionnalités permettent de savoir si quelqu'un est actif dessus.",
    date: "1 mai 2025",
    readTime: "7 min",
    tag: "Hinge",
  },
  {
    slug: "profil-inactif-vs-actif-rencontre",
    title: "Profil inactif vs profil actif : comment faire la différence ?",
    excerpt:
      "Un profil peut rester en ligne même sans activité récente. On explique les indicateurs qui permettent de distinguer un compte dormant d'un compte utilisé régulièrement.",
    date: "25 avril 2025",
    readTime: "5 min",
    tag: "Détection",
  },
];

export default function GuidesPage() {
  return (
    <main>
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">
          Catégorie
        </p>
        <h1
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          GUIDES<span style={{ color: "#ef4444" }}>.</span>
        </h1>
        <p className="mt-4 text-zinc-400 text-base max-w-lg leading-relaxed">
          Le fonctionnement interne de Tinder, Bumble et Hinge — pour comprendre
          ce que ces apps révèlent (ou cachent).
        </p>
      </div>

      {/* Articles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#27272a" }}>
        {articles.map((article) => (
          <div
            key={article.slug}
            style={{ background: "#09090b", padding: "2rem 0" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {article.tag}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#52525b" }}>
                    {article.date} · {article.readTime} de lecture
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  {article.title}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.6 }}>
                  {article.excerpt}
                </p>
              </div>
              <Link
                href={`/blog/guides/${article.slug}`}
                style={{
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#ef4444",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  paddingTop: "0.25rem",
                }}
              >
                Lire →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Back to blog */}
      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #27272a" }}>
        <Link
          href="/blog"
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#52525b",
            textDecoration: "none",
          }}
        >
          ← Toutes les catégories
        </Link>
      </div>
    </main>
  );
}
