'use client';

import { useState, useRef } from "react";

const DESTINATIONS = {
  tier1: {
    label: { es: "Destinos populares", pt: "Destinos populares", en: "Popular destinations" },
    countries: [
      { code: "US", name: { es: "Estados Unidos", pt: "Estados Unidos", en: "United States" }, slug: "united-states", flag: "🇺🇸" },
      { code: "ES", name: { es: "España", pt: "Espanha", en: "Spain" }, slug: "spain", flag: "🇪🇸" },
      { code: "IT", name: { es: "Italia", pt: "Itália", en: "Italy" }, slug: "italy", flag: "🇮🇹" },
      { code: "FR", name: { es: "Francia", pt: "França", en: "France" }, slug: "france", flag: "🇫🇷" },
      { code: "GB", name: { es: "Reino Unido", pt: "Reino Unido", en: "United Kingdom" }, slug: "united-kingdom", flag: "🇬🇧" },
      { code: "DE", name: { es: "Alemania", pt: "Alemanha", en: "Germany" }, slug: "germany", flag: "🇩🇪" },
      { code: "TR", name: { es: "Turquía", pt: "Turquia", en: "Turkey" }, slug: "turkey", flag: "🇹🇷" },
    ],
  },
  tier2: {
    label: { es: "Asia, Medio Oriente y más", pt: "Ásia, Oriente Médio e mais", en: "Asia, Middle East & more" },
    countries: [
      { code: "JP", name: { es: "Japón", pt: "Japão", en: "Japan" }, slug: "japan", flag: "🇯🇵" },
      { code: "CA", name: { es: "Canadá", pt: "Canadá", en: "Canada" }, slug: "canada", flag: "🇨🇦" },
      { code: "AE", name: { es: "Dubái / EAU", pt: "Dubai / EAU", en: "Dubai / UAE" }, slug: "uae", flag: "🇦🇪" },
      { code: "PT", name: { es: "Portugal", pt: "Portugal", en: "Portugal" }, slug: "portugal", flag: "🇵🇹" },
      { code: "NL", name: { es: "Países Bajos", pt: "Países Baixos", en: "Netherlands" }, slug: "netherlands", flag: "🇳🇱" },
      { code: "CH", name: { es: "Suiza", pt: "Suíça", en: "Switzerland" }, slug: "switzerland", flag: "🇨🇭" },
    ],
  },
  tier3: {
    label: { es: "Viajes dentro de LATAM", pt: "Viagens na América Latina", en: "Intra-LATAM travel" },
    countries: [
      { code: "AR", name: { es: "Argentina", pt: "Argentina", en: "Argentina" }, slug: "argentina", flag: "🇦🇷" },
      { code: "BR", name: { es: "Brasil", pt: "Brasil", en: "Brazil" }, slug: "brazil", flag: "🇧🇷" },
      { code: "CO", name: { es: "Colombia", pt: "Colômbia", en: "Colombia" }, slug: "colombia", flag: "🇨🇴" },
      { code: "MX", name: { es: "México", pt: "México", en: "Mexico" }, slug: "mexico", flag: "🇲🇽" },
      { code: "CL", name: { es: "Chile", pt: "Chile", en: "Chile" }, slug: "chile", flag: "🇨🇱" },
      { code: "PE", name: { es: "Perú", pt: "Peru", en: "Peru" }, slug: "peru", flag: "🇵🇪" },
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
    nav: { home: "Inicio", plans: "Destinos", how: "Cómo funciona", faq: "FAQ" },
    hero: {
      title: "Tus datos, contigo\na donde vayas",
      subtitle: "Datos móviles instantáneos para tu viaje. Sin chip físico. Sin roaming. Actívalos antes de salir.",
      cta: "Elige tu destino",
      badge: "200+ destinos · 4G/LTE · Activación instantánea",
    },
    destinations: {
      title: "¿A dónde viajas?",
      subtitle: "Selecciona tu destino y llévate tus datos",
    },
    packages: {
      title: "Datos para", gb: "GB", days: "días", unlimited: "Ilimitado",
      throttle: "luego a", buy: "Comprar", back: "← Cambiar destino",
      hotspot: "Hotspot incluido", activation: "Se activa al primer uso",
      popular: "Popular", bestValue: "Mejor valor",
    },
    how: {
      title: "Así de fácil",
      steps: [
        { n: "01", title: "Elige tu destino", desc: "Selecciona el país y el plan de datos que necesitas para tu viaje." },
        { n: "02", title: "Paga seguro", desc: "Tarjeta de crédito/débito o criptomonedas. Pago en USD, sin sorpresas." },
        { n: "03", title: "Recibe tu QR", desc: "Al instante en tu correo. Puedes instalarlo antes de viajar." },
        { n: "04", title: "Aterriza conectado", desc: "Enciende datos móviles al llegar y navega desde el primer segundo." },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Qué es una eSIM y cómo funciona?", a: "Una eSIM es una tarjeta SIM digital integrada en tu teléfono. En lugar de un chip físico, se instala escaneando un código QR que te enviamos por correo. Tu línea local sigue funcionando." },
        { q: "¿Cómo sé si mi teléfono es compatible?", a: "La mayoría de los iPhone desde el XS/XR, Samsung Galaxy S20+, Google Pixel 3+ y Huawei P40+ son compatibles. Tu teléfono debe estar desbloqueado (libre de operador)." },
        { q: "¿Puedo compartir datos por hotspot?", a: "Sí. Todos nuestros planes incluyen hotspot/tethering sin costo adicional." },
        { q: "¿Cuándo se activan los datos?", a: "Los datos se activan cuando enciendes la conexión celular de la eSIM en el país de destino. Puedes instalar la eSIM antes de viajar." },
        { q: "¿Qué métodos de pago aceptan?", a: "Tarjetas de crédito y débito internacionales (Visa, Mastercard, Amex) vía Stripe, y criptomonedas." },
        { q: "¿Puedo recargar si se me acaban los datos?", a: "Sí. Puedes comprar un plan adicional (top-up) para la misma eSIM sin necesidad de instalar una nueva." },
      ],
    },
    checkout: {
      title: "Finalizar compra", email: "Correo electrónico",
      emailPlaceholder: "tu@correo.com", method: "Método de pago",
      stripe: "Tarjeta (Stripe)", crypto: "Criptomonedas",
      summary: "Resumen", country: "Destino", plan: "Plan", total: "Total",
      pay: "Pagar", processing: "Procesando...", success: "¡Compra exitosa!",
      successMsg: "Revisa tu correo. Recibirás el QR de activación en los próximos minutos.",
      back: "← Volver a planes",
      disclaimer: "Datos Contigo es una marca comercial de AseguraPro LLC. Servicio de conectividad digital.",
    },
    footer: {
      tagline: "Tus datos, contigo a donde vayas",
      legal: "AseguraPro LLC — Todos los derechos reservados",
      links: { terms: "Términos", privacy: "Privacidad", contact: "Contacto" },
    },
    langLabel: "ES",
  },
  pt: {
    nav: { home: "Início", plans: "Destinos", how: "Como funciona", faq: "FAQ" },
    hero: {
      title: "Seus dados, com você\npara onde for",
      subtitle: "Dados móveis instantâneos para sua viagem. Sem chip físico. Sem roaming. Ative antes de sair.",
      cta: "Escolha seu destino",
      badge: "200+ destinos · 4G/LTE · Ativação instantânea",
    },
    destinations: {
      title: "Para onde você viaja?",
      subtitle: "Selecione seu destino e leve seus dados",
    },
    packages: {
      title: "Dados para", gb: "GB", days: "dias", unlimited: "Ilimitado",
      throttle: "após", buy: "Comprar", back: "← Mudar destino",
      hotspot: "Hotspot incluído", activation: "Ativa no primeiro uso",
      popular: "Popular", bestValue: "Melhor valor",
    },
    how: {
      title: "Simples assim",
      steps: [
        { n: "01", title: "Escolha seu destino", desc: "Selecione o país e o plano de dados para sua viagem." },
        { n: "02", title: "Pague com segurança", desc: "Cartão de crédito/débito ou cripto. Em USD, sem surpresas." },
        { n: "03", title: "Receba seu QR", desc: "Instantaneamente no seu e-mail. Instale antes de viajar." },
        { n: "04", title: "Chegue conectado", desc: "Ligue os dados móveis ao chegar e navegue desde o primeiro segundo." },
      ],
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        { q: "O que é uma eSIM e como funciona?", a: "Uma eSIM é um cartão SIM digital integrado ao seu telefone. Instala-se escaneando um QR code. Sua linha local continua funcionando." },
        { q: "Meu telefone é compatível?", a: "A maioria dos iPhone desde o XS/XR, Samsung Galaxy S20+, Google Pixel 3+ e Huawei P40+ são compatíveis. Deve estar desbloqueado." },
        { q: "Posso usar hotspot?", a: "Sim. Todos os planos incluem hotspot/tethering sem custo adicional." },
        { q: "Quando os dados são ativados?", a: "Quando você liga a conexão celular da eSIM no país de destino. Pode instalar antes de viajar." },
        { q: "Quais métodos de pagamento?", a: "Cartões internacionais (Visa, Mastercard, Amex) via Stripe e criptomoedas." },
        { q: "Posso recarregar?", a: "Sim. Você pode comprar um plano adicional (top-up) para a mesma eSIM." },
      ],
    },
    checkout: {
      title: "Finalizar compra", email: "E-mail",
      emailPlaceholder: "seu@email.com", method: "Método de pagamento",
      stripe: "Cartão (Stripe)", crypto: "Criptomoedas",
      summary: "Resumo", country: "Destino", plan: "Plano", total: "Total",
      pay: "Pagar", processing: "Processando...", success: "Compra realizada!",
      successMsg: "Verifique seu e-mail. Você receberá o QR de ativação em minutos.",
      back: "← Voltar aos planos",
      disclaimer: "Dados Contigo é marca comercial da AseguraPro LLC. Serviço de conectividade digital.",
    },
    footer: {
      tagline: "Seus dados, com você para onde for",
      legal: "AseguraPro LLC — Todos os direitos reservados",
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
      badge: "200+ destinations · 4G/LTE · Instant activation",
    },
    destinations: {
      title: "Where are you traveling?",
      subtitle: "Pick your destination and take your data with you",
    },
    packages: {
      title: "Data for", gb: "GB", days: "days", unlimited: "Unlimited",
      throttle: "then", buy: "Buy now", back: "← Change destination",
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
      back: "← Back to plans",
      disclaimer: "Datos Contigo is a trademark of AseguraPro LLC. Digital connectivity service.",
    },
    footer: {
      tagline: "Your data, with you wherever you go",
      legal: "AseguraPro LLC — All rights reserved",
      links: { terms: "Terms", privacy: "Privacy", contact: "Contact" },
    },
    langLabel: "EN",
  },
};

