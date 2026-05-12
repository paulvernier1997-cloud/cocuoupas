"use client";

import React from "react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fff" }}>
      <div style={{ width: "100%", padding: "3rem 4rem" }}>
        <nav style={{ marginBottom: "2.5rem" }}>
          <a
            href="/"
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#52525b",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ef4444")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#52525b")}
          >
            ← Retour à l'outil
          </a>
        </nav>
        {children}
      </div>
    </div>
  );
}