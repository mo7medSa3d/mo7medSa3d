"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState, FC } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Terminal,
  TrendingUp,
  X,
} from "lucide-react";
import {
  PROFILE,
  PROJECTS,
  SKILLS,
  HERO,
  NAVIGATION_ITEMS,
  ABOUT,
  EXPERTISE,
  CONTACT_SECTION,
  FOOTER,
  TERMINAL,
  SKILL_CATEGORIES,
  LOADER,
  UI,
  SOCIALS,
} from "@/constants/data";
import { useTheme } from "@/hooks/useTheme";

const AICore = dynamic(() => import("@/three/AICore"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-[3rem] bg-white/[.03]"
    />
  ),
});

/* -------------------------------------------------------------------------- */
/*  Semantic Theme Tokens                                                     */
/* -------------------------------------------------------------------------- */
type ThemeVars = Record<
  | "--paper"
  | "--paper-2"
  | "--ink"
  | "--muted"
  | "--muted-2"
  | "--line"
  | "--glass"
  | "--glass-border"
  | "--glass-border-strong"
  | "--card"
  | "--card-border"
  | "--signal"
  | "--signal-2"
  | "--signal-wash"
  | "--focus"
  | "--success"
  | "--warning"
  | "--error"
  | "--aurora-1"
  | "--aurora-2"
  | "--shadow"
  | "--shadow-heavy",
  string
>;

const CORE_AMBER = "#8B5CF6";
const CORE_TEAL = "#3B82F6";

const DARK_THEME: ThemeVars = {
  "--paper": "#07080B",
  "--paper-2": "#0F1117",
  "--ink": "#F8FAFC",
  "--muted": "#94A3B8",
  // Raised from #64748B: at 9-10px with wide tracking this label color is used
  // constantly (metrics, eyebrows, timestamps) and needs to clear 4.5:1 on
  // both surfaces, not just body copy.
  "--muted-2": "#7C8AA0",
  "--glass": "rgba(15, 17, 23, 0.72)",
  "--glass-border": "rgba(255, 255, 255, 0.12)",
  "--glass-border-strong": "rgba(255, 255, 255, 0.22)",
  "--card": "#12141B",
  "--card-border": "rgba(255, 255, 255, 0.10)",
  "--line": "rgba(255, 255, 255, 0.08)",
  "--signal": "#3B82F6",
  "--signal-2": "#8B5CF6",
  "--signal-wash": "rgba(59, 130, 246, 0.16)",
  "--focus": "#5EB1FF",
  "--success": "#34D399",
  "--warning": "#FBBF24",
  "--error": "#FB7185",
  "--aurora-1": "rgba(59, 130, 246, 0.14)",
  "--aurora-2": "rgba(139, 92, 246, 0.10)",
  "--shadow": "0 10px 40px -10px rgba(0,0,0,0.6)",
  "--shadow-heavy": "0 25px 80px -15px rgba(0,0,0,0.8)",
};

/* ----------------------------------------------------------------------- *
 *  Light theme — rebuilt from scratch, not a dark-mode inversion.
 *
 *  The old light theme failed because every surface (page, glass, cards)
 *  sat within a few percent of the same near-white value, so nothing had
 *  an edge. Apple, Linear, Vercel and Stripe all solve this the same way:
 *  the *page* is a warm-neutral gray, elevated surfaces are true white,
 *  and hierarchy comes from that gap plus a real (not decorative) shadow —
 *  never from a heavier border alone. Borders stay hairline-thin but are
 *  paired with shadow + a whiter surface, so they read as "precise" rather
 *  than "invisible."
 * ----------------------------------------------------------------------- */
const LIGHT_THEME: ThemeVars = {
  "--paper": "#F4F4F6",
  "--paper-2": "#FFFFFF",
  "--ink": "#16171B",
  "--muted": "#48484F",
  // Was #64748B (~4.6:1 on the old #F8FAFC paper) — too close to the AA
  // floor for 9-10px tracked-out mono labels. #6B6B74 clears ~5.3:1 on
  // both --paper and --paper-2/--card.
  "--muted-2": "#6B6B74",
  // Card surfaces are now near-opaque white so they visibly separate from
  // the gray page instead of blending into it (was 0.82 alpha on an
  // almost-identical paper color — that's the "washed out" bug).
  "--glass": "rgba(255, 255, 255, 0.92)",
  "--glass-border": "rgba(15, 15, 20, 0.12)",
  "--glass-border-strong": "rgba(15, 15, 20, 0.18)",
  "--card": "#FFFFFF",
  "--card-border": "rgba(15, 15, 20, 0.09)",
  "--line": "rgba(15, 15, 20, 0.08)",
  "--signal": "#0A6CFF",
  "--signal-2": "#7C3AED",
  "--signal-wash": "rgba(10, 108, 255, 0.08)",
  "--focus": "#0A6CFF",
  "--success": "#059669",
  "--warning": "#B45309",
  "--error": "#DC2626",
  "--aurora-1": "rgba(10, 108, 255, 0.07)",
  "--aurora-2": "rgba(124, 58, 237, 0.05)",
  // Two-layer shadows (tight contact shadow + soft ambient falloff) is
  // what makes Stripe/Linear surfaces feel "lifted" instead of just
  // outlined. A single soft blur alone reads as flat on white.
  "--shadow": "0 1px 2px rgba(16,16,20,0.04), 0 10px 28px -10px rgba(16,16,20,0.14)",
  "--shadow-heavy": "0 4px 12px rgba(16,16,20,0.06), 0 32px 64px -16px rgba(16,16,20,0.20)",
};