const C = {
  bg: "#FFFFFF",
  bgSoft: "#F7F9F8",
  bgAlt: "#F0F4F2",
  surface: "#FFFFFF",
  border: "#E5E9E7",
  borderStrong: "#D1D8D4",
  green: "#49CC68",
  greenDark: "#3BA855",
  greenDarker: "#2E8643",
  greenLight: "#E8F7ED",
  greenGlow: "rgba(73,204,104,0.12)",
  text: "#090D14",
  textMuted: "#5A6670",
  textDim: "#8A939A",
};

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <rect width="56" height="56" rx="14" fill="#49CC68" />
    <circle cx="22" cy="32" r="16" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" fill="none"/>
    <path d="M30 24 A10 10 0 0 1 40 14" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <path d="M33 28 A16 16 0 0 1 48 8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" fill="none"/>
    <circle cx="22" cy="34" r="4" fill="#FFFFFF"/>
    <path d="M22 40 L19.5 37 L24.5 37 Z" fill="#FFFFFF" opacity="0.8"/>
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

  const sFont = "'Proxima Nova', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const scrollTo = (ref) => { setView("home"); setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 100); };
  const goPackages = (c) => { setSelectedCountry(c); setView("packages"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBuy = (pkg) => { setSelectedPackage(pkg); setCheckout({ email: "", method: "stripe", status: "idle" }); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const doPay = () => { if (!checkout.email) return; setCheckout(s => ({ ...s, status: "processing" })); setTimeout(() => setCheckout(s => ({ ...s, status: "success" })), 2400); };

  return (
    <div style={{ fontFamily: sFont, background: C.bg, color: C.text, minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background: ${C.bg}; }
        ::selection { background:${C.green}; color:#FFFFFF; }
        input:focus { outline:2px solid ${C.green}; outline-offset:-2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation:fadeUp .45s ease both }
        .fu1{animation-delay:.06s} .fu2{animation-delay:.12s} .fu3{animation-delay:.18s}
        .fu4{animation-delay:.24s} .fu5{animation-delay:.3s} .fu6{animation-delay:.36s}
        .btn-primary { transition: all .2s ease; }
        .btn-primary:hover { background:${C.greenDark} !important; transform:translateY(-1px); }
        .card-hover { transition: all .25s ease; }
        .card-hover:hover { border-color:${C.green} !important; transform:translateY(-2px); box-shadow: 0 8px 24px rgba(9,13,20,0.06); }
        .dest-card { transition: all .25s ease; }
        .dest-card:hover { border-color:${C.green} !important; background:${C.greenLight} !important; }
        .dest-card:hover .dest-flag { transform:scale(1.1); }
        .link-nav { transition: color .15s ease; }
        .link-nav:hover { color:${C.green} !important; }
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
          .hero-badges { flex-direction:column !important; align-items:flex-start !important; gap:20px !important; }
          .footer-row { flex-direction:column !important; align-items:flex-start !important; gap:20px !important; }
        }
        @media (max-width:480px) {
          .dest-grid { grid-template-columns:repeat(2, 1fr) !important; }
        }
        @media (hover:none) {
          .btn-primary:hover,.card-hover:hover,.dest-card:hover { transform:none; box-shadow:none; }
          .dest-card:active { transform:scale(0.97); background:${C.greenLight}; }
          .card-hover:active { transform:scale(0.99); }
        }
      `}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"0 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
          <div onClick={() => { setView("home"); window.scrollTo({ top:0 }); setMenuOpen(false); }} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
            <Logo size={34} />
            <span style={{ fontWeight:600, fontSize:17, letterSpacing:"-0.01em", color:C.text }}>
              Datos Contigo
            </span>
          </div>
          <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:32 }}>
            {[
              { label: t.nav.plans, action: () => scrollTo(plansRef) },
              { label: t.nav.how, action: () => scrollTo(howRef) },
              { label: t.nav.faq, action: () => scrollTo(faqRef) },
            ].map((item, i) => (
              <span key={i} className="link-nav" onClick={item.action} style={{ cursor:"pointer", fontSize:14, color:C.textMuted, fontWeight:500 }}>
                {item.label}
              </span>
            ))}
            <div style={{ display:"flex", gap:1, background:C.bgAlt, borderRadius:8, padding:3 }}>
              {["es","pt","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  border:"none", cursor:"pointer", padding:"6px 11px", borderRadius:6, fontSize:12, fontWeight:600,
                  background: lang === l ? C.green : "transparent",
                  color: lang === l ? "#FFFFFF" : C.textMuted,
                  transition:"all .15s", fontFamily:sFont,
                }}>{i18n[l].langLabel}</button>
              ))}
            </div>
          </div>
          <div className="mobile-burger" style={{ display:"none", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", gap:1, background:C.bgAlt, borderRadius:6, padding:2 }}>
              {["es","pt","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  border:"none", cursor:"pointer", padding:"5px 9px", borderRadius:5, fontSize:11, fontWeight:600,
                  background: lang === l ? C.green : "transparent",
                  color: lang === l ? "#FFFFFF" : C.textMuted, fontFamily:sFont,
                }}>{i18n[l].langLabel}</button>
              ))}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background:"none", border:"none", cursor:"pointer", padding:8,
              display:"flex", flexDirection:"column", gap:4, width:40, height:40,
              alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ display:"block", width:22, height:2, background:C.text, borderRadius:1, transition:"all .2s", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
              <span style={{ display:"block", width:22, height:2, background:C.text, borderRadius:1, transition:"all .2s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display:"block", width:22, height:2, background:C.text, borderRadius:1, transition:"all .2s", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
            </button>
          </div>
        </div>
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`} style={{
          display:"none", flexDirection:"column", padding:"8px 0 16px",
          borderTop:`1px solid ${C.border}`, gap:2,
        }}>
          {[
            { label: t.nav.plans, action: () => { scrollTo(plansRef); setMenuOpen(false); } },
            { label: t.nav.how, action: () => { scrollTo(howRef); setMenuOpen(false); } },
            { label: t.nav.faq, action: () => { scrollTo(faqRef); setMenuOpen(false); } },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              background:"none", border:"none", cursor:"pointer", padding:"16px 20px",
              fontSize:16, color:C.text, textAlign:"left", fontFamily:sFont, fontWeight:500,
              borderRadius:8, minHeight:48,
            }}>{item.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ paddingTop:68 }}>
        {view === "home" && (<>
          <section style={{ padding:"96px 20px 80px", background:C.bg }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              <div className="fu" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"7px 14px", borderRadius:100,
                background:C.greenLight, color:C.greenDarker,
                fontSize:13, fontWeight:500, marginBottom:28,
                border:`1px solid ${C.green}33`,
              }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:C.green }} />
                {t.hero.badge}
              </div>
              <h1 className="fu fu1" style={{
                fontSize:"clamp(36px,6.5vw,72px)", fontWeight:700,
                lineHeight:1.05, letterSpacing:"-0.035em",
                marginBottom:24, color:C.text, maxWidth:900,
                whiteSpace:"pre-line",
              }}>
                {t.hero.title.split("\n").map((line, i) => (
                  <span key={i} style={{ display:"block" }}>
                    {i === 1 ? <span style={{ color:C.green }}>{line}</span> : line}
                  </span>
                ))}
              </h1>
              <p className="fu fu2" style={{
                fontSize:"clamp(16px,2.2vw,20px)", color:C.textMuted,
                maxWidth:620, marginBottom:40, lineHeight:1.5,
                fontWeight:400,
              }}>
                {t.hero.subtitle}
              </p>
              <button className="fu fu3 btn-primary" onClick={() => scrollTo(plansRef)} style={{
                border:"none", cursor:"pointer", padding:"16px 36px", borderRadius:10,
                background:C.green, color:"#FFFFFF", fontWeight:600, fontSize:16,
                fontFamily:sFont, minHeight:52,
              }}>
                {t.hero.cta} →
              </button>
              <div className="fu fu4 hero-badges" style={{
                marginTop:56, display:"flex", gap:40, flexWrap:"wrap",
              }}>
                {[
                  { label: lang==="en"?"Countries":lang==="pt"?"Países":"Países", value:"200+" },
                  { label: lang==="en"?"Network":lang==="pt"?"Rede":"Red", value:"4G / LTE" },
                  { label: lang==="en"?"Delivery":lang==="pt"?"Entrega":"Entrega", value: lang==="en"?"Instant":"Instantánea" },
                  { label: lang==="en"?"Payment":lang==="pt"?"Pagamento":"Pago", value:"Stripe + Crypto" },
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontSize:22, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>{s.value}</div>
                    <div style={{ fontSize:13, color:C.textDim, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={plansRef} style={{ padding:"80px 20px", background:C.bgSoft, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              <div style={{ marginBottom:48 }}>
                <h2 className="fu" style={{
                  fontSize:"clamp(28px,4.5vw,44px)", fontWeight:700,
                  letterSpacing:"-0.025em", marginBottom:12, color:C.text,
                }}>
                  {t.destinations.title}
                </h2>
                <p className="fu fu1" style={{ color:C.textMuted, fontSize:17, maxWidth:600 }}>
                  {t.destinations.subtitle}
                </p>
              </div>
              {Object.entries(DESTINATIONS).map(([tierKey, tier]) => (
                <div key={tierKey} style={{ marginBottom:40 }}>
                  <div style={{
                    fontSize:12, fontWeight:600, color:C.textDim,
                    textTransform:"uppercase", letterSpacing:"0.08em",
                    marginBottom:16,
                  }}>
                    {tier.label[lang]}
                  </div>
                  <div className="dest-grid" style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",
                    gap:12,
                  }}>
                    {tier.countries.map((c, i) => (
                      <div key={c.code} className={`dest-card fu fu${Math.min(i+1,6)}`} onClick={() => goPackages(c)}
                        style={{
                          background:C.bg, border:`1px solid ${C.border}`,
                          borderRadius:12, padding:"24px 16px",
                          cursor:"pointer", textAlign:"left", minHeight:110,
                          display:"flex", flexDirection:"column", justifyContent:"space-between",
                        }}>
                        <div className="dest-flag" style={{ fontSize:32, transition:"transform .25s ease" }}>{c.flag}</div>
                        <div style={{ fontWeight:600, fontSize:14, color:C.text, marginTop:12 }}>
                          {c.name[lang]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section ref={howRef} style={{ padding:"96px 20px", background:C.bg }}>
            <div style={{ maxWidth:1100, margin:"0 auto" }}>
              <h2 style={{
                fontSize:"clamp(28px,4.5vw,44px)", fontWeight:700,
                letterSpacing:"-0.025em", marginBottom:56, color:C.text,
              }}>
                {t.how.title}
              </h2>
              <div className="how-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:24 }}>
                {t.how.steps.map((step, i) => (
                  <div key={i} className={`fu fu${i+1}`} style={{
                    background:C.bg, border:`1px solid ${C.border}`,
                    borderRadius:14, padding:"32px 28px",
                    display:"flex", flexDirection:"column", gap:12,
                  }}>
                    <div style={{
                      width:40, height:40, borderRadius:10,
                      background:C.greenLight, color:C.greenDarker,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontWeight:700, fontSize:14, marginBottom:8,
                    }}>{step.n}</div>
                    <h3 style={{ fontSize:18, fontWeight:600, color:C.text, letterSpacing:"-0.01em" }}>{step.title}</h3>
                    <p style={{ fontSize:15, color:C.textMuted, lineHeight:1.55 }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={faqRef} style={{ padding:"80px 20px", background:C.bgSoft, borderTop:`1px solid ${C.border}` }}>
            <div style={{ maxWidth:780, margin:"0 auto" }}>
              <h2 style={{
                fontSize:"clamp(28px,4.5vw,44px)", fontWeight:700,
                letterSpacing:"-0.025em", marginBottom:40, color:C.text,
              }}>
                {t.faq.title}
              </h2>
              {t.faq.items.map((item, i) => (
                <div key={i} style={{ borderBottom:`1px solid ${C.border}`, padding:"20px 0" }}>
                  <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    cursor:"pointer", display:"flex", justifyContent:"space-between",
                    alignItems:"center", gap:16, minHeight:44,
                  }}>
                    <span style={{ fontWeight:500, fontSize:16, color:C.text, flex:1 }}>{item.q}</span>
                    <span style={{
                      color:C.green, fontSize:24, fontWeight:300,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition:"transform .25s", flexShrink:0, width:24, textAlign:"center",
                    }}>+</span>
                  </div>
                  {openFaq === i && <p style={{
                    marginTop:12, fontSize:15, color:C.textMuted, lineHeight:1.65,
                    animation:"fadeUp .3s ease",
                  }}>{item.a}</p>}
                </div>
              ))}
            </div>
          </section>
        </>)}

        {view === "packages" && selectedCountry && (
          <section style={{ padding:"48px 20px 80px", maxWidth:1100, margin:"0 auto" }}>
            <button onClick={() => setView("home")} style={{
              background:"none", border:"none", cursor:"pointer",
              color:C.green, fontSize:14, fontWeight:600,
              marginBottom:32, fontFamily:sFont, minHeight:44, padding:0,
            }}>{t.packages.back}</button>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ fontSize:48 }}>{selectedCountry.flag}</span>
              <div>
                <h2 style={{
                  fontSize:"clamp(24px,4vw,36px)", fontWeight:700,
                  letterSpacing:"-0.025em", color:C.text,
                }}>
                  {t.packages.title} {selectedCountry.name[lang]}
                </h2>
                <p style={{ color:C.textMuted, fontSize:14, marginTop:4 }}>4G / LTE</p>
              </div>
            </div>
            <div className="pkg-grid" style={{
              display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16,
            }}>
              {generatePackages(selectedCountry.code).map((pkg, i) => {
                const isPop = i === 2, isBest = i === 4;
                return (
                  <div key={pkg.id} className={`card-hover fu fu${Math.min(i+1,6)}`} style={{
                    background:C.bg,
                    border:`1px solid ${isPop ? C.green : C.border}`,
                    borderRadius:14, padding:"28px 24px",
                    position:"relative",
                    boxShadow: isPop ? "0 4px 16px rgba(73,204,104,0.08)" : "none",
                  }}>
                    {(isPop || isBest) && (
                      <div style={{
                        display:"inline-block", padding:"4px 10px", borderRadius:6,
                        background: C.greenLight, color: C.greenDarker,
                        fontSize:11, fontWeight:600, marginBottom:16,
                        textTransform:"uppercase", letterSpacing:"0.04em",
                      }}>
                        {isPop ? t.packages.popular : t.packages.bestValue}
                      </div>
                    )}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                        <span style={{ fontSize:36, fontWeight:700, color:C.text, letterSpacing:"-0.02em" }}>
                          {pkg.unlimited ? "∞" : pkg.gb}
                        </span>
                        {!pkg.unlimited && (
                          <span style={{ fontSize:16, color:C.textMuted, fontWeight:500 }}>
                            {t.packages.gb}
                          </span>
                        )}
                      </div>
                      {pkg.unlimited && (
                        <div style={{ fontSize:12, color:C.textDim, marginTop:4 }}>
                          {t.packages.unlimited} · {t.packages.throttle} {pkg.throttle}
                        </div>
                      )}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24, fontSize:14, color:C.textMuted }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:C.green, fontWeight:700 }}>✓</span> {pkg.days} {t.packages.days}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:C.green, fontWeight:700 }}>✓</span> {t.packages.hotspot}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ color:C.green, fontWeight:700 }}>✓</span> {t.packages.activation}
                      </div>
                    </div>
                    <div style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      paddingTop:20, borderTop:`1px solid ${C.border}`,
                    }}>
                      <div>
                        <span style={{ fontSize:28, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>
                          ${pkg.price.toFixed(2)}
                        </span>
                        <span style={{ fontSize:13, color:C.textDim, marginLeft:4 }}>USD</span>
                      </div>
                      <button className="btn-primary" onClick={() => goBuy(pkg)} style={{
                        border:"none", cursor:"pointer", padding:"12px 22px", borderRadius:10,
                        background:C.green, color:"#FFFFFF",
                        fontWeight:600, fontSize:14, fontFamily:sFont, minHeight:44,
                      }}>
                        {t.packages.buy}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {view === "checkout" && selectedPackage && selectedCountry && (
          <section style={{ padding:"48px 20px 80px", maxWidth:560, margin:"0 auto" }}>
            <button onClick={() => setView("packages")} style={{
              background:"none", border:"none", cursor:"pointer",
              color:C.green, fontSize:14, fontWeight:600,
              marginBottom:32, fontFamily:sFont, minHeight:44, padding:0,
            }}>{t.checkout.back}</button>
            {checkout.status === "success" ? (
              <div className="fu" style={{
                background:C.bg, border:`1px solid ${C.green}`,
                borderRadius:16, padding:"48px 32px", textAlign:"center",
              }}>
                <div style={{
                  width:64, height:64, borderRadius:"50%",
                  background:C.greenLight, margin:"0 auto 20px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:32, color:C.green, fontWeight:700,
                }}>✓</div>
                <h2 style={{ fontSize:24, fontWeight:700, marginBottom:12, color:C.text, letterSpacing:"-0.02em" }}>
                  {t.checkout.success}
                </h2>
                <p style={{ color:C.textMuted, fontSize:15, lineHeight:1.6, marginBottom:32 }}>
                  {t.checkout.successMsg}
                </p>
                <button className="btn-primary" onClick={() => { setView("home"); window.scrollTo({ top:0 }); }} style={{
                  border:"none", cursor:"pointer", padding:"14px 32px", borderRadius:10,
                  background:C.green, color:"#FFFFFF",
                  fontWeight:600, fontSize:15, fontFamily:sFont, minHeight:48,
                }}>{t.nav.home}</button>
              </div>
            ) : (
              <div className="fu">
                <h2 style={{
                  fontSize:28, fontWeight:700, marginBottom:32,
                  letterSpacing:"-0.025em", color:C.text,
                }}>{t.checkout.title}</h2>
                <div style={{
                  background:C.bgSoft, border:`1px solid ${C.border}`,
                  borderRadius:12, padding:24, marginBottom:24,
                }}>
                  <h3 style={{
                    fontSize:11, fontWeight:600, color:C.textDim,
                    textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16,
                  }}>{t.checkout.summary}</h3>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ color:C.textMuted, fontSize:14 }}>{t.checkout.country}</span>
                    <span style={{ fontWeight:500, fontSize:14, color:C.text }}>
                      {selectedCountry.flag} {selectedCountry.name[lang]}
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <span style={{ color:C.textMuted, fontSize:14 }}>{t.checkout.plan}</span>
                    <span style={{ fontWeight:500, fontSize:14, color:C.text }}>
                      {selectedPackage.unlimited ? t.packages.unlimited : `${selectedPackage.gb} GB`} · {selectedPackage.days} {t.packages.days}
                    </span>
                  </div>
                  <div style={{
                    borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:4,
                    display:"flex", justifyContent:"space-between", alignItems:"baseline",
                  }}>
                    <span style={{ fontWeight:600, fontSize:15, color:C.text }}>{t.checkout.total}</span>
                    <span style={{ fontWeight:700, fontSize:24, color:C.text, letterSpacing:"-0.01em" }}>
                      ${selectedPackage.price.toFixed(2)} <span style={{ fontSize:13, color:C.textDim, fontWeight:500 }}>USD</span>
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:8, color:C.text }}>
                    {t.checkout.email}
                  </label>
                  <input type="email" placeholder={t.checkout.emailPlaceholder} value={checkout.email}
                    onChange={e => setCheckout(s => ({ ...s, email: e.target.value }))}
                    style={{
                      width:"100%", padding:"14px 16px", background:C.bg,
                      border:`1px solid ${C.borderStrong}`, borderRadius:10,
                      color:C.text, fontSize:16, fontFamily:sFont,
                    }} />
                </div>
                <div style={{ marginBottom:28 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:10, color:C.text }}>
                    {t.checkout.method}
                  </label>
                  <div className="pay-methods" style={{ display:"flex", gap:10 }}>
                    {[
                      { id:"stripe", label:t.checkout.stripe, icon:"💳" },
                      { id:"crypto", label:t.checkout.crypto, icon:"₿" },
                    ].map(m => (
                      <button key={m.id} onClick={() => setCheckout(s => ({ ...s, method: m.id }))} style={{
                        flex:1, padding:"14px 16px",
                        background: checkout.method === m.id ? C.greenLight : C.bg,
                        border:`1px solid ${checkout.method === m.id ? C.green : C.borderStrong}`,
                        borderRadius:10, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                        color: checkout.method === m.id ? C.greenDarker : C.text,
                        fontWeight:500, fontSize:14, transition:"all .15s",
                        fontFamily:sFont, minHeight:52,
                      }}>
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn-primary" onClick={doPay}
                  disabled={checkout.status === "processing" || !checkout.email}
                  style={{
                    width:"100%", border:"none",
                    cursor: checkout.email ? "pointer" : "not-allowed",
                    padding:"16px", borderRadius:10,
                    background: checkout.status === "processing" ? C.greenDark : C.green,
                    color:"#FFFFFF", fontWeight:600, fontSize:16, fontFamily:sFont,
                    opacity: !checkout.email ? 0.5 : 1, minHeight:56,
                    animation: checkout.status === "processing" ? "pulse 1.5s infinite" : "none",
                  }}>
                  {checkout.status === "processing" ? t.checkout.processing : `${t.checkout.pay} $${selectedPackage.price.toFixed(2)} USD`}
                </button>
                <p style={{
                  marginTop:20, fontSize:12, color:C.textDim,
                  textAlign:"center", lineHeight:1.6,
                }}>{t.checkout.disclaimer}</p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer style={{
        borderTop:`1px solid ${C.border}`,
        padding:"56px 20px 32px", background:C.bgSoft,
      }}>
        <div className="footer-row" style={{
          maxWidth:1100, margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:32,
        }}>
          <div style={{ maxWidth:340 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <Logo size={32} />
              <span style={{ fontWeight:600, fontSize:16, color:C.text }}>Datos Contigo</span>
            </div>
            <div style={{ fontSize:14, color:C.textMuted, lineHeight:1.5 }}>
              {t.footer.tagline}
            </div>
          </div>
          <div style={{ display:"flex", gap:28, fontSize:14, color:C.textMuted }}>
            <span style={{ cursor:"pointer" }} className="link-nav">{t.footer.links.terms}</span>
            <span style={{ cursor:"pointer" }} className="link-nav">{t.footer.links.privacy}</span>
            <span style={{ cursor:"pointer" }} className="link-nav">{t.footer.links.contact}</span>
          </div>
        </div>
        <div style={{
          maxWidth:1100, margin:"40px auto 0",
          paddingTop:24, borderTop:`1px solid ${C.border}`,
          fontSize:12, color:C.textDim, textAlign:"left",
        }}>
          © {new Date().getFullYear()} {t.footer.legal} · datoscontigo.com
        </div>
      </footer>
    </div>
  );
}
