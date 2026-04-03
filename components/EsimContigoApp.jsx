'use client';

import { useState, useRef } from "react";

const DESTINATIONS = {
  tier1: {
    label: { es: "Destinos populares", pt: "Destinos populares", en: "Popular destinations" },
    countries: [
      { code: "US", name: { es: "Estados Unidos", pt: "Estados Unidos", en: "United States" }, slug: "united-states", flag: "\u{1F1FA}\u{1F1F8}" },
      { code: "ES", name: { es: "Espa\u00f1a", pt: "Espanha", en: "Spain" }, slug: "spain", flag: "\u{1F1EA}\u{1F1F8}" },
      { code: "IT", name: { es: "Italia", pt: "It\u00e1lia", en: "Italy" }, slug: "italy", flag: "\u{1F1EE}\u{1F1F9}" },
      { code: "FR", name: { es: "Francia", pt: "Fran\u00e7a", en: "France" }, slug: "france", flag: "\u{1F1EB}\u{1F1F7}" },
      { code: "GB", name: { es: "Reino Unido", pt: "Reino Unido", en: "United Kingdom" }, slug: "united-kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
      { code: "DE", name: { es: "Alemania", pt: "Alemanha", en: "Germany" }, slug: "germany", flag: "\u{1F1E9}\u{1F1EA}" },
      { code: "TR", name: { es: "Turqu\u00eda", pt: "Turquia", en: "Turkey" }, slug: "turkey", flag: "\u{1F1F9}\u{1F1F7}" },
    ],
  },
  tier2: {
    label: { es: "Asia, Medio Oriente y m\u00e1s", pt: "\u00c1sia, Oriente M\u00e9dio e mais", en: "Asia, Middle East & more" },
    countries: [
      { code: "JP", name: { es: "Jap\u00f3n", pt: "Jap\u00e3o", en: "Japan" }, slug: "japan", flag: "\u{1F1EF}\u{1F1F5}" },
      { code: "CA", name: { es: "Canad\u00e1", pt: "Canad\u00e1", en: "Canada" }, slug: "canada", flag: "\u{1F1E8}\u{1F1E6}" },
      { code: "AE", name: { es: "Dub\u00e1i / EAU", pt: "Dubai / EAU", en: "Dubai / UAE" }, slug: "uae", flag: "\u{1F1E6}\u{1F1EA}" },
      { code: "PT", name: { es: "Portugal", pt: "Portugal", en: "Portugal" }, slug: "portugal", flag: "\u{1F1F5}\u{1F1F9}" },
      { code: "NL", name: { es: "Pa\u00edses Bajos", pt: "Pa\u00edses Baixos", en: "Netherlands" }, slug: "netherlands", flag: "\u{1F1F3}\u{1F1F1}" },
      { code: "CH", name: { es: "Suiza", pt: "Su\u00ed\u00e7a", en: "Switzerland" }, slug: "switzerland", flag: "\u{1F1E8}\u{1F1ED}" },
    ],
  },
  tier3: {
    label: { es: "Viajes dentro de LATAM", pt: "Viagens na Am\u00e9rica Latina", en: "Intra-LATAM travel" },
    countries: [
      { code: "AR", name: { es: "Argentina", pt: "Argentina", en: "Argentina" }, slug: "argentina", flag: "\u{1F1E6}\u{1F1F7}" },
      { code: "BR", name: { es: "Brasil", pt: "Brasil", en: "Brazil" }, slug: "brazil", flag: "\u{1F1E7}\u{1F1F7}" },
      { code: "CO", name: { es: "Colombia", pt: "Col\u00f4mbia", en: "Colombia" }, slug: "colombia", flag: "\u{1F1E8}\u{1F1F4}" },
      { code: "MX", name: { es: "M\u00e9xico", pt: "M\u00e9xico", en: "Mexico" }, slug: "mexico", flag: "\u{1F1F2}\u{1F1FD}" },
      { code: "CL", name: { es: "Chile", pt: "Chile", en: "Chile" }, slug: "chile", flag: "\u{1F1E8}\u{1F1F1}" },
      { code: "PE", name: { es: "Per\u00fa", pt: "Peru", en: "Peru" }, slug: "peru", flag: "\u{1F1F5}\u{1F1EA}" },
    ],
  },
};

const generatePackages = (countryCode) => {
  const base = [
    { gb: 1, days: 7, price: 4.50, unlimited: false },
    { gb: 3, days: 15, price: 8.00, unlimited: false },
    { gb: 5, days: 30, price: 12.00, unlimited: false },
    { gb: 10, days: 30, price: 18.00, unlimited: false },
    { gb: 20, days: 30, price: 28.00, unlimited: false },
    { gb: null, days: 15, price: 22.00, unlimited: true, throttle: "2 GB / 128 Kbps" },
    { gb: null, days: 30, price: 35.00, unlimited: true, throttle: "5 GB / 128 Kbps" },
  ];
  const m = { US:0.95,ES:1.0,IT:1.02,FR:1.05,GB:1.08,DE:1.0,TR:0.85,JP:1.2,CA:0.98,AE:1.15,PT:0.92,NL:1.0,CH:1.25,AR:1.0,BR:1.1,CO:0.98,MX:0.92,CL:0.95,PE:0.90 }[countryCode] || 1;
  return base.map((p, i) => ({
    ...p, id: `${countryCode.toLowerCase()}-${i}`,
    price: Math.round(p.price * m * 100) / 100,
    networks: ["4G", "LTE"], activation: "first-use", hotspot: true,
  }));
};

const i18n = {
  es: {
    nav: { home: "Inicio", plans: "Destinos", how: "C\u00f3mo funciona", faq: "FAQ" },
    hero: {
      title: "Tus datos, contigo\na donde vayas",
      subtitle: "Datos m\u00f3viles instant\u00e1neos para tu viaje. Sin chip f\u00edsico. Sin roaming. Act\u00edvalos antes de salir.",
      cta: "Elige tu destino",
      badge: "200+ destinos \u00b7 4G/LTE \u00b7 Activaci\u00f3n instant\u00e1nea",
    },
    destinations: {
      title: "\u00bfA d\u00f3nde viajas?",
      subtitle: "Selecciona tu destino y ll\u00e9vate tus datos",
    },
    packages: {
      title: "Datos para", gb: "GB", days: "d\u00edas", unlimited: "Ilimitado",
      throttle: "luego a", buy: "Comprar", back: "\u2190 Cambiar destino",
      hotspot: "Hotspot incluido", activation: "Se activa al primer uso",
      popular: "Popular", bestValue: "Mejor valor",
    },
    how: {
      title: "As\u00ed de f\u00e1cil",
      steps: [
        { n: "01", title: "Elige tu destino", desc: "Selecciona el pa\u00eds y el plan de datos que necesitas para tu viaje." },
        { n: "02", title: "Paga seguro", desc: "Tarjeta de cr\u00e9dito/d\u00e9bito o criptomonedas. Pago en USD, sin sorpresas." },
        { n: "03", title: "Recibe tu QR", desc: "Al instante en tu correo. Puedes instalarlo antes de viajar." },
        { n: "04", title: "Aterriza conectado", desc: "Enciende datos m\u00f3viles al llegar y navega desde el primer segundo." },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "\u00bfQu\u00e9 es una eSIM y c\u00f3mo funciona?", a: "Una eSIM es una tarjeta SIM digital integrada en tu tel\u00e9fono. En lugar de un chip f\u00edsico, se instala escaneando un c\u00f3digo QR que te enviamos por correo. Tu l\u00ednea local sigue funcionando." },
        { q: "\u00bfC\u00f3mo s\u00e9 si mi tel\u00e9fono es compatible?", a: "La mayor\u00eda de los iPhone desde el XS/XR, Samsung Galaxy S20+, Google Pixel 3+ y Huawei P40+ son compatibles. Tu tel\u00e9fono debe estar desbloqueado (libre de operador)." },
        { q: "\u00bfPuedo compartir datos por hotspot?", a: "S\u00ed. Todos nuestros planes incluyen hotspot/tethering sin costo adicional." },
        { q: "\u00bfCu\u00e1ndo se activan los datos?", a: "Los datos se activan cuando enciendes la conexi\u00f3n celular de la eSIM en el pa\u00eds de destino. Puedes instalar la eSIM antes de viajar." },
        { q: "\u00bfQu\u00e9 m\u00e9todos de pago aceptan?", a: "Tarjetas de cr\u00e9dito y d\u00e9bito internacionales (Visa, Mastercard, Amex) v\u00eda Stripe, y criptomonedas." },
        { q: "\u00bfPuedo recargar si se me acaban los datos?", a: "S\u00ed. Puedes comprar un plan adicional (top-up) para la misma eSIM sin necesidad de instalar una nueva." },
      ],
    },
    checkout: {
      title: "Finalizar compra", email: "Correo electr\u00f3nico",
      emailPlaceholder: "tu@correo.com", method: "M\u00e9todo de pago",
      stripe: "Tarjeta (Stripe)", crypto: "Criptomonedas",
      summary: "Resumen", country: "Destino", plan: "Plan", total: "Total",
      pay: "Pagar", processing: "Procesando...", success: "\u00a1Compra exitosa!",
      successMsg: "Revisa tu correo. Recibir\u00e1s el QR de activaci\u00f3n en los pr\u00f3ximos minutos.",
      back: "\u2190 Volver a planes",
      disclaimer: "Datos Contigo es una marca comercial de AseguraPro LLC. Servicio de conectividad digital provisto a trav\u00e9s de operadores locales.",
    },
    footer: {
      tagline: "Tus datos, contigo a donde vayas",
      legal: "AseguraPro LLC \u2014 Todos los derechos reservados",
      links: { terms: "T\u00e9rminos", privacy: "Privacidad", contact: "Contacto" },
    },
    langLabel: "ES",
  },
  pt: {
    nav: { home: "In\u00edcio", plans: "Destinos", how: "Como funciona", faq: "FAQ" },
    hero: {
      title: "Seus dados, com voc\u00ea\npara onde for",
      subtitle: "Dados m\u00f3veis instant\u00e2neos para sua viagem. Sem chip f\u00edsico. Sem roaming. Ative antes de sair.",
      cta: "Escolha seu destino",
      badge: "200+ destinos \u00b7 4G/LTE \u00b7 Ativa\u00e7\u00e3o instant\u00e2nea",
    },
    destinations: {
      title: "Para onde voc\u00ea viaja?",
      subtitle: "Selecione seu destino e leve seus dados",
    },
    packages: {
      title: "Dados para", gb: "GB", days: "dias", unlimited: "Ilimitado",
      throttle: "ap\u00f3s", buy: "Comprar", back: "\u2190 Mudar destino",
      hotspot: "Hotspot inclu\u00eddo", activation: "Ativa no primeiro uso",
      popular: "Popular", bestValue: "Melhor valor",
    },
    how: {
      title: "Simples assim",
      steps: [
        { n: "01", title: "Escolha seu destino", desc: "Selecione o pa\u00eds e o plano de dados para sua viagem." },
        { n: "02", title: "Pague com seguran\u00e7a", desc: "Cart\u00e3o de cr\u00e9dito/d\u00e9bito ou cripto. Em USD, sem surpresas." },
        { n: "03", title: "Receba seu QR", desc: "Instantaneamente no seu e-mail. Instale antes de viajar." },
        { n: "04", title: "Chegue conectado", desc: "Ligue os dados m\u00f3veis ao chegar e navegue desde o primeiro segundo." },
      ],
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        { q: "O que \u00e9 uma eSIM e como funciona?", a: "Uma eSIM \u00e9 um cart\u00e3o SIM digital integrado ao seu telefone. Instala-se escaneando um QR code. Sua linha local continua funcionando." },
        { q: "Meu telefone \u00e9 compat\u00edvel?", a: "A maioria dos iPhone desde o XS/XR, Samsung Galaxy S20+, Google Pixel 3+ e Huawei P40+ s\u00e3o compat\u00edveis. Deve estar desbloqueado." },
        { q: "Posso usar hotspot?", a: "Sim. Todos os planos incluem hotspot/tethering sem custo adicional." },
        { q: "Quando os dados s\u00e3o ativados?", a: "Quando voc\u00ea liga a conex\u00e3o celular da eSIM no pa\u00eds de destino. Pode instalar antes de viajar." },
        { q: "Quais m\u00e9todos de pagamento?", a: "Cart\u00f5es internacionais (Visa, Mastercard, Amex) via Stripe e criptomoedas." },
        { q: "Posso recarregar?", a: "Sim. Voc\u00ea pode comprar um plano adicional (top-up) para a mesma eSIM." },
      ],
    },
    checkout: {
      title: "Finalizar compra", email: "E-mail",
      emailPlaceholder: "seu@email.com", method: "M\u00e9todo de pagamento",
      stripe: "Cart\u00e3o (Stripe)", crypto: "Criptomoedas",
      summary: "Resumo", country: "Destino", plan: "Plano", total: "Total",
      pay: "Pagar", processing: "Processando...", success: "Compra realizada!",
      successMsg: "Verifique seu e-mail. Voc\u00ea receber\u00e1 o QR de ativa\u00e7\u00e3o em minutos.",
      back: "\u2190 Voltar aos planos",
      disclaimer: "Dados Contigo \u00e9 marca comercial da AseguraPro LLC. Servi\u00e7o de conectividade digital.",
    },
    footer: {
      tagline: "Seus dados, com voc\u00ea para onde for",
      legal: "AseguraPro LLC \u2014 Todos os direitos reservados",
      links: { terms: "Termos", privacy: "Privacidade", contact: "Contato" },
    },
    langLabel: "PT",
  },
  en: {
    nav: { home: "Home", plans: "Destinations", how: "How it works", faq: "FAQ" },
    hero: {
      title: "Your data, with you\nwherever you go",
      subtitle: "Instant mobile data for your trip. No physical SIM. No roaming fees. Activate before you leave.",
      cta: "Choose your destination",
      badge: "200+ destinations \u00b7 4G/LTE \u00b7 Instant activation",
    },
    destinations: {
      title: "Where are you traveling?",
      subtitle: "Pick your destination and take your data with you",
    },
    packages: {
      title: "Data for", gb: "GB", days: "days", unlimited: "Unlimited",
      throttle: "then", buy: "Buy now", back: "\u2190 Change destination",
      hotspot: "Hotspot included", activation: "Activates on first use",
      popular: "Popular", bestValue: "Best value",
    },
    how: {
      title: "It's that easy",
      steps: [
        { n: "01", title: "Pick your destination", desc: "Choose the country and data plan for your trip." },
        { n: "02", title: "Pay securely", desc: "Credit/debit card or crypto. USD pricing, no surprises." },
        { n: "03", title: "Get your QR", desc: "Instantly by email. Install it before you travel." },
        { n: "04", title: "Land connected", desc: "Turn on mobile data when you arrive and browse from second one." },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is an eSIM and how does it work?", a: "An eSIM is a digital SIM built into your phone. Instead of a physical chip, you install it by scanning a QR code we email you. Your local line keeps working." },
        { q: "Is my phone compatible?", a: "Most iPhones from XS/XR, Samsung Galaxy S20+, Google Pixel 3+, and Huawei P40+ are compatible. Your phone must be carrier-unlocked." },
        { q: "Can I use hotspot?", a: "Yes. All plans include hotspot/tethering at no extra cost." },
        { q: "When does the data activate?", a: "When you turn on the eSIM's cellular connection in the destination country. You can install it before traveling." },
        { q: "What payment methods?", a: "International credit/debit cards (Visa, Mastercard, Amex) via Stripe and cryptocurrency." },
        { q: "Can I top up?", a: "Yes. You can buy an additional plan for the same eSIM without installing a new one." },
      ],
    },
    checkout: {
      title: "Checkout", email: "Email address",
      emailPlaceholder: "you@email.com", method: "Payment method",
      stripe: "Card (Stripe)", crypto: "Cryptocurrency",
      summary: "Summary", country: "Destination", plan: "Plan", total: "Total",
      pay: "Pay", processing: "Processing...", success: "Purchase successful!",
      successMsg: "Check your email. You'll receive the activation QR code within minutes.",
      back: "\u2190 Back to plans",
      disclaimer: "Datos Contigo is a trademark of AseguraPro LLC. Digital connectivity service.",
    },
    footer: {
      tagline: "Your data, with you wherever you go",
      legal: "AseguraPro LLC \u2014 All rights reserved",
      links: { terms: "Terms", privacy: "Privacy", contact: "Contact" },
    },
    langLabel: "EN",
  },
};