/* -------------------------------------------------------------------------- */
/*  Focus Ring — applied to every interactive element so keyboard users get   */
/*  the same crisp affordance mouse users get from hover states.              */
/* -------------------------------------------------------------------------- */
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]";

/* -------------------------------------------------------------------------- */
/*  Branded Technology Chips System                                           */
/* -------------------------------------------------------------------------- */
interface TechBrandConfig {
  color: string;
  border: string;
  bg: string;
}

const TECH_BRAND_MAP: Record<string, TechBrandConfig> = {
  "React": { color: "#61DAFB", border: "rgba(97,218,251,0.3)", bg: "rgba(97,218,251,0.08)" },
  "Next.js 14": { color: "#3B82F6", border: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.08)" },
  "Next.js": { color: "#3B82F6", border: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.08)" },
  "TypeScript": { color: "#3178C6", border: "rgba(49,120,198,0.3)", bg: "rgba(49,120,198,0.08)" },
  "Rust": { color: "#DEA584", border: "rgba(222,165,132,0.3)", bg: "rgba(222,165,132,0.08)" },
  "Wasm": { color: "#654FF0", border: "rgba(101,79,240,0.3)", bg: "rgba(101,79,240,0.08)" },
  "Tailwind CSS": { color: "#06B6D4", border: "rgba(6,182,212,0.3)", bg: "rgba(6,182,212,0.08)" },
  "Tailwind": { color: "#06B6D4", border: "rgba(6,182,212,0.3)", bg: "rgba(6,182,212,0.08)" },
  "Python": { color: "#F59E0B", border: "rgba(245,158,11,0.3)", bg: "rgba(245,158,11,0.08)" },
  "Docker": { color: "#2496ED", border: "rgba(36,150,237,0.3)", bg: "rgba(36,150,237,0.08)" },
  "Framer Motion": { color: "#A855F7", border: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.08)" },
};

function getTechBrand(techName: string): TechBrandConfig {
  return (
    TECH_BRAND_MAP[techName] || {
      color: "#94A3B8",
      border: "rgba(148,163,184,0.25)",
      bg: "rgba(148,163,184,0.06)",
    }
  );
}

/* -------------------------------------------------------------------------- */
/*  Utility Hooks                                                             */
/* -------------------------------------------------------------------------- */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return reduced;
}

function useRafThrottledScroll(callback: () => void, deps: React.DependencyList) {
  useEffect(() => {
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        callback();
        frame = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, deps);
}

/* -------------------------------------------------------------------------- */
/*  Magnetic Button Container                                                 */
/* -------------------------------------------------------------------------- */
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const handlePointerMove = useCallback(
    (event: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((event.clientX - rect.left - rect.width / 2) * strength);
      y.set((event.clientY - rect.top - rect.height / 2) * strength);
    },
    [strength, x, y]
  );

  const handlePointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ambient Background                                                        */
/* -------------------------------------------------------------------------- */
function Background({ reduced }: { reduced: boolean }) {
  const auroraClass = reduced ? "" : "animate-[aurora_16s_ease-in-out_infinite]";
  const auroraReverseClass = reduced ? "" : "animate-[aurora_20s_ease-in-out_infinite_reverse]";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[var(--paper)] transition-colors duration-500" />
      <div
        className={`absolute -top-1/3 left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--aurora-1)_0%,transparent_65%)] opacity-60 blur-3xl ${auroraClass}`}
      />
      <div
        className={`absolute -bottom-1/3 right-0 h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,var(--aurora-2)_0%,transparent_65%)] opacity-40 blur-3xl ${auroraReverseClass}`}
      />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Custom Animated Cursor                                                    */
/* -------------------------------------------------------------------------- */
function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 700, damping: 42 });
  const y = useSpring(my, { stiffness: 700, damping: 42 });
  const rx = useSpring(mx, { stiffness: 210, damping: 25 });
  const ry = useSpring(my, { stiffness: 210, damping: 25 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    const m = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const h = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],a,button");
      setLabel(t?.dataset.cursor || (t ? UI.cursorViewLabel : ""));
    };
    window.addEventListener("mousemove", m);
    document.addEventListener("mouseover", h);
    return () => {
      window.removeEventListener("mousemove", m);
      document.removeEventListener("mouseover", h);
    };
  }, [mx, my]);

  return (
    <>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ink)] mix-blend-difference md:block"
      />
      <motion.div
        style={{ x: rx, y: ry }}
        animate={{ width: label ? 72 : 34, height: label ? 72 : 34 }}
        className="pointer-events-none fixed left-0 top-0 z-[149] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--signal)]/50 bg-[var(--signal)]/10 text-[9px] font-bold tracking-widest text-[var(--ink)] backdrop-blur-md md:flex"
      >
        {label}
      </motion.div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roles Carousel                                                            */
