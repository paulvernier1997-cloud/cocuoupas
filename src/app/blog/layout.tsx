import React from "react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen bg-black text-white">
      <nav className="mb-10">
        <a href="/" className="text-sm text-zinc-500 hover:text-red-500 transition-colors italic uppercase tracking-widest">
          ← Retour à l'outil
        </a>
      </nav>
      {children}
    </div>
  );
}