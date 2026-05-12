import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technique & OSINT | Blog CocuOuPas",
  description:
    "Méthodes numériques, OSINT et outils pour retrouver un profil sur les applications de rencontre anonymement.",
};

const articles = [
  {
    slug: "comment-trouver-profil-tinder-sans-compte",
    title: "Comment trouver un profil Tinder sans avoir de compte",
    excerpt:
      "Il existe plusieurs méthodes pour vérifier la présence de quelqu'un sur Tinder sans créer de compte. On vous explique les techniques utilisées par les enquêteurs et leurs limites.",
    date: "12 mai 2025",
    readTime: "6 min",
    tag: "Tinder",
  },
  {
    slug: "osint-recherche-profil-rencontre",
    title: "OSINT : les bases pour rechercher un profil sur les apps de rencontre",
    excerpt:
      "L'OSINT (Open Source Intelligence) permet de collecter des informations publiquement disponibles. Voici comment cette discipline s'applique aux profils de rencontre.",
    date: "8 mai 2025",
    readTime: "8 min",
    tag: "OSINT",
  },
  {
    slug: "reverse-image-search-profils",
    title: "Recherche inversée d'image : retrouver un profil de rencontre",
    excerpt:
      "Google Images, TinEye, PimEyes — ces outils permettent de retrouver l'origine d'une photo. On compare leur efficacité pour détecter les profils de rencontre.",
    date: "3 mai 2025",
    readTime: "5 min",
    tag: "Outils",
  },
  {
    slug: "comment-fonctionnent-algorithmes-tinder",
    title: "Comment fonctionnent les algorithmes de Tinder en 2025",
    excerpt:
      "L'algorithme Elo de Tinder a évolué. Comprendre son fonctionnement permet de savoir pourquoi certains profils apparaissent (ou n'apparaissent pas) dans les résultats.",
    date: "28 avril 2025",
    readTime: "7 min",
    tag: "Algorithme",
  },
];

export default function TechniquePage() {
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
          TECH<span style={{ color: "#ef4444" }}>.</span>
        </h1>
        <p className="mt-4 text-zinc-400 text-base max-w-lg leading-relaxed">
          Méthodes numériques et OSINT pour retrouver un profil sur les apps de
          rencontre anonymement.
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
                href={`/blog/technique/${article.slug}`}
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