/* -------------------------------------------------------------------------- */
function Roles() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((current) => (current + 1) % PROFILE.roles.length),
      UI.roleRotateMs
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-10 overflow-hidden sm:h-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)] bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl"
        >
          {PROFILE.roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shine Magnetic Button Component                                          */
/* -------------------------------------------------------------------------- */
interface ShineButtonProps {
  href: string;
  variant: "solid" | "ghost";
  dataCursor?: string;
  children: React.ReactNode;
}

function ShineButton({ href, variant, dataCursor, children }: ShineButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    ref.current?.style.setProperty("--shine-x", `${px}%`);
    ref.current?.style.setProperty("--shine-y", `${py}%`);
  }, []);

  const base =
    `group relative isolate flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${FOCUS_RING}`;
  const solid =
    "bg-[var(--ink)] text-[var(--paper)] shadow-[var(--shadow)] hover:shadow-[var(--shadow-heavy)]";
  const ghost =
    "border border-[var(--glass-border)] text-[var(--ink)] hover:border-[var(--ink)]/40 bg-[var(--glass)] backdrop-blur-xl";

  return (
    <Magnetic strength={0.25}>
      <a
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        data-cursor={dataCursor}
        className={`${base} ${variant === "solid" ? solid : ghost}`}
        style={{ "--shine-x": "50%", "--shine-y": "50%" } as React.CSSProperties}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${variant === "solid"
            ? "bg-[radial-gradient(circle_at_var(--shine-x)_var(--shine-y),rgba(255,255,255,0.25),transparent_60%)]"
            : "bg-[radial-gradient(circle_at_var(--shine-x)_var(--shine-y),var(--line),transparent_60%)]"
            }`}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </a>
    </Magnetic>
  );
}

/* -------------------------------------------------------------------------- */
/*  Metric Chip & System Tag                                                  */
/* -------------------------------------------------------------------------- */
function MetricChip({ metric, label, className = "" }: { metric: string; label: string; className?: string }) {
  return (
    <div
      className={`pointer-events-none flex flex-col rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] px-5 py-4 backdrop-blur-2xl shadow-[var(--shadow)] ${className}`}
    >
      <span className="text-xl font-extrabold leading-none text-[var(--ink)]">{metric}</span>
      <span className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted-2)]">
        {label}
      </span>
    </div>
  );
}

function SystemTag({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-5 py-2.5 backdrop-blur-xl shadow-[var(--shadow)] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ backgroundColor: CORE_AMBER }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: CORE_AMBER }}
        />
      </span>
      <Activity size={14} style={{ color: CORE_TEAL }} aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
        {UI.signalCoreLive}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Visual Composition (Hero Graphic)                                         */
/* -------------------------------------------------------------------------- */
function VisualComposition({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 20 });
  const sry = useSpring(ry, { stiffness: 120, damping: 20 });
  const spx = useSpring(px, { stiffness: 90, damping: 18 });
  const spy = useSpring(py, { stiffness: 90, damping: 18 });

  const portraitX = useTransform(spx, (v) => v * -14);
  const portraitY = useTransform(spy, (v) => v * -14);
  const chipAX = useTransform(spx, (v) => v * -30);
  const chipAY = useTransform(spy, (v) => v * -30);

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      rx.set(-relY * 6);
      ry.set(relX * 6);
      px.set(relX);
      py.set(relY);
    },
    [reduced, rx, ry, px, py]
  );

  const handleLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    px.set(0);
    py.set(0);
  }, [rx, ry, px, py]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto h-[420px] w-full max-w-[420px] sm:h-[520px] sm:max-w-[520px] md:h-[680px] md:max-w-none lg:h-[800px]"
    >
      <motion.div
        aria-hidden="true"
        animate={reduced ? {} : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          background: `radial-gradient(circle, ${CORE_AMBER}26 0%, transparent 70%)`,
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={reduced ? {} : { opacity: [0.22, 0.4, 0.22] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        className="absolute left-[62%] top-[42%] h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${CORE_TEAL}22 0%, transparent 70%)`,
        }}
      />
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
        className="relative h-full w-full will-change-transform"
      >
        <div className="absolute inset-0 -m-6 sm:-m-10 md:-m-16 lg:-m-24">
          <AICore />
        </div>
        <motion.div
          animate={reduced ? {} : { y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 z-10 h-[42%] w-[42%] max-h-[300px] max-w-[300px] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div style={{ x: portraitX, y: portraitY }} className="relative h-full w-full">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{
                background: `radial-gradient(circle, ${CORE_AMBER}44 0%, transparent 70%)`,
              }}
            />
            <div
              className="relative h-full w-full overflow-hidden rounded-full p-[3px]"
              style={{
                backgroundImage: `linear-gradient(var(--paper), var(--paper)), linear-gradient(135deg, ${CORE_AMBER}, ${CORE_TEAL})`,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <Image
                src="/images/profile.webp"
                alt={PROFILE.fullName}
                width={600}
                height={734}
                priority
                quality={100}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 260px, 200px"
                className="h-full w-full rounded-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          style={{ x: chipAX, y: chipAY }}
          className="absolute left-[15%] top-[20%] hidden sm:block md:-left-8 lg:-left-12"
        >
          <MetricChip metric="Data Science" label="Python & ML" />
        </motion.div>
        <SystemTag className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-8" />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                              */
/* -------------------------------------------------------------------------- */
function Hero({ loaded, reduced }: { loaded: boolean; reduced: boolean }) {
  const container: Variants = reduced
    ? { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
    : {
      hidden: {},
      show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    };

  const item: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : {
      hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
      },
    };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen flex-col justify-center gap-14 px-6 pb-20 pt-32 md:gap-10 md:px-12 md:pb-0 md:pt-28"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate={loaded ? "show" : "hidden"}
        className="relative z-10 grid items-center gap-14 md:grid-cols-12 md:gap-6"
      >
        <div className="relative min-w-0 md:col-span-5">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2 text-xs backdrop-blur-xl"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
            </span>
            {HERO.badgeText}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-8 text-[clamp(2.75rem,8.5vw,7rem)] font-bold leading-[0.88] tracking-[-0.06em] text-[var(--ink)]"
          >
            {HERO.headingLine1}
            <br />
            <span className="font-light text-[var(--muted)]">{HERO.headingLine2}</span>
          </motion.h1>

          <motion.div variants={item} className="mt-7">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-2)]">
              {HERO.subHeading}
            </p>
            <div className="mt-2">
              <Roles />
            </div>
          </motion.div>

          <motion.p variants={item} className="mt-3 max-w-md leading-relaxed text-[var(--muted)] sm:max-w-lg">
            {PROFILE.bio}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <ShineButton href="#projects" variant="solid" dataCursor={UI.cursorExploreLabel}>
              {HERO.primaryButtonText} <ArrowDown size={16} aria-hidden="true" />
            </ShineButton>
            <ShineButton href="#contact" variant="ghost" dataCursor={UI.cursorContactLabel}>
              {HERO.secondaryButtonText}
            </ShineButton>
            <Magnetic strength={0.25}>
              <a
                href={PROFILE.resume}
                download
                aria-label={HERO.resumeButtonLabel}
                className={`flex items-center justify-center rounded-full border border-[var(--glass-border)] p-3.5 transition-colors hover:border-[var(--ink)]/40 bg-[var(--glass)] ${FOCUS_RING}`}
              >
                <Download size={18} aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <div className="relative min-w-0 md:col-span-7 md:-mr-6 lg:-mr-16 xl:-mr-24">
          <motion.div variants={item}>
            <VisualComposition reduced={reduced} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading Screen                                                            */
/* -------------------------------------------------------------------------- */
function LoaderScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + UI.loaderStep);
        if (next === 100) {
          clearInterval(id);
          setTimeout(onDone, UI.loaderExitDelayMs);
        }
        return next;
      });
    }, UI.loaderTickMs);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio, ${progress}% complete`}
      exit={{ opacity: 0, filter: "blur(15px)" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#07080B]"
    >
      <div className="w-[min(600px,85vw)]">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--signal)]">
          {LOADER.tagline}
        </p>
        <h1 className="mt-10 text-5xl font-bold tracking-tight text-white">
          {LOADER.headingLine1}
          <br />
          <span className="text-white/30 font-light">{LOADER.headingLine2}</span>
        </h1>
        <div className="mt-12 h-[2px] w-full bg-white/10">
          <div
            className="h-full bg-[var(--signal)] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-right font-mono text-xs text-white/50">{progress}%</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interactive Terminal Contact                                              */
/* -------------------------------------------------------------------------- */
type HistoryEntryType = "prompt" | "output" | "error";
interface HistoryEntry {
  type: HistoryEntryType;
  text: React.ReactNode;
}

const WELCOME_ENTRY: HistoryEntry = {
  type: "output",
  text: (
    <div>
      <div className="text-[var(--signal)] font-semibold">{TERMINAL.welcome[0]}</div>
      <div className="text-white/70">{TERMINAL.welcome[1]}</div>
    </div>
  ),
};

function TerminalContact({ onToggleTheme }: { onToggleTheme: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([WELCOME_ENTRY]);
  const [input, setInput] = useState("");
  const [, setCommandLog] = useState<string[]>([]);
  const [, setHistoryCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const pushEntry = useCallback(
    (command: string, type: HistoryEntryType, output: React.ReactNode) => {
      setHistory((prev) => [
        ...prev,
        { type: "prompt", text: `$ ${command}` },
        { type, text: output },
      ]);
      setCommandLog((prev) => [...prev, command]);
      setHistoryCursor(-1);
      setInput("");
    },
    []
  );

  const handleCommand = useCallback(
    (rawCommand: string) => {
      const command = rawCommand.trim().toLowerCase();
      if (command === "") return;

      if (command === "clear") {
        setHistory([]);
        setInput("");
        return;
      }

      let output: React.ReactNode;
      let type: HistoryEntryType = "output";

      switch (command) {
        case "help":
          output = (
            <div className="space-y-1 text-white/80">
              {TERMINAL.helpOutput.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          );
          break;
        case "whoami":
          output = (
            <div className="space-y-1">
              <div className="font-bold text-cyan-300">{TERMINAL.whoamiName}</div>
              <div className="text-white/70">{TERMINAL.whoamiBio}</div>
            </div>
          );
          break;
        case "skills":
          output = (
            <div className="space-y-1">
              <div className="text-white/70">{TERMINAL.skillsLabel}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SKILLS.map((skill) => (
                  <span key={skill} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
          break;
        case "projects":
          output = (
            <div className="space-y-2">
              {PROJECTS.map((project, i) => (
                <div key={project.title} className="text-xs">
                  <span style={{ color: project.color }}>0{i + 1}.</span>{" "}
                  <span className="font-bold text-white">{project.title}</span> —{" "}
                  <span className="text-white/50">{project.metric}</span>
                </div>
              ))}
            </div>
          );
          break;
        case "email":
          output = (
            <a href={`mailto:${PROFILE.email}`} className="text-cyan-300 underline">
              {PROFILE.email}
            </a>
          );
          break;

        case "linkedin":
          output = (
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline"
            >
              {PROFILE.linkedin}
            </a>
          );
          break;

        case "github":
          output = (
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline"
            >
              {PROFILE.github}
            </a>
          );
          break;

        case "resume":
          output = (
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline"
            >
              Download Resume
            </a>
          );
          break;

        case "theme":
          onToggleTheme();
          output = TERMINAL.themeToggled;
          break;
        default:
          type = "error";
          output = `${TERMINAL.errorPrefix}${rawCommand}${TERMINAL.errorSuffix}`;
      }

      pushEntry(rawCommand, type, output);
    },
    [onToggleTheme, pushEntry]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) handleCommand(input);
  };

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[#07090E] text-white shadow-[var(--shadow-heavy)]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/[0.03] dark:bg-white/[0.03]">
        <div className="flex items-center gap-2 text-xs font-mono text-white/50">
          <Terminal size={14} className="text-blue-400" aria-hidden="true" />
          <span>{TERMINAL.secureInterface}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      <div
        role="log"
        aria-live="polite"
        className="min-h-[280px] max-h-[380px] overflow-y-auto p-6 font-mono text-xs sm:text-sm leading-relaxed"
      >
        {history.map((entry, i) => (
          <div
            key={i}
            className={`py-1 whitespace-pre-wrap ${entry.type === "prompt"
              ? "text-cyan-300 font-semibold"
              : entry.type === "error"
                ? "text-rose-400"
                : "text-white/80"
              }`}
          >
            {entry.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-white/10 px-6 py-4 bg-white/[0.01] transition-colors focus-within:bg-white/[0.03]"
      >
        <span className="text-cyan-300 font-mono" aria-hidden="true">
          {TERMINAL.prompt}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Terminal command input"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white outline-none placeholder:text-white/20 caret-[var(--focus)]"
          placeholder={TERMINAL.placeholder}
        />
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skills Constellation                                                      */
/* -------------------------------------------------------------------------- */
function SkillsConstellation() {
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    SKILLS.forEach((skill) => {
      const category =
        SKILL_CATEGORIES.find((c) => c.pattern.test(skill))?.name ?? "Core Stack";
      const existing = map.get(category) ?? [];
      existing.push(skill);
      map.set(category, existing);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="flex flex-col gap-10">
        {groups.map(([category, items]) => (
          <div key={category}>
            <p className="mb-4 text-left text-xs font-mono uppercase tracking-[0.25em] text-[var(--muted-2)]">
              {category}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {items.map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-5 py-2.5 text-xs font-semibold text-[var(--ink)] backdrop-blur-xl shadow-[var(--shadow)]"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interfaces & Types                                                        */
/* -------------------------------------------------------------------------- */
export interface ProjectItem {
  title: string;
  summary: string;
  description?: string;
  image?: string;
  color: string;
  tech: string[];
  metric: string;
  label: string;
  github: string;
  liveUrl?: string;
  highlights?: string[];
}

export interface ProjectGridCardProps {
  project: ProjectItem;
  index: number;
  caseStudyPrefix: string;
  onOpen: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Fallback Compact Canvas Preview                                           */
/* -------------------------------------------------------------------------- */
const FallbackProductPreview: FC<{ color: string; seed: number }> = ({ color, seed }) => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0D14] via-[#10131D] to-[#07080B] p-4">
    <div
      className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"
      style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 70%, transparent 100%)" }}
    />
    <div className="relative z-10 grid w-full max-w-xs grid-cols-2 gap-2 opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
      <div className="col-span-2 rounded-xl border border-white/10 bg-black/[0.03] dark:bg-white/[0.05] p-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono text-white/70">Core Engine #{seed}</span>
          </div>
          <Cpu className="h-3.5 w-3.5 text-white/40" />
        </div>
        <div className="mt-2 h-1 w-3/4 rounded-full bg-white/10" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-md">
        <TrendingUp className="h-3.5 w-3.5" style={{ color }} />
        <div className="mt-1 text-sm font-bold text-white">+142%</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-md">
        <Code2 className="h-3.5 w-3.5 text-white/60" />
        <div className="mt-1 text-sm font-bold text-white">99.9%</div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Project Card — full-width, image-led, one per row                        */
/*                                                                            */
/*  Why the old two-column card had to go: at ~7/12 + 5/12 split, the image  */
/*  was cropped to a supporting-actor role and the metadata column had to    */
/*  clamp the summary to two lines. That's the layout you reach for when you */
/*  have twelve projects to list, not when you have a handful worth a real   */
/*  showcase. Apple's product pages never split hero art with copy 60/40 —   */
/*  the art gets the full stage, then the copy gets its own full-width beat  */
/*  underneath it. This card follows that rhythm: image first, full bleed,   */
/*  then title → summary → stack → metric → actions in one generous column. */
/* -------------------------------------------------------------------------- */
export function ProjectGridCard({
  project,
  index,
  caseStudyPrefix,
  onOpen,
}: ProjectGridCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 160, damping: 20, mass: 0.5 };
  const mouseX = useSpring(rawMouseX, springConfig);
  const mouseY = useSpring(rawMouseY, springConfig);

  // A full-width card is too large for a convincing 3D tilt across its whole
  // body (it reads as "the page is warping"), so the tilt is scoped to the
  // image plate only, and kept subtle — a hint of depth, not a gimmick.
  const rotateX = useTransform(mouseY, [0, 1], shouldReduceMotion ? [0, 0] : [1.4, -1.4]);
  const rotateY = useTransform(mouseX, [0, 1], shouldReduceMotion ? [0, 0] : [-1.4, 1.4]);
  const imageX = useTransform(mouseX, [0, 1], shouldReduceMotion ? [0, 0] : [-10, 10]);
  const imageY = useTransform(mouseY, [0, 1], shouldReduceMotion ? [0, 0] : [-8, 8]);
  const spotX = useTransform(mouseX, [0, 1], [0, 100]);
  const spotY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const rect = cardRef.current.getBoundingClientRect();
      rawMouseX.set((event.clientX - rect.left) / rect.width);
      rawMouseY.set((event.clientY - rect.top) / rect.height);
    },
    [rawMouseX, rawMouseY]
  );

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0.5);
    rawMouseY.set(0.5);
  }, [rawMouseX, rawMouseY]);

  // Per-card scroll trigger (rather than inheriting the parent grid's single
  // whileInView) is what makes projects "reveal naturally" one at a time as
  // the page scrolls, instead of the whole stack animating together the
  // moment the section edge crosses the viewport.
  const revealVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : {
      hidden: { opacity: 0, y: 56, scale: 0.97 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 90, damping: 20, mass: 0.9 },
      },
    };

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="group min-w-0"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)] transition-shadow duration-500 hover:shadow-[var(--shadow-heavy)] sm:rounded-[2.5rem]"
      >
        {/* Animated accent border — a 1px ring that fades in on hover using
            the project's own color, instead of a static border everywhere. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 ring-1 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-[2.5rem]"
          style={{ boxShadow: `inset 0 0 0 1px ${project.color}40` }}
        />

        {/* ---- Image plate: full width, top of the card ----
            This element is the clip mask ONLY. It must never also carry a
            CSS `perspective` (a 3D-transform root): a single element that
            is both an `overflow-hidden` + `border-radius` clip *and* a 3D
            perspective root is exactly the combination mobile Safari/WebKit
            is known to mis-render — it silently drops the rounded clip on
            any descendant using a 3D transform, so the image bleeds to
            square corners at the card's true edge. `perspective` now lives
            on the inner tilt layer instead (see below), and `transform-gpu`
            + the mask-image are a standard belt-and-braces nudge that force
            Safari onto a real compositing layer for the clip itself. */}
        <div
          className="relative transform-gpu overflow-hidden rounded-t-[2rem] sm:rounded-t-[2.5rem]"
          style={{
            aspectRatio: "18 / 8",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            className="absolute inset-0 will-change-transform"
          >
            {/* Ambient color wash behind the image edges, like a product
                photo lit against a gelled backdrop rather than a flat crop. */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 opacity-40 blur-2xl"
              style={{ background: `radial-gradient(60% 60% at 50% 40%, ${project.color}, transparent 70%)` }}
            />
            <motion.div style={{ x: imageX, y: imageY }} className="absolute inset-0 scale-[1.06]">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  className="h-full w-full object-full object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              ) : (
                <FallbackProductPreview color={project.color} seed={index + 1} />
              )}
            </motion.div>
          </motion.div>

          {/* Legibility gradient + spotlight, both above the image */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform(
                [spotX, spotY],
                ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, ${project.color}55, transparent 60%)`
              ),
            }}
          />

          {/* Index / case tag sits on the image, Apple-keynote style */}
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3.5 py-1.5 backdrop-blur-md sm:left-7 sm:top-7">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              {caseStudyPrefix}
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ---- Content: full width, generous breathing room ---- */}
        <div className="relative z-20 p-5 sm:p-8 md:p-10">
          <div className="max-w-3xl">
            <h3 className="text-balance text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl md:text-[2.35rem]">
              {project.title}
            </h3>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {project.summary}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
            {project.tech.map((tech) => {
              const brand = getTechBrand(tech);
              return (
                <span
                  key={tech}
                  style={{ color: brand.color, borderColor: brand.border, backgroundColor: brand.bg }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 hover:-translate-y-px hover:shadow-sm"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: brand.color, boxShadow: `0 0 6px ${brand.color}` }}
                  />
                  {tech}
                </span>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-6 border-t border-[var(--glass-border)] pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: project.color }}>
                {project.metric}
              </div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted-2)]">
                {project.label}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} repository`}
                style={{ borderColor: `${project.color}55`, color: project.color, backgroundColor: `${project.color}12` }}
                className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 hover:scale-110 ${FOCUS_RING}`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpen}
                aria-label={`Open case study for ${project.title}`}
                style={{ backgroundColor: project.color }}
                className={`group/btn relative inline-flex h-11 items-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${FOCUS_RING}`}
              >
                <span>Case Study</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Modal                                                             */
