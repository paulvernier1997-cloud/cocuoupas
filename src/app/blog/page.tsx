import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | CocuOuPas - Conseils, guides et psychologie de couple",
  description:
    "Explorez nos articles sur la fidélité, les signaux d'alerte, la psychologie du couple et les guides pratiques pour comprendre votre relation.",
};

const categories = [
  {
    slug: "guides",
    label: "Guides",
    emoji: "📖",
    description:
      "Des guides pratiques étape par étape pour naviguer les situations difficiles de couple.",
    color: "#ef4444",
  },
  {
    slug: "psychologie",
    label: "Psychologie",
    emoji: "🧠",
    description:
      "Comprendre les mécanismes psychologiques de la tricherie, de la jalousie et de la confiance.",
    color: "#f97316",
  },
  {
    slug: "technique",
    label: "Technique",
    emoji: "🔍",
    description:
      "Comment fonctionnent les apps de rencontre, les profils, et les outils de vérification.",
    color: "#a855f7",
  },
];

export default function BlogPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
          Le blog
        </p>
        <h1
          style={{
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          BLOG<span style={{ color: "#ef4444" }}>.</span>
        </h1>
        <p className="mt-6 text-zinc-400 text-lg max-w-xl leading-relaxed">
          Conseils, analyses et guides pour mieux comprendre votre relation et
          prendre les bonnes décisions.
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Catégories
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              style={{
                display: "block",
                border: "1px solid #27272a",
                borderRadius: "1rem",
                padding: "2rem",
                background: "#09090b",
                textDecoration: "none",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>
                {cat.emoji}
              </span>
              <h3
                style={{
                  color: cat.color,
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {cat.label}
              </h3>
              <p style={{ color: "#a1a1aa", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {cat.description}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  color: cat.color,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Voir les articles →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
