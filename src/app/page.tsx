"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

/* ══════════════ TYPES ══════════════ */
type Screen = "HOME" | "SCAN" | "RESULT";
type Tab = "EMAIL" | "FACE" | "INSTA";
type AppStatus = "wait" | "scan" | "done";
type ScanPhase = "INIT" | "CONNECT" | "TARGET" | "TINDER" | "BUMBLE" | "HINGE" | "COMPILE" | "DONE";
type LogType = "info" | "success" | "warning" | "critical" | "clean" | "section";
interface AppData { name: string; color: string; icon: string; db: string; }
interface ScanLog { time: string; text: string; type: LogType; }
interface ToastData { app: AppData; city: string; ago: number; }
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
const NAMES: string[] = ["Lucas M.", "Hugo D.", "Emma L.", "Léa R.", "Thomas B.", "Camille P.", "Nathan G.", "Sophie K.", "Julie T.", "Antoine V.", "Marine C.", "Maxime S."];
const ACTIONS: string[] = ["profil détecté à", "compte localisé à", "activité identifiée à", "profil repéré à"];

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
  const [ticker, setTicker] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [faq, setFaq] = useState<number | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [scanPhase, setScanPhase] = useState<ScanPhase>("INIT");
  const [appStatus, setAppStatus] = useState<AppStatus[]>(["wait", "wait", "wait"]);
  const [scanPct, setScanPct] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);

  const fakeProfile = useMemo<FakeProfile>(() => { const city = CITIES[Math.floor(Math.random() * CITIES.length)]; return { city, hrs: Math.floor(Math.random() * 6) + 1, km: Math.floor(Math.random() * 15) + 3, age: Math.floor(Math.random() * 8) + 22, photos: Math.floor(Math.random() * 3) + 3, bio: "Aventurier·e dans l'âme 🌍 | Amateur·ice de bons restos et de randonnées | Si tu aimes les chiens, on s'entendra bien 🐕 | Ici pour des rencontres authentiques", interests: ["Voyages", "Cuisine", "Sport", "Cinéma", "Musique"] }; }, []);

  // Insta autocomplete
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
  useEffect(() => {
    const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
    const gen = () => `${pick(NAMES)} — ${pick(ACTIONS)} ${pick(CITIES)}`; setTicker(gen());
    const t1 = setInterval(() => setTicker(gen()), 4500); const t2 = setInterval(() => setLiveCount(p => Math.max(32, Math.min(64, p + (Math.random() > .5 ? 1 : -1)))), 5000);
    const fire = () => { setToast({ app: pick(APPS), city: pick(CITIES), ago: Math.floor(Math.random() * 8) + 1 }); setTimeout(() => setToast(null), 6000); };
    const t3 = setTimeout(fire, 6000); const t4 = setInterval(fire, 30000);
    return () => { clearInterval(t1); clearInterval(t2); clearTimeout(t3); clearInterval(t4); };
  }, []);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setPhotos(p => [...p, ...Array.from(e.target.files!).map(f => URL.createObjectURL(f))].slice(0, 3)); };
  const ts = (): string => new Date().toLocaleTimeString("fr-FR", { hour12: false });
  const addLog = (text: string, type: LogType = "info") => setScanLogs(p => [...p, { time: ts(), text, type }]);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const canScan = tab === "EMAIL" ? (input.email.trim() || input.phone.trim()) : tab === "FACE" ? photos.length > 0 : tab === "INSTA" ? !!selectedInstaProfile : false;

  const getScanLabel = (): string => {
    if (scanTab === "INSTA" && selectedInstaProfile) return "@" + selectedInstaProfile.username;
    if (scanTab === "EMAIL") { if (input.email.trim() && input.phone.trim()) return input.email; if (input.email.trim()) return input.email; return input.phone; }
    return "reconnaissance faciale";
  };

  /* ════════ SCAN ENGINE (ambiguous — no free answers) ════════ */
  const startScan = () => {
    if (!canScan) return;
    setScanTab(tab); setScreen("SCAN"); setScanLogs([]); setAppStatus(["wait", "wait", "wait"]); setScanPhase("INIT"); setScanPct(0); setElapsed(0); scrollTop();
    let t = 0; const sched = (d: number, fn: () => void) => { t += d; setTimeout(fn, t); };

    // Phase 1: Connection
    sched(500, () => { setScanPhase("CONNECT"); addLog("Initialisation du protocole d'investigation…"); });
    sched(1200, () => { addLog("Établissement d'une connexion chiffrée (TLS 1.3)…"); setScanPct(2); });
    sched(1400, () => { addLog("Proxy résidentiel assigné — FR-CDG-04 (Paris)", "success"); setScanPct(4); });
    sched(1000, () => { addLog("Vérification de l'empreinte numérique… OK", "success"); setScanPct(6); });
    sched(1200, () => { addLog("Rotation de l'identité navigateur (User-Agent)…"); setScanPct(8); });
    sched(800, () => { addLog("Connexion sécurisée établie — Aucune fuite détectée", "success"); setScanPct(10); });

    // Phase 1.5: Target acquisition (varies by tab)
    sched(1200, () => { setScanPhase("TARGET"); setScanPct(11); });
    if (tab === "INSTA" && selectedInstaProfile) {
      sched(800, () => { addLog(`Extraction du profil Instagram @${selectedInstaProfile.username}…`); setScanPct(12); });
      sched(1200, () => { addLog("Photo de profil récupérée — Initialisation FaceTrace v4…", "success"); setScanPct(14); });
      sched(1000, () => { addLog("Empreinte biométrique générée — Prêt pour comparaison", "success"); setScanPct(15); });
    } else if (tab === "EMAIL") {
      sched(800, () => { addLog("Recherche par identifiants numériques (email / téléphone)…"); setScanPct(12); });
      sched(1200, () => { addLog("Interrogation des bases d'inscription des plateformes…", "success"); setScanPct(14); });
      sched(1000, () => { addLog("Identifiants indexés — Prêt pour comparaison croisée", "success"); setScanPct(15); });
    } else {
      sched(800, () => { addLog("Traitement des photos uploadées (FaceTrace v4)…"); setScanPct(12); });
      sched(1200, () => { addLog("Extraction des traits biométriques du visage…", "success"); setScanPct(14); });
      sched(1000, () => { addLog("Empreinte faciale générée — Prêt pour comparaison", "success"); setScanPct(15); });
    }

    // Phase 2: Tinder (ambiguous ending)
    sched(1500, () => { setScanPhase("TINDER"); setAppStatus(["scan", "wait", "wait"]); addLog("──── Analyse Tinder (2.4M profils indexés) ────"); setScanPct(17); });
    sched(1800, () => { addLog("Interrogation de l'index Tinder Europe (FR)…"); setScanPct(20); });
    sched(2200, () => { addLog("Filtrage par tranche d'âge et géolocalisation…"); setScanPct(24); });
    sched(1600, () => { addLog("342 profils correspondants dans la zone…"); setScanPct(28); });
    sched(2000, () => { addLog("Comparaison biométrique en cours…"); setScanPct(32); });
    sched(2400, () => { addLog("Analyse des métadonnées de profil…"); setScanPct(35); });
    sched(1800, () => { addLog("Résultat classifié — Ajouté au rapport chiffré", "success"); setAppStatus(["done", "wait", "wait"]); setScanPct(38); });

    // Phase 3: Bumble
    sched(1500, () => { setScanPhase("BUMBLE"); setAppStatus(prev => [prev[0], "scan", prev[2]]); addLog("──── Analyse Bumble (1.8M profils indexés) ────"); setScanPct(42); });
    sched(1600, () => { addLog("Interrogation de l'index Bumble France…"); setScanPct(46); });
    sched(2000, () => { addLog("Filtrage des profils par critères démographiques…"); setScanPct(50); });
    sched(1800, () => { addLog("187 profils correspondants identifiés…"); setScanPct(54); });
    sched(2200, () => { addLog("Comparaison des données de profil…"); setScanPct(58); });
    sched(1400, () => { addLog("Résultat classifié — Ajouté au rapport chiffré", "success"); setAppStatus(prev => [prev[0], "done", prev[2]]); setScanPct(62); });

    // Phase 4: Hinge
    sched(1500, () => { setScanPhase("HINGE"); setAppStatus(prev => [prev[0], prev[1], "scan"]); addLog("──── Analyse Hinge (920K profils indexés) ────"); setScanPct(66); });
    sched(1400, () => { addLog("Interrogation de l'index Hinge France…"); setScanPct(70); });
    sched(1800, () => { addLog("Filtrage par zone géographique…"); setScanPct(74); });
    sched(1600, () => { addLog("94 profils dans la zone de recherche…"); setScanPct(78); });
    sched(2000, () => { addLog("Analyse comparative en cours…"); setScanPct(82); });
    sched(1200, () => { addLog("Résultat classifié — Ajouté au rapport chiffré", "success"); setAppStatus(prev => [prev[0], prev[1], "done"]); setScanPct(86); });

    // Phase 5: Compilation
    sched(1200, () => { setScanPhase("COMPILE"); addLog("──── Compilation du rapport ────"); setScanPct(88); });
    sched(1400, () => { addLog("Agrégation des résultats des 3 plateformes…"); setScanPct(90); });
    sched(1200, () => { addLog("⚠ Résultats sensibles détectés — Classification en cours…", "warning"); setScanPct(93); });
    sched(1000, () => { addLog("Chiffrement du rapport d'investigation (AES-256)…"); setScanPct(96); });
    sched(800, () => { addLog("Rapport finalisé — En attente de déblocage", "success"); setScanPct(100); });
    sched(600, () => { addLog("Purge sécurisée des traces de connexion… OK", "success"); setScanPhase("DONE"); });
    sched(2500, () => { setScreen("RESULT"); });
  };

  const faqs = [
    { q: "Le scan est-il vraiment anonyme ?", a: "Totalement. Nous utilisons des proxys résidentiels rotatifs et des identités de navigation uniques. La personne ciblée ne reçoit aucune notification et ne saura jamais qu'une recherche a été effectuée." },
    { q: "Qu'apparaît sur mon relevé bancaire ?", a: "Un libellé neutre « TS-DIGITAL » ou « WEB-SERVICES ». Le nom CocuOuPas n'apparaîtra jamais sur aucun document bancaire." },
    { q: "Quelle est la différence entre Standard et Intégral ?", a: "Le rapport Standard vous donne le verdict par application et des captures floutées. L'Intégral inclut les photos HD, la bio complète, la localisation GPS précise, l'historique d'activité sur 30 jours et un certificat d'investigation PDF officiel." },
    { q: "Quelles applications sont couvertes ?", a: "Tinder, Bumble et Hinge — les 3 plus grandes apps de rencontre en France, couvrant plus de 95% du marché." },
    { q: "Comment fonctionne la recherche par email/téléphone ?", a: "Les applications de rencontre utilisent un email ou un numéro de téléphone pour créer un compte. Notre système vérifie directement si ces identifiants sont associés à un profil actif." },
    { q: "Mes données sont-elles en sécurité ?", a: "Le rapport est chiffré en AES-256 et accessible uniquement par vous. Nous ne conservons aucune donnée personnelle au-delà de 48h. Conforme au RGPD." },
    { q: "Puis-je être remboursé ?", a: "Si notre système rencontre une erreur technique empêchant la génération du rapport, vous êtes remboursé automatiquement sous 24h." },
  ];
  const testimonials = [
    { name: "Marine L.", city: "Lyon", text: "Des doutes depuis des mois. En une minute j'avais un rapport complet avec les captures. Difficile à encaisser mais au moins je sais.", stars: 5, date: "il y a 3 jours" },
    { name: "Thomas R.", city: "Paris", text: "On me traitait de parano. Le rapport PDF avec les preuves m'a donné raison. Merci pour cet outil.", stars: 5, date: "il y a 1 semaine" },
    { name: "Sophie M.", city: "Bordeaux", text: "Rien trouvé. Honnêtement, payer 4€ pour retrouver le sommeil, c'est le meilleur investissement de ma vie.", stars: 5, date: "il y a 5 jours" },
    { name: "Julien K.", city: "Lille", text: "Profil actif avec photos récentes. Impossible de nier face aux preuves du rapport intégral.", stars: 5, date: "il y a 2 jours" },
    { name: "Camille D.", city: "Marseille", text: "Rapide, discret, efficace. Le certificat d'absence m'a rassurée. Mon couple va mieux depuis.", stars: 5, date: "il y a 4 jours" },
    { name: "Nicolas F.", city: "Toulouse", text: "Le rapport intégral est ultra complet : photos HD, bio, localisation GPS. J'ai pu prendre ma décision sereinement.", stars: 5, date: "il y a 6 jours" },
  ];

  const formatTime = (s: number): string => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{--bg:#050505;--s1:#0a0a0a;--s2:#0f0f0f;--s3:#161616;--bd:rgba(255,255,255,.06);--bd2:rgba(255,255,255,.1);--red:#dc2626;--red-d:#7f1d1d;--red-l:#fca5a5;--gold:#f59e0b;--gold-l:#fbbf24;--green:#22c55e;--blue:#3b82f6;--purple:#8b5cf6;--t1:#fff;--t2:rgba(255,255,255,.55);--t3:rgba(255,255,255,.25);--t4:rgba(255,255,255,.08)}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--t1);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}::selection{background:rgba(220,38,38,.2)}
a{color:inherit;text-decoration:none}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
@keyframes slideInR{from{transform:translateX(120%)}to{transform:translateX(0)}}
@keyframes progressStripe{0%{background-position:0 0}100%{background-position:40px 0}}
@keyframes dotPulse{0%,80%,100%{opacity:.2}40%{opacity:1}}
@keyframes pressScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes scanLine{0%,100%{top:0%}50%{top:92%}}
@keyframes gridPulse{0%,100%{opacity:.12}50%{opacity:.3}}
.fu{animation:fadeUp .5s ease both}.fi{animation:fadeIn .4s ease both}
.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}.d4{animation-delay:.24s}.d5{animation-delay:.3s}
.mq{display:flex;animation:marquee 40s linear infinite}
.press-scroll{display:flex;animation:pressScroll 25s linear infinite}
.term::-webkit-scrollbar{width:3px}.term::-webkit-scrollbar-track{background:transparent}.term::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}
.log-info{color:#6ee7b7}.log-success{color:#4ade80;font-weight:600}.log-warning{color:#fbbf24;font-weight:600}.log-critical{color:#ef4444;font-weight:700}.log-clean{color:rgba(255,255,255,.35);font-style:italic}.log-section{color:rgba(255,255,255,.15);font-weight:600;letter-spacing:.04em}
.bp{background:linear-gradient(135deg,#991b1b,#450a0a);color:#fff;border:none;cursor:pointer;font-weight:700;transition:all .15s}.bp:hover{filter:brightness(1.2);transform:translateY(-1px)}.bp:active{transform:scale(.97)}
.bg{background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;border:none;cursor:pointer;font-weight:700;transition:all .15s}.bg:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 16px 48px -8px rgba(245,158,11,.3)}.bg:active{transform:scale(.97)}
.bo{background:none;color:#fff;border:2px solid var(--bd2);cursor:pointer;font-weight:700;transition:all .15s}.bo:hover{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.03)}
input:focus{outline:none;border-color:var(--red)!important;background:rgba(255,255,255,.03)!important}
.blur-content{filter:blur(6px);user-select:none;pointer-events:none}.blur-heavy{filter:blur(10px);user-select:none;pointer-events:none}
.noise::before{content:'';position:fixed;inset:0;opacity:.012;pointer-events:none;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.progress-bar{background-size:40px 40px;background-image:repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(255,255,255,.03) 8px,rgba(255,255,255,.03) 16px);animation:progressStripe 1s linear infinite}
.dots span{display:inline-block;animation:dotPulse 1.4s infinite}.dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
.ch{transition:all .25s}.ch:hover{border-color:rgba(255,255,255,.12)!important;transform:translateY(-2px)}
.btn-disabled{background:#333!important;color:#777!important;cursor:not-allowed!important;border:1px solid #444!important}.btn-disabled:hover{filter:none!important;transform:none!important}
.bio-grid{background-image:linear-gradient(rgba(220,38,38,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,.12) 1px,transparent 1px);background-size:12px 12px;animation:gridPulse 3s ease infinite}
.scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--red),var(--red),transparent);box-shadow:0 0 8px 2px rgba(220,38,38,.4);animation:scanLine 2.5s ease-in-out infinite;z-index:3}
.tier-pop{position:relative;border:2px solid var(--gold)!important;box-shadow:0 0 40px -10px rgba(245,158,11,.15)}
  `;

  const SH: React.FC<{ title: string; sub?: string; tag?: string }> = ({ title, sub, tag }) => (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      {tag && <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--red)", marginBottom: 14 }}>{tag}</p>}
      <h2 style={{ fontSize: "clamp(24px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-.04em", marginBottom: sub ? 12 : 0, lineHeight: 1.05 }}>{title}</h2>
      {sub && <p style={{ color: "var(--t3)", fontSize: 14, maxWidth: 460, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
    </div>
  );

  return (
    <div className="noise" style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{css}</style>

      {toast && (<div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 300, animation: "slideInR .45s cubic-bezier(.16,1,.3,1) both" }}><div style={{ background: "#fff", color: "#111", padding: "14px 18px", borderRadius: 14, display: "flex", gap: 12, alignItems: "center", maxWidth: 340, boxShadow: "0 24px 60px rgba(0,0,0,.5)", borderLeft: "3px solid var(--red)" }}><span style={{ fontSize: 20, flexShrink: 0 }}>{toast.app.icon}</span><div><p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Profil {toast.app.name} détecté</p><p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>📍 {toast.city} · il y a {toast.ago} min</p></div></div></div>)}

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "#000", borderBottom: "1px solid var(--bd)", padding: "9px 0", overflow: "hidden" }}><div className="mq" style={{ gap: 40, whiteSpace: "nowrap", fontSize: 11, fontWeight: 600, color: "var(--t3)" }}>{[...Array(10)].map((_, i) => (<span key={i} style={{ display: "flex", alignItems: "center", gap: 28, flexShrink: 0 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} /><span style={{ color: "var(--t2)" }}>{liveCount} scans actifs</span></span><span style={{ color: "var(--t2)" }}>{ticker}</span><span style={{ color: "var(--gold)", fontWeight: 700 }}>À partir de 3,99€</span></span>))}</div></div>

      {/* ══════════════ HOME ══════════════ */}
      {screen === "HOME" && (
        <div className="fi">
          <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ background: "var(--red)", padding: "5px 9px", borderRadius: 8, fontWeight: 800, fontStyle: "italic", fontSize: 18 }}>C<span style={{ color: "var(--gold)" }}>O</span>P</div><span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.02em" }}>CocuOuPas<span style={{ color: "var(--red)" }}>.fr</span></span></div><div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 600, color: "var(--t3)" }}><a href="#methode">Méthode</a><a href="#avis">Avis</a><a href="#faq">FAQ</a></div><div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,.06)", padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.12)" }}>{IC.lock({ s: 11, c: "#22c55e" })}<span style={{ fontSize: 9, fontWeight: 700, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase" }}>Chiffré</span></div></div></nav>

          {/* HERO */}
          <section className="fu" style={{ maxWidth: 920, margin: "0 auto", textAlign: "center", padding: "56px 20px 40px", position: "relative" }}>
            <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle,rgba(220,38,38,.04) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 100, padding: "7px 16px 7px 8px", marginBottom: 28 }}><div style={{ display: "flex", marginLeft: 4 }}>{[0, 1, 2, 3].map(i => (<div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: ["#991b1b", "#7f1d1d", "#dc2626", "#b91c1c"][i], border: "2px solid var(--bg)", marginLeft: i > 0 ? -6 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", zIndex: 4 - i }}>{["M", "T", "S", "J"][i]}</div>))}</div><span style={{ fontSize: 12, fontWeight: 600, color: "var(--t2)" }}><AnimNum target={84712} /> investigations · <span style={{ color: "var(--gold)" }}>4.8★</span></span></div>
            <h1 className="fu d1" style={{ fontSize: "clamp(38px,7.5vw,88px)", fontWeight: 800, letterSpacing: "-.045em", lineHeight: .88, marginBottom: 24 }}>La vérité,<br /><span style={{ background: "linear-gradient(135deg,var(--gold-l),var(--gold),#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pour le prix d&apos;un café.</span></h1>
            <p className="fu d2" style={{ maxWidth: 520, margin: "0 auto 24px", color: "var(--t2)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.65 }}>Votre partenaire est-il inscrit(e) sur Tinder, Bumble ou Hinge ? Lancez une recherche 100% anonyme et obtenez un rapport d&apos;investigation complet en 60 secondes.</p>
            <div className="fu d3" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 44, flexWrap: "wrap" }}>{[{ t: "Anonyme & intraçable", i: IC.shield, c: "var(--green)" }, { t: "Résultat en 60 sec", i: IC.zap, c: "var(--gold)" }, { t: "Paiement 100% discret", i: IC.lock, c: "var(--blue)" }].map((b, i) => (<span key={i} style={{ fontSize: 11, fontWeight: 600, color: "var(--t2)", background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 100, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }}>{b.i({ s: 13, c: b.c })} {b.t}</span>))}</div>

            {/* ── SEARCH CARD (3 TABS) ── */}
            <div className="fu d4" style={{ background: "#fff", borderRadius: 24, maxWidth: 660, margin: "0 auto", overflow: "hidden", boxShadow: "0 40px 100px -25px rgba(0,0,0,.85)" }}>
              <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0" }}>
                {([
                  { id: "EMAIL" as Tab, label: "Email / Téléphone", icon: IC.mail },
                  { id: "FACE" as Tab, label: "Par photo (IA)", icon: IC.camera },
                  { id: "INSTA" as Tab, label: "Instagram", icon: IC.at },
                ]).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: tab === t.id ? "#fff" : "#fafafa", color: tab === t.id ? "var(--red)" : "#b0b0b0", borderBottom: tab === t.id ? "3px solid var(--red)" : "3px solid transparent", transition: "all .2s" }}>{t.icon({ s: 14 })} {t.label}</button>
                ))}
              </div>
              <div style={{ padding: "28px 28px 24px", color: "#111", minHeight: 180 }}>

                {/* EMAIL / PHONE TAB */}
                {tab === "EMAIL" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ position: "relative" }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#ccc" }}>{IC.mail({ s: 17 })}</div>
                      <input value={input.email} onChange={e => setInput({ ...input, email: e.target.value })} placeholder="Adresse email du / de la partenaire" style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12, border: "2px solid #f0f0f0", fontSize: 14, fontWeight: 600, background: "#fafafa", color: "#111", transition: "all .15s" }} /></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ flex: 1, height: 1, background: "#eee" }} /><span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>et / ou</span><div style={{ flex: 1, height: 1, background: "#eee" }} /></div>
                    <div style={{ position: "relative" }}><div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#ccc" }}>{IC.phone({ s: 17 })}</div>
                      <input value={input.phone} onChange={e => setInput({ ...input, phone: e.target.value })} placeholder="Numéro de téléphone (ex: 06 12 34 56 78)" style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12, border: "2px solid #f0f0f0", fontSize: 14, fontWeight: 600, background: "#fafafa", color: "#111", transition: "all .15s" }} /></div>
                    <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 2 }}>Les apps de rencontre utilisent ces identifiants pour créer un compte — c&apos;est la méthode la plus fiable.</p>
                  </div>
                )}

                {/* FACE TAB */}
                {tab === "FACE" && (
                  <div>
                    <input type="file" multiple accept="image/*" id="face-upload" onChange={onUpload} disabled={photos.length >= 3} style={{ display: "none" }} />
                    <label htmlFor="face-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "36px 20px", border: "2px dashed #e0e0e0", borderRadius: 16, background: "#fafafa", cursor: "pointer" }}><div style={{ background: "#fff", padding: 10, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>{IC.upload({ s: 22, c: "#aaa" })}</div><p style={{ fontSize: 14, fontWeight: 700, color: "#444" }}>Uploadez 1 à 3 photos nettes du visage</p><p style={{ fontSize: 11, color: "#aaa" }}>JPG, PNG — Max 5 Mo</p></label>
                    {photos.length > 0 && (<div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>{photos.map((p, i) => (<div key={i} style={{ position: "relative", width: 60, height: 60, borderRadius: 10, overflow: "hidden", border: "2px solid #e5e5e5" }}><img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><button onClick={() => setPhotos(x => x.filter((_, j) => j !== i))} style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,.6)", border: "none", borderRadius: "50%", padding: 2, cursor: "pointer", display: "flex" }}>{IC.x({ s: 10, c: "#fff" })}</button></div>))}</div>)}
                  </div>
                )}

                {/* INSTAGRAM TAB */}
                {tab === "INSTA" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "relative", zIndex: 10 }}>
                        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#ccc" }}>{IC.search({ s: 18 })}</div>
                        <input value={instaQuery} onChange={e => { setInstaQuery(e.target.value); if (selectedInstaProfile) setSelectedInstaProfile(null); }} placeholder="Chercher un compte Instagram (ex: lea_martin)..." style={{ width: "100%", padding: "16px 16px 16px 46px", borderRadius: 14, border: "2px solid #eaeaea", fontSize: 15, fontWeight: 600, background: "#fff", color: "#111", transition: "all .2s", boxShadow: "0 4px 12px rgba(0,0,0,.03)" }} />
                        {isSearchingInsta && (<div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}><div style={{ width: 18, height: 18, border: "2px solid #eee", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin .7s linear infinite" }} /></div>)}
                      </div>
                      {instaResults.length > 0 && !selectedInstaProfile && (
                        <div className="fi" style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 14, marginTop: 8, boxShadow: "0 14px 40px rgba(0,0,0,.15)", border: "1px solid #eaeaea", zIndex: 50, overflow: "hidden" }}>
                          {instaResults.map((prof, i) => (
                            <div key={i} onClick={() => { setSelectedInstaProfile(prof); setInstaQuery(prof.username); setInstaResults([]); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer", borderBottom: i === instaResults.length - 1 ? "none" : "1px solid #f5f5f5", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafafa"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              {prof.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(prof.profile_pic_url)}`} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }} />) : (<div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 20, c: "#999" })}</div>)}
                              <div><p style={{ fontSize: 14, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>{prof.username}{prof.is_verified && <span style={{ color: "#3b82f6", fontSize: 12 }}>✓</span>}</p><p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{prof.full_name}</p></div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedInstaProfile && (
                        <div className="fi" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 14, padding: "14px 16px" }}>
                          {selectedInstaProfile.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(selectedInstaProfile.profile_pic_url)}`} alt="" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,.08)" }} />) : (<div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", border: "2px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 24, c: "#aaa" })}</div>)}
                          <div style={{ flex: 1 }}><p style={{ fontSize: 10, fontWeight: 800, color: "#22c55e", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Cible verrouillée par l&apos;IA</p><p style={{ fontSize: 15, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>@{selectedInstaProfile.username}{selectedInstaProfile.is_verified && <span style={{ color: "#3b82f6", fontSize: 12 }}>✓</span>}</p>{selectedInstaProfile.full_name && <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{selectedInstaProfile.full_name}</p>}</div>
                          <div style={{ color: "#22c55e" }}>{IC.checkCircle({ s: 24 })}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA BUTTON */}
                <button onClick={startScan} disabled={!canScan} className={!canScan ? "btn-disabled" : "bp"} style={{ width: "100%", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .3s" }}>
                  {canScan ? "Lancer l'investigation" : "Renseignez les informations ci-dessus"} {canScan && IC.arrowRight({ s: 18 })}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#999", marginTop: 14 }}>🔒 Recherche anonyme · Aucune notification envoyée</p>
              </div>
            </div>
          </section>

          {/* PRESS */}
          <section style={{ padding: "32px 0", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", background: "var(--s1)", overflow: "hidden" }}><p style={{ textAlign: "center", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--t4)", marginBottom: 18 }}>Vu dans la presse</p><div style={{ overflow: "hidden", position: "relative" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg,var(--s1),transparent)", zIndex: 2 }} /><div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg,var(--s1),transparent)", zIndex: 2 }} /><div className="press-scroll" style={{ gap: "clamp(40px,6vw,72px)", alignItems: "center", whiteSpace: "nowrap" }}>{[...Array(2)].map((_, r) => (<React.Fragment key={r}>{["Konbini", "GQ", "Le Parisien", "Cosmopolitan", "20 Minutes", "BFM Tech", "Madmoizelle", "Slate.fr"].map(name => (<span key={`${r}-${name}`} style={{ fontWeight: 800, fontStyle: "italic", fontSize: "clamp(16px,2.5vw,22px)", letterSpacing: "-.03em", opacity: .2, flexShrink: 0, padding: "0 4px" }}>{name}</span>))}</React.Fragment>))}</div></div></section>

          {/* STATS */}
          <section style={{ padding: "52px 20px", background: "var(--bg)" }}><div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>{[{ val: 84712, label: "Investigations", icon: IC.search, suffix: "" }, { val: 31847, label: "Profils détectés", icon: IC.alert, suffix: "" }, { val: 37, label: "Temps moyen", icon: IC.clock, suffix: " sec" }, { val: 4.8, label: "Satisfaction", icon: IC.star, suffix: "/5" }].map((s, i) => (<div key={i} style={{ background: "var(--s1)", borderRadius: 18, padding: "26px 20px", border: "1px solid var(--bd)", textAlign: "center" }}><div style={{ color: "var(--t4)", marginBottom: 8, display: "flex", justifyContent: "center" }}>{s.icon({ s: 16 })}</div><p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.04em" }}>{typeof s.val === "number" && s.val > 100 ? <AnimNum target={s.val} /> : s.val}{s.suffix}</p><p style={{ fontSize: 9, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 4 }}>{s.label}</p></div>))}</div></section>

          {/* SYMPTOMS */}
          <section style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}><SH title="Vous reconnaissez ces signes ?" sub="Si l'un de ces comportements vous parle, vous méritez une réponse. Pas des excuses." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>{[{ icon: IC.phone, title: "Téléphone verrouillé", desc: "Toujours face retournée, jamais posé sans surveillance. Code modifié récemment." }, { icon: IC.msgLock, title: "Conversations effacées", desc: "Historique trop propre. Des apps supprimées puis réinstallées discrètement." }, { icon: IC.bellOff, title: "Notifications coupées", desc: "L'écran ne s'allume plus. Alertes désactivées « pour le travail »." }, { icon: IC.clock, title: "Absences inexpliquées", desc: "Des « réunions tardives » de plus en plus fréquentes et vagues." }].map((s, i) => (<div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 20, padding: "30px 24px", border: "1px solid var(--bd)" }}><div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><div style={{ color: "var(--red)" }}>{s.icon({ s: 18 })}</div></div><h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</h3><p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p></div>))}</div><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={scrollTop} className="bp" style={{ padding: "14px 36px", borderRadius: 12, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>Vérifier maintenant {IC.arrowRight({ s: 16 })}</button></div></section>

          {/* HOW */}
          <section id="methode" style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}><SH tag="Méthode" title="Trois étapes. 60 secondes. Zéro trace." sub="Notre technologie analyse les 3 plus grandes apps de rencontre en France." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>{[{ n: "01", title: "Renseignez la cible", desc: "Email, téléphone, pseudo Instagram ou photo — choisissez la méthode qui vous convient. Plus vous donnez d'infos, plus l'analyse est précise.", icon: IC.user }, { n: "02", title: "L'IA scanne en temps réel", desc: "Analyse simultanée de Tinder, Bumble et Hinge via proxys résidentiels et reconnaissance faciale FaceTrace v4. 100% invisible.", icon: IC.globe }, { n: "03", title: "Débloquez votre rapport", desc: "Résultat par application, captures, bio, localisation GPS et historique d'activité dans un rapport PDF chiffré AES-256.", icon: IC.fileText }].map((h, i) => (<div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 22, padding: "38px 26px", border: "1px solid var(--bd)", position: "relative" }}><span style={{ position: "absolute", top: -13, left: 20, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 13, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px -4px rgba(220,38,38,.4)" }}>{h.n}</span><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, marginTop: 4 }}><h3 style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", maxWidth: "80%" }}>{h.title}</h3><div style={{ color: "var(--t4)" }}>{h.icon({ s: 20 })}</div></div><p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.7 }}>{h.desc}</p></div>))}</div></section>

          {/* REPORT CONTENT */}
          <section style={{ padding: "84px 20px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}><div style={{ maxWidth: 1060, margin: "0 auto" }}><SH tag="Le rapport" title="Ce que vous recevez" sub="Un véritable dossier d'investigation, pas un simple oui/non." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>{[{ icon: IC.image, title: "Captures HD du profil", desc: "Photos telles qu'elles apparaissent sur l'application.", color: "#3b82f6" }, { icon: IC.fileText, title: "Bio & centres d'intérêt", desc: "Texte complet et préférences affichées sur le profil.", color: "#8b5cf6" }, { icon: IC.mapPin, title: "Localisation GPS", desc: "Position connue et distance par rapport à vous.", color: "#f59e0b" }, { icon: IC.clock, title: "Dernière connexion", desc: "Date et heure exactes de la dernière activité.", color: "#22c55e" }, { icon: IC.barChart, title: "Niveau d'activité", desc: "Fréquence d'utilisation : occasionnel, régulier ou actif.", color: "#dc2626" }, { icon: IC.eye, title: "Statut du profil", desc: "Actif, en pause ou supprimé récemment.", color: "var(--t2)" }].map((r, i) => (<div key={i} className="ch" style={{ background: "var(--s2)", borderRadius: 18, padding: "26px 22px", border: "1px solid var(--bd)" }}><div style={{ width: 36, height: 36, borderRadius: 10, background: `${r.color}10`, border: `1px solid ${r.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><div style={{ color: r.color }}>{r.icon({ s: 16 })}</div></div><h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{r.title}</h3><p style={{ color: "var(--t3)", fontSize: 12, lineHeight: 1.6 }}>{r.desc}</p></div>))}</div></div></section>

          {/* TESTIMONIALS */}
          <section id="avis" style={{ padding: "84px 20px", maxWidth: 1060, margin: "0 auto" }}><SH tag="Avis vérifiés" title="Ils ont osé savoir." sub="Plus de 84 000 personnes ont utilisé CocuOuPas. Note moyenne : 4.8/5." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>{testimonials.map((t, i) => (<div key={i} className="ch" style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--bd)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ display: "flex", gap: 1 }}>{[...Array(t.stars)].map((_, j) => <span key={j} style={{ color: "var(--gold)", fontSize: 13 }}>★</span>)}</div><span style={{ fontSize: 9, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 4 }}>{IC.checkCircle({ s: 11, c: "var(--green)" })} Vérifié</span></div><p style={{ color: "var(--t2)", fontSize: 13, lineHeight: 1.65, marginBottom: 18, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--red-d)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{t.name[0]}</div><div><p style={{ fontWeight: 700, fontSize: 12 }}>{t.name}</p><p style={{ fontSize: 10, color: "var(--t3)" }}>{t.city}</p></div></div><span style={{ fontSize: 10, color: "var(--t4)" }}>{t.date}</span></div></div>))}</div></section>

          {/* COMPARE */}
          <section style={{ padding: "84px 20px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}><div style={{ maxWidth: 1060, margin: "0 auto" }}><SH tag="Comparatif" title="Pourquoi CocuOuPas ?" sub="Le rapport qualité-prix le plus imbattable du marché." /><div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 18, overflow: "hidden", border: "1px solid var(--bd)" }}><div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "var(--s2)", padding: "14px 22px", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--t3)", borderBottom: "1px solid var(--bd)" }}><span /><span style={{ textAlign: "center" }}>Détective privé</span><span style={{ textAlign: "center", color: "var(--red)" }}>CocuOuPas</span></div>{[{ l: "Délai", a: "7–15 jours", b: "≈ 60 sec" }, { l: "Tarif", a: "800–2 000€", b: "À partir de 3,99€" }, { l: "Anonymat", a: "Risqué", b: "100% garanti" }, { l: "Preuves", a: "Photos floues", b: "Rapport PDF HD" }, { l: "Disponibilité", a: "Heures bureau", b: "24/7 · Instant" }].map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 22px", borderBottom: "1px solid var(--bd)", fontSize: 12, alignItems: "center" }}><span style={{ fontWeight: 700, color: "var(--t2)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".03em" }}>{r.l}</span><span style={{ textAlign: "center", color: "var(--t3)" }}>{r.a}</span><span style={{ textAlign: "center", color: "var(--green)", fontWeight: 700 }}>{r.b}</span></div>))}</div></div></section>

          {/* SECURITY */}
          <section style={{ padding: "64px 20px", maxWidth: 1060, margin: "0 auto" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, textAlign: "center" }}>{[{ icon: IC.shield, title: "Anonymat total", desc: "Proxys résidentiels rotatifs. Zéro trace, zéro notification à la cible.", color: "var(--green)" }, { icon: IC.lock, title: "Chiffrement AES-256", desc: "Rapport chiffré de bout en bout. Lien unique et temporaire.", color: "var(--blue)" }, { icon: IC.eye, title: "Données purgées en 48h", desc: "Aucune donnée conservée au-delà de 48h. Conforme RGPD.", color: "var(--purple)" }].map((s, i) => (<div key={i} style={{ padding: "32px 24px", background: "var(--s1)", borderRadius: 20, border: "1px solid var(--bd)" }}><div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}08`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><div style={{ color: s.color }}>{s.icon({ s: 22 })}</div></div><h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</h3><p style={{ color: "var(--t3)", fontSize: 12, lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>{s.desc}</p></div>))}</div></section>

          {/* FAQ */}
          <section id="faq" style={{ padding: "84px 20px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}><div style={{ maxWidth: 1060, margin: "0 auto" }}><SH tag="FAQ" title="Questions fréquentes" /><div style={{ maxWidth: 660, margin: "0 auto", display: "flex", flexDirection: "column", gap: 6 }}>{faqs.map((f, i) => (<div key={i} style={{ borderRadius: 14, border: "1px solid var(--bd)", background: "var(--s2)", overflow: "hidden" }}><button onClick={() => setFaq(faq === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 700 }}><span>{f.q}</span><span style={{ transform: faq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s", flexShrink: 0, marginLeft: 12, color: "var(--red)" }}>{IC.chevDown({ s: 16 })}</span></button><div style={{ maxHeight: faq === i ? 260 : 0, overflow: "hidden", transition: "max-height .35s ease" }}><p style={{ padding: "0 18px 16px", color: "var(--t2)", fontSize: 13, lineHeight: 1.65 }}>{f.a}</p></div></div>))}</div></div></section>

          {/* FINAL CTA */}
          <section style={{ padding: "84px 20px", maxWidth: 580, margin: "0 auto" }}><div style={{ background: "linear-gradient(135deg,#1a0000,#200000,#1a0a00)", borderRadius: 28, padding: 2 }}><div style={{ background: "var(--bg)", borderRadius: 26, padding: "56px 36px", textAlign: "center" }}><div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>{IC.coffee({ s: 28, c: "var(--gold)" })}</div><h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>La vérité pour le prix d&apos;un café.</h2><p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 28, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.6 }}>Un espresso coûte 3,90€. Un rapport d&apos;investigation, à partir de 3,99€.</p><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}><span style={{ fontSize: "clamp(46px,12vw,72px)", fontWeight: 800, letterSpacing: "-.04em", background: "linear-gradient(135deg,var(--gold-l),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3,99€</span><div><p style={{ textDecoration: "line-through", color: "var(--t3)", fontSize: 16, fontWeight: 700 }}>19,99€</p><span style={{ background: "var(--red)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 5, textTransform: "uppercase" }}>-80%</span></div></div><button onClick={scrollTop} className="bg" style={{ width: "100%", padding: "18px", borderRadius: 16, fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".03em" }}>Lancer mon investigation</button><p style={{ fontSize: 10, color: "var(--t3)", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{IC.shield({ s: 11, c: "var(--t3)" })} Paiement Stripe · Libellé neutre sur relevé</p></div></div></section>

          {/* FOOTER */}
          <footer style={{ borderTop: "1px solid var(--bd)", padding: "44px 20px 28px", maxWidth: 1060, margin: "0 auto" }}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}><div style={{ maxWidth: 300 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ background: "var(--red)", padding: "4px 7px", borderRadius: 6, fontWeight: 800, fontStyle: "italic", fontSize: 14 }}>C<span style={{ color: "var(--gold)" }}>O</span>P</div><span style={{ fontWeight: 700, fontSize: 13 }}>CocuOuPas.fr</span></div><p style={{ fontSize: 11, color: "var(--t3)", lineHeight: 1.7, marginBottom: 14 }}>Investigation numérique confidentielle. Des milliers de personnes retrouvent la sérénité chaque semaine.</p><div style={{ display: "flex", gap: 1 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: "var(--gold)", fontSize: 11 }}>★</span>)}</div><p style={{ fontSize: 10, color: "var(--t3)", marginTop: 2 }}>4.8/5 · <AnimNum target={84712} /> avis</p></div><div style={{ display: "flex", gap: 48 }}>{[{ t: "Légal", items: ["Mentions légales", "CGV / CGU", "Confidentialité", "Cookies"] }, { t: "Support", items: ["Aide 24/7", "Remboursements", "Contact", "Presse"] }].map((c, i) => (<div key={i}><p style={{ fontSize: 9, fontWeight: 800, color: "var(--red)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>{c.t}</p>{c.items.map(l => <p key={l} style={{ fontSize: 11, color: "var(--t3)", marginBottom: 8, cursor: "pointer" }}>{l}</p>)}</div>))}</div></div><div style={{ borderTop: "1px solid var(--bd)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}><p style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".1em", textTransform: "uppercase" }}>© 2026 CocuOuPas.fr — Tous droits réservés</p><div style={{ display: "flex", gap: 14, fontSize: 10, color: "var(--t3)" }}><span>🇫🇷 Service français</span><span style={{ color: "var(--t4)" }}>·</span><span>RGPD</span><span style={{ color: "var(--t4)" }}>·</span><span>SSL</span><span style={{ color: "var(--t4)" }}>·</span><span>Stripe</span></div></div></footer>
        </div>
      )}

      {/* ══════════════ SCAN ══════════════ */}
      {screen === "SCAN" && (
        <div className="fi" style={{ minHeight: "100vh", padding: "68px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 720 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontSize: 11, fontWeight: 700, color: "var(--red)" }}><span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />Investigation en cours — {formatTime(elapsed)}</div>
              <h2 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 6 }}>Analyse de <span style={{ color: "var(--red)", textDecoration: "underline", textUnderlineOffset: 4, textDecorationColor: "rgba(220,38,38,.3)" }}>{getScanLabel()}</span></h2>
              <p style={{ fontSize: 13, color: "var(--t3)" }}>Scan simultané de 3 bases de données — Ne fermez pas cette page</p>
            </div>

            {/* ── BIOMETRIC SCAN CARD (Instagram only) ── */}
            {scanTab === "INSTA" && selectedInstaProfile && (
              <div className="fu" style={{ background: "var(--s1)", borderRadius: 18, border: "1px solid var(--bd)", padding: "18px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "relative", width: 72, height: 72, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: "2px solid rgba(220,38,38,.3)" }}>
                  {selectedInstaProfile.profile_pic_url ? (<img src={`https://images.weserv.nl/?url=${encodeURIComponent(selectedInstaProfile.profile_pic_url)}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<div style={{ width: "100%", height: "100%", background: "var(--s2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 28, c: "var(--t3)" })}</div>)}
                  <div className="bio-grid" style={{ position: "absolute", inset: 0 }} />
                  <div className="scan-line" />
                  {/* Corner markers */}
                  {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (<div key={i} style={{ position: "absolute", [y ? "bottom" : "top"]: 2, [x ? "right" : "left"]: 2, width: 10, height: 10, [y ? "borderBottom" : "borderTop"]: "2px solid var(--red)", [x ? "borderRight" : "borderLeft"]: "2px solid var(--red)", zIndex: 4 }} />))}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--red)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />Comparaison biométrique</p>
                  <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>@{selectedInstaProfile.username}</p>
                  {selectedInstaProfile.full_name && <p style={{ fontSize: 12, color: "var(--t3)" }}>{selectedInstaProfile.full_name}</p>}
                  <p style={{ fontSize: 10, color: "var(--t3)", marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>FaceTrace v4 · {scanPhase === "DONE" ? "Analyse terminée" : "Scan en cours…"}</p>
                </div>
              </div>
            )}

            {/* APP CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {APPS.map((app, i) => {
                const st = appStatus[i]; const isActive = st === "scan"; const bgCol = st === "done" ? "rgba(255,255,255,.02)" : "var(--s1)"; const bdCol = st === "done" ? "rgba(255,255,255,.1)" : isActive ? "rgba(255,255,255,.12)" : "var(--bd)";
                return (<div key={i} style={{ background: bgCol, borderRadius: 16, padding: "18px 14px", border: `1px solid ${bdCol}`, textAlign: "center", transition: "all .5s", opacity: st === "wait" ? .35 : 1, position: "relative", overflow: "hidden" }}>
                  {isActive && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${app.color},transparent)`, animation: "marquee 2s linear infinite" }} />}
                  <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{app.icon}</span>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{app.name}</p>
                  <p style={{ fontSize: 10, color: "var(--t3)", marginBottom: 10 }}>{app.db} profils</p>
                  {st === "wait" && <p style={{ fontSize: 10, color: "var(--t3)" }}>En attente<Dots /></p>}
                  {st === "scan" && (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><div style={{ width: 12, height: 12, border: "2px solid var(--t3)", borderTopColor: app.color, borderRadius: "50%", animation: "spin .7s linear infinite" }} /><span style={{ fontSize: 11, color: app.color, fontWeight: 700 }}>Analyse<Dots /></span></div>)}
                  {st === "done" && (<div className="fu" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>{IC.checkCircle({ s: 13, c: "var(--t2)" })}<span style={{ fontSize: 11, color: "var(--t2)", fontWeight: 600 }}>Analysé</span></div>)}
                </div>);
              })}
            </div>

            {/* PROGRESS */}
            <div style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "var(--t3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}><span>Progression globale</span><span style={{ color: scanPct >= 100 ? "var(--green)" : "var(--t2)" }}>{scanPct}%</span></div><div style={{ height: 6, background: "var(--s2)", borderRadius: 3, overflow: "hidden" }}><div className={scanPct < 100 ? "progress-bar" : ""} style={{ height: "100%", width: `${scanPct}%`, background: scanPct >= 100 ? "var(--green)" : "linear-gradient(90deg,#7f1d1d,#dc2626)", transition: "width .4s ease", borderRadius: 3 }} /></div></div>

            {/* TERMINAL */}
            <div style={{ background: "#030303", borderRadius: 16, border: "1px solid var(--bd)", overflow: "hidden" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--bd)", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "var(--t3)" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}>{IC.terminal({ s: 11 })} investigation.log</span><span style={{ color: "var(--red)", display: "flex", alignItems: "center", gap: 5 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />LIVE</span></div>
              <div className="term" style={{ padding: "14px 16px", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, height: 240, overflowY: "auto", lineHeight: 1.7 }}>{scanLogs.map((l, i) => (<div key={i} className="fi" style={{ display: "flex", gap: 10, marginBottom: 3 }}><span style={{ color: "var(--t4)", flexShrink: 0, fontSize: 10 }}>{l.time}</span><span className={l.text.startsWith("────") ? "log-section" : `log-${l.type}`}>{l.text}</span></div>))}<span className="pulse" style={{ color: "var(--green)", opacity: .25 }}>█</span><div ref={termRef} /></div></div>
            {scanPhase === "DONE" && (<div className="fu" style={{ textAlign: "center", marginTop: 20 }}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{IC.checkCircle({ s: 14, c: "var(--green)" })} Investigation terminée — Rapport prêt</div></div>)}
          </div>
        </div>
      )}

      {/* ══════════════ RESULT (AMBIGUOUS + 2 TIERS) ══════════════ */}
      {screen === "RESULT" && (
        <div className="fi" style={{ minHeight: "100vh", padding: "68px 20px 60px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>

            {/* Verdict — AMBIGUOUS */}
            <div className="fu" style={{ background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 22, padding: "36px 28px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", marginBottom: 14 }}>Rapport d&apos;investigation — {new Date().toLocaleDateString("fr-FR")}</p>
              <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Analyse terminée</h2>
              <p style={{ color: "var(--t2)", fontSize: 14, marginBottom: 16 }}>Résultats disponibles pour <strong style={{ color: "#fff" }}>{getScanLabel()}</strong></p>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
                {[{ v: "3", l: "Plateformes" }, { v: "5.1M", l: "Profils comparés" }, { v: "AES-256", l: "Chiffrement" }].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}><p style={{ fontSize: 18, fontWeight: 800 }}>{s.v}</p><p style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{s.l}</p></div>
                ))}
              </div>
            </div>

            {/* Per-app — ALL LOCKED */}
            <div className="fu d1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
              {APPS.map((app, i) => (
                <div key={i} style={{ background: "var(--s1)", borderRadius: 16, padding: "20px 14px", border: "1px solid var(--bd)", textAlign: "center" }}>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{app.icon}</span>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{app.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(245,158,11,.06)", padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(245,158,11,.12)" }}>
                    {IC.lock({ s: 12, c: "var(--gold)" })}<span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)" }}>Verrouillé</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning banner */}
            <div className="fu d2" style={{ background: "rgba(245,158,11,.04)", border: "1px solid rgba(245,158,11,.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              {IC.alert({ s: 18, c: "var(--gold)" })}
              <div><p style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>Des résultats sensibles nécessitent votre attention</p><p style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>Débloquez le rapport pour consulter les détails de l&apos;investigation.</p></div>
            </div>

            {/* Blurred preview */}
            <div className="fu d3" style={{ background: "var(--s1)", borderRadius: 22, border: "1px solid var(--bd)", overflow: "hidden", marginBottom: 20, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center,rgba(5,5,5,.55) 0%,rgba(5,5,5,.85) 100%)" }}>
                <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: 20, padding: "24px 32px", textAlign: "center", border: "1px solid var(--bd2)" }}>{IC.lock({ s: 24, c: "var(--gold)" })}<p style={{ fontWeight: 800, fontSize: 15, marginTop: 10, marginBottom: 4 }}>Aperçu du rapport</p><p style={{ fontSize: 11, color: "var(--t2)" }}>Débloquez pour consulter les résultats</p></div>
              </div>
              <div style={{ padding: "24px 20px" }}>
                <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 80, height: 100, borderRadius: 12, background: "linear-gradient(135deg,#2a1a1a,#1a1a2a)", flexShrink: 0, overflow: "hidden" }}><div className="blur-heavy" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.user({ s: 32, c: "rgba(255,255,255,.12)" })}</div></div>
                  <div style={{ flex: 1 }}><div className="blur-content"><p style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Prénom, {fakeProfile.age}</p><p style={{ fontSize: 11, color: "var(--t2)" }}>📍 {fakeProfile.city} · à {fakeProfile.km} km</p></div><div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>{fakeProfile.interests.slice(0, 3).map((tag, j) => (<span key={j} className="blur-content" style={{ fontSize: 9, padding: "3px 8px", borderRadius: 100, background: "rgba(255,255,255,.05)", border: "1px solid var(--bd)", color: "var(--t2)" }}>{tag}</span>))}</div></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[{ l: "Dernière activité", v: `il y a ${fakeProfile.hrs}h` }, { l: "Photos", v: `${fakeProfile.photos} photos` }, { l: "Localisation", v: fakeProfile.city }, { l: "Statut", v: "Actif" }].map((m, i) => (<div key={i} style={{ background: "rgba(255,255,255,.02)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--bd)" }}><p style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--t4)", marginBottom: 3 }}>{m.l}</p><p className="blur-content" style={{ fontSize: 12, fontWeight: 600 }}>{m.v}</p></div>))}
                </div>
              </div>
            </div>

            {/* ── 2-TIER PRICING ── */}
            <div className="fu d4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {/* Standard */}
              <div style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 22px", border: "2px solid var(--bd)", display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", marginBottom: 12 }}>Standard</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 18 }}><span style={{ fontSize: 36, fontWeight: 800 }}>3,99€</span><span style={{ fontSize: 12, color: "var(--t3)", textDecoration: "line-through" }}>14,99€</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                  {[{ ok: true, t: "Verdict par application" }, { ok: true, t: "Captures du profil (floutées)" }, { ok: true, t: "Localisation (ville)" }, { ok: false, t: "Bio complète" }, { ok: false, t: "GPS précis" }, { ok: false, t: "Historique 30 jours" }, { ok: false, t: "Certificat PDF" }].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: f.ok ? "var(--t2)" : "var(--t4)" }}>
                      {f.ok ? IC.check({ s: 14, c: "var(--green)" }) : IC.x({ s: 14, c: "var(--t4)" })}{f.t}
                    </div>
                  ))}
                </div>
                <button className="bo" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800 }}>Débloquer</button>
              </div>

              {/* Intégral */}
              <div className="tier-pop" style={{ background: "var(--s1)", borderRadius: 20, padding: "28px 22px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--gold)" }}>Intégral</p>
                  <span style={{ fontSize: 8, fontWeight: 800, background: "var(--gold)", color: "#000", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".04em" }}>Populaire</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 18 }}><span style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg,var(--gold-l),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>9,99€</span><span style={{ fontSize: 12, color: "var(--t3)", textDecoration: "line-through" }}>29,99€</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                  {[{ t: "Verdict par application" }, { t: "Photos HD non floutées" }, { t: "Bio & centres d'intérêt complets" }, { t: "Localisation GPS précise" }, { t: "Dernière connexion exacte" }, { t: "Historique d'activité (30j)" }, { t: "Certificat PDF avec n° de dossier" }].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--t2)" }}>
                      {IC.check({ s: 14, c: "var(--gold)" })}{f.t}
                    </div>
                  ))}
                </div>
                <button className="bg" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{IC.download({ s: 16 })} Débloquer</button>
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: 10, color: "var(--t3)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{IC.shield({ s: 11, c: "var(--t3)" })} Paiement anonyme Stripe · Libellé discret sur relevé bancaire</p>

            <button onClick={() => { setScreen("HOME"); setAppStatus(["wait", "wait", "wait"]); setScanLogs([]); setScanPct(0); }} style={{ display: "block", width: "100%", textAlign: "center", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--t3)", background: "none", border: "none", cursor: "pointer", padding: 14, textDecoration: "underline", textUnderlineOffset: 4 }}>Nouvelle investigation</button>
          </div>
        </div>
      )}
    </div>
  );
}