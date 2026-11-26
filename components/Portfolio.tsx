"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import {
  ABOUT,
  CONTACT_SECTION,
  EXPERTISE,
  FOOTER,
  HERO,
  NAVIGATION_ITEMS,
  PROFILE,
  PROJECT_CATEGORIES,
  PROJECTS,
  PROJECTS_SECTION,
  SKILL_GROUPS,
  SKILLS,
  TERMINAL,
  TERMINAL_COMMANDS,
  UI,
  type ProjectCategory,
  type ProjectItem,
} from "@/constants/data";
import { useTheme } from "@/hooks/useTheme";

const AICore = dynamic(() => import("@/three/AICore"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center"
    >
      <div className="h-[64%] w-[64%] rounded-full border border-[var(--signal)]/20 bg-[radial-gradient(circle,var(--signal-wash)_0%,transparent_70%)]" />
    </div>
  ),
});

const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]";

const TECH_COLORS: Record<string, string> = {
  Python: "#F59E0B",
  "Machine Learning": "#38BDF8",
  "Deep Learning": "#A855F7",
  "Scikit-Learn": "#F97316",
  TensorFlow: "#FF6F00",
  Keras: "#EF4444",
  XGBoost: "#22C55E",
  Pandas: "#818CF8",
  NumPy: "#38BDF8",
  SQL: "#06B6D4",
  "Power BI": "#EAB308",
  DAX: "#F59E0B",
  "Power Query": "#10B981",
  "Data Modeling": "#14B8A6",
  Tableau: "#60A5FA",
  Excel: "#22C55E",
  Playwright: "#34D399",
  Selenium: "#4ADE80",
  "Web Scraping": "#A78BFA",
  Automation: "#A78BFA",
  FastAPI: "#14B8A6",
  Flask: "#94A3B8",
  Docker: "#38BDF8",
};

function getTechColor(name: string) {
  return TECH_COLORS[name] ?? "#94A3B8";
}

function TechChip({ name }: { name: string }) {
  const color = getTechColor(name);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--paper)]/70 px-3 py-1 text-xs font-medium text-[var(--ink)]">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Isolated Footer Clock (avoids re-rendering the entire page every second)  */
/* -------------------------------------------------------------------------- */
function LocalClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return <p className="font-mono text-xs tabular-nums text-[var(--muted)]">{time}</p>;
}

/* -------------------------------------------------------------------------- */
/*  Ambient Background (lightweight CSS gradients — zero SVG turbulence)      */
/* -------------------------------------------------------------------------- */
function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--paper)]" />
      <div
        className="animate-orb absolute -top-40 left-1/2 h-[65vh] w-[70vw] -translate-x-1/2 rounded-full opacity-75 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--aurora-1) 0%, transparent 68%)",
        }}
      />
      <div
        className="animate-orb-slow absolute -bottom-40 right-0 h-[55vh] w-[55vw] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--aurora-2) 0%, transparent 68%)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roles Rotator                                                             */
