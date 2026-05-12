import Link from "next/link";

const categories = [
  { title: "Technique & OSINT", slug: "technique", desc: "Méthodes numériques pour retrouver un profil anonymement.", color: "border-red-600" },
  { title: "Psychologie & Couple", slug: "psychologie", desc: "Comprendre les comportements et les signes de tromperie.", color: "border-zinc-700" },
  { title: "Guides d'Applications", slug: "guides", desc: "Le fonctionnement interne de Tinder, Bumble et Hinge.", color: "border-zinc-800" }
];

export default function BlogHome() {
  return (
    <main>
      <h1 className="text-6xl font-black mb-2 italic tracking-tighter text-white">BLOG.</h1>
      <p className="text-zinc-500 mb-12 uppercase text-sm tracking-widest">Investigation numérique & Relations</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/blog/${cat.slug}`} className={`p-8 border-l-4 ${cat.color} bg-zinc-900/20 hover:bg-zinc-900/50 transition-all group`}>
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-red-600 transition-colors uppercase italic">{cat.title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}