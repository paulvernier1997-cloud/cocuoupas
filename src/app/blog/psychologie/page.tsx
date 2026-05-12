import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Psychologie & Couple | Blog CocuOuPas",
  description:
    "Comprendre les comportements de tromperie, les signaux d'alerte et la psychologie du couple.",
};

const articles = [
  {
    slug: "signes-partenaire-trompe",
    title: "Les 12 signaux d'alerte que votre partenaire vous trompe",
    excerpt:
      "Changements de comportement, de routine, d'humeur — certains signaux sont souvent ignorés. Voici ce que disent la psychologie et les témoignages réels.",
    date: "10 mai 2025",
    readTime: "7 min",
    tag: "Signaux",
  },
  {
    slug: "psychologie-trompeur",
    title: "Psychologie du trompeur : pourquoi trompe-t-on ?",
    excerpt:
      "Les études montrent que la tromperie répond à des mécanismes précis. Manque d'estime de soi, opportunisme, insatisfaction — on décrypte les profils les plus courants.",
    date: "5 mai 2025",
    readTime: "9 min",
    tag: "Psychologie",
  },
  {
    slug: "gaslighting-manipulation-couple",
    title: "Gaslighting et manipulation : comment les reconnaître",
    excerpt:
      "Le gaslighting est une forme de manipulation psychologique fréquente chez les partenaires infidèles. Reconnaître ces comportements est la première étape.",
    date: "29 avril 2025",
    readTime: "6 min",
    tag: "Manipulation",
  },
  {
    slug: "reconstruire-confiance-apres-trahison",
    title: "Reconstruire la confiance après une trahison : est-ce possible ?",
    excerpt:
      "Certains couples survivent à l'infidélité, d'autres non. Ce que disent les thérapeutes de couple sur les conditions nécessaires à une vraie reconstruction.",
    date: "22 avril 2025",
    readTime: "8 min",
    tag: "Reconstruction",
  },
];

export default function PsychologiePage() {
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
          PSYCHO<span style={{ color: "#ef4444" }}>.</span>
        </h1>
        <p className="mt-4 text-zinc-400 text-base max-w-lg leading-relaxed">
          Comprendre les comportements de tromperie, les signaux d'alerte et la
          psychologie du couple.
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
                href={`/blog/psychologie/${article.slug}`}
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