/* -------------------------------------------------------------------------- */
function Roles() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PROFILE.roles.length),
      UI.roleRotateMs,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-9 overflow-hidden sm:h-11">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl font-semibold text-[var(--signal)] sm:text-2xl"
        >
          {PROFILE.roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Visual Stage                                                         */
/* -------------------------------------------------------------------------- */
function HeroVisual() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[380px] sm:h-[460px] sm:max-w-[460px] lg:h-[580px] lg:max-w-[580px]">
      <div className="absolute -inset-6 sm:-inset-10">
        <AICore />
      </div>

      {/* Portrait centerpiece */}
      <div className="absolute left-1/2 top-1/2 z-10 h-[50%] w-[50%] max-h-[268px] max-w-[268px] -translate-x-1/2 -translate-y-1/2">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full opacity-45 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, var(--signal) 0%, var(--signal-2) 60%, transparent 75%)",
          }}
        />
        <div
          className="relative h-full w-full overflow-hidden rounded-full p-[2.5px] shadow-[var(--shadow-heavy)]"
          style={{
            backgroundImage:
              "linear-gradient(var(--paper), var(--paper)), linear-gradient(135deg, var(--signal), var(--signal-2))",
            backgroundOrigin: "border-box",
            backgroundClip: "content-box, border-box",
          }}
        >
          <Image
            src="/images/profile.webp"
            alt={PROFILE.fullName}
            width={536}
            height={656}
            priority
            sizes="(min-width: 1024px) 268px, (min-width: 640px) 230px, 180px"
            className="h-full w-full rounded-full object-cover object-top"
          />
        </div>
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Card (featured full-width or compact 2-col grid)                  */
/* -------------------------------------------------------------------------- */
function ProjectCard({
  project,
  index,
  featured,
  onOpen,
}: {
  project: ProjectItem;
  index: number;
  featured: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--glass-border-strong)] hover:shadow-[var(--shadow-heavy)] ${
        featured ? "lg:col-span-2 lg:grid lg:grid-cols-12" : ""
      }`}
    >
      {/* Preview Frame */}
      <div
        className={`relative overflow-hidden bg-[var(--paper-2)] ${
          featured ? "aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[380px]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 58vw, 100vw"
              : "(min-width: 1024px) 46vw, 100vw"
          }
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            {PROJECTS_SECTION.caseStudyPrefix}
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-1 flex-col justify-between p-6 sm:p-7 ${
          featured ? "lg:col-span-5 lg:p-8" : ""
        }`}
      >
        <div>
          <h3 className="text-balance text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.tech.map((t) => (
              <TechChip key={t} name={t} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
          <div>
            <div
              className="text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl"
              style={{ color: project.color }}
            >
              {project.metric}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-2)]">
              {project.label}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className={`grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--paper)] text-[var(--muted)] transition-colors hover:border-[var(--ink)]/40 hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Github size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onOpen}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 text-xs font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
            >
              <span>Case study</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Case Study Modal                                                          */