const C = {
  bg: "#0A0E17", surface: "#111827", card: "#151d2e",
  accent: "#00D4AA", accentGlow: "rgba(0,212,170,0.15)", sky: "#0EA5E9",
  text: "#F1F5F9", muted: "#94A3B8", dim: "#64748B",
  border: "#1e293b", amber: "#F59E0B", amberGlow: "rgba(245,158,11,0.12)",
  grad: "linear-gradient(135deg, #00D4AA, #0EA5E9)",
};

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <rect width="56" height="56" rx="14" fill="url(#logoGrad)" />
    <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="56" y2="56"><stop stopColor="#00D4AA"/><stop offset="1" stopColor="#0EA5E9"/></linearGradient></defs>
    <circle cx="22" cy="32" r="16" stroke="#0A0E17" strokeWidth="0.7" opacity="0.15" fill="none"/>
    <path d="M30 24 A10 10 0 0 1 40 14" stroke="#0A0E17" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <path d="M33 28 A16 16 0 0 1 48 8" stroke="#0A0E17" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" fill="none"/>
    <circle cx="22" cy="34" r="4" fill="#0A0E17"/>
    <path d="M22 40 L19.5 37 L24.5 37 Z" fill="#0A0E17" opacity="0.7"/>
  </svg>
);

export default function DatosContigoApp() {
  const [lang, setLang] = useState("es");
  const [view, setView] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkout, setCheckout] = useState({ email: "", method: "stripe", status: "idle" });
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = i18n[lang];

  const plansRef = useRef(null);
  const howRef = useRef(null);
  const faqRef = useRef(null);

  const sFont = "'DM Sans', 'Helvetica Neue', sans-serif";
  const sMono = "'Space Mono', monospace";

  const scrollTo = (ref) => { setView("home"); setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 100); };
  const goPackages = (c) => { setSelectedCountry(c); setView("packages"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBuy = (pkg) => { setSelectedPackage(pkg); setCheckout({ email: "", method: "stripe", status: "idle" }); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const doPay = () => { if (!checkout.email) return; setCheckout(s => ({ ...s, status: "processing" })); setTimeout(() => setCheckout(s => ({ ...s, status: "success" })), 2400); };

  return (
    <div style={{ fontFamily: sFont, background: C.bg, color: C.text, minHeight: "100vh" }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        ::selection { background:${C.accent}; color:${C.bg}; }
        input:focus { outline:2px solid ${C.accent}; outline-offset:-2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation:fadeUp .5s ease both }
        .fu1{animation-delay:.08s} .fu2{animation-delay:.16s} .fu3{animation-delay:.24s}
        .fu4{animation-delay:.32s} .fu5{animation-delay:.4s} .fu6{animation-delay:.48s}
        .glow:hover { box-shadow:0 0 30px ${C.accentGlow}; transform:translateY(-2px); }
        .chover:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(0,0,0,.35); border-color:${C.accent}44 !important; }
        .dhover:hover { transform:scale(1.03); border-color:${C.accent} !important; }
        .dhover:hover .dflag { transform:scale(1.12); }
        .desktop-nav { display:flex; }
        .mobile-burger { display:none; }
        .mobile-menu { display:none; }
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-burger { display:flex !important; }
          .mobile-menu.open { display:flex !important; animation:slideDown .25s ease; }
          .dest-grid { grid-template-columns:repeat(3, 1fr) !important; gap:10px !important; }
          .pkg-grid { grid-template-columns:1fr !important; }
          .how-grid { grid-template-columns:1fr !important; }
          .pay-methods { flex-direction:column !important; }
          .hero-badges { flex-direction:column !important; align-items:center !important; gap:14px !important; }
          .footer-row { flex-direction:column !important; text-align:center !important; gap:14px !important; }
        }
        @media (max-width:480px) {
          .dest-grid { grid-template-columns:repeat(2, 1fr) !important; }
        }
        @media (hover:none) {
          .glow:hover,.chover:hover,.dhover:hover { transform:none; box-shadow:none; }
          .dhover:active { transform:scale(0.97); }
          .chover:active { transform:scale(0.98); }
        }
      `}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:`${C.bg}ee`, backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.border}`, padding:"0 16px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div onClick={() => { setView("home"); window.scrollTo({ top:0 }); setMenuOpen(false); }} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <Logo size={32} />
            <span style={{ fontWeight:700, fontSize:16, letterSpacing:"-0.02em" }}>
              Datos <span style={{ color:C.accent }}>Contigo</span>
            </span>
          </div>
          <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:24 }}>
            {[
              { label: t.nav.plans, action: () => scrollTo(plansRef) },
              { label: t.nav.how, action: () => scrollTo(howRef) },
              { label: t.nav.faq, action: () => scrollTo(faqRef) },
            ].map((item, i) => (
              <span key={i} onClick={item.action} style={{ cursor:"pointer", fontSize:14, color:C.muted, transition:"color .2s" }}
                onMouseOver={e => e.target.style.color = C.accent} onMouseOut={e => e.target.style.color = C.muted}
              >{item.label}</span>
            ))}
            <div style={{ display:"flex", gap:2, background:C.surface, borderRadius:8, padding:3 }}>
              {["es","pt","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  border:"none", cursor:"pointer", padding:"5px 10px", borderRadius:6, fontSize:12, fontWeight:600,
                  background: lang === l ? C.accent : "transparent",
                  color: lang === l ? C.bg : C.muted,
                  transition:"all .2s", fontFamily:sMono,
                }}>{i18n[l].langLabel}</button>
              ))}
            </div>
          </div>
          <div className="mobile-burger" style={{ display:"none", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", gap:2, background:C.surface, borderRadius:6, padding:2 }}>
              {["es","pt","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:5, fontSize:11, fontWeight:600,
                  background: lang === l ? C.accent : "transparent",
                  color: lang === l ? C.bg : C.muted, fontFamily:sMono,
                }}>{i18n[l].langLabel}</button>
              ))}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background:"none", border:"none", cursor:"pointer", padding:8,
              display:"flex", flexDirection:"column", gap:4, width:36, height:36,
              alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ display:"block", width:20, height:2, background:C.text, borderRadius:1, transition:"all .2s", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
              <span style={{ display:"block", width:20, height:2, background:C.text, borderRadius:1, transition:"all .2s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display:"block", width:20, height:2, background:C.text, borderRadius:1, transition:"all .2s", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`} style={{
          display:"none", flexDirection:"column", padding:"12px 0 16px",
          borderTop:`1px solid ${C.border}`, gap:4,
        }}>
          {[
            { label: t.nav.plans, action: () => { scrollTo(plansRef); setMenuOpen(false); } },
            { label: t.nav.how, action: () => { scrollTo(howRef); setMenuOpen(false); } },
            { label: t.nav.faq, action: () => { scrollTo(faqRef); setMenuOpen(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              background:"none", border:"none", cursor:"pointer", padding:"14px 16px",
              fontSize:16, color:C.muted, textAlign:"left", fontFamily:sFont,
              borderRadius:8, minHeight:48,
            }}>{item.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ paddingTop:60 }}>
        {view === "home" && (<>
          <section style={{ position:"relative", padding:"70px 16px 60px", textAlign:"center", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-120, left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ position:"relative", maxWidth:820, margin:"0 auto" }}>
              <div className="fu" style={{ display:"inline-block", padding:"6px 16px", borderRadius:50, background:C.accentGlow, border:`1px solid ${C.accent}33`, fontSize:12, fontWeight:500, color:C.accent, marginBottom:26, fontFamily:sMono }}>
                {t.hero.badge}
              </div>
              <h1 className="fu fu1" style={{ fontSize:"clamp(32px,5.5vw,64px)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:20, whiteSpace:"pre-line" }}>
                {t.hero.title.split("\n").map((line, i) => (
                  <span key={i}>{i === 1 && <br />}{i === 0 ? line : <span style={{ background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{line}</span>}</span>
                ))}
              </h1>
              <p className="fu fu2" style={{ fontSize:"clamp(15px,3.5vw,18px)", color:C.muted, maxWidth:540, margin:"0 auto 34px", lineHeight:1.6 }}>{t.hero.subtitle}</p>
              <button className="fu fu3 glow" onClick={() => scrollTo(plansRef)} style={{ border:"none", cursor:"pointer", padding:"15px 38px", borderRadius:12, background:C.grad, color:C.bg, fontWeight:700, fontSize:16, transition:"all .3s", fontFamily:sFont, width:"auto", maxWidth:"100%" }}>
                {t.hero.cta} →
              </button>
              <div className="fu fu4 hero-badges" style={{ marginTop:44, display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap" }}>
                {[{ icon:"\u{1F512}", text:"Stripe & Crypto" }, { icon:"\u26A1", text: lang==="en"?"Instant QR":"QR instant\u00e1neo" }, { icon:"\u{1F4F6}", text:"4G / LTE" }, { icon:"\u{1F30E}", text:"200+ " + (lang==="en"?"countries":"pa\u00edses") }].map((b,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.dim }}>
                    <span style={{ fontSize:16 }}>{b.icon}</span>
                    <span style={{ fontFamily:sMono, fontSize:11 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={plansRef} style={{ padding:"50px 16px 70px", maxWidth:1200, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <h2 className="fu" style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:10 }}>{t.destinations.title}</h2>
              <p className="fu fu1" style={{ color:C.muted, fontSize:16 }}>{t.destinations.subtitle}</p>
            </div>
            {Object.entries(DESTINATIONS).map(([tierKey, tier]) => (
              <div key={tierKey} style={{ marginBottom:36 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.dim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14, fontFamily:sMono }}>
                  {tier.label[lang]}
                </div>
                <div className="dest-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 }}>
                  {tier.countries.map((c, i) => (
                    <div key={c.code} className={`dhover fu fu${Math.min(i+1,6)}`} onClick={() => goPackages(c)}
                      style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"22px 12px", cursor:"pointer", textAlign:"center", transition:"all .3s", minHeight:48 }}>
                      <div className="dflag" style={{ fontSize:36, marginBottom:8, transition:"transform .3s" }}>{c.flag}</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{c.name[lang]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section ref={howRef} style={{ padding:"70px 16px", background:`linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)` }}>
            <div style={{ maxWidth:1000, margin:"0 auto" }}>
              <h2 style={{ textAlign:"center", fontSize:"clamp(24px,4vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:50 }}>{t.how.title}</h2>
              <div className="how-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20 }}>
                {t.how.steps.map((step, i) => (
                  <div key={i} className={`fu fu${i+1}`} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"28px 22px", position:"relative" }}>
                    <div style={{ position:"absolute", top:14, right:14, fontFamily:sMono, fontSize:44, fontWeight:700, color:`${C.accent}0D` }}>{step.n}</div>
                    <div style={{ fontFamily:sMono, fontSize:13, color:C.accent, fontWeight:700, marginBottom:12 }}>{step.n}</div>
                    <h3 style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>{step.title}</h3>
                    <p style={{ fontSize:14, color:C.muted, lineHeight:1.6 }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={faqRef} style={{ padding:"70px 16px", maxWidth:720, margin:"0 auto" }}>
            <h2 style={{ textAlign:"center", fontSize:"clamp(24px,4vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:44 }}>{t.faq.title}</h2>
            {t.faq.items.map((item, i) => (
              <div key={i} style={{ borderBottom:`1px solid ${C.border}`, padding:"18px 0" }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", minHeight:48 }}>
                  <span style={{ fontWeight:500, fontSize:15, flex:1, paddingRight:12 }}>{item.q}</span>
                  <span style={{ color:C.accent, fontSize:22, fontWeight:300, transform: openFaq === i ? "rotate(45deg)" : "none", transition:"transform .3s", flexShrink:0 }}>+</span>
                </div>
                {openFaq === i && <p style={{ marginTop:10, fontSize:14, color:C.muted, lineHeight:1.7, animation:"fadeUp .3s ease" }}>{item.a}</p>}
              </div>
            ))}
          </section>
        </>)}

        {view === "packages" && selectedCountry && (
          <section style={{ padding:"36px 16px 70px", maxWidth:1100, margin:"0 auto" }}>
            <button onClick={() => setView("home")} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:14, fontWeight:500, marginBottom:28, fontFamily:sFont, minHeight:44 }}>{t.packages.back}</button>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:36 }}>
              <span style={{ fontSize:44 }}>{selectedCountry.flag}</span>
              <div>
                <h2 style={{ fontSize:"clamp(20px,4vw,34px)", fontWeight:700, letterSpacing:"-0.02em" }}>{t.packages.title} {selectedCountry.name[lang]}</h2>
                <p style={{ color:C.muted, fontSize:13, marginTop:4 }}>4G / LTE</p>
              </div>
            </div>
            <div className="pkg-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))", gap:14 }}>
              {generatePackages(selectedCountry.code).map((pkg, i) => {
                const isPop = i === 2, isBest = i === 4;
                return (
                  <div key={pkg.id} className={`chover fu fu${Math.min(i+1,6)}`}
                    style={{ background:C.card, border:`1px solid ${isPop ? C.accent+"55" : C.border}`, borderRadius:14, padding:"24px 20px", transition:"all .3s", position:"relative" }}>
                    {isPop && <div style={{ position:"absolute", top:-1, left:20, right:20, height:3, borderRadius:"0 0 3px 3px", background:C.grad }} />}
                    {(isPop || isBest) && (
                      <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:6, background: isPop ? C.accentGlow : C.amberGlow, border:`1px solid ${isPop ? C.accent+"33" : C.amber+"33"}`, fontSize:11, fontWeight:600, color: isPop ? C.accent : C.amber, marginBottom:14, fontFamily:sMono }}>
                        {isPop ? t.packages.popular : t.packages.bestValue}
                      </div>
                    )}
                    <div style={{ marginBottom:14 }}>
                      <span style={{ fontSize:32, fontWeight:700, fontFamily:sMono }}>{pkg.unlimited ? "\u221E" : pkg.gb}</span>
                      {!pkg.unlimited && <span style={{ fontSize:15, color:C.muted, marginLeft:4 }}>{t.packages.gb}</span>}
                      {pkg.unlimited && <span style={{ display:"block", fontSize:12, color:C.dim, marginTop:4, fontFamily:sMono }}>{t.packages.unlimited} \u00b7 {t.packages.throttle} {pkg.throttle}</span>}
                    </div>
                    <div style={{ display:"flex", gap:14, marginBottom:16, fontSize:13, color:C.muted }}>
                      <span>{pkg.days} {t.packages.days}</span><span>{pkg.networks.join(" / ")}</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:20, fontSize:12, color:C.dim }}>
                      <span>{t.packages.hotspot}</span><span>{t.packages.activation}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <span style={{ fontSize:24, fontWeight:700, color:C.accent, fontFamily:sMono }}>${pkg.price.toFixed(2)}</span>
                        <span style={{ fontSize:12, color:C.dim, marginLeft:4 }}>USD</span>
                      </div>
                      <button className="glow" onClick={() => goBuy(pkg)} style={{ border:"none", cursor:"pointer", padding:"12px 22px", borderRadius:10, background:C.grad, color:C.bg, fontWeight:600, fontSize:14, transition:"all .3s", fontFamily:sFont, minHeight:44 }}>{t.packages.buy}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {view === "checkout" && selectedPackage && selectedCountry && (
          <section style={{ padding:"36px 16px 70px", maxWidth:540, margin:"0 auto" }}>
            <button onClick={() => setView("packages")} style={{ background:"none", border:"none", cursor:"pointer", color:C.accent, fontSize:14, fontWeight:500, marginBottom:28, fontFamily:sFont, minHeight:44 }}>{t.checkout.back}</button>
            {checkout.status === "success" ? (
              <div className="fu" style={{ background:C.card, border:`1px solid ${C.accent}44`, borderRadius:18, padding:"40px 24px", textAlign:"center" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>{"\u2705"}</div>
                <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>{t.checkout.success}</h2>
                <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>{t.checkout.successMsg}</p>
                <button onClick={() => { setView("home"); window.scrollTo({ top:0 }); }} style={{ marginTop:28, border:"none", cursor:"pointer", padding:"14px 34px", borderRadius:10, background:C.grad, color:C.bg, fontWeight:600, fontSize:15, fontFamily:sFont, minHeight:48 }}>{t.nav.home}</button>
              </div>
            ) : (
              <div className="fu">
                <h2 style={{ fontSize:24, fontWeight:700, marginBottom:24, letterSpacing:"-0.02em" }}>{t.checkout.title}</h2>
                <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:20, marginBottom:20 }}>
                  <h3 style={{ fontSize:12, fontWeight:600, color:C.dim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14, fontFamily:sMono }}>{t.checkout.summary}</h3>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ color:C.muted, fontSize:14 }}>{t.checkout.country}</span>
                    <span style={{ fontWeight:500, fontSize:14 }}>{selectedCountry.flag} {selectedCountry.name[lang]}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ color:C.muted, fontSize:14 }}>{t.checkout.plan}</span>
                    <span style={{ fontWeight:500, fontSize:14 }}>{selectedPackage.unlimited ? t.packages.unlimited : `${selectedPackage.gb} GB`} \u00b7 {selectedPackage.days} {t.packages.days}</span>
                  </div>
                  <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:600, fontSize:16 }}>{t.checkout.total}</span>
                    <span style={{ fontWeight:700, fontSize:22, color:C.accent, fontFamily:sMono }}>${selectedPackage.price.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:7, color:C.muted }}>{t.checkout.email}</label>
                  <input type="email" placeholder={t.checkout.emailPlaceholder} value={checkout.email}
                    onChange={e => setCheckout(s => ({ ...s, email: e.target.value }))}
                    style={{ width:"100%", padding:"14px 15px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:16, fontFamily:sFont }} />
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:9, color:C.muted }}>{t.checkout.method}</label>
                  <div className="pay-methods" style={{ display:"flex", gap:10 }}>
                    {[{ id:"stripe", label:t.checkout.stripe, icon:"\u{1F4B3}" }, { id:"crypto", label:t.checkout.crypto, icon:"\u20BF" }].map(m => (
                      <button key={m.id} onClick={() => setCheckout(s => ({ ...s, method: m.id }))} style={{
                        flex:1, padding:"14px 14px", background: checkout.method === m.id ? C.accentGlow : C.surface,
                        border:`1px solid ${checkout.method === m.id ? C.accent+"66" : C.border}`, borderRadius:10, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                        color: checkout.method === m.id ? C.accent : C.muted, fontWeight:500, fontSize:14, transition:"all .2s", fontFamily:sFont, minHeight:48,
                      }}><span>{m.icon}</span> {m.label}</button>
                    ))}
                  </div>
                </div>
                <button className="glow" onClick={doPay} disabled={checkout.status === "processing" || !checkout.email}
                  style={{ width:"100%", border:"none", cursor:"pointer", padding:"16px", borderRadius:12,
                    background: checkout.status === "processing" ? C.dim : C.grad,
                    color:C.bg, fontWeight:700, fontSize:16, transition:"all .3s", fontFamily:sFont,
                    opacity: !checkout.email ? 0.5 : 1, minHeight:52,
                    animation: checkout.status === "processing" ? "pulse 1.5s infinite" : "none",
                  }}>
                  {checkout.status === "processing" ? t.checkout.processing : `${t.checkout.pay} $${selectedPackage.price.toFixed(2)} USD`}
                </button>
                <p style={{ marginTop:18, fontSize:11, color:C.dim, textAlign:"center", lineHeight:1.6 }}>{t.checkout.disclaimer}</p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer style={{ borderTop:`1px solid ${C.border}`, padding:"36px 16px", background:C.surface }}>
        <div className="footer-row" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:18 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <Logo size={24} />
              <span style={{ fontWeight:700, fontSize:15 }}>Datos <span style={{ color:C.accent }}>Contigo</span></span>
            </div>
            <div style={{ fontSize:13, color:C.dim, fontStyle:"italic" }}>{t.footer.tagline}</div>
          </div>
          <div style={{ display:"flex", gap:18, fontSize:13, color:C.muted }}>
            <span style={{ cursor:"pointer" }}>{t.footer.links.terms}</span>
            <span style={{ cursor:"pointer" }}>{t.footer.links.privacy}</span>
            <span style={{ cursor:"pointer" }}>{t.footer.links.contact}</span>
          </div>
          <div style={{ fontSize:11, color:C.dim, width:"100%", textAlign:"center", paddingTop:18, borderTop:`1px solid ${C.border}`, fontFamily:sMono }}>
            {"\u00A9"} {new Date().getFullYear()} {t.footer.legal} {"\u00b7"} datoscontigo.com
          </div>
        </div>
      </footer>
    </div>
  );
      }
