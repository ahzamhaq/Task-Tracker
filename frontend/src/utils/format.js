export const greeting = (date = new Date()) => {
  const h = date.getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
};

export const dueState = (value) => {
  if (!value) return null;
  const due = new Date(value);
  const now = new Date();
  const diff = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Overdue", tone: "danger" };
  if (diff === 0) return { label: "Due today", tone: "warning" };
  if (diff <= 2) return { label: `In ${diff}d`, tone: "warning" };
  return { label: formatDate(value), tone: "muted" };
};

export const relativeTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const diff = (d.getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const fmt = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [unit, secs] of units) {
    if (abs >= secs || unit === "second") {
      return fmt.format(Math.round(diff / secs), unit);
    }
  }
  return "";
};

export const toInputDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
};
