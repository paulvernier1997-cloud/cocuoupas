import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | CocuOuPas — Conseils, guides et psychologie de couple",
  description:
    "Explorez nos articles sur la fidélité, les signaux d'alerte, la psychologie du couple et les guides pratiques.",
};

const categories = [
  {
    slug: "technique",
    label: "Technique & OSINT",
    sub: "Méthodes numériques",
    count: 4,
    description:
      "Comment retrouver un profil sur les apps de rencontre. Outils, méthodes OSINT et recherche inversée d'image.",
    accent: "#ef4444",
    tag: "TECH",
    articles: [
      "Comment trouver un profil Tinder sans compte",
      "OSINT : bases pour la recherche de profils",
      "Recherche inversée d'image",
    ],
  },
  {
    slug: "psychologie",
    label: "Psychologie & Couple",
    sub: "Comprendre les comportements",
    count: 4,
    description:
      "Les mécanismes psychologiques de la tromperie, les signaux d'alerte, et comment reconstruire après une trahison.",
    accent: "#f97316",
    tag: "PSYCHO",
    articles: [
      "12 signaux que votre partenaire vous trompe",
      "Psychologie du trompeur : pourquoi trompe-t-on ?",
      "Gaslighting et manipulation",
    ],
  },
  {
    slug: "guides",
    label: "Guides d'Applications",
    sub: "Fonctionnement des apps",
    count: 4,
    description:
      "Le fonctionnement interne de Tinder, Bumble et Hinge. Algorithmes, profils et ce qu'ils révèlent sur l'activité.",
    accent: "#a855f7",
    tag: "GUIDE",
    articles: [
      "Guide complet Tinder 2025",
      "Bumble vs Tinder : quelles différences ?",
      "Hinge : le guide complet",
    ],
  },
];

const featuredArticle = {
  slug: "/blog/psychologie/signes-partenaire-trompe",
  label: "Psychologie",
  accent: "#f97316",
  title: "Les 12 signaux d'alerte que votre partenaire vous trompe",
  excerpt:
    "Changements de comportement, de routine, d'humeur — certains signaux sont souvent ignorés. Voici ce que disent la psychologie et les témoignages réels.",
  date: "10 mai 2025",
  readTime: "7 min",
};

export default function BlogPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section style={{ marginBottom: "4rem" }}>
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "#ef4444",
            marginBottom: "1.25rem",
          }}
        >
          ● Le blog
        </p>
        <h1
          style={{
            fontSize: "clamp(5rem, 14vw, 10rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          BLOG
          <span style={{ color: "#ef4444" }}>.</span>
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#71717a",
            maxWidth: "440px",
            lineHeight: 1.7,
          }}
        >
          Analyses, guides et psychologie pour mieux comprendre les signaux que vous ne voulez pas ignorer.
        </p>
      </section>

      {/* ── Featured Article ── */}
      <section style={{ marginBottom: "4rem" }}>
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#52525b",
            marginBottom: "1rem",
          }}
        >
          À la une
        </p>
        <Link
          href={featuredArticle.slug}
          style={{
            display: "block",
            textDecoration: "none",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 100%)",
            border: "1px solid #27272a",
            borderRadius: "1.25rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = featuredArticle.accent;
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${featuredArticle.accent}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: featuredArticle.accent,
                border: `1px solid ${featuredArticle.accent}55`,
                padding: "3px 10px",
                borderRadius: "4px",
                background: `${featuredArticle.accent}11`,
              }}
            >
              {featuredArticle.label}
            </span>
            <span style={{ fontSize: "0.7rem", color: "#52525b" }}>
              {featuredArticle.date} · {featuredArticle.readTime} de lecture
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "1rem",
              maxWidth: "640px",
            }}
          >
            {featuredArticle.title}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#71717a", lineHeight: 1.7, maxWidth: "560px", marginBottom: "1.5rem" }}>
            {featuredArticle.excerpt}
          </p>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: featuredArticle.accent,
            }}
          >
            Lire l'article →
          </span>
        </Link>
      </section>

      {/* ── Divider ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#52525b",
            whiteSpace: "nowrap",
          }}
        >
          Catégories
        </p>
        <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
      </div>

      {/* ── Category Cards ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/${cat.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              background: "#0a0a0a",
              border: "1px solid #1f1f1f",
              borderRadius: "1.25rem",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.25s, transform 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = cat.accent + "66";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1f1f1f";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* Radial glow */}
            <div
              style={{
                position: "absolute",
                bottom: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${cat.accent}18 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Tag */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: cat.accent,
                  background: `${cat.accent}15`,
                  border: `1px solid ${cat.accent}33`,
                  padding: "4px 10px",
                  borderRadius: "4px",
                }}
              >
                {cat.tag}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "#3f3f46",
                }}
              >
                {cat.count} articles
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              {cat.label}
            </h2>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#52525b",
                marginBottom: "1rem",
              }}
            >
              {cat.sub}
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "#71717a",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
                flex: 1,
              }}
            >
              {cat.description}
            </p>

            {/* Mini article list */}
            <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
              {cat.articles.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: i < cat.articles.length - 1 ? "0.5rem" : 0,
                  }}
                >
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: cat.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", color: "#52525b", lineHeight: 1.4 }}>{a}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: cat.accent,
                }}
              >
                Voir les articles →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}