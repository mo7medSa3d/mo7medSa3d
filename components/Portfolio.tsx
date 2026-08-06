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
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Activity,
    ArrowDown,
    ArrowUpRight,
    Download,
    Github,
    Linkedin,
    Mail,
    Menu,
    Moon,
    Sun,
    Terminal,
    X,
} from "lucide-react";
import {
    PROFILE,
    PROJECTS,
    SKILLS,
    HERO,
    NAVIGATION_ITEMS,
    NAV_LABELS,
    ABOUT,
    EXPERTISE,
    PROJECTS_SECTION,
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

const CORE_AMBER = "#ffb454";
const CORE_TEAL = "#5eead4";

/* -------------------------------------------------------------------------- */
/*  Themes                                                                     */
/* -------------------------------------------------------------------------- */
type ThemeVars = Record<
    | "--paper"
    | "--ink"
    | "--muted"
    | "--line"
    | "--glass"
    | "--signal"
    | "--signal-2"
    | "--aurora-1"
    | "--aurora-2",
    string
>;

const DARK_THEME: ThemeVars = {
    "--paper": "#050505",
    "--ink": "#FAFAFA",
    "--muted": "#A1A1AA",
    "--glass": "rgba(255,255,255,.04)",
    "--line": "rgba(255,255,255,.08)",
    "--signal": "#FFFFFF",
    "--signal-2": "#D4D4D8",
    "--aurora-1": "rgba(255,255,255,.05)",
    "--aurora-2": "rgba(255,255,255,.02)",
};

const LIGHT_THEME: ThemeVars = {
    "--paper": "#FCFCFC",
    "--ink": "#090909",
    "--muted": "#52525B",
    "--glass": "rgba(255,255,255,.78)",
    "--line": "rgba(0,0,0,.08)",
    "--signal": "#090909",
    "--signal-2": "#3F3F46",
    "--aurora-1": "rgba(0,0,0,.035)",
    "--aurora-2": "rgba(0,0,0,.02)",
};

/* -------------------------------------------------------------------------- */
/*  Utility hooks                                                              */
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

/* -------------------------------------------------------------------------- */
/*  Magnetic button wrapper                                                    */
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
        [strength, x, y],
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
/*  Ambient background                                                        */
/* -------------------------------------------------------------------------- */
function Background({ reduced }: { reduced: boolean }) {
    const auroraClass = reduced ? "" : "animate-[aurora_16s_ease-in-out_infinite]";
    const auroraReverseClass = reduced ? "" : "animate-[aurora_20s_ease-in-out_infinite_reverse]";

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[var(--paper)]" />
            <div
                className={`absolute -top-1/3 left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--aurora-1)_0%,transparent_65%)] opacity-60 blur-3xl ${auroraClass}`}
            />
            <div
                className={`absolute -bottom-1/3 right-0 h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,var(--aurora-2)_0%,transparent_65%)] opacity-40 blur-3xl ${auroraReverseClass}`}
            />
            <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
                <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain)" />
            </svg>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Custom Cursor                                                              */
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
        addEventListener("mousemove", m);
        document.addEventListener("mouseover", h);
        return () => {
            removeEventListener("mousemove", m);
            document.removeEventListener("mouseover", h);
        };
    }, []);

    return (
        <>
            <motion.div
                style={{ x, y }}
                className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference md:block"
            />
            <motion.div
                style={{ x: rx, y: ry }}
                animate={{ width: label ? 72 : 34, height: label ? 72 : 34 }}
                className="pointer-events-none fixed left-0 top-0 z-[149] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/5 text-[8px] font-bold tracking-widest text-cyan-200 backdrop-blur md:flex"
            >
                {label}
            </motion.div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*  Rotating role headline                                                     */
/* -------------------------------------------------------------------------- */
function Roles() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(
            () => setIndex((current) => (current + 1) % PROFILE.roles.length),
            UI.roleRotateMs,
        );
        return () => clearInterval(id);
    }, []);

    return (
        <div className="h-10 overflow-hidden sm:h-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -22, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)] bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl"
                >
                    {PROFILE.roles[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Hero – entrance choreography                                              */
/* -------------------------------------------------------------------------- */
function buildHeroVariants(reduced: boolean): { container: Variants; item: Variants } {
    if (reduced) {
        return {
            container: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
            item: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } },
        };
    }
    return {
        container: {
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        },
        item: {
            hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
            show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
            },
        },
    };
}

