"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

/* ══════════════ TYPES ══════════════ */
type Screen = "HOME" | "SCAN" | "RESULT";
type Tab = "EMAIL" | "FACE" | "INSTA";
type AppStatus = "wait" | "scan" | "done";
type ScanPhase = "INIT" | "CONNECT" | "TARGET" | "TINDER" | "BUMBLE" | "HINGE" | "COMPILE" | "DONE";
type LogType = "info" | "success" | "warning" | "clean" | "section";
interface AppData { name: string; color: string; icon: string; db: string; }
interface ScanLog { time: string; text: string; type: LogType; }
interface FakeProfile { city: string; hrs: number; km: number; age: number; photos: number; bio: string; interests: string[]; }
interface IconProps { d: string | string[]; s?: number; c?: string; f?: string;[key: string]: unknown; }
type IconFn = (props?: Partial<IconProps>) => React.ReactElement;
interface InstaProfile { username: string; full_name: string; profile_pic_url: string; is_verified?: boolean; }

/* ══════════════ DATA ══════════════ */
const CITIES: string[] = ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille", "Rennes", "Grenoble"];
const APPS: AppData[] = [
  { name: "Tinder", color: "#ff6b6b", icon: "🔥", db: "2.4M" },
  { name: "Bumble", color: "#ffc53d", icon: "🐝", db: "1.8M" },
  { name: "Hinge", color: "#7c5cfc", icon: "💜", db: "920K" },
];

