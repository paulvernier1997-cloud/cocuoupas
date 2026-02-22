"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Camera, User, ShieldCheck, ChevronRight, Star, Zap, Lock, CreditCard, TrendingUp, AlertTriangle, EyeOff, Database, Smartphone, HelpCircle, CheckCircle2, MapPin, Clock, Image as ImageIcon, Loader2, FileWarning, Fingerprint, Globe, SearchCode, HeartCrack, BellOff, MessageSquareLock, Terminal, Radar, Unlock, ShieldAlert, ChevronDown, Cpu, Network, Binary, Calendar, AtSign, UploadCloud, X } from 'lucide-react';

const CITIES = [
  "Paris (75)", "Marseille (13)", "Lyon (69)", "Toulouse (31)", "Nice (06)", "Nantes (44)",
  "Montpellier (34)", "Strasbourg (67)", "Bordeaux (33)", "Lille (59)", "Rennes (35)",
  "Reims (51)", "Toulon (83)", "Saint-Étienne (42)", "Le Havre (76)", "Grenoble (38)"
];
const APPS = ["Tinder", "Hinge", "Bumble"];
const ACTIONS = ["découvert à", "repéré à", "démasqué à", "identifié à"];

const HACK_LOGS = [
  "Connexion sécurisée au réseau Tor (Relais : Francfort)...",
  "Attribution d'une adresse IP fantôme dynamique... OK",
  "Contournement des pares-feux Cloudflare (Tinder/Bumble)...",
  "Injection du script Shadow-API v4.2 en mémoire...",
  "Accès aux bases de données en lecture seule... RÉUSSI",
  "Analyse croisée des métadonnées (RS & Date de naissance)...",
  "Recherche du profil cible en cours de traitement...",
  "Extraction des coordonnées GPS (Dernière connexion)...",
  "Algorithme FaceTrace : Mapping des traits du visage...",
  "Correspondance visuelle trouvée à 68%... Affinage...",
  "⚠️ CORRESPONDANCE CONFIRMÉE À 94.2% SUR UN PROFIL RÉCENT.",
  "Téléchargement des photos de profil (Source CDN)...",
  "Déchiffrement de la bio et des centres d'intérêts...",
  "Vérification des correspondances Bumble/Hinge actives...",
  "Compilation des preuves numériques en cours...",
  "Chiffrement final du rapport PDF (Standard AES-256)...",
  "Purge sécurisée des traces. Déconnexion réussie."
];

