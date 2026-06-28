import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber.jsx";

const toneStyles = {
  brand: "text-brand bg-brand/10",
  warning: "text-warning bg-warning/10",
  purple: "text-purple-500 bg-purple-500/10 dark:text-purple-300",
  success: "text-success bg-success/10",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone = "brand",
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11.5px] font-medium text-muted-2">{label}</span>
      </div>
      <div className="mt-3.5 text-[26px] font-semibold leading-none tracking-tight tabular-nums">
        <AnimatedNumber value={value} />
      </div>
      {subtitle && (
        <div className="mt-1.5 text-[12px] text-muted">{subtitle}</div>
      )}
    </motion.div>
  );
}