/* ── SVG Icon ── */
const I: React.FC<IconProps> = ({ d, s = 20, c = "currentColor", f = "none", ...p }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...(p as React.SVGProps<SVGSVGElement>)}>
    {(Array.isArray(d) ? d : [d]).map((x, i) => <path key={i} d={x} />)}
  </svg>
);
const IC: Record<string, IconFn> = {
  search: (p) => <I {...p} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />,
  camera: (p) => <I {...p} d={["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 17a4 4 0 100-8 4 4 0 000 8z"]} />,
  shield: (p) => <I {...p} d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"]} />,
  lock: (p) => <I {...p} d={["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z", "M7 11V7a5 5 0 0110 0v4"]} />,
  alert: (p) => <I {...p} d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"]} />,
  clock: (p) => <I {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 6v6l4 2"]} />,
  phone: (p) => <I {...p} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
  bellOff: (p) => <I {...p} d={["M13.73 21a2 2 0 01-3.46 0", "M18.63 13A17.89 17.89 0 0118 8", "M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14", "M18 8a6 6 0 00-9.33-5", "M1 1l22 22"]} />,
  msgLock: (p) => <I {...p} d={["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"]} />,
  chevDown: (p) => <I {...p} d="M6 9l6 6 6-6" />,
  upload: (p) => <I {...p} d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]} />,
  x: (p) => <I {...p} d={["M18 6L6 18", "M6 6l12 12"]} />,
  user: (p) => <I {...p} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"]} />,
  at: (p) => <I {...p} d={["M12 16a4 4 0 100-8 4 4 0 000 8z", "M16 12v1a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"]} />,
  terminal: (p) => <I {...p} d={["M4 17l6-6-6-6", "M12 19h8"]} />,
  image: (p) => <I {...p} d={["M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z", "M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", "M21 15l-5-5L5 21"]} />,
  mapPin: (p) => <I {...p} d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "M12 13a3 3 0 100-6 3 3 0 000 6z"]} />,
  checkCircle: (p) => <I {...p} d={["M22 11.08V12a10 10 0 11-5.93-9.14", "M22 4L12 14.01l-3-3"]} />,
  zap: (p) => <I {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" f="currentColor" />,
  download: (p) => <I {...p} d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]} />,
  arrowRight: (p) => <I {...p} d={["M5 12h14", "M12 5l7 7-7 7"]} />,
  globe: (p) => <I {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z", "M2 12h20", "M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"]} />,
  activity: (p) => <I {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  eye: (p) => <I {...p} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 15a3 3 0 100-6 3 3 0 000 6z"]} />,
  check: (p) => <I {...p} d="M20 6L9 17l-5-5" />,
  fileText: (p) => <I {...p} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} />,
  barChart: (p) => <I {...p} d={["M12 20V10", "M18 20V4", "M6 20v-4"]} />,
  star: (p) => <I {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" f="currentColor" />,
  coffee: (p) => <I {...p} d={["M18 8h1a4 4 0 010 8h-1", "M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z", "M6 1v3", "M10 1v3", "M14 1v3"]} />,
  mail: (p) => <I {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"]} />,
  hash: (p) => <I {...p} d={["M4 9h16", "M4 15h16", "M10 3L8 21", "M16 3l-2 18"]} />,
  externalLink: (p) => <I {...p} d={["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6", "M15 3h6v6", "M10 14L21 3"]} />,
};

/* ── AnimNum ── */
function AnimNum({ target, dur = 2200, suffix = "" }: { target: number; dur?: number; suffix?: string }) {
  const [v, setV] = useState(0); const ref = useRef<HTMLSpanElement>(null); const ran = useRef(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !ran.current) { ran.current = true; const t0 = performance.now(); const tick = (now: number) => { const p = Math.min((now - t0) / dur, 1); setV(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); } }, { threshold: .2 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, [target, dur]);
  return <span ref={ref}>{v.toLocaleString("fr-FR")}{suffix}</span>;
}
const Dots: React.FC = () => <span className="dots"><span>.</span><span>.</span><span>.</span></span>;

/* ═══════════ MAIN ═══════════ */
export default function CocuOuPas() {
  const [tab, setTab] = useState<Tab>("EMAIL");
  const [scanTab, setScanTab] = useState<Tab>("EMAIL");
  const [input, setInput] = useState({ email: "", phone: "" });
  const [instaQuery, setInstaQuery] = useState("");
  const [instaResults, setInstaResults] = useState<InstaProfile[]>([]);
  const [isSearchingInsta, setIsSearchingInsta] = useState(false);
  const [selectedInstaProfile, setSelectedInstaProfile] = useState<InstaProfile | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [screen, setScreen] = useState<Screen>("HOME");
  const [liveCount, setLiveCount] = useState(47);
  const [faq, setFaq] = useState<number | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [scanPhase, setScanPhase] = useState<ScanPhase>("INIT");
  const [appStatus, setAppStatus] = useState<AppStatus[]>(["wait", "wait", "wait"]);
  const [scanPct, setScanPct] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);
  const dossierRef = useRef(`COP-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);

  const fakeProfile = useMemo<FakeProfile>(() => { const city = CITIES[Math.floor(Math.random() * CITIES.length)]; return { city, hrs: Math.floor(Math.random() * 6) + 1, km: Math.floor(Math.random() * 15) + 3, age: Math.floor(Math.random() * 8) + 22, photos: Math.floor(Math.random() * 3) + 3, bio: "Aventurier·e dans l'âme | Amateur·ice de bons restos et de randonnées", interests: ["Voyages", "Cuisine", "Sport", "Cinéma", "Musique"] }; }, []);

  // Insta autocomplete (PRESERVED)
  useEffect(() => {
    if (!instaQuery.trim() || selectedInstaProfile?.username === instaQuery) { setInstaResults([]); setIsSearchingInsta(false); return; }
    const tid = setTimeout(async () => { setIsSearchingInsta(true); try { const res = await fetch(`/api/insta-search?query=${encodeURIComponent(instaQuery)}`); const data = await res.json(); if (Array.isArray(data)) setInstaResults(data.slice(0, 5)); else setInstaResults([]); } catch { setInstaResults([]); } finally { setIsSearchingInsta(false); } }, 600);
    return () => clearTimeout(tid);
  }, [instaQuery, selectedInstaProfile]);

  useEffect(() => { if (screen === "SCAN") termRef.current?.scrollIntoView({ behavior: "smooth" }); }, [scanLogs, screen]);
  useEffect(() => {
    if (screen === "SCAN" && scanPhase !== "DONE") { startTime.current = Date.now(); timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)), 200); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }
    if (scanPhase === "DONE" && timerRef.current) clearInterval(timerRef.current);
  }, [screen, scanPhase]);

  useEffect(() => { const t = setInterval(() => setLiveCount(p => Math.max(12, Math.min(38, p + (Math.random() > .5 ? 1 : -1)))), 5000); return () => clearInterval(t); }, []);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setPhotos(p => [...p, ...Array.from(e.target.files!).map(f => URL.createObjectURL(f))].slice(0, 3)); };
  const ts = (): string => new Date().toLocaleTimeString("fr-FR", { hour12: false });
  const addLog = (text: string, type: LogType = "info") => setScanLogs(p => [...p, { time: ts(), text, type }]);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const canScan = tab === "EMAIL" ? (input.email.trim() || input.phone.trim()) : tab === "FACE" ? photos.length > 0 : !!selectedInstaProfile;
  const getScanLabel = (): string => { if (scanTab === "INSTA" && selectedInstaProfile) return "@" + selectedInstaProfile.username; if (scanTab === "EMAIL") { if (input.email.trim()) return input.email; return input.phone; } return "analyse photo"; };

  /* ════════ SCAN ENGINE ════════ */
  const startScan = () => {
    if (!canScan) return;
    dossierRef.current = `COP-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setScanTab(tab); setScreen("SCAN"); setScanLogs([]); setAppStatus(["wait", "wait", "wait"]); setScanPhase("INIT"); setScanPct(0); setElapsed(0); scrollTop();
    let t = 0; const sched = (d: number, fn: () => void) => { t += d; setTimeout(fn, t); };

    sched(500, () => { setScanPhase("CONNECT"); addLog("Connexion au serveur de vérification…"); });
    sched(1200, () => { addLog("Établissement de la connexion sécurisée…"); setScanPct(3); });
    sched(1400, () => { addLog("Connexion chiffrée établie", "success"); setScanPct(6); });
    sched(1000, () => { addLog("Session anonyme initialisée", "success"); setScanPct(9); });
    sched(1200, () => { setScanPhase("TARGET"); setScanPct(11); });
    if (tab === "INSTA" && selectedInstaProfile) {
      sched(800, () => { addLog(`Récupération du profil @${selectedInstaProfile.username}…`); setScanPct(13); });
      sched(1200, () => { addLog("Informations du profil extraites", "success"); setScanPct(15); });
    } else if (tab === "EMAIL") {
      sched(800, () => { addLog("Recherche par identifiants (email / téléphone)…"); setScanPct(13); });
      sched(1200, () => { addLog("Identifiants préparés pour la recherche", "success"); setScanPct(15); });
    } else {
      sched(800, () => { addLog("Traitement de la photo uploadée…"); setScanPct(13); });
      sched(1200, () => { addLog("Caractéristiques extraites de la photo", "success"); setScanPct(15); });
    }
    sched(1500, () => { setScanPhase("TINDER"); setAppStatus(["scan", "wait", "wait"]); addLog("──── Vérification Tinder ────"); setScanPct(17); });
    sched(2000, () => { addLog("Recherche en cours sur la base Tinder France…"); setScanPct(22); });
    sched(2400, () => { addLog("Filtrage par critères de correspondance…"); setScanPct(27); });
    sched(2200, () => { addLog("218 profils analysés dans votre zone…"); setScanPct(32); });
    sched(1800, () => { addLog("Comparaison terminée", "success"); setScanPct(36); });
    sched(1000, () => { addLog("Résultat enregistré dans le rapport", "success"); setAppStatus(["done", "wait", "wait"]); setScanPct(38); });
    sched(1500, () => { setScanPhase("BUMBLE"); setAppStatus(prev => [prev[0], "scan", prev[2]]); addLog("──── Vérification Bumble ────"); setScanPct(42); });
    sched(2000, () => { addLog("Recherche en cours sur la base Bumble France…"); setScanPct(47); });
    sched(2200, () => { addLog("Filtrage par critères de correspondance…"); setScanPct(52); });
    sched(1800, () => { addLog("147 profils analysés dans votre zone…"); setScanPct(57); });
    sched(1600, () => { addLog("Comparaison terminée", "success"); setScanPct(60); });
    sched(1000, () => { addLog("Résultat enregistré dans le rapport", "success"); setAppStatus(prev => [prev[0], "done", prev[2]]); setScanPct(63); });
    sched(1500, () => { setScanPhase("HINGE"); setAppStatus(prev => [prev[0], prev[1], "scan"]); addLog("──── Vérification Hinge ────"); setScanPct(67); });
    sched(2000, () => { addLog("Recherche en cours sur la base Hinge France…"); setScanPct(72); });
    sched(2200, () => { addLog("Filtrage par critères de correspondance…"); setScanPct(77); });
    sched(1800, () => { addLog("89 profils analysés dans votre zone…"); setScanPct(82); });
    sched(1600, () => { addLog("Comparaison terminée", "success"); setScanPct(85); });
    sched(1000, () => { addLog("Résultat enregistré dans le rapport", "success"); setAppStatus(prev => [prev[0], prev[1], "done"]); setScanPct(88); });
    sched(1200, () => { setScanPhase("COMPILE"); addLog("──── Génération du rapport ────"); setScanPct(90); });
    sched(1400, () => { addLog("Compilation des résultats des 3 plateformes…"); setScanPct(93); });
    sched(1200, () => { addLog("Chiffrement du rapport…"); setScanPct(96); });
    sched(1000, () => { addLog(`Rapport généré — Réf. ${dossierRef.current}`, "success"); setScanPct(100); });
    sched(600, () => { addLog("Nettoyage de la session…", "success"); setScanPhase("DONE"); });
    sched(2500, () => { setScreen("RESULT"); });
  };

  /* ════════ CONTENT DATA ════════ */
  const faqs = [
    { q: "Est-ce légal ?", a: "La vérification de profils publics sur des plateformes de rencontre est légale. Nous n'accédons à aucune donnée privée — nous consultons uniquement les informations que les utilisateurs de ces plateformes ont choisi de rendre accessibles. Notre service est conforme au RGPD et au droit français." },
    { q: "Comment ça marche techniquement ?", a: "Notre système croise les informations que vous fournissez (email, téléphone ou photo) avec les profils publiquement accessibles sur Tinder, Bumble et Hinge. Nous utilisons les mêmes mécanismes de recherche que ces plateformes mettent à disposition de leurs utilisateurs." },
    { q: "Pourquoi faire confiance à CocuOuPas ?", a: "Plus de 84 000 vérifications réalisées depuis notre lancement. Les paiements sont sécurisés par Stripe, le leader mondial du paiement en ligne. Toutes les données sont chiffrées en AES-256 et purgées sous 48h. Si notre système ne parvient pas à générer votre rapport, vous êtes remboursé automatiquement." },
    { q: "La personne recherchée sera-t-elle notifiée ?", a: "Non, jamais. Notre processus de vérification est entièrement passif. Aucune interaction n'est effectuée avec le profil recherché, aucune notification n'est envoyée, aucune trace n'est laissée." },
    { q: "Qu'apparaît sur mon relevé bancaire ?", a: "Un libellé neutre « TS-DIGITAL » ou « WEB-SERVICES ». Le nom CocuOuPas n'apparaît sur aucun document bancaire. Votre démarche reste entièrement confidentielle." },
    { q: "Quelle différence entre Standard et Intégral ?", a: "Le rapport Standard vous indique si un profil existe ou non sur chaque plateforme, avec le nom, l'âge et la période d'activité. L'Intégral ajoute les captures d'écran complètes, la bio, les centres d'intérêt, la distance approximative et un rapport PDF téléchargeable avec référence unique." },
    { q: "Et si aucun profil n'est trouvé ?", a: "Vous recevez un rapport confirmant l'absence de profil actif sur les 3 plateformes vérifiées. C'est d'ailleurs le résultat le plus fréquent — et souvent une source de soulagement pour nos utilisateurs." },
    { q: "Puis-je être remboursé ?", a: "Si notre système rencontre une erreur technique empêchant la génération du rapport, vous êtes remboursé automatiquement sous 24h, sans aucune démarche de votre part." },
  ];

  const testimonials = [
    { name: "Marine L.", city: "Lyon", text: "J'avais des doutes depuis quelques mois, j'ai tenté. Le rapport était clair, j'ai eu ma réponse. C'est pas facile mais au moins on sait.", stars: 5, date: "il y a 3 jours" },
    { name: "Thomas R.", city: "Paris", text: "Sceptique au début, je pensais que c'était du vent. Le rapport était sérieux et détaillé. Ça m'a permis de voir les choses clairement.", stars: 5, date: "il y a 1 semaine" },
    { name: "Sophie M.", city: "Bordeaux", text: "Rien trouvé, ouf. J'aurais préféré ne pas avoir à vérifier mais bon, 4€ pour retrouver la tranquillité c'est correct.", stars: 4, date: "il y a 5 jours" },
    { name: "Julien K.", city: "Lille", text: "Le rapport intégral est vraiment complet. Screenshots, bio, tout y est. J'ai pu prendre une décision en connaissance de cause.", stars: 5, date: "il y a 2 jours" },
    { name: "Camille D.", city: "Marseille", text: "Rapide et discret. Pas de profil trouvé pour mon copain. Ça m'a rassurée même si j'me sens un peu coupable d'avoir vérifié haha", stars: 4, date: "il y a 4 jours" },
    { name: "Nicolas F.", city: "Toulouse", text: "Le service fait ce qu'il promet, ni plus ni moins. Résultats clairs par application. J'recommande.", stars: 5, date: "il y a 6 jours" },
  ];

  const formatTime = (s: number): string => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{--bg:#050505;--s1:#0a0a0a;--s2:#0f0f0f;--s3:#161616;--bd:rgba(255,255,255,.06);--bd2:rgba(255,255,255,.1);--red:#dc2626;--red-d:#7f1d1d;--red-l:#fca5a5;--gold:#f59e0b;--gold-l:#fbbf24;--green:#22c55e;--blue:#3b82f6;--purple:#8b5cf6;--t1:#fff;--t2:rgba(255,255,255,.55);--t3:rgba(255,255,255,.25);--t4:rgba(255,255,255,.08)}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--t1);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}::selection{background:rgba(220,38,38,.2)}
a{color:inherit;text-decoration:none}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
@keyframes progressStripe{0%{background-position:0 0}100%{background-position:40px 0}}
@keyframes dotPulse{0%,80%,100%{opacity:.2}40%{opacity:1}}
@keyframes scanLine{0%,100%{top:0%}50%{top:92%}}
@keyframes gridPulse{0%,100%{opacity:.12}50%{opacity:.3}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.fu{animation:fadeUp .5s ease both}.fi{animation:fadeIn .4s ease both}
.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}.d4{animation-delay:.24s}
.term::-webkit-scrollbar{width:3px}.term::-webkit-scrollbar-track{background:transparent}.term::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}
.log-info{color:#a7b4a0}.log-success{color:#4ade80;font-weight:600}.log-warning{color:#fbbf24;font-weight:600}.log-clean{color:rgba(255,255,255,.3);font-style:italic}.log-section{color:rgba(255,255,255,.15);font-weight:600;letter-spacing:.04em}
.bp{background:linear-gradient(135deg,#991b1b,#450a0a);color:#fff;border:none;cursor:pointer;font-weight:700;transition:all .15s}.bp:hover{filter:brightness(1.2);transform:translateY(-1px)}.bp:active{transform:scale(.97)}
.bg{background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;border:none;cursor:pointer;font-weight:700;transition:all .15s}.bg:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 16px 48px -8px rgba(245,158,11,.3)}.bg:active{transform:scale(.97)}
.bdark{background:#1f1f1f;color:#fff;border:none;cursor:pointer;font-weight:700;transition:all .15s}.bdark:hover{background:#2a2a2a;transform:translateY(-1px)}.bdark:active{transform:scale(.97)}
.bo{background:none;color:#fff;border:2px solid var(--bd2);cursor:pointer;font-weight:700;transition:all .15s}.bo:hover{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.03)}
input:focus{outline:none;border-color:#ccc!important;background:#fff!important}
.noise::before{content:'';position:fixed;inset:0;opacity:.012;pointer-events:none;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.progress-bar{background-size:40px 40px;background-image:repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(255,255,255,.03) 8px,rgba(255,255,255,.03) 16px);animation:progressStripe 1s linear infinite}
.dots span{display:inline-block;animation:dotPulse 1.4s infinite}.dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
.ch{transition:all .25s}.ch:hover{border-color:rgba(255,255,255,.12)!important;transform:translateY(-2px)}
.btn-disabled{background:#e5e5e5!important;color:#999!important;cursor:not-allowed!important;border:none!important}.btn-disabled:hover{filter:none!important;transform:none!important}
.insta-ring{position:absolute;inset:-4px;border-radius:18px;border:2px solid transparent;background:conic-gradient(from 0deg,transparent 0%,rgba(139,92,246,.5) 30%,transparent 60%) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 2.5s linear infinite}
.insta-overlay{position:absolute;inset:0;background:rgba(139,92,246,.08);animation:pulseOverlay 2s ease infinite}
@keyframes pulseOverlay{0%,100%{opacity:.08}50%{opacity:.2}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 15px -5px var(--gc)}50%{box-shadow:0 0 25px -3px var(--gc)}}
.tier-pop{position:relative;border:2px solid var(--gold)!important;box-shadow:0 0 40px -10px rgba(245,158,11,.15)}
.mq{display:flex;animation:marquee 40s linear infinite}
  `;

  const SH: React.FC<{ title: string; sub?: string; tag?: string }> = ({ title, sub, tag }) => (<div style={{ textAlign: "center", marginBottom: 52 }}>{tag && <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--red)", marginBottom: 14 }}>{tag}</p>}<h2 style={{ fontSize: "clamp(24px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-.04em", marginBottom: sub ? 12 : 0, lineHeight: 1.05 }}>{title}</h2>{sub && <p style={{ color: "var(--t3)", fontSize: 14, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}</div>);

  return (
    <div className="noise" style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{css}</style>

      {/* MARQUEE */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "#000", borderBottom: "1px solid var(--bd)", padding: "9px 0", overflow: "hidden" }}><div className="mq" style={{ gap: 48, whiteSpace: "nowrap", fontSize: 11, fontWeight: 600, color: "var(--t3)" }}>{[...Array(8)].map((_, i) => (<span key={i} style={{ display: "flex", alignItems: "center", gap: 32, flexShrink: 0 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} /><span style={{ color: "var(--t2)" }}>{liveCount} vérifications en cours</span></span><span style={{ color: "var(--t3)" }}>Tinder · Bumble · Hinge</span><span style={{ color: "var(--t2)" }}>La vérité pour le prix d&apos;un café</span></span>))}</div></div>

      {/* ══════════════ HOME ══════════════ */}
      {screen === "HOME" && (
        <div className="fi">
          <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ background: "var(--red)", padding: "5px 9px", borderRadius: 8, fontWeight: 800, fontStyle: "italic", fontSize: 18 }}>C<span style={{ color: "var(--gold)" }}>O</span>P</div><span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.02em" }}>CocuOuPas<span style={{ color: "var(--red)" }}>.fr</span></span></div><div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 600, color: "var(--t3)" }}><a href="#methode">Méthode</a><a href="#avis">Avis</a><a href="#faq">FAQ</a></div><div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,.06)", padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.12)" }}>{IC.lock({ s: 11, c: "#22c55e" })}<span style={{ fontSize: 9, fontWeight: 700, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase" }}>Chiffré</span></div></div></nav>

          {/* ════ HERO ════ */}
          <section className="fu" style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", padding: "56px 20px 60px", position: "relative" }}>
            <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle,rgba(220,38,38,.04) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div className="fu" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '4px 14px 4px 4px', marginBottom: 28, gap: 10, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex' }}>{['M', 'T', 'S', 'J'].map((l, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, marginLeft: i === 0 ? 0 : -6, border: '2px solid var(--bg)', color: '#fff' }}>{l}</div>)}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>84 712 investigations · <span style={{ color: 'var(--gold)' }}>4.8★</span></span>
            </div>
            <h1 className="fu d1" style={{ fontSize: "clamp(38px,7vw,84px)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: .92, marginBottom: 24 }}>La vérité,<br /><span style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pour le prix d&apos;un café.</span></h1>
            <p className="fu d2" style={{ maxWidth: 540, margin: "0 auto 32px", color: "var(--t2)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.65 }}>Votre partenaire est-il inscrit(e) sur Tinder, Bumble ou Hinge ?<br />Lancez une recherche 100% anonyme et obtenez un rapport<br />d&apos;investigation complet en 60 secondes.</p>
            <div className="fu d3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.05)', fontSize: 11, fontWeight: 700, color: '#aaa' }}>{IC.shield({ s: 14, c: "#22c55e" })} Anonyme & intraçable</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.05)', fontSize: 11, fontWeight: 700, color: '#aaa' }}>{IC.zap({ s: 14, c: "#f59e0b" })} Résultat en 60 sec</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(59,130,246,0.15)', background: 'rgba(59,130,246,0.05)', fontSize: 11, fontWeight: 700, color: '#aaa' }}>{IC.lock({ s: 14, c: "#3b82f6" })} Paiement 100% discret</div>
            </div>

            {/* ════ SEARCH CARD ════ */}
            <div className="fu d4" style={{ background: "#fff", borderRadius: 24, maxWidth: 740, margin: "0 auto", overflow: "hidden", boxShadow: "0 40px 100px -25px rgba(255,255,255,.1)" }}>
              <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0" }}>{[{ id: "EMAIL" as Tab, label: "Email / Téléphone", emoji: "✉️", activeColor: "var(--red)" }, { id: "FACE" as Tab, label: "Par photo", emoji: "📸", activeColor: "var(--blue)" }, { id: "INSTA" as Tab, label: "@ Instagram", emoji: "📱", activeColor: "var(--purple)" }].map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: tab === t.id ? "#fff" : "#fafafa", color: tab === t.id ? "#111" : "#999", borderBottom: tab === t.id ? `3px solid ${t.activeColor}` : "3px solid transparent", transition: "all .2s" }}><span style={{ fontSize: 16 }}>{t.emoji}</span> {t.label}</button>))}</div>
              <div style={{ padding: "32px 36px 28px", color: "#111", minHeight: 200 }}>
                {tab === "EMAIL" && (<div style={{ display: "flex", flexDirection: "column", gap: 12 }}><div style={{ position: "relative" }}><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: 'rgba(220,38,38,0.1)', color: 'var(--red)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IC.mail({ s: 16 })}</div><input value={input.email} onChange={e => setInput({ ...input, email: e.target.value })} placeholder="Adresse email du / de la partenaire" style={{ width: "100%", padding: "16px 16px 16px 56px", borderRadius: 12, border: "2px solid #eaeaea", fontSize: 15, fontWeight: 600, background: "#fafafa", color: "#111", transition: "all .15s" }} /><div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: '#ccc' }}>{IC.check({ s: 18 })}</div></div><div style={{ display: "flex", alignItems: "center", gap: 16, margin: "4px 0" }}><div style={{ flex: 1, height: 1, background: "#eee" }} /><span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>et / ou</span><div style={{ flex: 1, height: 1, background: "#eee" }} /></div><div style={{ position: "relative" }}><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IC.phone({ s: 16 })}</div><input value={input.phone} onChange={e => setInput({ ...input, phone: e.target.value })} placeholder="Numéro de téléphone (ex: 06 12 34 56 78)" style={{ width: "100%", padding: "16px 16px 16px 56px", borderRadius: 12, border: "2px solid #eaeaea", fontSize: 15, fontWeight: 600, background: "#fafafa", color: "#111", transition: "all .15s" }} /><div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: '#ccc' }}>{IC.check({ s: 18 })}</div></div><p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 6 }}>Les apps de rencontre utilisent ces identifiants pour créer un compte.</p></div>)}
                {tab === "FACE" && (<div><input type="file" multiple accept="image/*" id="face-upload" onChange={onUpload} disabled={photos.length >= 3} style={{ display: "none" }} /><label htmlFor="face-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "40px 20px", border: "2px dashed #d0d0d0", borderRadius: 16, background: "#fafafa", cursor: "pointer" }}><div style={{ background: "#fff", padding: 12, borderRadius: "50%", boxShadow: "0 4px 12px rgba(59,130,246,0.15)", color: "var(--blue)" }}>{IC.upload({ s: 24 })}</div><p style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>Uploadez 1 à 3 photos nettes du visage</p><p style={{ fontSize: 12, color: "#aaa" }}>JPG, PNG — Max 5 Mo</p></label>{photos.length > 0 && (<div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>{photos.map((p, i) => (<div key={i} style={{ position: "relative", width: 64, height: 64, borderRadius: 12, overflow: "hidden", border: "2px solid #e5e5e5", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}><img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><button onClick={() => setPhotos(x => x.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.7)", border: "none", borderRadius: "50%", padding: 3, cursor: "pointer", display: "flex" }}>{IC.x({ s: 10, c: "#fff" })}</button></div>))}</div>)}</div>)}
                {tab === "INSTA" && (<div style={{ display: "flex", flexDirection: "column", gap: 12 }}><div style={{ position: "relative" }}><div style={{ position: "relative", zIndex: 10 }}><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: 'rgba(139,92,246,0.1)', color: 'var(--purple)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IC.at({ s: 16 })}</div><input value={instaQuery} onChange={e => { setInstaQuery(e.target.value); if (selectedInstaProfile) setSelectedInstaProfile(null); }} placeholder="Rechercher un compte Instagram…" style={{ width: "100%", padding: "16px 16px 16px 56px", borderRadius: 12, border: "2px solid #eaeaea", fontSize: 15, fontWeight: 600, background: "#fafafa", color: "#111", transition: "all .2s" }} />{isSearchingInsta && (<div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}><div style={{ width: 18, height: 18, border: "2px solid #eee", borderTopColor: "var(--purple)", borderRadius: "50%", animation: "spin .7s linear infinite" }} /></div>)}</div>{instaResults.length > 0 && !selectedInstaProfile && (<div className="fi" style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 14, marginTop: 8, boxShadow: "0 14px 40px rgba(0,0,0,.15)", border: "1px solid #eaeaea", zIndex: 50, overflow: "hidden" }}>{instaResults.map((prof, i) => (<div key={i} onClick={() => { setSelectedInstaProfile(prof); setInstaQuery(prof.username); setInstaResults([]); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer", borderBottom: i === instaResults.length - 1 ? "none" : "1px solid #f5f5f5", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{prof.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(prof.profile_pic_url)}`} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }} />) : (<div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 20, c: "#999" })}</div>)}<div><p style={{ fontSize: 14, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>{prof.username}{prof.is_verified && <span style={{ color: "#3b82f6", fontSize: 12 }}>✓</span>}</p><p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{prof.full_name}</p></div></div>))}</div>)}{selectedInstaProfile && (<div className="fi" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, background: "rgba(139,92,246,.06)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 12, padding: "14px 16px" }}>{selectedInstaProfile.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(selectedInstaProfile.profile_pic_url)}`} alt="" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,.08)" }} />) : (<div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", border: "2px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 24, c: "#aaa" })}</div>)}<div style={{ flex: 1 }}><p style={{ fontSize: 10, fontWeight: 800, color: "var(--purple)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Profil sélectionné</p><p style={{ fontSize: 15, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>@{selectedInstaProfile.username}{selectedInstaProfile.is_verified && <span style={{ color: "#3b82f6", fontSize: 12 }}>✓</span>}</p></div><div style={{ color: "var(--purple)" }}>{IC.checkCircle({ s: 24 })}</div></div>)}</div></div>)}
                <button onClick={startScan} disabled={!canScan} className={!canScan ? "btn-disabled" : "bdark"} style={{ width: "100%", padding: "18px", borderRadius: 12, fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .3s" }}>{canScan ? "Lancer la vérification" : "Renseignez les informations ci-dessus"} {canScan && IC.arrowRight({ s: 18 })}</button>
                <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{IC.lock({ s: 12, c: '#aaa' })} Recherche anonyme - Aucune notification envoyée</p>
              </div>
            </div>
          </section>

          {/* ════ SOURCED STATS ════ */}
          <section style={{ padding: "20px 20px 40px", position: "relative", zIndex: 10 }}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, textAlign: "center", marginBottom: 60 }}>
              {[{ val: "32%", desc: "des Français en couple ont déjà utilisé une app de rencontre", src: "IFOP 2024", c: "#3b82f6" }, { val: "2,4M", desc: "de profils actifs sur les apps de dating en France", src: "ESTIMATION MARCHÉ 2025", c: "#dc2626" }, { val: "63%", desc: "des utilisateurs de Tinder déclarent être en couple", src: "ÉTUDE BVA", c: "#f59e0b" }].map((s, i) => (<div key={i} style={{ padding: "8px 12px" }}><p style={{ fontSize: 34, fontWeight: 800, color: "var(--t1)", letterSpacing: "-.03em", marginBottom: 12, textShadow: `0 0 30px ${s.c}50` }}>{s.val}</p><p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.6, marginBottom: 12, maxWidth: 220, margin: "0 auto 12px" }}>{s.desc}</p><p style={{ fontSize: 9, color: "var(--t4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.src}</p></div>))}
            </div>
            <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[{ val: 84200, label: "VÉRIFICATIONS", icon: IC.search, suffix: "+", c: "#3b82f6" }, { val: 9400, label: "PROFILS IDENTIFIÉS", icon: IC.alert, suffix: "+", c: "#ef4444" }, { val: 47, label: "TEMPS MOYEN", icon: IC.clock, suffix: " sec", c: "#f59e0b" }, { val: 4.7, label: "SATISFACTION", icon: IC.star, suffix: "/5", c: "#22c55e" }].map((s, i) => (<div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 16, padding: "28px 20px", border: `1px solid ${s.c}25`, textAlign: "center", position: "relative", overflow: "hidden", boxShadow: `0 8px 30px ${s.c}08` }}><div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 100, height: 100, background: `radial-gradient(circle, ${s.c}20 0%, transparent 70%)`, pointerEvents: "none" }} /><div style={{ color: s.c, marginBottom: 14, display: "flex", justifyContent: "center", opacity: 0.9 }}>{s.icon({ s: 22 })}</div><p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.04em" }}>{typeof s.val === "number" && s.val > 100 ? <AnimNum target={s.val} /> : s.val}{s.suffix}</p><p style={{ fontSize: 9, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 8 }}>{s.label}</p></div>))}
            </div>
          </section>

          {/* ════ SYMPTOMS ════ */}
          <section style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}>
            <SH title="Vous reconnaissez ces signes ?" sub="Si l'un de ces comportements vous parle, vous méritez une réponse claire." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
              {[{ icon: IC.phone, title: "Téléphone verrouillé", desc: "Toujours face retournée. Code modifié récemment sans explication." }, { icon: IC.msgLock, title: "Conversations effacées", desc: "Historique trop propre. Des applications supprimées discrètement." }, { icon: IC.bellOff, title: "Notifications coupées", desc: "Alertes désactivées. L'écran ne s'allume plus en votre présence." }, { icon: IC.clock, title: "Absences inexpliquées", desc: "Des « réunions » de plus en plus fréquentes et difficiles à vérifier." }].map((s, i) => (
                <div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 20, padding: "30px 24px", border: "1px solid var(--bd)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><div style={{ color: "var(--red)" }}>{s.icon({ s: 18 })}</div></div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}><button onClick={scrollTop} className="bp" style={{ padding: "14px 36px", borderRadius: 12, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>Vérifier maintenant {IC.arrowRight({ s: 16 })}</button></div>
          </section>

          {/* ════ HOW IT WORKS ════ */}
          <section id="methode" style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}>
            <SH tag="Comment ça marche" title="Trois étapes simples" sub="Notre système vérifie la présence d'un profil sur les 3 principales apps de rencontre en France." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
              {[{ n: "01", title: "Fournissez une information", desc: "Email, numéro de téléphone, pseudo Instagram ou photo. Une seule information suffit pour lancer la vérification.", icon: IC.user }, { n: "02", title: "Vérification automatique", desc: "Notre système recherche la présence d'un profil correspondant sur Tinder, Bumble et Hinge. Processus 100% anonyme.", icon: IC.globe }, { n: "03", title: "Consultez votre rapport", desc: "Résultat clair par application. Si un profil existe : aperçu, bio et informations publiques disponibles dans votre rapport.", icon: IC.fileText }].map((h, i) => (
                <div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 22, padding: "38px 26px", border: "1px solid var(--bd)", position: "relative" }}>
                  <span style={{ position: "absolute", top: -13, left: 20, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 13, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(220,38,38,.4)" }}>{h.n}</span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, marginTop: 4 }}><h3 style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", maxWidth: "80%" }}>{h.title}</h3><div style={{ color: "var(--t4)" }}>{h.icon({ s: 20 })}</div></div>
                  <p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.7 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ════ TESTIMONIALS ════ */}
          <section id="avis" style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}>
            <SH tag="Avis" title="Ce qu&apos;en pensent nos utilisateurs" sub="Plus de 84 000 vérifications réalisées. Note moyenne : 4.7/5." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--bd)" }}>
                  <div style={{ display: "flex", gap: 1, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <span key={j} style={{ color: j < t.stars ? "var(--gold)" : "var(--t4)", fontSize: 13 }}>★</span>)}
                  </div>
                  <p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.65, marginBottom: 18 }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--s3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "var(--t2)" }}>{t.name[0]}</div>
                      <div><p style={{ fontWeight: 700, fontSize: 12 }}>{t.name}</p><p style={{ fontSize: 10, color: "var(--t3)" }}>{t.city}</p></div>
                    </div>
                    <span style={{ fontSize: 10, color: "var(--t4)" }}>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════ COMPARE ════ */}
          <section style={{ padding: "84px 20px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}>
            <div style={{ maxWidth: 1060, margin: "0 auto" }}>
              <SH tag="Comparatif" title="Un service accessible à tous" />
              <div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 18, overflow: "hidden", border: "1px solid var(--bd)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "var(--s2)", padding: "14px 22px", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--t3)", borderBottom: "1px solid var(--bd)" }}><span /><span style={{ textAlign: "center" }}>Détective privé</span><span style={{ textAlign: "center", color: "var(--red)" }}>CocuOuPas</span></div>
                {[{ l: "Délai", a: "7–15 jours", b: "≈ 60 sec" }, { l: "Tarif", a: "800–2 000€", b: "À partir de 3,99€" }, { l: "Anonymat", a: "Variable", b: "Garanti" }, { l: "Format", a: "Rapport oral", b: "Rapport numérique" }, { l: "Disponibilité", a: "Heures bureau", b: "24/7" }].map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 22px", borderBottom: "1px solid var(--bd)", fontSize: 12, alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "var(--t2)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".03em" }}>{r.l}</span>
                    <span style={{ textAlign: "center", color: "var(--t3)" }}>{r.a}</span>
                    <span style={{ textAlign: "center", color: "var(--green)", fontWeight: 700 }}>{r.b}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ SECURITY ════ */}
          <section style={{ padding: "64px 20px", maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, textAlign: "center" }}>
              {[{ icon: IC.shield, title: "Recherche anonyme", desc: "Aucune interaction avec le profil recherché. Aucune notification envoyée, aucune trace laissée.", color: "var(--green)" }, { icon: IC.lock, title: "Données chiffrées", desc: "Rapport chiffré de bout en bout (AES-256). Accessible via un lien unique et temporaire.", color: "var(--blue)" }, { icon: IC.eye, title: "Rien n'est conservé", desc: "Toutes les données sont supprimées sous 48h. Service conforme au RGPD.", color: "var(--purple)" }].map((s, i) => (
                <div key={i} style={{ padding: "32px 24px", background: "var(--s1)", borderRadius: 20, border: "1px solid var(--bd)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}08`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><div style={{ color: s.color }}>{s.icon({ s: 22 })}</div></div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: "var(--t3)", fontSize: 12, lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ════ FAQ ════ */}
          <section id="faq" style={{ padding: "84px 20px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}>
            <div style={{ maxWidth: 1060, margin: "0 auto" }}>
              <SH tag="FAQ" title="Questions fréquentes" />
              <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {faqs.map((f, i) => (
                  <div key={i} style={{ borderRadius: 14, border: "1px solid var(--bd)", background: "var(--s2)", overflow: "hidden" }}>
                    <button onClick={() => setFaq(faq === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 700 }}>
                      <span>{f.q}</span><span style={{ transform: faq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s", flexShrink: 0, marginLeft: 12, color: "var(--red)" }}>{IC.chevDown({ s: 16 })}</span>
                    </button>
                    <div style={{ maxHeight: faq === i ? 300 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
                      <p style={{ padding: "0 18px 16px", color: "var(--t2)", fontSize: 13, lineHeight: 1.65 }}>{f.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ CTA ════ */}
          <section style={{ padding: "84px 20px", maxWidth: 580, margin: "0 auto" }}>
            <div style={{ background: "linear-gradient(135deg,#1a0000,#200000,#1a0a00)", borderRadius: 28, padding: 2 }}>
              <div style={{ background: "var(--bg)", borderRadius: 26, padding: "56px 36px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>{IC.coffee({ s: 28, c: "var(--gold)" })}</div>
                <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>La vérité pour le prix d&apos;un café.</h2>
                <p style={{ fontSize: 13, color: "var(--t3)", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>Un espresso coûte 3,90€. Une vérification complète sur 3 applications, à partir de 3,99€.</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
                  <span style={{ fontSize: "clamp(42px,10vw,64px)", fontWeight: 800, letterSpacing: "-.04em", background: "linear-gradient(135deg,var(--gold-l),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3,99€</span>
                </div>
                <button onClick={scrollTop} className="bg" style={{ width: "100%", padding: "18px", borderRadius: 16, fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".03em" }}>Lancer une vérification</button>
                <p style={{ fontSize: 10, color: "var(--t3)", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{IC.shield({ s: 11, c: "var(--t3)" })} Paiement Stripe · Libellé neutre sur relevé</p>
              </div>
            </div>
          </section>

          {/* ════ FOOTER ════ */}
          <footer style={{ borderTop: "1px solid var(--bd)", padding: "44px 20px 28px", maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
              <div style={{ maxWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ background: "var(--red)", padding: "4px 7px", borderRadius: 6, fontWeight: 800, fontStyle: "italic", fontSize: 14 }}>C<span style={{ color: "var(--gold)" }}>O</span>P</div><span style={{ fontWeight: 700, fontSize: 13 }}>CocuOuPas.fr</span></div>
                <p style={{ fontSize: 11, color: "var(--t3)", lineHeight: 1.7 }}>Service de vérification confidentiel. Nous aidons les personnes à obtenir des réponses claires sur leur relation.</p>
              </div>
              <div style={{ display: "flex", gap: 48 }}>
                {[{ t: "Légal", items: ["Mentions légales", "CGV / CGU", "Confidentialité", "Cookies"] }, { t: "Support", items: ["Aide", "Remboursements", "Contact"] }].map((c, i) => (
                  <div key={i}><p style={{ fontSize: 9, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{c.t}</p>{c.items.map(l => <p key={l} style={{ fontSize: 11, color: "var(--t3)", marginBottom: 8, cursor: "pointer" }}>{l}</p>)}</div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--bd)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".08em", textTransform: "uppercase" }}>© 2026 TS Digital SAS — CocuOuPas.fr</p>
              <div style={{ display: "flex", gap: 14, fontSize: 10, color: "var(--t3)" }}><span>🇫🇷 France</span><span style={{ color: "var(--t4)" }}>·</span><span>RGPD</span><span style={{ color: "var(--t4)" }}>·</span><span>SSL</span><span style={{ color: "var(--t4)" }}>·</span><span>Stripe</span></div>
            </div>
          </footer>
        </div>
      )}


      {/* ══════════════ SCAN ══════════════ */}
      {screen === "SCAN" && (
        <div className="fi" style={{ minHeight: "100vh", padding: "68px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 720 }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontSize: 11, fontWeight: 700, color: "var(--red)" }}><span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />Vérification en cours — {formatTime(elapsed)}</div>
              <h2 style={{ fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 6 }}>Vérification de <span style={{ color: "var(--red)" }}>{getScanLabel()}</span></h2>
              <p style={{ fontSize: 13, color: "var(--t3)" }}>Analyse de 3 plateformes — Ne fermez pas cette page</p>
            </div>

            {/* Context card */}
            {scanTab === "INSTA" && selectedInstaProfile ? (
              <div className="fu" style={{ background: "var(--s1)", borderRadius: 18, border: "1px solid rgba(139,92,246,.15)", padding: "18px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "relative", width: 72, height: 72, borderRadius: 14, overflow: "visible", flexShrink: 0 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden" }}>
                    {selectedInstaProfile.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(selectedInstaProfile.profile_pic_url)}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<div style={{ width: "100%", height: "100%", background: "var(--s2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 28, c: "var(--t3)" })}</div>)}
                    {scanPhase !== "DONE" && <div className="insta-overlay" />}
                  </div>
                  {scanPhase !== "DONE" && <div className="insta-ring" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--purple)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>{scanPhase !== "DONE" && <span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--purple)", display: "inline-block" }} />}{scanPhase === "DONE" ? "Profil analysé" : "Recherche en cours"}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>@{selectedInstaProfile.username}</p>
                  {selectedInstaProfile.full_name && <p style={{ fontSize: 12, color: "var(--t3)" }}>{selectedInstaProfile.full_name}</p>}
                </div>
                {scanPhase === "DONE" && <div style={{ color: "var(--green)" }}>{IC.checkCircle({ s: 22 })}</div>}
              </div>
            ) : (
              <div className="fu" style={{ background: "var(--s1)", borderRadius: 14, border: "1px solid var(--bd)", padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: scanTab === "EMAIL" ? "rgba(220,38,38,.08)" : "rgba(59,130,246,.08)", border: `1px solid ${scanTab === "EMAIL" ? "rgba(220,38,38,.12)" : "rgba(59,130,246,.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {scanTab === "EMAIL" ? IC.mail({ s: 18, c: "var(--red)" }) : IC.camera({ s: 18, c: "var(--blue)" })}
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--t3)", marginBottom: 2 }}>{scanTab === "EMAIL" ? "Recherche par identifiants" : "Recherche par photo"}</p>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{getScanLabel()}</p>
                </div>
              </div>
            )}

            {/* App cards — dramatic state transitions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
              {APPS.map((app, i) => {
                const st = appStatus[i]; const isActive = st === "scan"; const isDone = st === "done";
                return (
                  <div key={i} style={{
                    background: isActive ? `linear-gradient(180deg, ${app.color}0a, var(--s1))` : "var(--s1)",
                    borderRadius: 18, padding: "26px 14px", textAlign: "center", transition: "all .5s ease",
                    opacity: st === "wait" ? .3 : 1,
                    border: `1px solid ${isActive ? `${app.color}35` : isDone ? `${app.color}18` : "var(--bd)"}`,
                    boxShadow: isActive ? `0 8px 32px -8px ${app.color}30` : isDone ? `0 4px 16px -6px ${app.color}15` : "none",
                    position: "relative", overflow: "hidden", transform: isActive ? "scale(1.03)" : "scale(1)"
                  }}>
                    {isActive && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent 20%,${app.color},transparent 80%)` }} />}
                    <span style={{ fontSize: 32, display: "block", marginBottom: 10, filter: st === "wait" ? "grayscale(1) opacity(.35)" : "none", transition: "filter .5s" }}>{app.icon}</span>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{app.name}</p>
                    {st === "wait" && <p style={{ fontSize: 11, color: "var(--t4)" }}>En attente<Dots /></p>}
                    {st === "scan" && (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${app.color}12`, padding: "6px 14px", borderRadius: 8 }}>
                        <div style={{ width: 14, height: 14, border: `2px solid ${app.color}40`, borderTopColor: app.color, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                        <span style={{ fontSize: 11, color: app.color, fontWeight: 700 }}>Analyse<Dots /></span>
                      </div>
                    )}
                    {st === "done" && (
                      <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,.08)", padding: "6px 14px", borderRadius: 8 }}>
                        {IC.checkCircle({ s: 14, c: "var(--green)" })}
                        <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 700 }}>Terminé</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar + phase label */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Progression</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: scanPct >= 100 ? "var(--green)" : "var(--t1)" }}>{scanPct}%</span>
              </div>
              <div style={{ height: 8, background: "var(--s2)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <div className={scanPct < 100 ? "progress-bar" : ""} style={{ height: "100%", width: `${scanPct}%`, background: scanPct >= 100 ? "var(--green)" : "linear-gradient(90deg,#7f1d1d,#dc2626,#ef4444)", transition: "width .4s ease", borderRadius: 4 }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--t3)", textAlign: "center" }}>
                {scanPhase === "INIT" || scanPhase === "CONNECT" ? "Connexion sécurisée…" :
                  scanPhase === "TARGET" ? "Préparation de la recherche…" :
                    scanPhase === "TINDER" ? "Analyse Tinder en cours…" :
                      scanPhase === "BUMBLE" ? "Analyse Bumble en cours…" :
                        scanPhase === "HINGE" ? "Analyse Hinge en cours…" :
                          scanPhase === "COMPILE" ? "Génération du rapport…" :
                            "Vérification terminée"}
              </p>
            </div>

            {/* Terminal */}
            <div style={{ background: "#030303", borderRadius: 16, border: "1px solid var(--bd)", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--bd)", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "var(--t3)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{IC.terminal({ s: 11 })} vérification.log</span>
                <span style={{ color: scanPhase === "DONE" ? "var(--green)" : "var(--t3)", display: "flex", alignItems: "center", gap: 5 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: scanPhase === "DONE" ? "var(--green)" : "var(--t3)", display: "inline-block" }} />{scanPhase === "DONE" ? "TERMINÉ" : "EN COURS"}</span>
              </div>
              <div className="term" style={{ padding: "14px 16px", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, height: 180, overflowY: "auto", lineHeight: 1.7 }}>
                {scanLogs.map((l, i) => (<div key={i} className="fi" style={{ display: "flex", gap: 10, marginBottom: 3 }}><span style={{ color: "var(--t4)", flexShrink: 0, fontSize: 10 }}>{l.time}</span><span className={l.text.startsWith("────") ? "log-section" : `log-${l.type}`}>{l.text}</span></div>))}
                <span className="pulse" style={{ color: "var(--green)", opacity: .25 }}>█</span><div ref={termRef} />
              </div>
            </div>
            {scanPhase === "DONE" && (<div className="fu" style={{ textAlign: "center", marginTop: 20 }}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{IC.checkCircle({ s: 14, c: "var(--green)" })} Vérification terminée — Rapport prêt</div></div>)}
          </div>
        </div>
      )}


      {/* ══════════════ RESULT ══════════════ */}
      {screen === "RESULT" && (
        <div className="fi" style={{ minHeight: "100vh", padding: "68px 20px 60px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>

            {/* Simplified Recap */}
            <div className="fu" style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 22, padding: "32px 28px", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", marginBottom: 6 }}>Rapport de vérification</p>
                  <h2 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-.03em" }}>Résultats disponibles</h2>
                </div>
                <div style={{ background: "var(--s2)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--bd)" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Réf.</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace" }}>{dossierRef.current}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "var(--t3)" }}>
                <span>{getScanLabel()}</span>
                <span style={{ color: "var(--t4)" }}>·</span>
                <span>{new Date().toLocaleDateString("fr-FR")}</span>
                <span style={{ color: "var(--t4)" }}>·</span>
                <span>{scanTab === "EMAIL" ? "Par identifiants" : scanTab === "INSTA" ? "Via Instagram" : "Par photo"}</span>
                <span style={{ color: "var(--t4)" }}>·</span>
                <span>{formatTime(elapsed)}</span>
              </div>
            </div>

            {/* App results — Colored glow cards */}
            <div className="fu d1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
              {APPS.map((app, i) => (
                <div key={i} style={{ background: "var(--s1)", borderRadius: 18, padding: "24px 14px", border: `1px solid ${app.color}20`, textAlign: "center", position: "relative", overflow: "hidden", ["--gc" as string]: `${app.color}40`, animation: "glowPulse 3s ease infinite", animationDelay: `${i * 0.4}s` } as React.CSSProperties}>
                  <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 80, height: 80, background: `radial-gradient(circle, ${app.color}15 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{app.icon}</span>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{app.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: `${app.color}08`, padding: "8px 12px", borderRadius: 10, border: `1px solid ${app.color}15` }}>
                    <div className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: app.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: app.color }}>Rapport prêt</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Emotional banner with countdown */}
            <div className="fu d2" style={{ background: "linear-gradient(135deg, rgba(245,158,11,.06), rgba(220,38,38,.04))", border: "1px solid rgba(245,158,11,.12)", borderRadius: 16, padding: "20px 22px", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {IC.clock({ s: 20, c: "var(--gold)" })}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--t1)", marginBottom: 3 }}>Vos résultats sont prêts</p>
                  <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5 }}>Ce rapport sera automatiquement supprimé dans <strong style={{ color: "var(--gold)" }}>23h 59min</strong> pour des raisons de confidentialité.</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="fu d3" style={{ textAlign: "center", marginBottom: 18 }}>
              <p style={{ fontSize: 12, color: "var(--t3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ display: "flex", gap: 1 }}>{[...Array(5)].map((_, j) => <span key={j} style={{ color: "var(--gold)", fontSize: 11 }}>★</span>)}</span>
                <span>73% des utilisateurs choisissent le rapport <strong style={{ color: "var(--gold)" }}>Intégral</strong></span>
              </p>
            </div>

            {/* 2-TIER PRICING */}
            <div className="fu d3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {/* Standard */}
              <div style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 22px", border: "2px solid var(--bd)", display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", marginBottom: 14 }}>Standard</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}><span style={{ fontSize: 36, fontWeight: 800 }}>3,99€</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                  {[{ ok: true, t: "Résultat par application" }, { ok: true, t: "Nom et âge du profil" }, { ok: true, t: "Période d'activité" }, { ok: true, t: "Résumé par email" }, { ok: false, t: "Captures d'écran" }, { ok: false, t: "Bio & centres d'intérêt" }, { ok: false, t: "Rapport PDF" }].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: f.ok ? "var(--t2)" : "var(--t4)" }}>{f.ok ? IC.check({ s: 14, c: "var(--green)" }) : IC.x({ s: 14, c: "var(--t4)" })}{f.t}</div>
                  ))}
                </div>
                <a href="https://buy.stripe.com/5kQbJ2bVfgyhbdOau94Vy1F" target="_blank" rel="noopener noreferrer" style={{ width: "100%", textDecoration: "none" }}><button className="bo" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 15, fontWeight: 800 }}>Débloquer — 3,99€</button></a>
              </div>
              {/* Intégral */}
              <div className="tier-pop" style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 22px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--gold)" }}>Intégral</p><span style={{ fontSize: 8, fontWeight: 800, background: "var(--gold)", color: "#000", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>Recommandé</span></div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}><span style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg,var(--gold-l),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>9,99€</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                  {[{ t: "Résultat par application" }, { t: "Captures d'écran complètes" }, { t: "Bio & centres d'intérêt" }, { t: "Distance approximative" }, { t: "Date estimée de création" }, { t: "Résumé par email" }, { t: "Rapport PDF (réf. unique)" }].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--t2)" }}>{IC.check({ s: 14, c: "var(--gold)" })}{f.t}</div>
                  ))}
                </div>
                <a href="https://buy.stripe.com/00w28scZj2Hreq09q54Vy1G" target="_blank" rel="noopener noreferrer" style={{ width: "100%", textDecoration: "none" }}><button className="bg" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{IC.download({ s: 16 })} Débloquer — 9,99€</button></a>
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: 10, color: "var(--t3)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{IC.shield({ s: 11, c: "var(--t3)" })} Paiement sécurisé Stripe · Libellé discret sur relevé · Remboursement si erreur</p>
            <button onClick={() => { setScreen("HOME"); setAppStatus(["wait", "wait", "wait"]); setScanLogs([]); setScanPct(0); }} style={{ display: "block", width: "100%", textAlign: "center", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", background: "none", border: "none", cursor: "pointer", padding: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Nouvelle vérification</button>
          </div>
        </div>
      )}
    </div>
  );
}
