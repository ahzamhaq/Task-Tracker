import { motion } from "framer-motion";

export default function ProgressRing({
  value = 0,
  size = 56,
  stroke = 5,
  label,
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--c-border-strong)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#6366F1"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[13px] font-semibold tabular-nums leading-none">
          {Math.round(clamped)}%
        </div>
        {label && (
          <div className="mt-0.5 text-[9.5px] uppercase tracking-wider text-muted-2">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
