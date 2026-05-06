import { useState } from "react";
import {
  GraduationCap,
  Shield,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Search,
  BedDouble,
  Bath,
  Heart,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Home,
  Moon,
  Sun,
} from "lucide-react";

// ─────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────
const tokens = {
  navy:      "#1a2b5e",
  navyLight: "#2d4a8a",
  gold:      "#c9a227",
  goldLight: "#e8c547",
  cream:     "#f8f5f0",
  white:     "#ffffff",
  slate:     "#8492a6",
  slateLight:"#eef1f8",
  safe:      "#22c55e",
  warn:      "#f59e0b",
  danger:    "#ef4444",
  safeLight: "#dcfce7",
  warnLight: "#fef3c7",
  dangerLight:"#fee2e2",
};

// ─────────────────────────────────────────
// SAFETY SCORE HELPER
// ─────────────────────────────────────────
function getSafetyMeta(score) {
  if (score >= 80) return { color: tokens.safe,   bg: tokens.safeLight,  label: "Safe",     ring: "#86efac" };
  if (score >= 60) return { color: tokens.warn,   bg: tokens.warnLight,  label: "Moderate", ring: "#fcd34d" };
  return               { color: tokens.danger, bg: tokens.dangerLight,label: "Caution",  ring: "#fca5a5" };
}

