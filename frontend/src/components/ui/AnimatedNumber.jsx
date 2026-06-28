import { useAnimatedNumber } from "../../hooks/useAnimatedNumber.js";

export default function AnimatedNumber({ value, duration = 500, className }) {
  const display = useAnimatedNumber(value, duration);
  return <span className={className}>{display}</span>;
}
