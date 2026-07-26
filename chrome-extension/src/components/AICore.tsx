import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Zap, Cpu } from "lucide-react";

export type AICoreState =
  | "idle"
  | "scanning"
  | "thinking"
  | "generating"
  | "success"
  | "error";

export interface AICoreProps {
  state: AICoreState;
  size?: number;
  progress?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// Cinematic scan pipeline with block-by-block fill animation
// ─────────────────────────────────────────────────────────────
const SCAN_PIPELINE = [
  {
    phase: "DOM",
    label: "Mapping DOM tree",
    totalBlocks: 12,
    color: "#06b6d4",
    icon: "◈",
  },
  {
    phase: "SEMANTIC",
    label: "Extracting semantics",
    totalBlocks: 12,
    color: "#3b82f6",
    icon: "◉",
  },
  {
    phase: "INTENT",
    label: "Detecting page intent",
    totalBlocks: 12,
    color: "#8b5cf6",
    icon: "◎",
  },
  {
    phase: "CONTEXT",
    label: "Building AI context",
    totalBlocks: 12,
    color: "#10b981",
    icon: "◈",
  },
];

const GENERATE_PIPELINE = [
  {
    phase: "PROMPT",
    label: "Injecting context",
    totalBlocks: 10,
    color: "#38bdf8",
    icon: "▸",
  },
  {
    phase: "REASON",
    label: "Reasoning chain",
    totalBlocks: 10,
    color: "#a78bfa",
    icon: "▸",
  },
  {
    phase: "OUTPUT",
    label: "Generating output",
    totalBlocks: 10,
    color: "#34d399",
    icon: "▸",
  },
];

// Fake matrix hex digits for HUD realism
const HEX_CHARS = "0123456789ABCDEF";
function randHex(n: number) {
  return Array.from(
    { length: n },
    () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
  ).join("");
}

/** Renders a single animated progress row */
const BlockProgressRow: React.FC<{
  phase: string;
  label: string;
  filledBlocks: number;
  totalBlocks: number;
  color: string;
  icon: string;
  isActive: boolean;
  isDone: boolean;
}> = ({ phase, label, filledBlocks, totalBlocks, color, icon, isActive, isDone }) => {
  const pct = Math.round((filledBlocks / totalBlocks) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isDone || isActive ? 1 : 0.35, x: 0 }}
      className="flex flex-col gap-0.5 w-full"
    >
      {/* Row header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: isDone ? color : isActive ? color : "#52525b" }}
          >
            {icon}
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-wider font-semibold"
            style={{ color: isDone ? color : isActive ? color : "#52525b" }}
          >
            {phase}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-mono tracking-wide"
            style={{ color: isDone ? color : isActive ? "#a1a1aa" : "#3f3f46" }}
          >
            {isDone ? label : isActive ? label : "waiting..."}
          </span>
          <span
            className="text-[9px] font-mono font-bold"
            style={{ color: isDone ? color : isActive ? color : "#3f3f46" }}
          >
            {isDone ? "100" : isActive ? pct : "00"}%
          </span>
        </div>
      </div>

      {/* Block bar */}
      <div className="flex gap-[2px]">
        {Array.from({ length: totalBlocks }).map((_, i) => {
          const filled = i < filledBlocks;
          const isEdge = i === filledBlocks - 1 && isActive && !isDone;
          return (
            <motion.div
              key={i}
              className="h-[5px] flex-1 rounded-[1px]"
              style={{
                backgroundColor: filled
                  ? isDone
                    ? color
                    : color
                  : "#18181b",
                border: `1px solid ${filled ? color + "80" : "#27272a"}`,
                boxShadow: isEdge ? `0 0 6px ${color}` : "none",
                opacity: filled ? (isDone ? 0.9 : 1) : 0.4,
              }}
              animate={
                isEdge
                  ? {
                      opacity: [1, 0.5, 1],
                      boxShadow: [`0 0 6px ${color}`, `0 0 12px ${color}`, `0 0 6px ${color}`],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: isEdge ? Infinity : 0 }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

/** Matrix hex ticker that streams fake hex bytes */
const HexTicker: React.FC<{ color: string; active: boolean }> = ({ color, active }) => {
  const [hex, setHex] = useState(randHex(24));
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setHex(randHex(24)), 80);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div
      className="text-[9px] font-mono tracking-widest truncate opacity-50 select-none"
      style={{ color }}
    >
      {active ? hex : "── ──── ──── ──── ──── ──"}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
//  Main AICore Component
// ─────────────────────────────────────────────────────────────
export const AICore: React.FC<AICoreProps> = ({
  state = "idle",
  size = 80,
  progress = 0,
  label,
  sublabel,
  className = "",
}) => {
  // ── Scanning block animation state ──
  const [blockProgress, setBlockProgress] = useState<number[]>([0, 0, 0, 0]);
  const [activeRow, setActiveRow] = useState(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Generating block animation state ──
  const [genProgress, setGenProgress] = useState<number[]>([0, 0, 0]);
  const [genRow, setGenRow] = useState(0);

  // ── Holographic orb color ──
  const theme = (() => {
    switch (state) {
      case "scanning":
        return { primary: "#06b6d4", secondary: "#3b82f6", glow: "rgba(6,182,212,0.5)" };
      case "thinking":
        return { primary: "#8b5cf6", secondary: "#ec4899", glow: "rgba(139,92,246,0.5)" };
      case "generating":
        return { primary: "#38bdf8", secondary: "#10b981", glow: "rgba(56,189,248,0.55)" };
      case "success":
        return { primary: "#10b981", secondary: "#06b6d4", glow: "rgba(16,185,129,0.55)" };
      case "error":
        return { primary: "#ef4444", secondary: "#f97316", glow: "rgba(239,68,68,0.5)" };
      default:
        return { primary: "#38bdf8", secondary: "#8b5cf6", glow: "rgba(56,189,248,0.25)" };
    }
  })();

  // ── Block fill animation for scanning ──
  useEffect(() => {
    if (state !== "scanning") {
      setBlockProgress([0, 0, 0, 0]);
      setActiveRow(0);
      return;
    }
    setBlockProgress([0, 0, 0, 0]);
    setActiveRow(0);
    let row = 0;
    let block = 0;
    const total = SCAN_PIPELINE[0].totalBlocks;

    frameRef.current = setInterval(() => {
      block++;
      if (block <= total) {
        setBlockProgress((prev) => {
          const next = [...prev];
          next[row] = block;
          return next;
        });
      } else {
        // Move to next row
        row++;
        block = 0;
        setActiveRow(row);
        if (row >= SCAN_PIPELINE.length) {
          clearInterval(frameRef.current!);
          setActiveRow(-1);
        }
      }
    }, 110); // 110ms per block = cinematic speed

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [state]);

  // ── Block fill animation for generating ──
  useEffect(() => {
    if (state !== "generating") {
      setGenProgress([0, 0, 0]);
      setGenRow(0);
      return;
    }
    setGenProgress([0, 0, 0]);
    setGenRow(0);
    let row = 0;
    let block = 0;
    const total = GENERATE_PIPELINE[0].totalBlocks;

    const id = setInterval(() => {
      block++;
      if (block <= total) {
        setGenProgress((prev) => {
          const next = [...prev];
          next[row] = block;
          return next;
        });
      } else {
        row = (row + 1) % GENERATE_PIPELINE.length; // loop
        block = 0;
        setGenRow(row);
        setGenProgress((prev) => {
          const next = [...prev];
          next[row] = 0;
          return next;
        });
      }
    }, 140);

    return () => clearInterval(id);
  }, [state]);

  const pipeline = state === "scanning" ? SCAN_PIPELINE : GENERATE_PIPELINE;
  const bProgress = state === "scanning" ? blockProgress : genProgress;
  const aRow = state === "scanning" ? activeRow : genRow;
  const showBlockPipeline = state === "scanning" || state === "generating";

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* ── 1. Holographic Orb ── */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Ambient glow */}
        <motion.div
          className="absolute rounded-full blur-2xl pointer-events-none"
          style={{ width: size * 1.4, height: size * 1.4, backgroundColor: theme.primary }}
          animate={{
            scale: state === "generating" ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: state === "idle" ? 0.18 : state === "success" ? [0.4, 0.7, 0.3] : 0.4,
          }}
          transition={{ duration: state === "scanning" ? 1.0 : 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Outer orbital ring (CW) */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: `${theme.primary}55` }}
          animate={{ rotate: 360 }}
          transition={{ duration: state === "scanning" || state === "generating" ? 3.5 : 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Diagonal cross-ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dotted"
          style={{ borderColor: `${theme.secondary}40`, transform: "rotateX(55deg)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: state === "scanning" ? 5 : 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full border"
          style={{
            width: size * 0.72,
            height: size * 0.72,
            borderColor: `${theme.secondary}70`,
            borderStyle: "dashed",
          }}
          animate={{
            rotate: -360,
            scale: state === "thinking" ? [1, 1.06, 1] : state === "scanning" ? [0.96, 1.04, 0.96] : 1,
          }}
          transition={{
            rotate: { duration: state === "scanning" ? 2.5 : 9, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* JARVIS Energy Nucleus */}
        <motion.div
          className="relative rounded-full flex items-center justify-center border border-white/25 backdrop-blur-md"
          style={{
            width: size * 0.44,
            height: size * 0.44,
            background: `radial-gradient(circle at 35% 35%, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            boxShadow: `0 0 24px ${theme.glow}, inset 0 0 12px rgba(255,255,255,0.1)`,
          }}
          animate={{ scale: state === "generating" || state === "success" ? [1, 1.18, 1] : [1, 1.06, 1] }}
          transition={{ duration: state === "generating" ? 0.7 : 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div key="success" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                <Check className="text-white stroke-[2.5]" style={{ width: size * 0.2, height: size * 0.2 }} />
              </motion.div>
            ) : state === "error" ? (
              <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <AlertTriangle className="text-white" style={{ width: size * 0.2, height: size * 0.2 }} />
              </motion.div>
            ) : state === "scanning" ? (
              <motion.div
                key="scanning"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="text-white fill-current" style={{ width: size * 0.2, height: size * 0.2 }} />
              </motion.div>
            ) : state === "generating" ? (
              <motion.div
                key="generating"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Cpu className="text-white" style={{ width: size * 0.2, height: size * 0.2 }} />
              </motion.div>
            ) : (
              <motion.div
                key="default"
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                {/* Custom promptless logo mark */}
                <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── 2. Block-by-Block Pipeline HUD ── */}
      <AnimatePresence mode="wait">
        {showBlockPipeline ? (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="mt-4 w-full px-2 space-y-2"
          >
            {/* HUD header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">
                {state === "scanning" ? "// context_scan.exe" : "// generate.exe"}
              </span>
              <HexTicker color={theme.primary} active={true} />
            </div>

            {/* Pipeline rows */}
            {pipeline.map((row, i) => {
              const done =
                state === "scanning"
                  ? i < activeRow || (activeRow === -1)
                  : i !== genRow && genProgress[i] === 0 && i < genRow;
              const active = i === aRow;
              return (
                <BlockProgressRow
                  key={row.phase}
                  phase={row.phase}
                  label={row.label}
                  filledBlocks={i === aRow ? bProgress[i] ?? 0 : done ? row.totalBlocks : 0}
                  totalBlocks={row.totalBlocks}
                  color={row.color}
                  icon={row.icon}
                  isActive={active && (state === "scanning" ? activeRow !== -1 : true)}
                  isDone={done}
                />
              );
            })}

            {/* Status line */}
            <div className="flex items-center gap-2 pt-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.primary }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                {state === "scanning"
                  ? activeRow === -1
                    ? "CONTEXT READY — LOADING ACTIONS..."
                    : pipeline[Math.min(activeRow, pipeline.length - 1)]?.label.toUpperCase() + "..."
                  : pipeline[Math.min(genRow, pipeline.length - 1)]?.label.toUpperCase() + "..."}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center space-y-1 px-4"
          >
            {label && (
              <div className="text-xs font-bold text-white tracking-wide">{label}</div>
            )}
            {sublabel && (
              <div className="text-[11px] text-zinc-400">{sublabel}</div>
            )}
            {state === "idle" && (
              <div className="flex items-center justify-center gap-1 mt-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
