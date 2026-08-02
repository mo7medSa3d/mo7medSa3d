"use client";

import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
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
import { PROFILE, PROJECTS, SKILLS } from "@/constants/data";
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
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = ["About", "Expertise", "Projects", "Contact"] as const;
const NAV_SECTIONS = ["home", "about", "expertise", "projects", "contact"] as const;

const LOADER_TICK_MS = 90;
const LOADER_STEP = 11;
const LOADER_EXIT_DELAY_MS = 450;

const ROLE_ROTATE_MS = 3000;

const SCROLL_COMPACT_THRESHOLD = 40;

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

/** Skill category keyword matchers, evaluated in priority order. */
const SKILL_CATEGORY_PATTERNS: [category: string, pattern: RegExp][] = [
    ["Data", /(pandas|numpy|sql|etl|spark|airflow|data)/i],
    ["Modeling", /(sklearn|scikit|tensorflow|pytorch|xgboost|ml|regression|cluster)/i],
    ["Product", /(react|next|node|typescript|javascript|api|web)/i],
];

/** Buckets a flat skill string into a readable category without touching the source data shape. */
function categorizeSkill(skill: string): string {
    const match = SKILL_CATEGORY_PATTERNS.find(([, pattern]) => pattern.test(skill));
    return match?.[0] ?? "Core Stack";
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
            const t = (e.target as HTMLElement).closest<HTMLElement>(
                "[data-cursor],a,button"
            );
            setLabel(t?.dataset.cursor || (t ? "VIEW" : ""));
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
/*  Hooks                                                                      */
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

/**
 * Throttles a scroll handler to at most once per animation frame,
 * avoiding layout thrashing on high-frequency scroll events.
 */
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
    /** Pull strength; higher values track the cursor more aggressively. */
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
/*  Rotating role headline                                                     */
/* -------------------------------------------------------------------------- */

function Roles() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(
            () => setIndex((current) => (current + 1) % PROFILE.roles.length),
            ROLE_ROTATE_MS,
        );
        return () => clearInterval(id);
    }, []);

    return (
        <div className="h-14 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                    exit={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)] bg-clip-text text-3xl font-semibold text-transparent"
                >
                    {PROFILE.roles[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Loading screen                                                             */
/* -------------------------------------------------------------------------- */

function Loader({ onDone }: { onDone: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setProgress((current) => {
                const next = Math.min(100, current + LOADER_STEP);
                if (next === 100) {
                    clearInterval(id);
                    setTimeout(onDone, LOADER_EXIT_DELAY_MS);
                }
                return next;
            });
        }, LOADER_TICK_MS);
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
                    Calibrating signal core…
                </p>
                <h1 className="mt-10 text-5xl font-semibold text-white">
                    MOHAMED
                    <br />
                    <span className="text-white/30">AL-SHAER</span>
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
            <div className="text-[var(--signal)]">MOHAMED AL-SHAER // NEURAL-ENGINE v2.0</div>
            <div>Type &apos;help&apos; to see available commands.</div>
        </div>
    ),
};

interface TerminalContactProps {
    onToggleTheme: () => void;
}
export function TerminalContact({ onToggleTheme }: TerminalContactProps) {
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
                            <div>Available commands:</div>
                            <div>• whoami – About me</div>
                            <div>• skills – My technical skills</div>
                            <div>• projects – List case studies</div>
                            <div>• email – My email address</div>
                            <div>• github – My GitHub profile</div>
                            <div>• linkedin – My LinkedIn profile</div>
                            <div>• resume – Download my resume</div>
                            <div>• theme – Toggle light / dark mode</div>
                            <div>• date – Current date &amp; time</div>
                            <div>• clear – Clear terminal</div>
                            <div className="text-white/30">↑ / ↓ browse history · Tab to autocomplete</div>
                        </div>
                    );
                    break;

                case "whoami":
                    output = (
                        <div className="space-y-2">
                            <div className="font-semibold text-cyan-300">{PROFILE.name}</div>
                            <div className="text-white/70">{PROFILE.bio}</div>
                            <div className="text-xs text-white/50">{PROFILE.university}</div>
                        </div>
                    );
                    break;

                case "skills":
                    output = (
                        <div className="space-y-1">
                            <div className="text-white/70">Skills:</div>
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
                                        {" "}
                                        — {project.metric} {project.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                    break;

                case "email":
                    output = (
                        <div className="flex items-center gap-3">
                            <span className="text-white/70">Email:</span>
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
                            <span className="text-white/70">GitHub:</span>
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
                            <span className="text-white/70">LinkedIn:</span>
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
                            <span className="text-white/70">Resume:</span>
                            <a
                                href={PROFILE.resume}
                                download
                                className="rounded-md border border-white/10 px-3 py-1 text-sm text-white/80 transition hover:bg-white/5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download
                            </a>
                        </div>
                    );
                    break;

                case "theme":
                    onToggleTheme();
                    output = "Theme toggled.";
                    break;

                case "date":
                    output = new Date().toString();
                    break;

                default:
                    output = `Command not found: "${command}". Type 'help' for available commands.`;
                    type = "error";
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
                    <span>mohamed@neural-engine: ~</span>
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
                        className={`py-0.5 whitespace-pre-wrap ${
                            entry.type === "prompt"
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
                    $
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
                    placeholder="Enter a command…"
                />
            </form>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Skills constellation                                                       */
/* -------------------------------------------------------------------------- */

function SkillsConstellation() {
    const groups = useMemo(() => {
        const map = new Map<string, string[]>();
        SKILLS.forEach((skill) => {
            const category = categorizeSkill(skill);
            map.set(category, [...(map.get(category) ?? []), skill]);
        });
        return Array.from(map.entries());
    }, []);

    const [active, setActive] = useState<string | null>(null);
    const activeCategory = active ? categorizeSkill(active) : null;

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
/*  Project case study card                                                    */
/* -------------------------------------------------------------------------- */

interface ProjectCaseProps {
    project: (typeof PROJECTS)[number];
    index: number;
    onOpen: () => void;
}

const CARD_TILT_STIFFNESS = 150;
const CARD_TILT_DAMPING = 18;
const CARD_TILT_DEGREES = 6;

function ProjectCase({ project, index, onOpen }: ProjectCaseProps) {
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: CARD_TILT_STIFFNESS, damping: CARD_TILT_DAMPING });
    const springRotateY = useSpring(rotateY, { stiffness: CARD_TILT_STIFFNESS, damping: CARD_TILT_DAMPING });

    const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(relativeX * CARD_TILT_DEGREES);
        rotateX.set(-relativeY * CARD_TILT_DEGREES);
    };

    const handlePointerLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    // Bounded so the result panel's tech list can never grow taller than its
    // viewport-scaled budget, regardless of how many technologies a project lists.
    const visibleTech = project.tech.slice(0, 4);

    return (
        <article
            className="h-[min(82svh,720px)] w-full max-w-7xl overflow-hidden rounded-[clamp(1rem,1.5vw,2.25rem)] border border-[var(--line)] bg-[var(--glass)] p-[clamp(0.5rem,1vw+1.5svh,2rem)] shadow-[0_30px_120px_rgba(0,0,0,.75)] backdrop-blur-xl"
            style={{
                zIndex: index + 1,
                backgroundImage: `radial-gradient(circle at 80% 30%, ${project.color}22, transparent 32%)`,
            }}
        >
            <div className="mx-auto flex h-full w-full max-w-7xl flex-row items-center gap-[clamp(0.5rem,1.5vw,2.5rem)]">
                <div
                    data-reveal
                    className="flex min-w-0 basis-[55%] flex-col justify-center overflow-hidden"
                >
                    <p
                        className="text-[clamp(.55rem,.5vw+.5svh,.75rem)] uppercase tracking-[.25em]"
                        style={{ color: project.color }}
                    >
                        Case study — 0{index + 1} of {PROJECTS.length}
                    </p>
                    <h3 className="mt-[clamp(0.5rem,0.6vw+0.8svh,1rem)] break-words text-[clamp(1rem,2.2vw+1.6svh,4.5rem)] font-semibold leading-[.95] tracking-tight text-[var(--ink)]">
                        {project.title}
                    </h3>
                    <p className="mt-[clamp(0.5rem,0.6vw+0.8svh,1rem)] overflow-hidden text-[clamp(.65rem,.5vw+.7svh,1rem)] leading-relaxed text-[var(--muted)] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] [display:-webkit-box]">
                        {project.summary}
                    </p>
                    <div className="mt-[clamp(0.75rem,0.8vw+1svh,1.75rem)] flex flex-wrap gap-[clamp(0.25rem,0.4vw+0.4svh,0.5rem)]">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--glass)] px-[clamp(0.4rem,0.5vw+0.3svh,0.75rem)] py-[clamp(0.15rem,0.2vw+0.2svh,0.25rem)] text-[clamp(.5rem,.4vw+.4svh,.8rem)] text-[var(--ink)] backdrop-blur-xl"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <Magnetic>
                        <button
                            type="button"
                            onClick={onOpen}
                            data-cursor="OPEN"
                            className="mt-[clamp(0.5rem,0.5vw+0.7svh,1rem)] flex w-fit items-center gap-2 rounded-full bg-[var(--ink)] px-[clamp(0.6rem,0.6vw+0.5svh,1.5rem)] py-[clamp(0.35rem,0.4vw+0.5svh,0.75rem)] text-[clamp(.6rem,.5vw+.5svh,.9rem)] font-medium text-[var(--paper)] transition-all duration-300 hover:scale-105 hover:opacity-90"
                        >
                            View Case Study
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </button>
                    </Magnetic>
                </div>

                <motion.div
                    onMouseMove={handlePointerMove}
                    onMouseLeave={handlePointerLeave}
                    style={{
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        transformPerspective: 900,
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="relative flex min-w-0 basis-[45%] flex-col overflow-hidden rounded-[clamp(0.85rem,1.4vw,2rem)] border border-white/[0.08] bg-[#050505] p-[clamp(0.5rem,1vw+1.5svh,1.75rem)] text-white shadow-[0_30px_80px_rgba(0,0,0,.85)] backdrop-blur-2xl will-change-transform"
                >
                    <div
                        className="absolute -right-[clamp(3rem,5vw+4svh,6rem)] -top-[clamp(3rem,5vw+4svh,6rem)] h-[clamp(6rem,10vw+8svh,14rem)] w-[clamp(6rem,10vw+8svh,14rem)] rounded-full blur-3xl"
                        style={{ background: `${project.color}30` }}
                    />

                    <div className="relative flex items-start justify-between gap-[clamp(0.5rem,0.6vw+0.6svh,0.75rem)]">
                        <div>
                            <p className="text-[clamp(.5rem,.4vw+.4svh,.75rem)] uppercase tracking-[.25em] text-white/40">
                                Project Result
                            </p>
                            <h4
                                className="mt-[clamp(0.25rem,0.3vw+0.4svh,0.5rem)] text-[clamp(1.25rem,1.6vw+2.4svh,3.75rem)] font-bold"
                                style={{ color: project.color }}
                            >
                                {project.metric}
                            </h4>
                            <p className="mt-[clamp(0.25rem,0.3vw+0.3svh,0.5rem)] text-[clamp(.55rem,.4vw+.5svh,.85rem)] text-white/50">
                                {project.label}
                            </p>
                        </div>
                        <div
                            className="rounded-full border px-[clamp(0.5rem,0.5vw+0.4svh,0.75rem)] py-[clamp(0.15rem,0.2vw+0.2svh,0.25rem)] text-[clamp(.5rem,.35vw+.4svh,.75rem)]"
                            style={{
                                borderColor: `${project.color}55`,
                                color: project.color,
                            }}
                        >
                            LIVE
                        </div>
                    </div>

                    <div className="my-[clamp(0.75rem,0.8vw+1.2svh,2rem)] h-px bg-white/10" />

                    <div className="flex flex-col gap-[clamp(0.4rem,0.5vw+0.7svh,1rem)]">
                        {visibleTech.map((tech, i) => (
                            <motion.div
                                key={tech}
                                whileHover={{ x: 5 }}
                                className="group flex items-center justify-between rounded-[clamp(0.75rem,1vw,1rem)] border border-white/10 bg-white/[0.03] px-[clamp(0.5rem,0.6vw+0.6svh,1.25rem)] py-[clamp(0.35rem,0.4vw+0.6svh,1rem)]"
                            >
                                <div className="flex items-center gap-[clamp(0.4rem,0.5vw+0.4svh,0.75rem)]">
                                    <div
                                        className="flex h-[clamp(1.5rem,2vw+2svh,2.5rem)] w-[clamp(1.5rem,2vw+2svh,2.5rem)] items-center justify-center rounded-full text-[clamp(.55rem,.4vw+.5svh,.85rem)] font-semibold"
                                        style={{
                                            background: `${project.color}20`,
                                            color: project.color,
                                        }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <span className="text-[clamp(.65rem,.5vw+.6svh,1rem)]">
                                        {tech}
                                    </span>
                                </div>
                                <ArrowUpRight
                                    size={16}
                                    className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-[clamp(0.5rem,0.6vw+0.8svh,1.5rem)] grid grid-cols-2 gap-[clamp(0.4rem,0.5vw+0.5svh,0.75rem)]">
                        <div className="rounded-[clamp(0.75rem,1vw,1rem)] border border-white/10 p-[clamp(0.5rem,0.6vw+0.7svh,1.25rem)]">
                            <p className="text-[clamp(.5rem,.35vw+.4svh,.75rem)] uppercase text-white/40">
                                Stack
                            </p>
                            <b className="mt-[clamp(0.25rem,0.3vw+0.3svh,0.5rem)] block text-[clamp(.95rem,.8vw+1.2svh,1.875rem)]">
                                {project.tech.length}
                            </b>
                        </div>
                        <div className="rounded-[clamp(0.75rem,1vw,1rem)] border border-white/10 p-[clamp(0.5rem,0.6vw+0.7svh,1.25rem)]">
                            <p className="text-[clamp(.5rem,.35vw+.4svh,.75rem)] uppercase text-white/40">
                                Case Study
                            </p>
                            <b className="mt-[clamp(0.25rem,0.3vw+0.3svh,0.5rem)] block text-[clamp(.95rem,.8vw+1.2svh,1.875rem)]">
                                0{index + 1}
                            </b>
                        </div>
                    </div>
                </motion.div>
            </div>
        </article>
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
                    Case study — 0{index + 1}
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
                        <Github size={18} aria-hidden="true" /> Code
                    </a>
                    <a href="#contact" onClick={onClose} className="rounded-full border border-white/15 px-6 py-4">
                        Discuss this project
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
    const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0]);
    const [now, setNow] = useState<Date | null>(null);
    const reduced = usePrefersReducedMotion();
    const projectsSection = useRef<HTMLElement>(null);
    const projectsTrack = useRef<HTMLDivElement>(null);
    const scrollProgress = useMotionValue(0);
    const scrollProgressSpring = useSpring(scrollProgress, { stiffness: 130, damping: 28 });

    const toggleTheme = useCallback(() => setLight((prev) => !prev), [setLight]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Scroll progress + navbar compaction, throttled to one update per frame.
    useRafThrottledScroll(() => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress.set(window.scrollY / maxScroll);
        setCompact(window.scrollY > SCROLL_COMPACT_THRESHOLD);
    }, [scrollProgress]);

    // Scroll-spy for nav active states.
    useEffect(() => {
        const sections = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(
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

    // Live clock for the footer.
    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // Escape closes the project modal and the mobile nav menu.
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

    // GSAP scroll-triggered reveal animations & responsive matchMedia.
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Reveal animations for all devices
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

            // MatchMedia for Desktop Horizontal Scroll only!
            const mm = gsap.matchMedia();

            mm.add("(min-width: 0px)", () => {
                if (projectsSection.current && projectsTrack.current) {
                    const cards = gsap.utils.toArray(".project-card");

                    gsap.to(cards, {
                        xPercent: -100 * (cards.length - 1),
                        ease: "none",
                        scrollTrigger: {
                            invalidateOnRefresh: true,
                            trigger: projectsSection.current,
                            pin: true,
                            scrub: 1,
                            start: "top top",
                            end: () =>
                                "+=" +
                                (projectsTrack.current!.scrollWidth - window.innerWidth),
                        },
                    });
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const themeVars = useMemo<ThemeVars>(() => (light ? LIGHT_THEME : DARK_THEME), [light]);
    const activeProject = modalIndex !== null ? PROJECTS[modalIndex] : null;

    return (
        <main
            style={themeVars as React.CSSProperties}
            // Added md: prefix so the custom cursor is desktop-only, preventing touch issues on mobile
            className="md:cursor-none overflow-clip bg-[var(--paper)] text-[var(--ink)] transition-colors duration-700"
        >
            <a
                href="#home"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--paper)]"
            >
                Skip to content
            </a>

            <AnimatePresence>{!loaded && <Loader onDone={() => setLoaded(true)} />}</AnimatePresence>

            <Background reduced={reduced} />

            {/* The integrated Cursor Component is rendered here */}
            <Cursor />

            <motion.div
                style={{ scaleX: scrollProgressSpring }}
                className="fixed left-0 top-0 z-[110] h-[2px] w-full origin-left bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]"
            />

            {/* Navbar */}
            <nav className="fixed left-1/2 top-4 z-50 w-[min(900px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--glass)] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,.18)]">
                <div
                    className={`flex items-center justify-between px-4 transition-all duration-300 ${compact ? "h-14" : "h-16"
                        }`}
                >
                    <b className="text-sm text-[var(--ink)]">MA / Mohamed Al-Shaer</b>

                    <div className="hidden items-center gap-1 md:flex">
                        {NAV_LINKS.map((link) => {
                            const id = link.toLowerCase();
                            const isActive = activeSection === id;
                            return (
                                <a
                                    key={link}
                                    href={`#${id}`}
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
                                    {link}
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
                                {NAV_LINKS.map((link) => {
                                    const id = link.toLowerCase();
                                    const isActive = activeSection === id;
                                    return (
                                        <a
                                            key={link}
                                            href={`#${id}`}
                                            onClick={() => setMobileNavOpen(false)}
                                            aria-current={isActive ? "true" : undefined}
                                            className={`rounded-xl px-4 py-3 text-sm transition-colors ${isActive
                                                ? "bg-[var(--signal)]/12 text-[var(--ink)]"
                                                : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"
                                                }`}
                                        >
                                            {link}
                                        </a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero */}
            <section
                id="home"
                className="relative flex flex-col gap-14 px-6 pb-20 pt-28 md:grid md:min-h-screen md:grid-cols-2 md:items-center md:gap-10 md:px-12 md:pb-0 md:pt-24"
            >
                <div className="relative z-10 min-w-0">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-4 py-2 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" aria-hidden="true" />
                        Available for high-impact opportunities
                    </span>
                    <h1 className="mt-9 text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[.84] tracking-[-.075em]">
                        Mohamed
                        <br />
                        <span className="text-[var(--muted)]">Al-Shaer.</span>
                    </h1>
                    <div className="mt-8">
                        <Roles />
                    </div>
                    <p className="mt-5 max-w-xl leading-8 text-[var(--muted)]">
                        Computer and Data Science student at Alexandria University building
                        production-minded AI, predictive analytics, automation and business
                        intelligence systems.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Magnetic>
                            <a
                                href="#projects"
                                data-cursor="EXPLORE"
                                className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-4 font-semibold text-[var(--paper)]"
                            >
                                Explore work <ArrowDown size={18} aria-hidden="true" />
                            </a>
                        </Magnetic>
                        <Magnetic>
                            <a
                                href="#contact"
                                data-cursor="CONTACT"
                                className="rounded-full border border-[var(--line)] px-6 py-4"
                            >
                                Contact
                            </a>
                        </Magnetic>
                        <Magnetic>
                            <a
                                href={PROFILE.resume}
                                download
                                aria-label="Download résumé"
                                className="rounded-full border border-[var(--line)] p-4"
                            >
                                <Download aria-hidden="true" />
                            </a>
                        </Magnetic>
                    </div>
                </div>

                <div className="relative min-w-0">
                    <div className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[.35em] text-[var(--muted)] md:hidden">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" aria-hidden="true" />
                        Signal Core
                    </div>
                    <div className="relative mx-auto h-[320px] w-full max-w-md overflow-hidden sm:h-[400px] md:h-[720px] md:max-w-none md:rounded-none md:border-none md:bg-transparent md:backdrop-blur-none">
                        <AICore />
                    </div>
                </div>

                <a
                    href="#about"
                    className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-[var(--muted)] md:flex"
                >
                    Scroll
                    <motion.span
                        animate={reduced ? {} : { y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    >
                        <ArrowDown size={14} aria-hidden="true" />
                    </motion.span>
                </a>
            </section>

            {/* About */}
            <section id="about" className="mx-auto max-w-7xl px-6 py-20 md:py-36">
                <h2 data-reveal className="text-[clamp(2rem,5.5vw,4.5rem)] font-semibold">
                    Engineering intelligence for{" "}
                    <span className="text-[var(--muted)]">real business problems.</span>
                </h2>
                <div data-reveal className="mt-14 grid gap-5 md:grid-cols-2">
                    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--glass)] p-6 md:p-9">
                        <p className="text-xl leading-relaxed sm:text-2xl md:text-3xl">
                            I specialize in machine learning, predictive analytics, data
                            engineering, automation and business intelligence — turning raw,
                            messy datasets into systems people can actually act on.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                title: "Machine Learning",
                                items: ["Regression", "Data Mining", "Model Evaluation", "Classification", "Feature Engineering"],
                            },
                            { title: "Data Analytics", items: ["Power BI", "SQL", "Excel", "Dashboard Design"] },
                            { title: "Automation", items: ["Playwright", "Selenium", "Web Scraping"] },
                            { title: "Deployment", items: ["Flask", "FastAPI", "Docker"] },
                        ].map((section) => (
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
                    A connected intelligence stack.
                </h2>
                <div data-reveal>
                    <SkillsConstellation />
                </div>
            </section>

            {/* Projects */}
            <section
                id="projects"
                ref={projectsSection}
                className="relative h-screen min-h-screen overflow-hidden"
            >
                <div
                    ref={projectsTrack}
                    className="flex h-screen flex-row items-center"
                >
                    {PROJECTS.map((project, i) => (
                        <div
                            key={project.title}
                            className="project-card flex h-screen w-screen shrink-0 items-center justify-center px-[clamp(0.5rem,1.5vw+1svh,3rem)]"
                        >
                            <ProjectCase
                                project={project}
                                index={i}
                                onOpen={() => setModalIndex(i)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="mx-auto max-w-7xl px-6 py-20 md:py-36">
                <h2 data-reveal className="text-[clamp(2.25rem,7vw,6rem)] font-semibold">
                    Let&apos;s build the next <span className="text-[var(--muted)]">intelligent product.</span>
                </h2>
                <div data-reveal className="mt-14">
                    <TerminalContact onToggleTheme={toggleTheme} />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--line)] p-6 sm:p-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <b className="text-xl">Mohamed Al-Shaer</b>
                        <p className="text-[var(--muted)]">Data Scientist · Machine Learning Engineer</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={PROFILE.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="rounded-full border border-[var(--line)] p-3"
                        >
                            <Github size={16} aria-hidden="true" />
                        </a>
                        <a
                            href={PROFILE.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="rounded-full border border-[var(--line)] p-3"
                        >
                            <Linkedin size={16} aria-hidden="true" />
                        </a>
                        <a href={`mailto:${PROFILE.email}`} aria-label="Email" className="rounded-full border border-[var(--line)] p-3">
                            <Mail size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm text-[var(--muted)]">Alexandria, Egypt</p>
                        <p className="tabular-nums text-sm text-[var(--muted)]">
                            {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                    </div>
                </div>
                <p className="mx-auto mt-8 max-w-7xl tracking-widest text-[var(--muted)]">DATA. MODELS. AUTOMATION.</p>
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