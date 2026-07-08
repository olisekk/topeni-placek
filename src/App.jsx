import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "775 228 191";
const PHONE_HREF = "tel:+420775228191";
const EMAIL = "placek-petr@seznam.cz";
const EMAIL_HREF = "mailto:placek-petr@seznam.cz";

const schemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Topení Plaček",
  "description": "Instalatér – voda, topení, plyn, odpady, koupelny. Moravskoslezský a Olomoucký kraj. Více než 30 let zkušeností.",
  "telephone": "+420775228191",
  "email": EMAIL,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Opava-Komárov",
    "addressRegion": "Moravskoslezský kraj",
    "addressCountry": "CZ"
  },
  "areaServed": ["Moravskoslezský kraj", "Olomoucký kraj"],
  "openingHours": "Mo-Fr 07:00-17:00",
  "priceRange": "$$"
};

/* ─── useInView ──────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, x = 0, y = 24, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={visible ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.58, delay: delay / 1000, ease: [0.22, 0.68, 0, 1.05] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Global CSS ─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { background: #f4f8fc; overflow-x: hidden; margin: 0 !important; padding: 0 !important; }
  #root, #root > div { width: 100% !important; max-width: 100% !important; }
  main { display: block; width: 100%; }
  #root { width: 100%; }
  .tp-root { width: 100%; }
  img  { max-width: 100%; display: block; }

  .tp-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #1a2636; }

  /* phone pulse */
  @keyframes phonePulse {
    0%   { box-shadow: 0 0 0 0   rgba(201,79,16,.5); }
    70%  { box-shadow: 0 0 0 12px rgba(201,79,16,0); }
    100% { box-shadow: 0 0 0 0   rgba(201,79,16,0); }
  }
  .phone-pulse { animation: phonePulse 2.4s infinite; }

  /* float */
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

  /* nav underline */
  .nav-link { position:relative; }
  .nav-link::after {
    content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px;
    background:#c94f10; transform:scaleX(0); transform-origin:left;
    transition:transform .22s ease;
  }
  .nav-link:hover::after { transform:scaleX(1); }

  /* cards */
  .service-card { transition: transform .22s ease, box-shadow .22s ease; }
  .service-card:hover { transform:translateY(-5px); box-shadow:0 18px 44px rgba(26,38,54,.13) !important; }
  .why-card { transition: border-color .2s ease, transform .2s ease; }
  .why-card:hover { border-color:#2a6fa8 !important; transform:translateY(-3px); }

  /* inputs */
  .tp-input { transition: border-color .18s, box-shadow .18s; }
  .tp-input:focus { border-color:#2a6fa8 !important; outline:none; box-shadow:0 0 0 3px rgba(42,111,168,.12); }

  /* mobile nav */
  @media (max-width:740px) {
    .desktop-nav { display:none !important; }
    .hamburger   { display:flex !important; }
  }

  /* section accent */
  .section-label {
    display:inline-block; font-size:11px; font-weight:700; letter-spacing:2.2px;
    text-transform:uppercase; color:#c94f10;
    margin-bottom:10px;
  }
  .divider {
    width:44px; height:3px; border-radius:2px;
    background:linear-gradient(90deg,#c94f10,#e07a40);
    margin-top:10px;
  }

  /* footer links */
  .foot-link { transition:color .18s; }
  .foot-link:hover { color:#7ab8e8 !important; }

  /* responsive grids */
  @media (max-width:740px) {
    .two-col { grid-template-columns: 1fr !important; gap: 28px !important; }
    .hero-btns { flex-direction: column !important; align-items: stretch !important; }
    .hero-btns a { text-align: center; justify-content: center; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .stat-card-num { font-size: 22px !important; }
  }
`;

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Služby", href: "#sluzby" },
    { label: "Proč my", href: "#proc-my" },
    { label: "Kontakt", href: "#kontakt" },
  ];

  return (
    <nav style={{
      background: "#fff",
      position: "sticky", top: 0, zIndex: 200,
      borderBottom: "1px solid #e0eaf4",
      boxShadow: scrolled ? "0 4px 24px rgba(26,38,54,.09)" : "0 1px 0 #e0eaf4",
      transition: "box-shadow .3s"
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", padding: "14px 0", display: "block" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: "#1a2636", letterSpacing: -.2, lineHeight: 1.1 }}>Topení Plaček</div>
          <div style={{ fontSize: 10, color: "#8aaac0", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 1.4, textTransform: "uppercase", marginTop: 2 }}>
            Moravskoslezský · Olomoucký kraj
          </div>
        </a>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link" style={{
              color: "#2c4a68", textDecoration: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600, fontSize: 14, padding: "18px 14px", display: "inline-block"
            }}>{l.label}</a>
          ))}
          <a href={PHONE_HREF} className="phone-pulse" style={{
            marginLeft: 12,
            background: "#c94f10", color: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 15,
            padding: "10px 20px", borderRadius: 7,
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "background .18s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#a83d08"}
            onMouseLeave={e => e.currentTarget.style.background = "#c94f10"}
          >
            <PhoneIcon size={14} />
            {PHONE}
          </a>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(o => !o)} style={{
          display: "none", alignItems: "center", justifyContent: "center",
          background: "none", border: "1.5px solid #dce8f4",
          borderRadius: 6, cursor: "pointer", width: 40, height: 40, color: "#1a2636"
        }} aria-label="Menu">
          {open
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden", background: "#fff", borderTop: "1px solid #edf2f8" }}
          >
            <div style={{ padding: "12px 24px 20px" }}>
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                  display: "block", padding: "12px 0",
                  color: "#1a2636", textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, fontSize: 16,
                  borderBottom: "1px solid #f0f5fa"
                }}>{l.label}</a>
              ))}
              <a href={PHONE_HREF} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 14, background: "#c94f10", color: "#fff",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: 16,
                padding: "14px 20px", borderRadius: 8, textDecoration: "none"
              }}>
                <PhoneIcon size={15} /> Zavolat: {PHONE}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─── PhoneIcon SVG ──────────────────────────────────────────── */
function PhoneIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 5.55 5.55l1.11-1.11a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);
  const anim = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(20px)",
    transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.22,.68,0,1.1) ${delay}ms`
  });

  return (
    <section style={{
      background: "linear-gradient(150deg, #091929 0%, #102338 40%, #183350 100%)",
      color: "#fff",
      padding: "clamp(56px,9vw,96px) 24px clamp(52px,8vw,88px)",
      position: "relative", overflow: "hidden"
    }}>
      {/* dot texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,.038) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      {/* glow blobs */}
      <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,111,168,.14) 0%, transparent 68%)", top: -120, right: -100, pointerEvents: "none", animation: "float 7s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,79,16,.1) 0%, transparent 70%)", bottom: -60, left: -60, pointerEvents: "none", animation: "float 9s ease-in-out infinite reverse" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <div style={anim(0)}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11.5, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: "#5a9ac8" }}>
            Moravskoslezský kraj · Olomoucký kraj · více než 30 let v oboru
          </span>
        </div>

        <h1 style={{
          ...anim(110),
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(28px, 5.5vw, 56px)",
          fontWeight: 700, lineHeight: 1.1,
          marginTop: 16, marginBottom: 20, letterSpacing: -0.5
        }}>
          Instalatérské práce<br />
          <em style={{ fontStyle: "italic", color: "#6ab2e0" }}>topení, voda, plyn</em> a odpady
        </h1>

        <p style={{
          ...anim(210),
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(15px, 2vw, 17px)",
          color: "#8ab0cc", maxWidth: 520, lineHeight: 1.82, marginBottom: 36
        }}>
          Profesionální instalatérské a topenářské práce po celém Moravskoslezském a Olomouckém kraji. Více než 30 let zkušeností, férové ceny a cena sdělená předem.
        </p>

        <div className="hero-btns" style={{ ...anim(310), display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <a href={PHONE_HREF} className="phone-pulse" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg,#d4541a,#c94f10)",
            color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: "clamp(16px,2vw,19px)",
            padding: "14px 28px", borderRadius: 9,
            textDecoration: "none", letterSpacing: .1,
            transition: "transform .2s, filter .2s"
          }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.currentTarget.style.filter = ""}
          >
            <PhoneIcon size={18} /> Zavolat: {PHONE}
          </a>
          <a href="#kontakt" style={{
            display: "inline-flex", alignItems: "center",
            border: "1.5px solid rgba(255,255,255,.22)",
            color: "#b8d4ec",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600, fontSize: 15,
            padding: "13px 22px", borderRadius: 9,
            textDecoration: "none",
            transition: "border-color .2s, color .2s, background .2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.55)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.22)"; e.currentTarget.style.color = "#b8d4ec"; e.currentTarget.style.background = "transparent"; }}
          >
            Napsat zprávu
          </a>
        </div>

        {/* trust row */}
        <div style={{
          ...anim(400),
          display: "flex", gap: 0, flexWrap: "wrap", marginTop: 48,
          borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 28
        }}>
          {[
            { val: "30+", label: "let v oboru" },
            { val: "2 kraje", label: "oblast působení" },
            { val: "100%", label: "cena předem" },
            { val: "Domácnosti\ni firmy", label: "zákazníci" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: "1 1 120px",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,.07)" : "none",
              padding: "0 28px 0 (i===0?0:28px)",
              paddingLeft: i === 0 ? 0 : 28
            }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "clamp(20px,2.5vw,26px)", color: "#6ab2e0", whiteSpace: "pre-line", lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#4a7a9a", marginTop: 5, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────────── */
const services = [
  {
    title: "Voda",
    slug: "voda",
    short: "Opravy a rozvody vody — od výměny kohoutu po kompletní nové rozvody.",
    items: ["Opravy a výměna vodovodního potrubí", "Nové rozvody studené a teplé vody", "Výměna baterií, kohoutů a splachovačů", "Opravy úniků a prasknutého potrubí", "Připojení spotřebičů (myčka, pračka)", "Tlakové zkoušky potrubí"],
    color: "#2a6fa8"
  },
  {
    title: "Topení",
    slug: "topeni",
    short: "Montáž, servis a opravy kotlů, radiátorů i podlahového vytápění.",
    items: ["Instalace a výměna plynových kotlů", "Montáž a opravy radiátorů", "Podlahové vytápění – instalace a servis", "Odvzdušnění topné soustavy", "Roční servis kotlů", "Opravy poruch topné soustavy"],
    color: "#c94f10"
  },
  {
    title: "Plyn",
    slug: "plyn",
    short: "Plynové rozvody, připojení spotřebičů, revize — odborně a bezpečně.",
    items: ["Montáž a opravy plynového potrubí", "Připojení plynových spotřebičů", "Instalace plynových kotlů", "Revize plynových zařízení", "Detekce úniků plynu", "Přeložky a rekonstrukce rozvodů"],
    color: "#1a7a50"
  },
  {
    title: "Odpady",
    slug: "odpady",
    short: "Čištění a opravy kanalizace, odpadního potrubí a sifónů.",
    items: ["Čištění ucpaných odpadů a kanalizace", "Opravy a výměna odpadního potrubí", "Protlačení a proplach kanalizace", "Instalace sifónů", "Opravy těsnosti kanalizace", "Připojení nových zařizovacích předmětů"],
    color: "#4a6272"
  },
  {
    title: "Rekonstrukce koupelen",
    slug: "koupelny",
    short: "Kompletní rekonstrukce koupelny na klíč – projekt, rozvody, montáž.",
    items: ["Rekonstrukce koupelny na klíč", "Instalace van, sprch a umyvadel", "Rozvody vody a odpadů", "Montáž radiátorů a topných žebříků", "Instalace WC a nádržek", "Konzultace a návrh dispozice"],
    color: "#5a3a88"
  },
];

function Services() {
  return (
    <section id="sluzby" style={{ background: "#f4f8fc", padding: "clamp(56px,8vw,88px) 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <span className="section-label">Naše práce</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,3.5vw,38px)", color: "#1a2636", fontWeight: 700, lineHeight: 1.15, marginBottom: 0 }}>
            Instalatérské služby
          </h2>
          <div className="divider" />
          <p style={{ color: "#4a6a8a", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, maxWidth: 500, lineHeight: 1.72, marginTop: 18 }}>
            Od drobné opravy po rekonstrukci celé koupelny nebo výměnu kotle. Vše řešíme na místě, s jasnou cenou předem.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,280px), 1fr))", gap: 18, marginTop: 44 }}>
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 70}>
              <div className="service-card" style={{
                background: "#fff", borderRadius: 10, padding: "26px 22px 22px",
                boxShadow: "0 2px 14px rgba(26,38,54,.07)",
                borderTop: `3px solid ${s.color}`, height: "100%"
              }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#1a2636", fontWeight: 700, marginBottom: 7 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: "#5a7a96", marginBottom: 16, lineHeight: 1.65 }}>{s.short}</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#3a5870", padding: "5px 0", borderBottom: "1px solid #edf2f7", display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: s.color, fontWeight: 800, flexShrink: 0, fontSize: 13, lineHeight: "20px" }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} style={{ marginTop: 40 }}>
          <a href={PHONE_HREF} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#1a2636", color: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 16,
            padding: "13px 26px", borderRadius: 8,
            textDecoration: "none", transition: "background .18s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#2a3e54"}
            onMouseLeave={e => e.currentTarget.style.background = "#1a2636"}
          >
            <PhoneIcon size={15} /> Domluvit termín: {PHONE}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── WhyUs ──────────────────────────────────────────────────── */