export default function CocuOuPas() {
  const [activeTab, setActiveTab] = useState('DATING_APP');
  const [liveScans, setLiveScans] = useState(42);
  const [recentFind, setRecentFind] = useState("Profil Tinder caché découvert à Paris");

  // Nouveaux states pour le formulaire
  const [targetInput, setTargetInput] = useState({ name: "", username: "", dob: "" });
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'LOCKED'>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanHistory, setScanHistory] = useState<{ time: string, text: string }[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", city: "", time: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll pour le terminal
  useEffect(() => {
    if (scanState === 'SCANNING') {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scanHistory, scanState]);

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animations FOMO
  useEffect(() => {
    const updateMarquee = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const app = APPS[Math.floor(Math.random() * APPS.length)];
      setRecentFind(`Profil ${app} ${ACTIONS[Math.floor(Math.random() * ACTIONS.length)]} ${city.split(' ')[0]}`);
    };

    updateMarquee();
    const findInterval = setInterval(updateMarquee, 3500);
    const scanInterval = setInterval(() => setLiveScans(prev => Math.max(38, prev + (Math.random() > 0.5 ? 1 : -1))), 5000);

    const triggerToast = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const app = APPS[Math.floor(Math.random() * APPS.length)];
      setToast({
        show: true,
        message: `Un compte ${app} actif a été localisé.`,
        city: `📍 Investigation terminée à ${city}`,
        time: `Il y a ${Math.floor(Math.random() * 5) + 1} min`
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    };

    const toastTimer = setTimeout(triggerToast, 4000);
    const toastInterval = setInterval(triggerToast, 22000);

    return () => { clearInterval(findInterval); clearInterval(scanInterval); clearTimeout(toastTimer); clearInterval(toastInterval); };
  }, []);

  // Gestion de l'upload des photos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setUploadedPhotos(prev => [...prev, ...newFiles].slice(0, 3)); // Limite à 3 photos max
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Logique du Scan
  const handleScan = () => {
    if (activeTab === 'DATING_APP' && !targetInput.name) {
      return alert("Veuillez au moins renseigner le Nom et Prénom de la cible.");
    }
    if (activeTab === 'FACE' && uploadedPhotos.length === 0) {
      return alert("Veuillez uploader au moins 1 photo pour lancer l'analyse faciale.");
    }

    setScanState('SCANNING');
    setScanProgress(0);
    setScanHistory([{ time: new Date().toLocaleTimeString('fr-FR', { hour12: false }), text: "Initialisation du protocole IA..." }]);
    window.scrollTo(0, 0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScanState('LOCKED'), 1000);
          return 100;
        }
        if (prev % 6 === 0) {
          const logIndex = Math.floor(prev / 6);
          if (HACK_LOGS[logIndex]) {
            setScanHistory(curr => [...curr, { time: new Date().toLocaleTimeString('fr-FR', { hour12: false }), text: HACK_LOGS[logIndex] }]);
          }
        }
        return prev + 1;
      });
    }, 300);
  };

  const faqs = [
    { q: "Le scan est-il vraiment anonyme ?", a: "À 100%. Nous n'interagissons jamais avec les serveurs des applications de manière directe via votre profil. Nous utilisons des comptes 'Shadow' et des API en lecture seule. La cible ne reçoit aucune notification." },
    { q: "Qu'apparaîtra-t-il sur mon relevé bancaire ?", a: "La discrétion est notre priorité. Le libellé sera neutre ('TS-SERVICES' ou 'WEB-INTEL'). Le nom de notre site n'apparaîtra jamais." },
    { q: "Pourquoi demander le nom d'utilisateur RS ?", a: "Cela permet à notre IA de croiser les photos de profil avec les réseaux sociaux (Instagram, TikTok) pour confirmer l'identité à 100% sur Tinder, Hinge ou Bumble." },
    { q: "Que se passe-t-il si l'IA ne trouve rien ?", a: "Nous vous délivrons un certificat d'absence numérique attestant qu'aucun profil n'a été détecté sur le Big 3. Vous pourrez enfin retrouver votre sérénité." }
  ];

  return (
    <div className="min-h-screen bg-[#070000] text-white font-sans selection:bg-red-500/30 overflow-x-hidden relative">

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-2xl border-l-4 border-red-600 flex items-start gap-4 max-w-sm">
          <div className="bg-red-50 p-2 rounded-full text-red-600 animate-pulse"><ShieldAlert size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{toast.city}</p>
            <p className="text-sm font-black leading-tight text-slate-800">{toast.message}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold"><Clock size={10} /> {toast.time}</p>
          </div>
        </div>
      </div>

      {/* MARQUEE BAR */}
      <div className="w-full bg-[#ffcc00] text-black py-3 flex whitespace-nowrap text-[11px] font-black tracking-tighter uppercase border-b border-black/10 fixed top-0 z-[90] shadow-xl overflow-hidden">
        <div className="animate-marquee flex gap-12 items-center">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-red-600" /> {liveScans} INVESTIGATIONS EN COURS</span>
              <span className="flex items-center gap-2 text-red-700 bg-white/50 px-3 py-0.5 rounded-full font-extrabold italic">{recentFind}</span>
              <span className="flex items-center gap-2">PRIX UNIQUE : 3,99€ <TrendingUp size={14} /></span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================
          ÉCRAN 1 : LANDING PAGE
          ========================================= */}
      {scanState === 'IDLE' && (
        <main className="animate-in fade-in duration-700">

          <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50 mt-14">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-red-600 p-2 rounded-lg shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                <span className="text-2xl font-black tracking-tighter italic">C<span className="text-yellow-400">O</span>P</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">CocuOuPas<span className="text-red-600">.fr</span></span>
            </div>
            <div className="hidden lg:flex gap-10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              <a href="#how" className="hover:text-white transition-colors">Méthode</a>
              <a href="#tech" className="hover:text-white transition-colors">IA-Core</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="#pricing" className="text-yellow-500 hover:text-yellow-400">Accès</a>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Lock size={14} className="text-green-500" />
              <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Sécurisé</span>
            </div>
          </nav>

          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/10 blur-[120px] -z-10 rounded-full" />
            <h1 className="text-6xl md:text-[7.5rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-8 drop-shadow-2xl">
              LA VÉRITÉ POUR LE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">PRIX D'UN CAFÉ !</span>
            </h1>
            <p className="max-w-2xl mx-auto text-white/60 text-lg md:text-xl font-medium mb-16 italic">
              "Ne laissez plus le doute détruire vos nuits. Identifiez les profils cachés en 60 secondes."
            </p>

            {/* CONSOLE DE RECHERCHE PIXEL PERFECT */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] text-slate-900 max-w-4xl mx-auto relative z-20 overflow-hidden">

              {/* TABS HEADER */}
              <div className="flex text-center font-black text-xs md:text-sm tracking-[0.1em] uppercase bg-[#f8f9fa] border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('DATING_APP')}
                  className={`flex-1 py-6 flex justify-center items-center gap-3 transition-all duration-300 relative ${activeTab === 'DATING_APP' ? 'bg-white text-red-600 border-2 border-b-0 border-[#1a73e8] rounded-t-2xl z-10' : 'text-slate-400 hover:text-slate-600 border-b border-slate-200'}`}
                >
                  <Search size={18} /> Dating Apps
                </button>
                <button
                  onClick={() => setActiveTab('FACE')}
                  className={`flex-1 py-6 flex justify-center items-center gap-3 transition-all duration-300 relative ${activeTab === 'FACE' ? 'bg-white text-red-600 border-2 border-b-0 border-[#1a73e8] rounded-t-2xl z-10' : 'text-slate-400 hover:text-slate-600 border-b border-slate-200'}`}
                >
                  <Camera size={18} /> FaceTrace IA
                </button>
              </div>

              <div className="p-8 md:p-12 space-y-8 bg-white border-x-2 border-b-2 border-transparent">
                <div className="text-left space-y-1 mb-2">
                  <h3 className="text-3xl font-black tracking-tight italic text-[#1a1a1a]">Cibler un individu :</h3>
                  <p className="text-slate-500 text-sm font-medium">Plus vous donnez d'informations, plus le scan est précis.</p>
                </div>

                {activeTab === 'DATING_APP' ? (
                  /* VUE 1 : DATING APPS (TEXT INPUTS) */
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="relative group w-full">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text" value={targetInput.name} onChange={(e) => setTargetInput({ ...targetInput, name: e.target.value })}
                        placeholder="Nom et Prénom de la cible..."
                        className="w-full bg-[#f8f9fa] border-2 border-[#f1f3f5] rounded-2xl px-14 py-5 text-lg font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative group flex-1">
                        <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text" value={targetInput.username} onChange={(e) => setTargetInput({ ...targetInput, username: e.target.value })}
                          placeholder="Utilisateur RS (Insta, TikTok...)"
                          className="w-full bg-[#f8f9fa] border-2 border-[#f1f3f5] rounded-2xl px-14 py-5 text-lg font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative group flex-1">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text" value={targetInput.dob} onChange={(e) => setTargetInput({ ...targetInput, dob: e.target.value })}
                          placeholder="Date de naissance (JJ/MM/AA)"
                          className="w-full bg-[#f8f9fa] border-2 border-[#f1f3f5] rounded-2xl px-14 py-5 text-lg font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* VUE 2 : FACETRACE (UPLOAD PHOTOS) */
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-[#f8f9fa] hover:bg-slate-50 transition-colors">
                      <input
                        type="file" multiple accept="image/*" className="hidden" id="face-upload"
                        onChange={handleFileUpload} disabled={uploadedPhotos.length >= 3}
                      />
                      <label htmlFor="face-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-full shadow-sm text-slate-400">
                          <UploadCloud size={32} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-700">Uploadez jusqu'à 3 photos claires du visage.</p>
                          <p className="text-sm text-slate-400">Formats acceptés : JPG, PNG (Max 5MB)</p>
                        </div>
                      </label>
                    </div>

                    {/* Previews des photos */}
                    {uploadedPhotos.length > 0 && (
                      <div className="flex gap-4 justify-center">
                        {uploadedPhotos.map((photo, idx) => (
                          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                            <img src={photo} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                            <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <button onClick={handleScan} className="w-full bg-gradient-to-r from-[#7a1010] to-[#4a0000] text-white font-black text-2xl py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_-10px_rgba(120,0,0,0.6)] hover:scale-[1.02] active:scale-95 uppercase italic tracking-widest">
                    LANCER L'INVESTIGATION <ChevronRight size={28} strokeWidth={4} />
                  </button>
                </div>

                {/* TRUST BADGES */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500"><ShieldCheck size={18} className="text-green-500" /> RECHERCHE 100% ANONYME</div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500"><Lock size={18} className="text-blue-500" /> DISCRÉTION BANCAIRE</div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500"><Star size={18} className="text-yellow-400" fill="currentColor" /> 84K+ SCANS</div>
                </div>
              </div>
            </div>
          </section>

          {/* AS SEEN ON */}
          <section className="py-12 bg-white/5 opacity-40 grayscale hover:grayscale-0 transition-all font-serif italic text-2xl font-black text-center flex justify-center gap-8 md:gap-20 flex-wrap">
            <span>Le Parisien</span><span>Cosmo</span><span>GQ</span><span>Konbini</span>
          </section>

          {/* SYMPTÔMES */}
          <section id="symptoms" className="py-32 bg-black relative">
            <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
              <HeartCrack className="w-16 h-16 text-red-600 mx-auto opacity-30 mb-8" />
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-20">Le doute est un poison mortel.</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Smartphone />, title: "Téléphone caché", desc: "Posé face contre table ou emmené partout, même sous la douche." },
                  { icon: <MessageSquareLock />, title: "Codes modifiés", desc: "Le code de déverrouillage a soudainement changé." },
                  { icon: <BellOff />, title: "Zéro notification", desc: "L'écran reste noir car les alertes Tinder sont masquées." },
                  { icon: <Clock />, title: "Retards suspects", desc: "Justifications floues pour des sorties tardives." }
                ].map((s, i) => (
                  <div key={i} className="bg-[#0f0f0f] p-10 rounded-[2.5rem] border border-white/5 text-left group hover:border-red-600/30 transition-all">
                    <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                    <h3 className="font-black text-lg mb-3 uppercase tracking-tighter italic">{s.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* COMMENT ÇA MARCHE - DÉTAILLÉ */}
          <section id="how" className="py-32 max-w-6xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">Comment ça marche ?</h2>
              <p className="text-white/40 text-lg">Trois étapes vers la tranquillité d'esprit.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <Binary />, title: "Indexation Cloud", desc: "Notre IA interroge les serveurs cache de Tinder, Hinge et Bumble pour identifier les profils créés ou mis à jour récemment." },
                { icon: <Network />, title: "Shadow Crawling", desc: "L'investigation se fait via des proxys résidentiels. Aucune interaction directe avec la cible. Pas de notification." },
                { icon: <Cpu />, title: "Analyse FacetTrace", desc: "Si vous fournissez une photo, notre moteur biométrique scanne plus de 4 milliards d'images pour isoler le bon profil." }
              ].map((h, i) => (
                <div key={i} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 relative group hover:bg-white/10 transition-all">
                  <div className="text-red-500 mb-8">{h.icon}</div>
                  <h3 className="text-2xl font-black italic mb-4 uppercase">{h.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-xl shadow-xl">0{i + 1}</div>
                </div>
              ))}
            </div>
          </section>

          {/* COMPARATIF */}
          <section id="compare" className="py-32 bg-white text-slate-900">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-center mb-20">Le meilleur choix.</h2>
              <div className="bg-slate-50 rounded-[3rem] border-2 border-slate-200 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-3 bg-slate-900 text-white font-black text-[11px] md:text-xs uppercase tracking-widest p-8 text-center items-center">
                  <div className="text-left text-lg italic">Critère</div>
                  <div>Détective Privé</div>
                  <div className="text-red-400 text-lg italic">CocuOuPas</div>
                </div>
                {[
                  { l: "Vitesse", t1: "15 jours", t2: "60 secondes", c: "text-green-600 font-black" },
                  { l: "Coût", t1: "1500€ +", t2: "3,99€", c: "text-green-600 font-black" },
                  { l: "Anonymat", t1: "Risqué", t2: "100% Garanti", c: "text-green-600 font-black" },
                  { l: "Preuves", t1: "Photos floues", t2: "Rapport PDF HD", c: "text-green-600 font-black" }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 border-b border-slate-200 p-8 text-center text-sm font-bold items-center">
                    <div className="text-left font-black text-slate-500 uppercase">{row.l}</div>
                    <div className="text-slate-400">{row.t1}</div>
                    <div className={row.c}>{row.t2}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ GÉANTE */}
          <section id="faq" className="py-32 max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <HelpCircle className="w-16 h-16 text-red-600 mx-auto opacity-30 mb-6" />
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Questions fréquentes</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="border border-white/5 rounded-[2rem] bg-white/5 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-8 flex justify-between items-center text-left hover:bg-white/5 transition-all">
                    <span className="text-lg font-black italic uppercase tracking-tight">{f.q}</span>
                    <ChevronDown className={`transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="p-8 pt-0 text-white/50 leading-relaxed font-medium">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="py-32 max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-red-600 to-[#4a0000] rounded-[4rem] p-1 shadow-2xl">
              <div className="bg-[#0a0000] rounded-[3.8rem] p-12 md:p-20 text-center space-y-10">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase italic">DÉBLOQUER LA VÉRITÉ</h2>
                <div className="flex items-center justify-center gap-5">
                  <span className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">3,99€</span>
                  <div className="text-left font-bold text-white/50 leading-none">
                    <p className="line-through text-2xl mb-2">19,99€</p>
                    <p className="text-[10px] bg-red-600 text-white px-2 py-1 rounded uppercase font-black italic">Accès Unique</p>
                  </div>
                </div>
                <button onClick={() => window.scrollTo(0, 0)} className="w-full max-w-md bg-yellow-400 text-black font-black text-2xl py-7 rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95">DÉMARRER L'INVESTIGATION</button>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"><ShieldCheck size={14} /> TRANSACTION SÉCURISÉE STRIPE</p>
              </div>
            </div>
          </section>

          <footer className="bg-black py-20 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="bg-red-600 p-2 rounded-lg"><span className="text-xl font-black italic">C<span className="text-yellow-400">O</span>P</span></div>
                  <span className="text-lg font-black uppercase italic tracking-widest">CocuOuPas.fr</span>
                </div>
                <p className="text-white/30 text-xs leading-relaxed">Leader de l'investigation numérique privée. Nous aidons plus de 400 utilisateurs par jour à retrouver leur sérénité grâce à notre IA de détection spécialisée.</p>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-red-600">Légalité</h4>
                <ul className="text-white/40 text-xs space-y-4 font-bold">
                  <li className="hover:text-white cursor-pointer transition-colors">Mentions Légales</li>
                  <li className="hover:text-white cursor-pointer transition-colors">CGV / CGU</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Politique de confidentialité</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-red-600">Assistance</h4>
                <ul className="text-white/40 text-xs space-y-4 font-bold">
                  <li className="hover:text-white cursor-pointer transition-colors">Support 24/7</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Remboursements</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Contactez-nous</li>
                </ul>
              </div>
            </div>
            <p className="text-center text-[10px] text-white/10 font-black uppercase tracking-[0.4em]">© 2026 CocuOuPas.fr • INVESTIGATION NUMÉRIQUE</p>
          </footer>
        </main>
      )}

      {/* SCANNING SCREEN (30 SECONDES) */}
      {scanState === 'SCANNING' && (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 animate-in fade-in zoom-in duration-500">
          <div className="w-full max-w-3xl space-y-10">
            <div className="text-center space-y-4">
              <div className="relative w-28 h-28 mx-auto mb-10">
                <Radar size={112} className="text-red-600 animate-[spin_4s_linear_infinite] opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse"><Search size={40} className="text-red-600" /></div>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-widest">Investigation en cours...</h2>
              <p className="text-xl text-red-500 font-black tracking-widest uppercase">
                CIBLE : <span className="text-white underline decoration-red-600 underline-offset-8">
                  {activeTab === 'DATING_APP' ? targetInput.name : "ANALYSE BIOMÉTRIQUE"}
                </span>
              </p>
            </div>
            <div className="bg-[#050505] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="bg-[#111] px-6 py-4 border-b border-white/5 flex justify-between items-center font-mono text-[10px] text-white/30 tracking-widest uppercase italic">
                <div className="flex items-center gap-2"><Terminal size={14} /> TERMINAL COP-IA V4.2</div>
                <span className="text-red-600 animate-pulse flex items-center gap-1">● CONNEXION SHADOW</span>
              </div>
              <div className="p-10 font-mono text-xs md:text-sm space-y-4 h-96 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {scanHistory.map((l, i) => (
                  <div key={i} className="flex gap-4 text-green-500 animate-in slide-in-from-bottom-2">
                    <span className="text-white/20 shrink-0">[{l.time}]</span>
                    <span className={l.text.includes("⚠️") ? "text-red-500 font-black italic" : ""}>{l.text}</span>
                  </div>
                ))}
                <div className="text-green-500/30 animate-pulse">_</div>
                <div ref={terminalEndRef} />
              </div>
              <div className="p-10 bg-[#0a0a0a] border-t border-white/5">
                <div className="flex justify-between text-[11px] font-black uppercase mb-4 tracking-[0.2em]"><span>Progression de l'investigation</span> <span className="text-red-600">{scanProgress}%</span></div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTATS POSITIFS */}
      {scanState === 'LOCKED' && (
        <div className="min-h-screen bg-[#050000] pt-24 px-6 animate-in slide-in-from-bottom-12 duration-700">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-red-600/10 border-2 border-red-600/50 rounded-[3rem] p-12 text-center space-y-4 shadow-[0_0_80px_rgba(220,38,38,0.2)] animate-pulse">
              <AlertTriangle size={64} className="text-red-600 mx-auto" />
              <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">MATCH POSITIF !</h2>
              <p className="text-red-200 text-xl font-bold uppercase tracking-widest leading-relaxed">
                Profil localisé pour <strong className="text-white">"{activeTab === 'DATING_APP' ? targetInput.name : "la personne ciblée"}"</strong>.
              </p>
            </div>
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
              <div className="p-12 space-y-12">
                <div className="flex items-center justify-between bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <div><p className="text-[10px] uppercase text-white/40 font-black tracking-widest mb-1">Score de certitude</p><p className="text-4xl font-black text-red-600 italic">CRITIQUE (94%)</p></div>
                  <div className="w-16 h-16 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[{ i: <ImageIcon />, t: "Photos récupérées", c: "text-blue-400", bg: "bg-blue-400/10" },
                  { i: <Clock />, t: "Activité récente", c: "text-green-400", bg: "bg-green-400/10" },
                  { i: <MapPin />, t: "Localisation GPS", c: "text-orange-400", bg: "bg-orange-400/10" },
                  { i: <FileWarning />, t: "Contenu Bio", c: "text-purple-400", bg: "bg-purple-400/10" }].map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-5">
                      <div className={`w-14 h-14 ${item.bg} ${item.c} rounded-2xl flex items-center justify-center`}>{item.i}</div>
                      <span className="text-white font-black italic uppercase text-xs tracking-widest">{item.t}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-[#600] to-[#200] rounded-[3rem] p-12 text-center border-2 border-red-600/30 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 group-hover:translate-x-full duration-[3s] transition-transform"></div>
                  <p className="text-xs text-yellow-400 font-black uppercase tracking-widest mb-8 italic">Le dossier complet est prêt à être téléchargé</p>
                  <div className="flex items-center justify-center gap-6 mb-10">
                    <span className="text-8xl font-black italic">3,99€</span>
                    <div className="text-left"><p className="line-through text-white/30 text-2xl font-bold italic">19,99€</p><p className="text-[10px] bg-white text-red-900 px-3 py-1 rounded-full font-black uppercase shadow-xl mt-2 tracking-tighter">Accès immédiat</p></div>
                  </div>

                  {/* LIEN STRIPE À PLACER ICI */}
                  <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl py-8 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 uppercase italic">
                    TÉLÉCHARGER LE RAPPORT PDF
                  </button>

                  <p className="text-[10px] text-white/30 mt-8 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 italic"><ShieldCheck size={16} /> Paiement Anonyme • Libellé neutre sur le relevé</p>
                </div>
              </div>
            </div>
            <button onClick={() => setScanState('IDLE')} className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors mb-20 underline underline-offset-8 decoration-white/10">Détruire la session sécurisée</button>
          </div>
        </div>
      )}
    </div>
  );
}