// ─────────────────────────────────────────
// SAFETY SCORE BADGE
// ─────────────────────────────────────────
function SafetyBadge({ score, size = "md" }) {
  const meta = getSafetyMeta(score);
  const isLg = size === "lg";

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: isLg ? 10 : 6,
      background: meta.bg,
      border: `1.5px solid ${meta.ring}`,
      borderRadius: 999,
      padding: isLg ? "8px 16px" : "5px 11px",
    }}>
      <Shield
        size={isLg ? 18 : 14}
        style={{ color: meta.color, flexShrink: 0 }}
        fill={meta.color}
        fillOpacity={0.18}
      />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: isLg ? 15 : 12,
        fontWeight: 700,
        color: meta.color,
        letterSpacing: "0.01em",
      }}>
        {score}/100 · {meta.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────
// LISTING CARD
// ─────────────────────────────────────────
function ListingCard({ listing, featured = false }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const meta = getSafetyMeta(listing.safetyScore);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.white,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 24px 60px rgba(26,43,94,0.16), 0 4px 16px rgba(26,43,94,0.08)"
          : "0 4px 24px rgba(26,43,94,0.08), 0 1px 4px rgba(26,43,94,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        width: "100%",
        maxWidth: 360,
        border: featured ? `2px solid ${tokens.gold}` : "1.5px solid rgba(26,43,94,0.07)",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Featured pill */}
      {featured && (
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 10,
          background: tokens.gold, color: tokens.white,
          padding: "4px 12px", borderRadius: 999,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 4px 12px rgba(201,162,39,0.35)",
        }}>
          <Sparkles size={11} /> Featured
        </div>
      )}

      {/* Save button */}
      <button
        onClick={() => setSaved(s => !s)}
        style={{
          position: "absolute", top: 14, right: 14, zIndex: 10,
          background: saved ? tokens.navy : "rgba(255,255,255,0.9)",
          border: "none", borderRadius: "50%",
          width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.2s",
        }}
      >
        <Heart
          size={16}
          fill={saved ? tokens.white : "none"}
          color={saved ? tokens.white : tokens.navy}
        />
      </button>

      {/* Image area */}
      <div style={{
        height: 180,
        background: `linear-gradient(135deg, ${tokens.navyLight} 0%, ${tokens.navy} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Abstract building illustration */}
        <svg width="200" height="140" viewBox="0 0 200 140" fill="none" style={{ opacity: 0.25 }}>
          <rect x="40" y="50" width="60" height="90" rx="4" fill="white"/>
          <rect x="110" y="30" width="50" height="110" rx="4" fill="white"/>
          <rect x="20" y="70" width="30" height="70" rx="4" fill="white"/>
          <rect x="55" y="65" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="75" y="65" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="55" y="90" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="75" y="90" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="120" y="50" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="138" y="50" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="120" y="75" width="12" height="14" rx="2" fill={tokens.navy}/>
          <rect x="138" y="75" width="12" height="14" rx="2" fill={tokens.navy}/>
        </svg>

        {/* Safety score overlay badge */}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
        }}>
          <SafetyBadge score={listing.safetyScore} />
        </div>

        {/* Day/night indicators */}
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", gap: 6,
        }}>
          {listing.safetyDay && (
            <div style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              borderRadius: 999, padding: "3px 8px",
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "white", fontWeight: 600,
            }}>
              <Sun size={10} /> {listing.safetyDay}
            </div>
          )}
          {listing.safetyNight && (
            <div style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              borderRadius: 999, padding: "3px 8px",
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "white", fontWeight: 600,
            }}>
              <Moon size={10} /> {listing.safetyNight}
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 20px 0" }}>
        {/* Title + campus */}
        <div style={{ marginBottom: 10 }}>
          <h3 style={{
            fontSize: 17, fontWeight: 700, color: tokens.navy,
            margin: 0, lineHeight: 1.3,
          }}>
            {listing.title}
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            marginTop: 5, color: tokens.slate, fontSize: 13,
          }}>
            <MapPin size={13} />
            <span>{listing.address}</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 16, marginBottom: 14,
          paddingBottom: 14,
          borderBottom: `1px solid ${tokens.slateLight}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: tokens.slate, fontSize: 13 }}>
            <BedDouble size={14} color={tokens.navyLight} />
            <span><strong style={{ color: tokens.navy }}>{listing.bedrooms}</strong> bed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: tokens.slate, fontSize: 13 }}>
            <Bath size={14} color={tokens.navyLight} />
            <span><strong style={{ color: tokens.navy }}>{listing.bathrooms}</strong> bath</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: tokens.slate, fontSize: 13 }}>
            <Users size={14} color={tokens.navyLight} />
            <span><strong style={{ color: tokens.navy }}>{listing.spots}</strong> spots left</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: tokens.slate, fontSize: 13, marginLeft: "auto" }}>
            <Home size={13} color={tokens.slate} />
            <span>{listing.distanceMi} mi</span>
          </div>
        </div>

        {/* Review snippet */}
        {listing.reviewSnippet && (
          <div style={{
            background: tokens.slateLight,
            borderRadius: 10, padding: "10px 14px",
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              {[...Array(listing.rating)].map((_, i) => (
                <Star key={i} size={12} fill={tokens.gold} color={tokens.gold} />
              ))}
              {[...Array(5 - listing.rating)].map((_, i) => (
                <Star key={i} size={12} fill="none" color={tokens.slate} />
              ))}
            </div>
            <p style={{
              fontSize: 12, color: tokens.slate, margin: 0,
              fontStyle: "italic", lineHeight: 1.5,
            }}>
              "{listing.reviewSnippet}"
            </p>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div style={{
        padding: "0 20px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 900, color: tokens.navy,
          }}>
            ${listing.pricePerPerson.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, color: tokens.slate }}>/person/mo</span>
          {listing.utilitiesIncluded && (
            <div style={{ fontSize: 11, color: tokens.safe, fontWeight: 600, marginTop: 2 }}>
              ✓ Utilities included
            </div>
          )}
        </div>

        <button style={{
          background: tokens.navy, color: tokens.white,
          border: "none", borderRadius: 10,
          padding: "10px 18px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'DM Sans', sans-serif",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = tokens.gold}
          onMouseLeave={e => e.currentTarget.style.background = tokens.navy}
        >
          View <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled] = useState(false);

  const navLinks = [
    { label: "Find Housing", href: "#" },
    { label: "Roommates",    href: "#" },
    { label: "Safety Map",   href: "#" },
    { label: "Reviews",      href: "#" },
    { label: "For Landlords",href: "#" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(248,245,240,0.97)" : tokens.white,
      borderBottom: `1px solid rgba(26,43,94,0.08)`,
      backdropFilter: "blur(16px)",
      fontFamily: "'DM Sans', sans-serif",
      transition: "box-shadow 0.2s",
      boxShadow: scrolled ? "0 4px 24px rgba(26,43,94,0.08)" : "none",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 32px",
        display: "flex", alignItems: "center",
        height: 68,
      }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginRight: 48 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: tokens.navy,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={20} color={tokens.gold} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20, fontWeight: 900,
            color: tokens.navy, letterSpacing: "-0.01em",
          }}>
            Scholar<span style={{ color: tokens.gold }}>Safe</span>
          </span>
        </a>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={{
              fontSize: 14, fontWeight: 500,
              color: tokens.slate, textDecoration: "none",
              padding: "6px 14px", borderRadius: 8,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = tokens.navy; e.currentTarget.style.background = tokens.slateLight; }}
              onMouseLeave={e => { e.currentTarget.style.color = tokens.slate; e.currentTarget.style.background = "transparent"; }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16 }}>
          <a href="#" style={{
            fontSize: 14, fontWeight: 600, color: tokens.navy,
            textDecoration: "none", padding: "8px 16px",
          }}>
            Log in
          </a>
          <a href="#" style={{
            background: tokens.navy, color: tokens.white,
            textDecoration: "none",
            padding: "9px 20px", borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6,
            transition: "background 0.15s",
            boxShadow: "0 2px 8px rgba(26,43,94,0.2)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = tokens.gold}
            onMouseLeave={e => e.currentTarget.style.background = tokens.navy}
          >
            Sign up free <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "none",
            background: "none", border: "none", cursor: "pointer",
            padding: 6, marginLeft: 12,
          }}
        >
          {menuOpen ? <X size={22} color={tokens.navy} /> : <Menu size={22} color={tokens.navy} />}
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────
const SAMPLE_LISTINGS = [
  {
    id: 1,
    title: "Modern 3BR near Campus",
    address: "0.4 mi · Oak District",
    safetyScore: 91,
    safetyDay: "97",
    safetyNight: "84",
    bedrooms: 3,
    bathrooms: 2,
    spots: 2,
    distanceMi: "0.4",
    pricePerPerson: 725,
    utilitiesIncluded: true,
    rating: 5,
    reviewSnippet: "Super quiet at night, landlord replies same-day. Best decision I made.",
  },
  {
    id: 2,
    title: "Cozy Studio · Scholar Row",
    address: "0.2 mi · Scholar Row",
    safetyScore: 74,
    safetyDay: "88",
    safetyNight: "61",
    bedrooms: 1,
    bathrooms: 1,
    spots: 1,
    distanceMi: "0.2",
    pricePerPerson: 980,
    utilitiesIncluded: false,
    rating: 4,
    reviewSnippet: "Great location, a bit noisy on weekends but overall solid.",
  },
  {
    id: 3,
    title: "4BR House · West End",
    address: "1.1 mi · West End",
    safetyScore: 48,
    safetyDay: "71",
    safetyNight: "29",
    bedrooms: 4,
    bathrooms: 2,
    spots: 3,
    distanceMi: "1.1",
    pricePerPerson: 540,
    utilitiesIncluded: false,
    rating: 3,
    reviewSnippet: "Cheap for a reason. Wouldn't walk home alone after dark.",
  },
];

function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const [campus, setCampus] = useState("");

  return (
    <div style={{
      background: tokens.white,
      borderRadius: 16,
      padding: "6px 6px 6px 20px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: "0 8px 40px rgba(26,43,94,0.12), 0 1px 4px rgba(26,43,94,0.06)",
      border: `1.5px solid rgba(26,43,94,0.08)`,
      maxWidth: 540,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Search size={18} color={tokens.slate} style={{ flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Search by university or neighborhood…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          border: "none", outline: "none",
          fontSize: 15, color: tokens.navy,
          background: "transparent", flex: 1,
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      <div style={{ width: 1, height: 24, background: "rgba(26,43,94,0.1)", flexShrink: 0 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", flexShrink: 0 }}>
        <MapPin size={15} color={tokens.slate} />
        <input
          type="text"
          placeholder="Campus"
          value={campus}
          onChange={e => setCampus(e.target.value)}
          style={{
            border: "none", outline: "none",
            fontSize: 15, color: tokens.navy,
            background: "transparent", width: 90,
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <ChevronDown size={14} color={tokens.slate} />
      </div>
      <button style={{
        background: tokens.navy, color: tokens.white,
        border: "none", borderRadius: 10,
        padding: "12px 22px",
        fontSize: 14, fontWeight: 700,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        fontFamily: "'DM Sans', sans-serif",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
        onMouseEnter={e => e.currentTarget.style.background = tokens.gold}
        onMouseLeave={e => e.currentTarget.style.background = tokens.navy}
      >
        Search <ArrowRight size={14} />
      </button>
    </div>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "rgba(255,255,255,0.7)",
      borderRadius: 999, padding: "8px 16px",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(26,43,94,0.08)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: tokens.navy, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: tokens.slate, lineHeight: 1.1 }}>{label}</div>
      </div>
    </div>
  );
}

function Hero() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section style={{
      background: `radial-gradient(ellipse at 70% 50%, rgba(201,162,39,0.08) 0%, transparent 60%),
                   radial-gradient(ellipse at 20% 80%, rgba(26,43,94,0.05) 0%, transparent 50%),
                   ${tokens.cream}`,
      minHeight: "calc(100vh - 68px)",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "80px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 60,
        alignItems: "center",
        width: "100%",
      }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: tokens.slateLight,
            border: "1px solid rgba(26,43,94,0.1)",
            borderRadius: 999, padding: "6px 16px",
            marginBottom: 28,
            animation: "fadeInUp 0.5s ease both",
          }}>
            <TrendingUp size={13} color={tokens.gold} />
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.navy, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              By Students, For Students
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 4.5vw, 3.8rem)",
            fontWeight: 900,
            color: tokens.navy,
            lineHeight: 1.05,
            marginBottom: 20,
            animation: "fadeInUp 0.5s 0.08s ease both",
          }}>
            Find your{" "}
            <span style={{
              color: tokens.gold,
              position: "relative",
              display: "inline-block",
            }}>
              safe
              <svg
                viewBox="0 0 120 8" style={{
                  position: "absolute", bottom: -6, left: 0,
                  width: "100%", height: 8, overflow: "visible",
                }}
              >
                <path d="M2 6 Q30 1 60 5 Q90 9 118 3" stroke={tokens.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </span>{" "}
            place.<br />
            Find your{" "}
            <span style={{ color: tokens.navyLight }}>people.</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 16, lineHeight: 1.75, color: tokens.slate,
            maxWidth: 460, marginBottom: 36,
            animation: "fadeInUp 0.5s 0.16s ease both",
          }}>
            The only student housing platform with verified listings, real student reviews,
            neighborhood safety scores, and compatible roommate matching — all in one place.
          </p>

          {/* Search bar */}
          <div style={{ marginBottom: 36, animation: "fadeInUp 0.5s 0.22s ease both" }}>
            <HeroSearchBar />
          </div>

          {/* Stats pills */}
          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap",
            animation: "fadeInUp 0.5s 0.3s ease both",
          }}>
            <StatPill icon="🎓" value="100%" label="Verified .edu" />
            <StatPill icon="🏠" value="5,000+" label="Listings" />
            <StatPill icon="🛡️" value="Safety-First" label="Always" />
          </div>
        </div>

        {/* ── RIGHT COLUMN — Listing card stack ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
          animation: "fadeInRight 0.6s 0.2s ease both",
        }}>
          {/* Tab selectors */}
          <div style={{
            display: "flex", gap: 6, marginBottom: 16,
            background: tokens.white,
            borderRadius: 12, padding: 4,
            boxShadow: "0 2px 12px rgba(26,43,94,0.08)",
            border: "1px solid rgba(26,43,94,0.06)",
          }}>
            {SAMPLE_LISTINGS.map((l, i) => {
              const m = getSafetyMeta(l.safetyScore);
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveCard(i)}
                  style={{
                    background: activeCard === i ? tokens.navy : "transparent",
                    color: activeCard === i ? tokens.white : tokens.slate,
                    border: "none", borderRadius: 8,
                    padding: "7px 16px",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: m.color, flexShrink: 0,
                  }} />
                  {l.safetyScore >= 80 ? "Safe" : l.safetyScore >= 60 ? "Moderate" : "Caution"}
                </button>
              );
            })}
          </div>

          {/* Active card */}
          <div style={{
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}>
            <ListingCard
              key={activeCard}
              listing={SAMPLE_LISTINGS[activeCard]}
              featured={activeCard === 0}
            />
          </div>

          {/* Floating match indicator */}
          <div style={{
            marginTop: 16,
            background: tokens.white,
            border: `1.5px solid ${tokens.slateLight}`,
            borderRadius: 12, padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 4px 16px rgba(26,43,94,0.07)",
            width: "100%", maxWidth: 360,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${tokens.navy}, ${tokens.navyLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Users size={16} color={tokens.gold} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.navy }}>
                Roommate Match Available
              </div>
              <div style={{ fontSize: 12, color: tokens.slate }}>
                Alex B. · Business Major · 92% compatible
              </div>
            </div>
            <div style={{
              background: tokens.slateLight,
              borderRadius: 999, padding: "4px 12px",
              fontSize: 13, fontWeight: 800, color: tokens.navyLight,
            }}>
              92%
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────
export default function ScholarSafeUI() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: tokens.cream }}>
      <Header />
      <Hero />

      {/* Safety badge demo strip */}
      <div style={{
        background: tokens.white,
        borderTop: `1px solid ${tokens.slateLight}`,
        padding: "24px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "center",
        gap: 16, flexWrap: "wrap",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <span style={{ fontSize: 13, color: tokens.slate, fontWeight: 600 }}>Safety Score examples:</span>
        <SafetyBadge score={91} size="md" />
        <SafetyBadge score={74} size="md" />
        <SafetyBadge score={48} size="md" />
      </div>
    </div>
  );
}