/* -------------------------------------------------------------------------- */
function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: ProjectItem;
  index: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-md"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[var(--glass-border-strong)] bg-[var(--card)] text-[var(--ink)] shadow-[var(--shadow-heavy)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-full border border-[var(--glass-border)] bg-[var(--paper)] px-2.5 py-0.5 font-mono text-[11px] font-semibold"
              style={{ color: project.color }}
            >
              {PROJECTS_SECTION.caseStudyPrefix}
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-[var(--muted-2)]">
              {project.category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className={`grid h-8 w-8 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]/40 ${FOCUS_RING}`}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover object-top"
            />
          </div>

          <div>
            <h2
              id="project-modal-title"
              className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              {project.title}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {project.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
              <div
                className="text-2xl font-extrabold tabular-nums"
                style={{ color: project.color }}
              >
                {project.metric}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
                {project.label}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 sm:col-span-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
                Tech stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--muted-2)]">
              <Sparkles size={13} style={{ color: project.color }} aria-hidden="true" />
              Key highlights
            </h3>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3.5 text-xs leading-relaxed text-[var(--ink)]/90"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: project.color }}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
          >
            <Github size={14} aria-hidden="true" />
            <span>View repository</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full border border-[var(--glass-border)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interactive Terminal (full command set, ↑/↓ history, Tab autocomplete)    */
/* -------------------------------------------------------------------------- */
type HistoryEntryType = "prompt" | "output" | "error";

interface HistoryEntry {
  id: number;
  type: HistoryEntryType;
  node: React.ReactNode;
}

function TerminalContact({ onToggleTheme }: { onToggleTheme: () => void }) {
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      type: "output",
      node: (
        <div className="space-y-1">
          <div className="font-semibold text-sky-400">{TERMINAL.welcome[0]}</div>
          <div className="text-slate-400">{TERMINAL.welcome[1]}</div>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);

  const scrollLogToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    });
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const cmd = trimmed.toLowerCase();

      setCmdHistory((prev) => [...prev, trimmed]);
      setCursor(-1);
      setInput("");

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      let type: HistoryEntryType = "output";
      let node: React.ReactNode;

      switch (cmd) {
        case "help":
          node = (
            <div className="space-y-1 text-slate-300">
              {TERMINAL.helpLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          );
          break;
        case "whoami":
          node = (
            <div className="space-y-1">
              <div className="font-semibold text-sky-300">{PROFILE.fullName}</div>
              <div className="text-slate-300">{PROFILE.bio}</div>
              <div className="text-slate-400">{PROFILE.university}</div>
            </div>
          );
          break;
        case "skills":
          node = (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          );
          break;
        case "projects":
          node = (
            <div className="space-y-1.5">
              {PROJECTS.map((p, i) => (
                <div key={p.title}>
                  <span style={{ color: p.color }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>{" "}
                  <span className="font-semibold text-white">{p.title}</span>{" "}
                  <span className="text-slate-400">({p.metric})</span>
                </div>
              ))}
            </div>
          );
          break;
        case "email":
          node = (
            <a href={`mailto:${PROFILE.email}`} className="text-sky-300 underline">
              {PROFILE.email}
            </a>
          );
          break;
        case "github":
          node = (
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline"
            >
              {PROFILE.github}
            </a>
          );
          break;
        case "linkedin":
          node = (
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline"
            >
              {PROFILE.linkedin}
            </a>
          );
          break;
        case "resume":
          node = (
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline"
            >
              Open / Download Résumé (PDF)
            </a>
          );
          break;
        case "theme":
          onToggleTheme();
          node = "Switched color theme.";
          break;
        case "date":
          node = new Date().toLocaleString();
          break;
        default:
          type = "error";
          node = `Command not found: "${trimmed}". Type 'help' to list available commands.`;
      }

      const promptId = nextId.current++;
      const outId = nextId.current++;
      setHistory((prev) => [
        ...prev,
        { id: promptId, type: "prompt", node: `$ ${trimmed}` },
        { id: outId, type, node },
      ]);
      scrollLogToBottom();
    },
    [onToggleTheme, scrollLogToBottom],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextCursor = cursor === -1 ? cmdHistory.length - 1 : Math.max(0, cursor - 1);
      setCursor(nextCursor);
      setInput(cmdHistory[nextCursor]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === -1) return;
      if (cursor >= cmdHistory.length - 1) {
        setCursor(-1);
        setInput("");
      } else {
        const nextCursor = cursor + 1;
        setCursor(nextCursor);
        setInput(cmdHistory[nextCursor]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const q = input.trim().toLowerCase();
      if (!q) return;
      const match = TERMINAL_COMMANDS.find((c) => c.startsWith(q));
      if (match) setInput(match);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--glass-border-strong)] bg-[#080B12] text-white shadow-[var(--shadow-heavy)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Terminal size={14} className="text-sky-400" aria-hidden="true" />
          <span>{TERMINAL.promptLabel}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      {/* Quick command chips */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/10 bg-white/[0.02] px-5 py-2.5">
        {(["whoami", "projects", "skills", "date", "theme", "clear"] as const).map(
          (cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                runCommand(cmd);
                inputRef.current?.focus();
              }}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              {cmd}
            </button>
          ),
        )}
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        onClick={() => inputRef.current?.focus()}
        className="custom-scrollbar min-h-[250px] max-h-[340px] flex-1 space-y-2 overflow-y-auto p-5 font-mono text-xs leading-relaxed sm:text-sm"
      >
        {history.map((entry) => (
          <div
            key={entry.id}
            className={
              entry.type === "prompt"
                ? "font-semibold text-sky-300"
                : entry.type === "error"
                  ? "text-rose-400"
                  : "text-slate-200"
            }
          >
            {entry.node}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCommand(input);
        }}
        className="flex items-center gap-2.5 border-t border-white/10 bg-white/[0.02] px-5 py-3.5 focus-within:bg-white/[0.04]"
      >
        <span className="font-mono text-sky-400" aria-hidden="true">
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
          placeholder={TERMINAL.placeholder}
          className="flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-500 sm:text-sm"
        />
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Portfolio                                                            */
/* -------------------------------------------------------------------------- */
export default function Portfolio() {
  const [light, toggleTheme] = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProjectCategory>("All");
  const [modalProjectIndex, setModalProjectIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > UI.scrollCompactThreshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAVIGATION_ITEMS.map((item) =>
      document.getElementById(item.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(
    () =>
      PROJECTS.map((project, originalIndex) => ({ project, originalIndex })).filter(
        ({ project }) =>
          selectedCategory === "All" || project.category === selectedCategory,
      ),
    [selectedCategory],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  }, []);

  const activeProject = modalProjectIndex !== null ? PROJECTS[modalProjectIndex] : null;

  return (
    <div className="relative min-h-screen overflow-x-clip text-[var(--ink)]">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[var(--paper)]"
      >
        Skip to content
      </a>

      <Background />

      {/* Scroll Progress */}
      <motion.div
        style={{ scaleX }}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[110] h-[2px] w-full origin-left bg-gradient-to-r from-[var(--signal)] to-[var(--signal-2)]"
      />

      {/* Floating Header */}
      <header className="fixed left-1/2 top-4 z-50 w-[min(1080px,calc(100%-24px))] -translate-x-1/2">
        <nav
          aria-label="Primary"
          className="relative rounded-full border border-[var(--glass-border-strong)] bg-[var(--glass)] backdrop-blur-2xl shadow-[var(--shadow-heavy)]"
        >
          <div
            className={`flex items-center justify-between px-4 transition-[height] duration-300 sm:px-5 ${
              compact ? "h-12 sm:h-14" : "h-14 sm:h-16"
            }`}
          >
            <a
              href="#home"
              className={`flex items-center gap-2.5 rounded-full ${FOCUS_RING}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--signal-wash)] font-mono text-xs font-bold text-[var(--signal)]">
                {PROFILE.initials}
              </span>
              <span className="hidden text-sm font-bold tracking-tight text-[var(--ink)] min-[420px]:inline">
                {PROFILE.fullName}
              </span>
            </a>

            <div className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper)]/50 p-1 md:flex">
              {NAVIGATION_ITEMS.map((item) => {
                const id = item.href.slice(1);
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                      isActive
                        ? "text-[var(--ink)]"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full border border-[var(--signal)]/35 bg-[var(--signal-wash)]"
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={PROFILE.resume}
                download
                className={`hidden items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--paper)]/70 px-3.5 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--signal)]/50 sm:inline-flex ${FOCUS_RING}`}
              >
                <Download size={13} aria-hidden="true" />
                <span>Résumé</span>
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
                className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--paper)]/70 text-[var(--muted)] transition-colors hover:border-[var(--signal)]/50 hover:text-[var(--ink)] ${FOCUS_RING}`}
              >
                {light ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileNavOpen}
                className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--paper)]/70 text-[var(--muted)] transition-colors hover:text-[var(--ink)] md:hidden ${FOCUS_RING}`}
              >
                {mobileNavOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-[var(--glass-border-strong)] bg-[var(--card)] p-2 shadow-[var(--shadow-heavy)] md:hidden"
              >
                {NAVIGATION_ITEMS.map((item) => {
                  const id = item.href.slice(1);
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={id}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${FOCUS_RING} ${
                        isActive
                          ? "bg-[var(--signal-wash)] text-[var(--ink)]"
                          : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-[var(--signal)]" />
                      )}
                    </a>
                  );
                })}
                <a
                  href={PROFILE.resume}
                  download
                  onClick={() => setMobileNavOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)]"
                >
                  <Download size={15} aria-hidden="true" />
                  <span>{HERO.resumeButtonLabel}</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:px-10"
        >
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-[clamp(3rem,7.5vw,5.75rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-[var(--ink)]">
                {HERO.headingLine1}
                <br />
                <span className="font-light text-[var(--muted)]">{HERO.headingLine2}</span>
              </h1>

              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--muted-2)]">
                  {HERO.subHeading}
                </p>
                <div className="mt-1.5">
                  <Roles />
                </div>
              </div>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                {PROFILE.bio}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className={`inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-semibold text-[var(--paper)] shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
                >
                  <span>{HERO.primaryButtonText}</span>
                  <ArrowDown size={15} aria-hidden="true" />
                </a>
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-strong)] bg-[var(--glass)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] backdrop-blur-xl transition-colors hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
                >
                  {HERO.secondaryButtonText}
                </a>
                <a
                  href={PROFILE.resume}
                  download
                  aria-label={HERO.resumeButtonLabel}
                  className={`grid h-12 w-12 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--ink)] transition-colors hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
                >
                  <Download size={17} aria-hidden="true" />
                </a>
              </div>

              {/* Compact proof strip */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-[var(--line)] pt-7">
                {HERO.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-xl font-extrabold tracking-tight text-[var(--ink)] tabular-nums sm:text-2xl">
                      {m.value}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted-2)]">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* About — Bento Grid */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 lg:px-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--signal)]">
            About
          </p>
          <h2
            id="about-heading"
            className="mt-3 max-w-4xl text-balance text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--ink)]"
          >
            {ABOUT.headingStart}{" "}
            <span className="font-light text-[var(--muted)]">{ABOUT.headingEnd}</span>
          </h2>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-7 shadow-[var(--shadow)] sm:p-9 lg:col-span-5">
              <p className="text-lg font-medium leading-relaxed text-[var(--ink)] sm:text-xl">
                {ABOUT.description}
              </p>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                <GraduationCap
                  size={20}
                  className="mt-0.5 shrink-0 text-[var(--signal)]"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {PROFILE.degree}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">
                    {PROFILE.university}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {ABOUT.sections.map((section) => (
                <div
                  key={section.title}
                  className="group rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--signal)]/40"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--ink)]">
                      {section.title}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="text-[var(--muted-2)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--signal)]"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {section.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs text-[var(--muted)]"
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

        {/* Expertise — Categorized Stack */}
        <section
          id="expertise"
          aria-labelledby="expertise-heading"
          className="border-y border-[var(--line)] bg-[var(--paper-2)]/50 px-5 py-20 sm:px-8 md:py-28 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--signal)]">
                  Technical Stack
                </p>
                <h2
                  id="expertise-heading"
                  className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--ink)]"
                >
                  {EXPERTISE.headingStart}{" "}
                  <span className="font-light text-[var(--muted)]">
                    {EXPERTISE.headingEnd}
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
                {EXPERTISE.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.name}
                  className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]"
                >
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
                    {group.name}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <TechChip key={skill} name={skill} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 lg:px-10"
        >
          <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--signal)]">
                <Layers size={14} aria-hidden="true" />
                <span>Crafted Showcase</span>
              </div>
              <h2
                id="projects-heading"
                className="mt-3 text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--ink)]"
              >
                {PROJECTS_SECTION.headingStart}{" "}
                <span className="font-light text-[var(--muted)]">
                  {PROJECTS_SECTION.headingEnd}
                </span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--muted)] md:text-right">
              {PROJECTS_SECTION.subtitle}
            </p>
          </div>

          {/* Category Filters */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mt-8 flex flex-wrap gap-2"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                    active
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "border border-[var(--glass-border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Featured + 2-col Editorial Grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {filteredProjects.map(({ project, originalIndex }, idx) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={originalIndex}
                featured={idx === 0 && filteredProjects.length > 1}
                onOpen={() => setModalProjectIndex(originalIndex)}
              />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28 lg:px-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--signal)]">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-3 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.04em] text-[var(--ink)]"
          >
            {CONTACT_SECTION.headingStart}{" "}
            <span className="font-light text-[var(--muted)]">
              {CONTACT_SECTION.headingEnd}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {CONTACT_SECTION.subtitle}
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            {/* Direct Contact Bento */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-2)]">
                  Direct Email
                </span>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="mt-2 block break-all text-lg font-bold text-[var(--ink)] transition-colors hover:text-[var(--signal)]"
                >
                  {PROFILE.email}
                </a>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={13} aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} aria-hidden="true" />
                        <span>Copy email</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
                  >
                    <Mail size={13} aria-hidden="true" />
                    <span>Open mail app</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col justify-between rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
                >
                  <Linkedin size={20} className="text-[var(--signal)]" aria-hidden="true" />
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--ink)]">LinkedIn</span>
                    <ArrowUpRight
                      size={15}
                      className="text-[var(--muted-2)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </a>

                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col justify-between rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
                >
                  <Github size={20} className="text-[var(--signal)]" aria-hidden="true" />
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--ink)]">GitHub</span>
                    <ArrowUpRight
                      size={15}
                      className="text-[var(--muted-2)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </div>

              <a
                href={PROFILE.resume}
                download
                className={`group flex items-center justify-between rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--signal)]/50 ${FOCUS_RING}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--signal-wash)] text-[var(--signal)]">
                    <Download size={17} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[var(--ink)]">
                      {HERO.resumeButtonLabel}
                    </div>
                    <div className="text-xs text-[var(--muted)]">PDF · 1 page</div>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--muted-2)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Interactive Terminal */}
            <div className="lg:col-span-7">
              <TerminalContact onToggleTheme={toggleTheme} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] bg-[var(--paper-2)] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-bold text-[var(--ink)]">{FOOTER.name}</div>
            <p className="text-xs text-[var(--muted)]">{FOOTER.role}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Github size={16} aria-hidden="true" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              aria-label="Email"
              className={`grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
            >
              <Mail size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="md:text-right">
            <p className="text-xs text-[var(--muted)]">{FOOTER.location}</p>
            <LocalClock />
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-7xl font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted-2)]">
          {FOOTER.tagline}
        </p>
      </footer>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && modalProjectIndex !== null && (
          <ProjectModal
            project={activeProject}
            index={modalProjectIndex}
            onClose={() => setModalProjectIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