function WhyUs() {
  const reasons = [
    { title: "Více než 30 let zkušeností", desc: "Instalatérskému řemeslu se věnujeme od roku 1991. Za tu dobu jsme realizovali stovky zakázek — od výměny kohoutku po komplexní rekonstrukce." },
    { title: "Cena sdělená předem", desc: "Před zahájením každé práce sdělíme odhadovanou cenu a držíme se jí. Pokud se cokoliv změní, informujeme zákazníka vždy předem." },
    { title: "Poctivá práce", desc: "Záleží nám na tom, aby oprava nebo instalace vydržela. Nepoužíváme levné náhradní díly tam, kde by to mohlo způsobit problémy." },
    { title: "Celý Moravskoslezský a Olomoucký kraj", desc: "Vyjíždíme k zákazníkům po celém regionu — domácnostem i firmám, bez ohledu na vzdálenost v rámci obou krajů." },
    { title: "Osobní přístup", desc: "Každou zakázku posuzujeme osobně na místě. Nejsme zprostředkovatel — přijedeme, podíváme se a řekneme reálné řešení." },
    { title: "Domácnosti i firmy", desc: "Pracujeme pro soukromé zákazníky, bytová družstva i menší firmy. Referenční kontakty poskytneme na vyžádání." },
  ];

  return (
    <section id="proc-my" style={{ background: "#fff", padding: "clamp(56px,8vw,88px) 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <span className="section-label">Proč Topení Plaček</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,3.5vw,38px)", color: "#1a2636", fontWeight: 700, lineHeight: 1.15 }}>
            Co zákazníci oceňují
          </h2>
          <div className="divider" />
          <p style={{ color: "#4a6a8a", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, maxWidth: 480, lineHeight: 1.72, marginTop: 18 }}>
            Žádné marketingové sliby — jen věci, které zákazníci skutečně oceňují.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,272px), 1fr))", gap: 16, marginTop: 44 }}>
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <div className="why-card" style={{
                background: "#f7fafd", borderRadius: 9,
                padding: "22px 20px", border: "1.5px solid #dce8f2", height: "100%"
              }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 15.5, color: "#1a2636", fontWeight: 700, marginBottom: 9, lineHeight: 1.3 }}>{r.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: "#4a6a8a", lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const inp = {
    width: "100%", padding: "11px 14px",
    border: "1.5px solid #ccdaec", borderRadius: 7,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15, color: "#1a2636",
    background: "#fff", boxSizing: "border-box"
  };
  const lbl = { display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#3a5878", marginBottom: 5 };

  return (
    <section id="kontakt" style={{ background: "#f4f8fc", padding: "clamp(56px,8vw,88px) 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Reveal>
          <span className="section-label">Kontakt</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,3.5vw,38px)", color: "#1a2636", fontWeight: 700, lineHeight: 1.15 }}>
            Zavolejte nebo napište
          </h2>
          <div className="divider" />
          <p style={{ color: "#4a6a8a", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, maxWidth: 430, lineHeight: 1.72, marginTop: 18 }}>
            Volejte v pracovní době, nebo nám napište — ozveme se co nejdříve.
          </p>
        </Reveal>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 28, marginTop: 44, alignItems: "start" }}>
          {/* Info */}
          <Reveal x={-20} y={0}>
            <div style={{ background: "#1a2636", borderRadius: 12, padding: "clamp(22px,4vw,32px) clamp(20px,3.5vw,28px)", color: "#fff", marginBottom: 14 }}>
              {[
                { label: "Telefon", content: <a href={PHONE_HREF} style={{ color: "#fff", textDecoration: "none", fontFamily: "'Fraunces', serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 600, display: "block", marginTop: 3 }}>{PHONE}</a> },
                { label: "E-mail", content: <a href={EMAIL_HREF} style={{ color: "#7ab8e0", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15 }}>{EMAIL}</a> },
                { label: "Oblast působení", content: <div style={{ color: "#7ab8e0", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.6 }}>Moravskoslezský kraj<br />Olomoucký kraj</div> },
                { label: "Pracovní doba", content: <div style={{ color: "#7ab8e0", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15 }}>Pondělí – pátek: 7:00 – 17:00</div> },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 22 : 0 }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10.5, letterSpacing: 1.8, textTransform: "uppercase", color: "#3a6080", marginBottom: 4 }}>{row.label}</div>
                  {row.content}
                </div>
              ))}
            </div>
            <a href={PHONE_HREF} className="phone-pulse" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "linear-gradient(135deg,#d4541a,#c94f10)",
              color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "clamp(15px,2vw,17px)",
              padding: "14px 20px", borderRadius: 9,
              textDecoration: "none", transition: "filter .18s"
            }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseLeave={e => e.currentTarget.style.filter = ""}
            >
              <PhoneIcon size={16} /> Zavolat: {PHONE}
            </a>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "clamp(22px,4vw,32px) clamp(20px,3.5vw,28px)", boxShadow: "0 2px 20px rgba(26,38,54,.08)" }}>
              {sent ? (
                <div style={{ padding: "16px 0" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#eaf6f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a7a50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", color: "#1a2636", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Zpráva odeslána</h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#4a6a8a", fontSize: 15, lineHeight: 1.7 }}>
                    Ozveme se co nejdříve. Pro rychlejší odpověď zavolejte na{" "}
                    <a href={PHONE_HREF} style={{ color: "#c94f10", fontWeight: 700 }}>{PHONE}</a>.
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#1a2636", fontWeight: 700, marginBottom: 22 }}>Napsat zprávu</h3>
                  {[
                    { field: "name", label: "Jméno", placeholder: "Jan Novák", type: "text" },
                    { field: "phone", label: "Telefon", placeholder: "604 123 456", type: "tel" },
                  ].map(({ field, label, placeholder, type }) => (
                    <div key={field} style={{ marginBottom: 14 }}>
                      <label style={lbl}>{label}</label>
                      <input type={type} placeholder={placeholder} value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="tp-input" style={inp} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>Zpráva</label>
                    <textarea rows={4} placeholder="Popište, co potřebujete..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="tp-input" style={{ ...inp, resize: "vertical" }} />
                  </div>
                  <button onClick={() => {
                    if (!form.name || !form.phone || !form.message) { alert("Vyplňte prosím všechna pole."); return; }
                    setSent(true);
                  }} style={{
                    width: "100%", background: "#1a2636", color: "#fff",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 16,
                    padding: "13px 20px", border: "none",
                    borderRadius: 7, cursor: "pointer", transition: "background .18s"
                  }}
                    onMouseEnter={e => e.target.style.background = "#2a3e54"}
                    onMouseLeave={e => e.target.style.background = "#1a2636"}
                  >
                    Odeslat zprávu
                  </button>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#8aaac0", marginTop: 12 }}>
                    Preferujete telefon?&nbsp;
                    <a href={PHONE_HREF} style={{ color: "#c94f10", fontWeight: 700 }}>{PHONE}</a>
                  </p>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#0b1822", color: "#4a7a9a", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17, color: "#c0d8ec", marginBottom: 4 }}>Topení Plaček</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>Voda · Topení · Plyn · Odpady · Koupelny</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, marginTop: 4 }}>Moravskoslezský a Olomoucký kraj</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <a href={PHONE_HREF} className="foot-link" style={{ color: "#4a7a9a", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>{PHONE}</a>
          <a href={EMAIL_HREF} className="foot-link" style={{ color: "#4a7a9a", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>{EMAIL}</a>
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: "20px auto 0", paddingTop: 16, borderTop: "1px solid #1a3040", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#2a4a5c", textAlign: "center" }}>
        © {new Date().getFullYear()} Topení Plaček. Všechna práva vyhrazena.
      </div>
    </footer>
  );
}

/* ─── Intro ──────────────────────────────────────────────────── */
function IntroScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#0b1822",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 24px"
      }}
    >
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#c94f10 30%,#c94f10 70%,transparent)", transformOrigin: "center" }} />

      <div style={{ textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 0.68, 0, 1.05], delay: 0.28 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "clamp(28px,7vw,56px)", color: "#e8f2fa", letterSpacing: -0.5, lineHeight: 1.1 }}>
            Topení Plaček
          </div>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.72 }}
          style={{ width: 44, height: 2, background: "#c94f10", borderRadius: 2, margin: "16px auto 14px", transformOrigin: "left" }} />
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "clamp(10px,2vw,13px)", color: "#4a7a9a", letterSpacing: 2.5, textTransform: "uppercase" }}>
          Topení&nbsp;·&nbsp;Podlahové topení&nbsp;·&nbsp;Rozvody vody&nbsp;·&nbsp;Plyn
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.15 }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, color: "#243a4c", marginTop: 12, letterSpacing: 0.4 }}>
          Moravskoslezský · Olomoucký kraj · více než 30 let v oboru
        </motion.div>
      </div>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(42,111,168,.28) 30%,rgba(42,111,168,.28) 70%,transparent)", transformOrigin: "center" }} />
    </motion.div>
  );
}

/* ─── App ────────────────────────────────────────────────────── */
export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof sessionStorage === "undefined") return true;
    if (sessionStorage.getItem("tp_seen")) return false;
    sessionStorage.setItem("tp_seen", "1");
    return true;
  });

  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => setShowIntro(false), 2700);
    return () => clearTimeout(t);
  }, [showIntro]);

  useEffect(() => {
    // Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Schema
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(schemaData);
    document.head.appendChild(s);

    // Meta
    document.title = "Topení Plaček – Instalatér Moravskoslezský a Olomoucký kraj | 775 228 191";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
    m.content = "Topení Plaček – profesionální instalatérské a topenářské práce v Moravskoslezském a Olomouckém kraji. Voda, topení, plyn, odpady, koupelny. Více než 30 let zkušeností. Tel: 775 228 191.";

    // CSS
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen key="intro" />}
      </AnimatePresence>
      <motion.div
        className="tp-root"
        style={{ width: "100%", minWidth: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <Navbar />
        <main>
          <Hero />
          <Services />
          <WhyUs />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