/* -------------------------------------------------------------------------- */
/*  Hero – hover-lit magnetic CTA                                              */
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
        "group relative isolate flex items-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5";
    const solid = "bg-[var(--ink)] text-[var(--paper)]";
    const ghost = "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)]/40";

    return (
        <Magnetic strength={0.25}>
            <a
                ref={ref}
                href={href}
                onMouseMove={handleMove}
                data-cursor={dataCursor}
                className={`${base} ${variant === "solid" ? solid : ghost}`}
                style={{ ["--shine-x" as string]: "50%", ["--shine-y" as string]: "50%" }}
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
/*  Hero – floating data readout                                              */
/* -------------------------------------------------------------------------- */
interface MetricChipProps {
    metric: string;
    label: string;
    className?: string;
}

function MetricChip({ metric, label, className = "" }: MetricChipProps) {
    return (
        <div
            className={`pointer-events-none flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--glass)] px-4 py-3 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,.5)] ${className}`}
        >
            <span className="text-lg font-bold leading-none text-[var(--ink)]">{metric}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[.2em] text-[var(--muted)]">
                {label}
            </span>
        </div>
    );
}

function SystemTag({ className = "" }: { className?: string }) {
    return (
        <div
            className={`pointer-events-none flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-4 py-2 backdrop-blur-xl ${className}`}
        >
            <span className="relative flex h-2 w-2">
                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: CORE_AMBER }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: CORE_AMBER }} />
            </span>
            <Activity size={12} style={{ color: CORE_TEAL }} aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[var(--muted)]">
                {UI.signalCoreLive}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Hero – visual composition (AI Core + portrait + chips)                    */
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
    const chipBX = useTransform(spx, (v) => v * 16);
    const chipBY = useTransform(spy, (v) => v * 16);

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
        [reduced, rx, ry, px, py],
    );

    const handleLeave = useCallback(() => {
        rx.set(0);
        ry.set(0);
        px.set(0);
        py.set(0);
    }, [rx, ry, px, py]);

    const firstProject = PROJECTS?.[0];

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
                style={{ background: `radial-gradient(circle, ${CORE_AMBER}26 0%, transparent 70%)` }}
            />
            <motion.div
                aria-hidden="true"
                animate={reduced ? {} : { opacity: [0.22, 0.4, 0.22] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                className="absolute left-[62%] top-[42%] h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
                style={{ background: `radial-gradient(circle, ${CORE_TEAL}22 0%, transparent 70%)` }}
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
                            className="absolute inset-0 rounded-full blur-2xl"
                            style={{ background: `radial-gradient(circle, ${CORE_AMBER}33 0%, transparent 70%)` }}
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
                {firstProject && (
  <motion.div
style={{ x: chipAX, y: chipAY }}
    className="absolute left-[20%] top-[20%] hidden sm:block md:-left-10 lg:-left-16"
  >
    <MetricChip metric="Data Science" label="Python & ML" />
  </motion.div>
)}

<SystemTag className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-6" />
            </motion.div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Hero section                                                              */
/* -------------------------------------------------------------------------- */
function Hero({ loaded, reduced }: { loaded: boolean; reduced: boolean }) {
    const { container, item } = buildHeroVariants(reduced);

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
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-4 py-2 text-xs backdrop-blur-xl"
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal)] opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                        </span>
                        {HERO.badgeText}
                    </motion.span>

                    <motion.h1
                        variants={item}
                        className="mt-8 text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[.84] tracking-[-.075em] text-[var(--ink)]"
                    >
                        {HERO.headingLine1}
                        <br />
                        <span className="text-[var(--muted)]">{HERO.headingLine2}</span>
                    </motion.h1>

                    <motion.div variants={item} className="mt-7">
                        <p className="text-xs uppercase tracking-[.3em] text-[var(--muted)]">
                            {HERO.subHeading}
                        </p>
                        <div className="mt-2">
                            <Roles />
                        </div>
                    </motion.div>

                    <motion.p
                        variants={item}
                        className="mt-2 max-w-md leading-8 text-[var(--muted)] sm:max-w-lg"
                    >
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
                                className="flex items-center justify-center rounded-full border border-[var(--line)] p-4 transition-colors hover:border-[var(--ink)]/40"
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

            <a
                href="#about"
                className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs text-[var(--muted)] md:flex"
            >
                {HERO.scrollIndicator}
                <span className="relative h-10 w-px overflow-hidden bg-[var(--line)]">
                    <motion.span
                        animate={reduced ? {} : { y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                        className="absolute left-0 top-0 h-1/2 w-full bg-[var(--ink)]"
                    />
                </span>
            </a>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Loading screen                                                             */
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#05070a]"
        >
            <div className="w-[min(600px,85vw)]">
                <p className="text-xs uppercase tracking-[.3em] text-[var(--signal)]">
                    {LOADER.tagline}
                </p>
                <h1 className="mt-10 text-5xl font-semibold text-white">
                    {LOADER.headingLine1}
                    <br />
                    <span className="text-white/30">{LOADER.headingLine2}</span>
                </h1>
                <div className="mt-12 h-px bg-white/10">
                    <div
                        className="h-full bg-[var(--signal)] transition-[width] duration-150"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-3 text-right text-xs text-[var(--muted)]">{progress}%</p>
            </div>
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Interactive terminal                                                       */
/* -------------------------------------------------------------------------- */
const COMMANDS = [
    "help",
    "whoami",
    "skills",
    "projects",
    "email",
    "github",
    "linkedin",
    "resume",
    "theme",
    "date",
    "clear",
] as const;

type HistoryEntryType = "prompt" | "output" | "error";
interface HistoryEntry {
    type: HistoryEntryType;
    text: React.ReactNode;
}

const WELCOME_ENTRY: HistoryEntry = {
    type: "output",
    text: (
        <div>
            <div className="text-[var(--signal)]">{TERMINAL.welcome[0]}</div>
            <div>{TERMINAL.welcome[1]}</div>
        </div>
    ),
};

interface TerminalContactProps {
    onToggleTheme: () => void;
}
function TerminalContact({ onToggleTheme }: TerminalContactProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([WELCOME_ENTRY]);
    const [input, setInput] = useState("");
    const [commandLog, setCommandLog] = useState<string[]>([]);
    const [historyCursor, setHistoryCursor] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const pushEntry = useCallback((command: string, type: HistoryEntryType, output: React.ReactNode) => {
        setHistory((prev) => [...prev, { type: "prompt", text: `$ ${command}` }, { type, text: output }]);
        setCommandLog((prev) => [...prev, command]);
        setHistoryCursor(-1);
        setInput("");
    }, []);

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
                        <div className="space-y-1">
                            {TERMINAL.helpOutput.map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    );
                    break;

                case "whoami":
                    output = (
                        <div className="space-y-2">
                            <div className="font-semibold text-cyan-300">{TERMINAL.whoamiName}</div>
                            <div className="text-white/70">{TERMINAL.whoamiBio}</div>
                            <div className="text-xs text-white/50">{TERMINAL.whoamiUniversity}</div>
                        </div>
                    );
                    break;

                case "skills":
                    output = (
                        <div className="space-y-1">
                            <div className="text-white/70">{TERMINAL.skillsLabel}</div>
                            <ul className="list-inside list-disc text-white/60">
                                {SKILLS.map((skill) => (
                                    <li key={skill} className="text-sm">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                    break;

                case "projects":
                    output = (
                        <div className="space-y-1">
                            {PROJECTS.map((project, i) => (
                                <div key={project.title} className="text-sm">
                                    <span style={{ color: project.color }}>0{i + 1}</span>{" "}
                                    <span className="text-white/80">{project.title}</span>
                                    <span className="text-white/40">
                                        {TERMINAL.projectItemPrefix}{project.metric} {project.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                    break;

                case "email":
                    output = (
                        <div className="flex items-center gap-3">
                            <span className="text-white/70">{TERMINAL.emailLabel}</span>
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="text-cyan-300 underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {PROFILE.email}
                            </a>
                        </div>
                    );
                    break;

                case "github":
                    output = (
                        <div className="flex items-center gap-3">
                            <span className="text-white/70">{TERMINAL.githubLabel}</span>
                            <a
                                href={PROFILE.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-300 underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {PROFILE.github}
                            </a>
                        </div>
                    );
                    break;

                case "linkedin":
                    output = (
                        <div className="flex items-center gap-3">
                            <span className="text-white/70">{TERMINAL.linkedinLabel}</span>
                            <a
                                href={PROFILE.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-300 underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {PROFILE.linkedin}
                            </a>
                        </div>
                    );
                    break;

                case "resume":
                    output = (
                        <div className="flex items-center gap-3">
                            <span className="text-white/70">{TERMINAL.resumeLabel}</span>
                            <a
                                href={PROFILE.resume}
                                download
                                className="rounded-md border border-white/10 px-3 py-1 text-sm text-white/80 transition hover:bg-white/5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {TERMINAL.resumeDownload}
                            </a>
                        </div>
                    );
                    break;

                case "theme":
                    onToggleTheme();
                    output = TERMINAL.themeToggled;
                    break;

                case "date":
                    output = new Date().toString();
                    break;

                default:
                    type = "error";
                    output = `${TERMINAL.errorPrefix}${rawCommand}${TERMINAL.errorSuffix}`;
            }

            pushEntry(rawCommand, type, output);
        },
        [onToggleTheme, pushEntry],
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim()) handleCommand(input);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!commandLog.length) return;
            const next = Math.min(historyCursor + 1, commandLog.length - 1);
            setHistoryCursor(next);
            setInput(commandLog[commandLog.length - 1 - next] ?? "");
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = historyCursor - 1;
            setHistoryCursor(next);
            setInput(next >= 0 ? commandLog[commandLog.length - 1 - next] : "");
        } else if (event.key === "Tab") {
            event.preventDefault();
            const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
            if (match) setInput(match);
        }
    };

    const handleContainerClick = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest("button, a")) inputRef.current?.focus();
    };

    return (
        <div
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a0e] text-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]"
            onClick={handleContainerClick}
        >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-white/40">
                    <Terminal size={14} className="text-cyan-300" aria-hidden="true" />
                    <span>{TERMINAL.secureInterface}</span>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
            </div>

            <div
                role="log"
                aria-live="polite"
                className="min-h-[260px] max-h-[360px] overflow-y-auto p-4 font-mono text-sm sm:min-h-96 sm:max-h-[500px] sm:p-6"
            >
                {history.map((entry, i) => (
                    <div
                        key={i}
                        className={`py-0.5 whitespace-pre-wrap ${entry.type === "prompt"
                                ? "text-cyan-300"
                                : entry.type === "error"
                                    ? "text-rose-400"
                                    : "text-white/70"
                            }`}
                    >
                        {entry.text}
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                <span className="text-cyan-300" aria-hidden="true">
                    {TERMINAL.prompt}
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Terminal command input"
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                    placeholder={TERMINAL.placeholder}
                />
            </form>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Skills constellation (about section)                                      */
/* -------------------------------------------------------------------------- */
function SkillsConstellation() {
    const groups = useMemo(() => {
        const map = new Map<string, string[]>();
        SKILLS.forEach((skill) => {
            const category = SKILL_CATEGORIES.find((c) => c.pattern.test(skill))?.name ?? "Core Stack";
            const existing = map.get(category) ?? [];
            existing.push(skill);
            map.set(category, existing);
        });
        return Array.from(map.entries());
    }, []);

    const [active, setActive] = useState<string | null>(null);
    const activeCategory = active ? (SKILL_CATEGORIES.find((c) => c.pattern.test(active))?.name ?? "") : "";

    return (
        <div className="mx-auto mt-14 max-w-5xl">
            <div className="flex flex-col gap-10">
                {groups.map(([category, items]) => (
                    <div key={category}>
                        <p className="mb-4 text-left text-xs uppercase tracking-[.25em] text-[var(--muted)]">
                            {category}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                            {items.map((skill) => (
                                <motion.button
                                    type="button"
                                    key={skill}
                                    onHoverStart={() => setActive(skill)}
                                    onHoverEnd={() => setActive(null)}
                                    onFocus={() => setActive(skill)}
                                    onBlur={() => setActive(null)}
                                    whileHover={{ scale: 1.08, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    aria-describedby="skills-constellation-detail"
                                    className="rounded-full border border-[var(--line)] bg-[var(--glass)] px-5 py-3 text-sm outline-none transition-colors focus-visible:border-[var(--signal)]"
                                >
                                    {skill}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div
                id="skills-constellation-detail"
                aria-live="polite"
                className="mt-8 h-6 text-center text-sm text-[var(--muted)]"
            >
                {active ? `${active} — part of the ${activeCategory} layer of the stack.` : ""}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Projects Section & Cards (Merged Component)                                */
/* -------------------------------------------------------------------------- */
function buildCardVariants(reduced: boolean): { grid: Variants; card: Variants } {
    if (reduced) {
        return {
            grid: { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
            card: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } },
        };
    }
    return {
        grid: {
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        },
        card: {
            hidden: { opacity: 0, y: 80, rotateX: 8, filter: "blur(10px)" },
            show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.9 },
            },
        },
    };
}

function AbstractPreview({ color, seed }: { color: string; seed: number }) {
    const nodes = [
        [20 + (seed * 13) % 30, 30 + (seed * 7) % 25],
        [55 + (seed * 11) % 30, 15 + (seed * 17) % 20],
        [75 + (seed * 5) % 15, 55 + (seed * 19) % 25],
        [30 + (seed * 23) % 25, 65 + (seed * 3) % 20],
        [50, 45],
    ];

    return (
        <div className="relative h-full w-full overflow-hidden rounded-t-[calc(1.75rem-3px)]">
            <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(120% 100% at 20% 0%, ${color}22 0%, transparent 55%)` }}
            />
            <div
                className="absolute inset-0 opacity-40"
                style={{ background: `radial-gradient(60% 60% at 80% 90%, ${color}30 0%, transparent 70%)` }}
            />
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id={`glow-${seed}`}>
                        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                </defs>
                {nodes.map(([x1, y1], i) => {
                    const [x2, y2] = nodes[(i + 1) % nodes.length];
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={color}
                            strokeOpacity={0.25}
                            strokeWidth={0.3}
                        />
                    );
                })}
                {nodes.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={i === 4 ? 10 : 2.2} fill={`url(#glow-${seed})`} />
                ))}
                {nodes.map(([x, y], i) => (
                    <circle key={`dot-${i}`} cx={x} cy={y} r={0.9} fill={color} />
                ))}
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,var(--paper)_100%)] opacity-60" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
    );
}

interface ProjectGridCardProps {
    project: (typeof PROJECTS)[number];
    index: number;
    onOpen: () => void;
    cardVariants: Variants;
}

function ProjectGridCard({ project, index, onOpen, cardVariants }: ProjectGridCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        ref.current?.style.setProperty("--spot-x", `${x}%`);
        ref.current?.style.setProperty("--spot-y", `${y}%`);
    }, []);

    const visibleTech = project.tech.slice(0, 5);

    return (
        <motion.article
            ref={ref}
            variants={cardVariants}
            onMouseMove={handleMove}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{
                ["--spot-x" as string]: "50%",
                ["--spot-y" as string]: "50%",
                ["--project-color" as string]: project.color,
                transformPerspective: 1000,
            }}
            className="group/card relative flex h-[560px] flex-col overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--glass)] shadow-[0_30px_80px_-40px_rgba(0,0,0,.55)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 hover:border-[color-mix(in_srgb,var(--project-color)_45%,var(--line))] hover:bg-[color-mix(in_srgb,var(--glass)_88%,transparent)] hover:shadow-[0_50px_110px_-40px_rgba(0,0,0,.65)] focus-within:border-[var(--project-color)]"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{
                    background:
                        "radial-gradient(360px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--project-color) 16%, transparent), transparent 65%)",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute left-0 top-0 z-10 h-[2px] w-0 transition-[width] duration-500 ease-out group-hover/card:w-full"
                style={{ background: `linear-gradient(90deg, var(--project-color), transparent)` }}
            />
            <div className="relative h-[38%] shrink-0 border-b border-[var(--line)]">
<div className="relative h-full w-full overflow-hidden rounded-t-[calc(1.75rem-3px)]">
    {project.image ? (
        <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
            sizes="(max-width:768px) 100vw, 33vw"
        />
    ) : (
        <AbstractPreview color={project.color} seed={index + 1} />
    )}

    <div
        className="absolute inset-0"
        style={{
            background:
                "linear-gradient(to top, rgba(10,13,18,.75), transparent)"
        }}
    />
</div>                <span
                    className="absolute left-4 top-4 z-10 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[.2em] backdrop-blur-xl"
                    style={{ borderColor: `${project.color}55`, color: project.color, background: "var(--glass)" }}
                >
                    {PROJECTS_SECTION.caseStudyPrefix}0{index + 1}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--ink)]">
                    {project.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                    {project.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {visibleTech.map((tech, i) => (
                        <span
                            key={tech}
                            style={{ transitionDelay: `${i * 25}ms` }}
                            className="translate-y-0 rounded-full border border-[var(--line)] bg-[var(--glass)] px-2.5 py-1 text-[11px] text-[var(--ink)] transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-6 relative z-20">
                    <div>
                        <p
                            className="text-2xl font-bold leading-none"
                            style={{ color: project.color }}
                        >
                            {project.metric}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[.2em] text-[var(--muted)]">
                            {project.label}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onOpen}
                            aria-label={`View ${project.title} case study`}
                            data-cursor={UI.cursorOpenLabel}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition-transform hover:scale-105"
                        >
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </button>
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source on GitHub`}
                            data-cursor={UI.cursorCodeLabel}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]/40"
                        >
                            <Github size={16} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

function ProjectsSection({ onOpenProject }: { onOpenProject: (index: number) => void }) {
    const reduced = usePrefersReducedMotion();
    const variants = useMemo(() => buildCardVariants(reduced), [reduced]);

    return (
        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 md:py-36">
            <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-semibold">
                {PROJECTS_SECTION.headingStart} <span className="text-[var(--muted)]">{PROJECTS_SECTION.headingEnd}</span>
            </h2>

            <motion.div
                variants={variants.grid}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                style={{ perspective: 1200 }}
            >
                {PROJECTS.map((project, i) => (
                    <ProjectGridCard
                        key={project.title}
                        project={project}
                        index={i}
                        onOpen={() => onOpenProject(i)}
                        cardVariants={variants.card}
                    />
                ))}
            </motion.div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*  Project modal                                                              */
/* -------------------------------------------------------------------------- */
function ProjectModal({ project, index, onClose }: { project: (typeof PROJECTS)[number]; index: number; onClose: () => void }) {
    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] overflow-auto bg-black/80 p-6 backdrop-blur-2xl"
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto max-w-5xl rounded-[2rem] bg-[#0a0d12] p-10 text-white"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="float-right rounded-full border border-white/10 p-2 transition-colors hover:bg-white/5"
                >
                    <X aria-hidden="true" />
                </button>

                <p className="text-xs uppercase tracking-[.25em]" style={{ color: project.color }}>
                    {PROJECTS_SECTION.caseStudyPrefix}0{index + 1}
                </p>
                <h2 className="mt-4 text-[clamp(1.75rem,4.5vw,3rem)] font-semibold">{project.title}</h2>
                <p className="mt-8 max-w-3xl leading-8 text-white/60">{project.summary}</p>

                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 p-5">
                        <b className="text-3xl" style={{ color: project.color }}>
                            {project.metric}
                        </b>
                        <p className="text-xs text-white/50">{project.label}</p>
                    </div>
                    {project.tech.slice(0, 3).map((tech) => (
                        <div key={tech} className="rounded-2xl border border-white/10 p-5">
                            <p className="text-sm">{tech}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex gap-3">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-white px-6 py-4 text-black"
                    >
                        <Github size={18} aria-hidden="true" /> {PROJECTS_SECTION.codeButton}
                    </a>
                    <a href="#contact" onClick={onClose} className="rounded-full border border-white/15 px-6 py-4">
                        {PROJECTS_SECTION.discussProject}
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main portfolio page                                                        */
/* -------------------------------------------------------------------------- */
export default function Portfolio() {
    const [light, setLight] = useTheme();
    const [loaded, setLoaded] = useState(false);
    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [compact, setCompact] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(NAVIGATION_ITEMS[0].href.replace("#", ""));
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
        const sections = NAVIGATION_ITEMS.map((item) => document.getElementById(item.href.replace("#", ""))).filter(
            (el): el is HTMLElement => el !== null,
        );
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-45% 0px -45% 0px" },
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
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModalIndex(null);
                setMobileNavOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        },
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

            <AnimatePresence>{!loaded && <LoaderScreen onDone={() => setLoaded(true)} />}</AnimatePresence>

            <Background reduced={reduced} />
            <Cursor />

            <motion.div
                style={{ scaleX: scrollProgressSpring }}
                className="fixed left-0 top-0 z-[110] h-[2px] w-full origin-left bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]"
            />

            {/* Navbar */}
            <nav className="fixed left-1/2 top-4 z-50 w-[min(900px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--glass)] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,.18)]">
                <div
                    className={`flex items-center justify-between px-4 transition-all duration-300 ${compact ? "h-14" : "h-16"}`}
                >
                    <b className="text-sm text-[var(--ink)]">{PROFILE.initials} / {PROFILE.fullName}</b>

                    <div className="hidden items-center gap-1 md:flex">
                        {NAVIGATION_ITEMS.map((item) => {
                            const id = item.href.replace("#", "");
                            const isActive = activeSection === id;
                            return (
                                <a
                                    key={id}
                                    href={item.href}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`relative rounded-full px-4 py-2 text-sm transition-colors ${isActive ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                            className="absolute inset-0 -z-10 rounded-full bg-[var(--signal)]/12"
                                        />
                                    )}
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <Magnetic>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
                                className="rounded-full border border-[var(--line)] p-3"
                            >
                                {light ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
                            </button>
                        </Magnetic>
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen((prev) => !prev)}
                            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileNavOpen}
                            className="rounded-full border border-[var(--line)] p-3 md:hidden"
                        >
                            {mobileNavOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileNavOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden border-t border-[var(--line)] md:hidden"
                        >
                            <div className="flex flex-col gap-1 p-3">
                                {NAVIGATION_ITEMS.map((item) => {
                                    const id = item.href.replace("#", "");
                                    const isActive = activeSection === id;
                                    return (
                                        <a
                                            key={id}
                                            href={item.href}
                                            onClick={() => setMobileNavOpen(false)}
                                            aria-current={isActive ? "true" : undefined}
                                            className={`rounded-xl px-4 py-3 text-sm transition-colors ${isActive
                                                    ? "bg-[var(--signal)]/12 text-[var(--ink)]"
                                                    : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"
                                                }`}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero */}
            <Hero loaded={loaded} reduced={reduced} />

            {/* About */}
            <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:py-36">
                <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-semibold">
                    {ABOUT.headingStart} <span className="text-[var(--muted)]">{ABOUT.headingEnd}</span>
                </h2>
                <div data-reveal className="mt-14 grid gap-5 md:grid-cols-2">
                    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--glass)] p-6 md:p-9">
                        <p className="text-xl leading-relaxed sm:text-2xl md:text-3xl">
                            {ABOUT.description}
                        </p>
                    </div>
                    <div className="space-y-4">
                        {ABOUT.sections.map((section) => (
                            <div
                                key={section.title}
                                className="group rounded-[2rem] border border-[var(--line)] bg-[var(--glass)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--signal)]"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">{section.title}</h3>
                                    <ArrowUpRight
                                        size={18}
                                        aria-hidden="true"
                                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                    />
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {section.items.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-[var(--line)] px-3 py-2 text-sm transition hover:bg-[var(--signal)]/10"
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
            <section id="expertise" className="border-y border-[var(--line)] px-6 py-20 md:py-36 text-center">
                <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-semibold">
                    {EXPERTISE.heading}
                </h2>
                <div data-reveal>
                    <SkillsConstellation />
                </div>
            </section>

            {/* Projects */}
            <ProjectsSection onOpenProject={setModalIndex} />

            {/* Contact */}
            <section id="contact" className="mx-auto max-w-7xl px-6 py-20 md:py-36">
                <h2 data-reveal className="text-[clamp(2.25rem,7vw,6rem)] font-semibold">
                    {CONTACT_SECTION.headingStart} <span className="text-[var(--muted)]">{CONTACT_SECTION.headingEnd}</span>
                </h2>
                <div data-reveal className="mt-14">
                    <TerminalContact onToggleTheme={toggleTheme} />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--line)] p-6 sm:p-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <b className="text-xl">{FOOTER.name}</b>
                        <p className="text-[var(--muted)]">{FOOTER.role}</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={SOCIALS.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="rounded-full border border-[var(--line)] p-3"
                        >
                            <Github size={16} aria-hidden="true" />
                        </a>
                        <a
                            href={SOCIALS.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="rounded-full border border-[var(--line)] p-3"
                        >
                            <Linkedin size={16} aria-hidden="true" />
                        </a>
                        <a href={`mailto:${SOCIALS.email}`} aria-label="Email" className="rounded-full border border-[var(--line)] p-3">
                            <Mail size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-[var(--muted)]">{FOOTER.location}</p>
                        <p className="tabular-nums text-sm text-[var(--muted)]">
                            {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                    </div>
                </div>
                <p className="mx-auto mt-8 max-w-7xl tracking-widest text-[var(--muted)]">{FOOTER.tagline}</p>
            </footer>

            {/* Project modal */}
            <AnimatePresence>
                {activeProject && modalIndex !== null && (
                    <ProjectModal project={activeProject} index={modalIndex} onClose={() => setModalIndex(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}