/* -------------------------------------------------------------------------- */
export function ProjectModal({
  project,
  index,
  caseStudyPrefix = "CASE — ",
  onClose,
}: {
  project: ProjectItem | null;
  index: number;
  caseStudyPrefix?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xl"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-[var(--glass-border-strong)] bg-[var(--card)] text-[var(--ink)] shadow-[var(--shadow-heavy)]"
        >
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--card)] px-6 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-[var(--glass-border)] bg-[var(--paper)] px-2.5 py-0.5 text-[11px] font-mono font-semibold" style={{ color: project.color }}>
                {caseStudyPrefix}{String(index + 1).padStart(2, "0")}
              </span>
              <span className="hidden text-xs font-mono text-[var(--muted)] sm:inline-block">Deep Dive</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--ink)] transition-all hover:scale-105 ${FOCUS_RING}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
            {/* Hero card */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--paper)] p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-[90px] opacity-30" style={{ backgroundColor: project.color }} />
              <div className="relative z-10 max-w-2xl">
                <h2 id="project-modal-title" className="text-2xl font-extrabold sm:text-3xl tracking-tight text-[var(--ink)]">
                  {project.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {project.description || project.summary}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--card)] p-3.5 shadow-sm transition hover:scale-[1.02]">
                  <div className="text-xl sm:text-2xl font-extrabold" style={{ color: project.color }}>
                    {project.metric}
                  </div>
                  <div className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-[var(--muted-2)]">
                    {project.label}
                  </div>
                </div>

                <div className="col-span-1 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] p-3.5 shadow-sm sm:col-span-3 flex flex-col justify-center transition hover:scale-[1.01]">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--muted-2)] mb-1.5">
                    Stack Ecosystem
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((t) => {
                      const brand = getTechBrand(t);
                      return (
                        <span
                          key={t}
                          style={{
                            color: brand.color,
                            borderColor: brand.border,
                            backgroundColor: brand.bg,
                          }}
                          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-300 hover:scale-[1.03] hover:-translate-y-px"
                        >
                          <span
                            className="h-1 w-1 rounded-full"
                            style={{
                              backgroundColor: brand.color,
                              boxShadow: `0 0 6px ${brand.color}`,
                            }}
                          />
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Image container */}
            {project.image && (
              <div className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] shadow-[var(--shadow)]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-full aspect-[16/10]"
                />
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--muted-2)]">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: project.color }} />
                  Key Impact Highlights
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {project.highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--paper)] p-3 text-xs text-[var(--ink)]/80 transition hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: project.color }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-[var(--glass-border)] bg-[var(--card)] px-6 py-4">
            <div className="flex items-center gap-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] ${FOCUS_RING}`}
                style={{
                  borderColor: project.color,
                  color: project.color,
                  backgroundColor: `${project.color}15`,
                }}
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--paper)] transition-all hover:scale-[1.03] ${FOCUS_RING}`}
                  style={{ backgroundColor: project.color }}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Projects Section Component                                           */
/* -------------------------------------------------------------------------- */
export function ProjectsSection({
  projects = [],
  sectionHeading = { start: "Selected", end: "Projects" },
  caseStudyPrefix = "CASE — ",
  onOpenProject,
}: {
  projects?: ProjectItem[];
  sectionHeading?: { start: string; end: string };
  caseStudyPrefix?: string;
  onOpenProject?: (index: number) => void;
}) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const activeProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative mx-auto max-w-[96rem] scroll-mt-28 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 border-b border-[var(--glass-border)] pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[var(--muted-2)]">
              <Layers className="h-4 w-4 text-[var(--signal)]" aria-hidden="true" />
              Crafted Showcase
            </div>
            <h2 id="projects-heading" className="mt-3 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--ink)]">
              {sectionHeading.start} <span className="font-light text-[var(--muted)]">{sectionHeading.end}</span>
            </h2>
          </div>
          <p className="max-w-md text-pretty text-xs leading-relaxed text-[var(--muted)] md:text-right sm:text-sm">
            High-performance applications, interactive software architectures, and digital products engineered for scale.
          </p>
        </div>
      </div>

      {/* One project per row, full width. Generous vertical gap so each
          project reads as its own cinematic beat rather than a dense list. */}
      <div className="mx-auto mt-14 flex max-w-5xl flex-col gap-20 sm:gap-28 md:mt-20 md:gap-36">
        {projects.map((project, i) => (
          <ProjectGridCard
            key={project.title}
            project={project}
            index={i}
            caseStudyPrefix={caseStudyPrefix}
            onOpen={() => {
              setSelectedProjectIndex(i);
              onOpenProject?.(i);
            }}
          />
        ))}
      </div>

      {!onOpenProject && (
        <ProjectModal
          project={activeProject}
          index={selectedProjectIndex ?? 0}
          caseStudyPrefix={caseStudyPrefix}
          onClose={() => setSelectedProjectIndex(null)}
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Portfolio Page Component                                             */
/* -------------------------------------------------------------------------- */
export default function Portfolio() {
  const [light, setLight] = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [compact, setCompact] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>(
    NAVIGATION_ITEMS[0].href.replace("#", "")
  );
  const [now, setNow] = useState<Date | null>(null);
  const reduced = usePrefersReducedMotion();
  const scrollProgress = useMotionValue(0);
  const scrollProgressSpring = useSpring(scrollProgress, { stiffness: 130, damping: 28 });

  const toggleTheme = useCallback(() => setLight((prev) => !prev), [setLight]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useRafThrottledScroll(() => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress.set(window.scrollY / maxScroll);
    setCompact(window.scrollY > UI.scrollCompactThreshold);
  }, [scrollProgress]);

  useEffect(() => {
    const sections = NAVIGATION_ITEMS.map((item) =>
      document.getElementById(item.href.replace("#", ""))
    ).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const themeVars = useMemo<ThemeVars>(() => (light ? LIGHT_THEME : DARK_THEME), [light]);
  const activeProject = modalIndex !== null ? PROJECTS[modalIndex] : null;

  return (
    <main
      style={themeVars as React.CSSProperties}
      className="md:cursor-none overflow-clip bg-[var(--paper)] text-[var(--ink)] transition-colors duration-700"
    >
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--paper)]"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {!loaded && <LoaderScreen onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <Background reduced={reduced} />
      <Cursor />

      {/* Progress Line */}
      <motion.div
        style={{ scaleX: scrollProgressSpring }}
        className="fixed left-0 top-0 z-[110] h-[2px] w-full origin-left bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]"
      />

      {/* Navigation */}
      <nav
        className={`fixed left-1/2 top-4 z-50 w-[min(1080px,calc(100%-24px))] -translate-x-1/2 transition-all duration-500 ${mobileNavOpen ? "rounded-[28px]" : "rounded-full"
          }`}
      >
        <div
          className={`relative overflow-visible border border-[var(--glass-border-strong)] bg-[var(--glass)] backdrop-blur-3xl shadow-[var(--shadow-heavy)] transition-all duration-500 ${mobileNavOpen ? "rounded-[28px]" : "rounded-full"
            }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--signal)]/5 via-transparent to-[var(--signal-2)]/5" />

          <div
            className={`relative flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${compact ? "h-12 sm:h-14" : "h-14 sm:h-16"
              }`}
          >
            {/* Brand */}
            <a
              href="#home"
              className={`flex items-center gap-3 whitespace-nowrap rounded-full ${FOCUS_RING}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--signal)]/12 font-bold text-[var(--signal)]">
                {PROFILE.initials}
              </div>
              <div className="hidden min-[430px]:block">
                <p className="text-sm font-semibold tracking-tight text-[var(--ink)] leading-none">
                  {PROFILE.fullName}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  Portfolio
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-1 md:flex">
              {NAVIGATION_ITEMS.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeSection === id;

                return (
                  <a
                    key={id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${FOCUS_RING} ${isActive
                      ? "text-[var(--ink)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                        className="absolute inset-0 -z-10 rounded-full border border-[var(--signal)]/40"
                        style={{
                          background: `linear-gradient(90deg, var(--signal-wash), transparent)`,
                          boxShadow: `0 0 0 1px var(--signal-wash), 0 4px 16px -4px var(--signal)`,
                        }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Magnetic>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--muted)] transition-all duration-300 hover:scale-105 hover:border-[var(--signal)]/40 hover:text-[var(--signal)] ${FOCUS_RING}`}
                >
                  {light ? (
                    <Sun size={17} aria-hidden="true" />
                  ) : (
                    <Moon size={17} aria-hidden="true" />
                  )}
                </button>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileNavOpen}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--muted)] transition-all duration-300 hover:scale-105 hover:border-[var(--signal)]/40 hover:text-[var(--signal)] md:hidden ${FOCUS_RING}`}
              >
                {mobileNavOpen ? (
                  <X size={18} aria-hidden="true" />
                ) : (
                  <Menu size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{
                  duration: 0.3,
                }}
                className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 px-1 md:hidden"
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--glass-border-strong)] bg-[var(--card)] backdrop-blur-3xl shadow-[var(--shadow-heavy)]">
                  <div className="flex flex-col gap-1 p-3">
                    {NAVIGATION_ITEMS.map((item) => {
                      const id = item.href.replace("#", "");
                      const isActive = activeSection === id;

                      return (
                        <a
                          key={id}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-px ${FOCUS_RING} ${isActive
                            ? "border border-[var(--signal)]/20 bg-[var(--signal)]/12 text-[var(--ink)]"
                            : "text-[var(--muted)] hover:bg-[var(--glass)] hover:text-[var(--ink)]"
                            }`}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span
                              className="h-2 w-2 rounded-full bg-[var(--signal)]"
                              style={{ boxShadow: "0 0 10px var(--signal)" }}
                            />)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero */}
      <Hero loaded={loaded} reduced={reduced} />

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-24 sm:px-6 md:py-36 lg:px-8">
        <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold tracking-tight text-[var(--ink)]">
          {ABOUT.headingStart} <span className="font-light text-[var(--muted)]">{ABOUT.headingEnd}</span>
        </h2>
        <div data-reveal className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass)] p-8 md:p-10 shadow-[var(--shadow)] backdrop-blur-2xl">
            <p className="text-xl leading-relaxed sm:text-2xl md:text-3xl font-medium text-[var(--ink)]">
              {ABOUT.description}
            </p>
          </div>
          <div className="space-y-4">
            {ABOUT.sections.map((section) => (
              <div
                key={section.title}
                className="group rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--signal)] shadow-[var(--shadow)] backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--ink)]">{section.title}</h3>
                  <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-[var(--muted)]" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--glass-border)] px-3.5 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--ink)]/30 hover:text-[var(--ink)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section id="expertise" className="border-y border-[var(--glass-border)] px-6 py-20 md:py-36 text-center">
        <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold tracking-tight text-[var(--ink)]">
          {EXPERTISE.heading}
        </h2>
        <div data-reveal>
          <SkillsConstellation />
        </div>
      </section>

      {/* Projects */}
      <ProjectsSection projects={PROJECTS} onOpenProject={setModalIndex} />

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-24 sm:px-6 md:py-36 lg:px-8">
        <h2 data-reveal className="text-[clamp(2.25rem,7vw,6rem)] font-bold tracking-tight text-[var(--ink)]">
          {CONTACT_SECTION.headingStart}{" "}
          <span className="font-light text-[var(--muted)]">{CONTACT_SECTION.headingEnd}</span>
        </h2>
        <div data-reveal className="mt-14">
          <TerminalContact onToggleTheme={toggleTheme} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] p-6 sm:p-10 bg-[var(--paper-2)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <b className="text-xl font-bold text-[var(--ink)]">{FOOTER.name}</b>
            <p className="text-sm text-[var(--muted)]">{FOOTER.role}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`rounded-full border border-[var(--glass-border)] p-3 text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Github size={16} aria-hidden="true" />
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`rounded-full border border-[var(--glass-border)] p-3 text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${SOCIALS.email}`}
              aria-label="Email"
              className={`rounded-full border border-[var(--glass-border)] p-3 text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Mail size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-[var(--muted)]">{FOOTER.location}</p>
            <p className="font-mono text-xs text-[var(--muted)]">
              {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
            </p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl font-mono text-[10px] uppercase tracking-widest text-[var(--muted-2)]">
          {FOOTER.tagline}
        </p>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && modalIndex !== null && (
          <ProjectModal
            project={activeProject}
            index={modalIndex}
            onClose={() => setModalIndex(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}