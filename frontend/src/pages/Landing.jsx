import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiChevronDown,
  FiCommand,
  FiGithub,
  FiMail,
  FiMoon,
  FiSearch,
  FiSun,
  FiTwitter,
} from "react-icons/fi";
import Logo from "../components/layout/Logo.jsx";
import Button from "../components/ui/Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="min-h-screen bg-app text-[color:var(--c-ink)]">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <FeaturePlan />
        <FeatureFocus />
        <FeatureMemory />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Primitives                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
      <span className="inline-block h-px w-6 bg-[color:var(--c-border-strong)]" />
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, y = 8, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Navigation                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "#plan", label: "Plan" },
  { href: "#focus", label: "Focus" },
  { href: "#testimonials", label: "Customers" },
  { href: "#faq", label: "FAQ" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.6, 1] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled
          ? "border-b border-app bg-app/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center">
        <Link to="/" aria-label="TaskFlow home">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-10 hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                  isActive
                    ? "text-[color:var(--c-ink)]"
                    : "text-muted hover:text-[color:var(--c-ink)]"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-[color:var(--c-ink)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
          >
            {theme === "dark" ? (
              <FiSun className="h-4 w-4" />
            ) : (
              <FiMoon className="h-4 w-4" />
            )}
          </button>
          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" rightIcon={<FiArrowRight className="h-3.5 w-3.5" />}>
              Get started
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Hero                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-b border-app">
      <Container className="pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:pr-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-app bg-[color:var(--c-surface)] py-1 pl-1 pr-3 text-[12px] text-muted"
            >
              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-brand">
                New
              </span>
              Activity timeline & notes on every task
            </motion.div>

            <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[60px]">
              The task manager
              <br />
              that gets out of
              <br />
              your way.
            </h1>

            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted">
              TaskFlow is built for people who'd rather ship than fiddle with
              their tools. Capture work in a keystroke, focus on what's next,
              and review what you actually got done.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button
                  size="lg"
                  rightIcon={<FiArrowRight className="h-4 w-4" />}
                >
                  Start for free
                </Button>
              </Link>
              <a
                href="#plan"
                className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-[13.5px] font-medium text-muted transition hover:text-[color:var(--c-ink)]"
              >
                See how it works
                <FiArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-muted-2">
              <FiCommand className="h-3 w-3" />
              Open the command bar with
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
              from anywhere in the app
            </p>
          </div>

          <div className="lg:col-span-5">
            <HeroPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroPreview() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="relative"
    >
      {/* receding stacked card behind */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-3 top-3 rounded-card border border-app bg-[color:var(--c-surface)] opacity-60"
      />
      <div className="relative overflow-hidden rounded-card border border-app-strong bg-[color:var(--c-surface-solid)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
        {/* command bar mock */}
        <div className="flex items-center gap-2 border-b border-app px-3 py-2.5">
          <FiSearch className="h-3.5 w-3.5 text-muted" />
          <span className="text-[12px] text-muted-2">Type a command or search…</span>
          <span className="ml-auto inline-flex items-center gap-1">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </span>
        </div>
        <ul className="divide-y divide-[color:var(--c-border)] py-1 text-[12.5px]">
          {[
            { i: "New task", k: ["N"], active: true },
            { i: "Today's focus", k: ["T"] },
            { i: "Open archive", k: ["⌘", "A"] },
            { i: "Toggle theme", k: ["⌘", "J"] },
          ].map((row) => (
            <li
              key={row.i}
              className={`flex items-center justify-between px-3 py-2 ${
                row.active ? "bg-brand/[0.06] text-[color:var(--c-ink)]" : "text-muted"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                {row.i}
              </span>
              <span className="inline-flex items-center gap-1">
                {row.k.map((s, i) => (
                  <span key={i} className="kbd">
                    {s}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Marquee — wordmark style "used at" line, no fake logos                     */
/* ────────────────────────────────────────────────────────────────────────── */

function Marquee() {
  const WORDS = [
    "northwind",
    "fieldnotes",
    "atlas",
    "blackbird",
    "openline",
    "monolith",
    "halftone",
    "switchboard",
  ];
  return (
    <div className="border-b border-app">
      <Container className="flex flex-col items-center gap-5 py-10 sm:flex-row sm:justify-between sm:gap-10">
        <p className="text-[12px] text-muted-2">
          Used daily by makers, students, and small teams
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:justify-end">
          {WORDS.map((w) => (
            <li
              key={w}
              className="font-mono text-[13px] tracking-tight text-muted-2"
            >
              {w}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Feature 1 — Plan (text left, mockup right)                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function FeatureBlock({ eyebrow, title, body, bullets, mockup, reverse }) {
  return (
    <Section id={eyebrow.toLowerCase()}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal
          className={`min-w-0 lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight sm:text-[38px]">
            {title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{body}</p>
          {bullets && (
            <ul className="mt-6 space-y-3 text-[13.5px]">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-muted">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        <Reveal delay={0.05} className="min-w-0 lg:col-span-7">
          {mockup}
        </Reveal>
      </div>
    </Section>
  );
}

function FeaturePlan() {
  return (
    <FeatureBlock
      eyebrow="Plan"
      title="A list that respects your attention."
      body="Tasks live in a single, scannable view. Priority shows as a thin color bar — not a sticker. Status changes inline. Everything is one keystroke from the next."
      bullets={[
        "Inline status with no extra clicks",
        "Stacked filters: status, priority, date",
        "Sort by what matters today, not yesterday",
      ]}
      mockup={<PlanMockup />}
    />
  );
}

function PlanMockup() {
  const rows = [
    { t: "Draft Q3 launch plan", p: "High", s: "In Progress", sTone: "purple", pTone: "danger" },
    { t: "Review onboarding copy", p: "Med", s: "Pending", sTone: "muted", pTone: "warning" },
    { t: "Ship release notes", p: "Med", s: "Pending", sTone: "muted", pTone: "warning" },
    { t: "Sync with design team", p: "Low", s: "Done", sTone: "success", pTone: "blue" },
    { t: "Reply to investor email", p: "High", s: "Pending", sTone: "muted", pTone: "danger" },
  ];
  return (
    <Frame label="taskflow.app/dashboard">
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2 text-[11.5px] text-muted-2">
          <span className="rounded-md bg-[color:var(--c-border)] px-2 py-0.5 text-muted">All</span>
          <span className="rounded-md px-2 py-0.5">Pending</span>
          <span className="rounded-md px-2 py-0.5">Done</span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <FiSearch className="h-3 w-3" /> Filter
          </span>
        </div>
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li
              key={r.t}
              className="group relative flex items-center gap-3 overflow-hidden rounded-md border border-app bg-[color:var(--c-surface)] px-3 py-2"
            >
              <span
                className="absolute inset-y-0 left-0 w-[2.5px]"
                style={{ background: borderForPriority(r.p) }}
              />
              <span className="ml-1 h-3.5 w-3.5 rounded-full border border-app-strong" />
              <span className="flex-1 truncate text-[12.5px] font-medium">{r.t}</span>
              <Pill tone={r.pTone}>{r.p}</Pill>
              <Pill tone={r.sTone}>{r.s}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Feature 2 — Focus (mockup left, text right)                                */
/* ────────────────────────────────────────────────────────────────────────── */

function FeatureFocus() {
  return (
    <FeatureBlock
      eyebrow="Focus"
      title="See today, decide what's next."
      body="A small widget tells you the truth about your day — how much you finished, what's overdue, what's high-priority and still untouched. No vanity metrics."
      reverse
      bullets={[
        "Real completion rate, not a guess",
        "Today and overdue, surfaced first",
        "Notifications for what actually changed",
      ]}
      mockup={<FocusMockup />}
    />
  );
}

function FocusMockup() {
  return (
    <Frame label="insights">
      <div className="grid grid-cols-5 gap-4 p-5">
        <div className="col-span-3 rounded-md border border-app bg-[color:var(--c-surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted-2">
              Completion
            </span>
            <span className="text-[11px] tabular-nums text-muted">68%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--c-border)]">
            <div className="h-full w-[68%] rounded-full bg-brand" />
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-[11.5px]">
            <Metric label="This week" value="11" />
            <Metric label="Due today" value="2" accent="warning" />
            <Metric label="Overdue" value="1" accent="danger" />
          </dl>
        </div>
        <div className="col-span-2 rounded-md border border-app bg-[color:var(--c-surface)] p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-2">
            Today
          </div>
          <ul className="mt-3 space-y-2 text-[12px]">
            {[
              { t: "Send weekly update", done: true },
              { t: "Final review on copy", done: false },
              { t: "Plan Friday demo", done: false },
            ].map((i) => (
              <li key={i.t} className="flex items-center gap-2">
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    i.done
                      ? "border-success bg-success text-white"
                      : "border-app-strong"
                  }`}
                >
                  {i.done && <FiCheck className="h-2 w-2" />}
                </span>
                <span className={i.done ? "text-muted-2 line-through" : ""}>
                  {i.t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

function Metric({ label, value, accent }) {
  const tone =
    accent === "warning"
      ? "text-warning"
      : accent === "danger"
      ? "text-danger"
      : "";
  return (
    <div>
      <dd className={`text-[18px] font-semibold tabular-nums ${tone}`}>{value}</dd>
      <dt className="mt-0.5 text-muted">{label}</dt>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Feature 3 — Memory (text left, mockup right) — activity & notes            */
/* ────────────────────────────────────────────────────────────────────────── */

function FeatureMemory() {
  return (
    <FeatureBlock
      eyebrow="Memory"
      title="Every task remembers what happened to it."
      body="Open any task to see the full timeline — who changed what, when. Pin notes for context that won't fit in the title. Nothing falls through the cracks."
      bullets={[
        "Diff-based activity, not a noisy audit log",
        "Markdown-friendly notes per task",
        "Relative timestamps you can actually read",
      ]}
      mockup={<MemoryMockup />}
    />
  );
}

function MemoryMockup() {
  return (
    <Frame label="task › details">
      <div className="grid gap-0 sm:grid-cols-[1.1fr_1fr]">
        <div className="border-b border-app p-5 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-1.5">
            <Pill tone="success" dot>
              In Progress
            </Pill>
            <Pill tone="danger">High</Pill>
          </div>
          <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
            Draft Q3 launch plan
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Outline the rollout sequence, owners, and the metrics we'll watch.
            Share the doc by Friday.
          </p>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-2">
            Notes
          </div>
          <div className="mt-1.5 rounded-md border border-app bg-[color:var(--c-surface)] p-2.5 text-[12px] leading-relaxed text-muted">
            Loop in Priya for marketing review. Reuse the Q1 launch checklist
            as a base.
          </div>
        </div>
        <div className="p-5">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-2">
            Activity
          </div>
          <ol className="relative space-y-3 border-l border-app pl-4 text-[12px]">
            <Activity tone="brand" label="Priority changed">
              Medium → High · 2h ago
            </Activity>
            <Activity tone="muted" label="Notes updated">
              4h ago
            </Activity>
            <Activity tone="purple" label="Status changed">
              Pending → In Progress · yesterday
            </Activity>
            <Activity tone="brand" label="Created">
              2 days ago
            </Activity>
          </ol>
        </div>
      </div>
    </Frame>
  );
}

function Activity({ tone, label, children }) {
  const dotColor =
    tone === "purple"
      ? "bg-purple-500"
      : tone === "muted"
      ? "bg-[color:var(--c-border-strong)]"
      : "bg-brand";
  return (
    <li className="relative">
      <span
        className={`absolute -left-[21px] top-1 inline-block h-2 w-2 rounded-full ${dotColor}`}
      />
      <div className="font-medium">{label}</div>
      <div className="text-[11.5px] text-muted-2">{children}</div>
    </li>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Social Proof — stats + testimonials                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function Stats() {
  const items = [
    { v: "2 min", l: "Median setup time" },
    { v: "<60ms", l: "Optimistic UI response" },
    { v: "100%", l: "Local-first preferences" },
    { v: "11", l: "Keyboard shortcuts" },
  ];
  return (
    <section className="border-y border-app bg-[color:var(--c-surface)]/40">
      <Container className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-app bg-[color:var(--c-border)] sm:grid-cols-4">
        {items.map((s) => (
          <div
            key={s.l}
            className="bg-app p-6 text-center sm:p-8"
          >
            <div className="text-[26px] font-semibold tracking-tight tabular-nums">
              {s.v}
            </div>
            <div className="mt-1 text-[12px] text-muted-2">{s.l}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "I tried four task apps last quarter. TaskFlow is the first one that didn't make me feel guilty for opening it.",
      name: "Priya Shah",
      role: "Founding engineer, Northwind",
    },
    {
      quote:
        "The activity timeline is the feature I didn't know I wanted. I finally trust the app to remember what I changed.",
      name: "Marcus Reilly",
      role: "PM, Fieldnotes",
    },
    {
      quote:
        "Keyboard-first, no clutter, no upsell. It feels like it was built by someone who actually does the work.",
      name: "Lia Almeida",
      role: "Designer, Atlas Studio",
    },
  ];
  return (
    <Section id="testimonials">
      <div className="max-w-2xl">
        <Eyebrow>Customers</Eyebrow>
        <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight sm:text-[38px]">
          Quiet praise from people who ship.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.04}>
            <figure className="flex h-full flex-col rounded-card border border-app bg-[color:var(--c-surface)] p-6">
              <blockquote className="text-[14px] leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-app pt-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-[11px] font-semibold text-white">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <div className="text-[12.5px]">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-2">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  FAQ                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "Do I need an account to use TaskFlow?",
    a: "No. You can continue as guest and your session lives on this device. Sign in with your name and email if you'd like a personalized greeting.",
  },
  {
    q: "Where is my data stored?",
    a: "Tasks sync to a MongoDB database you control. Preferences (theme, background, animations) stay on your device.",
  },
  {
    q: "Is there a mobile app?",
    a: "The web app is fully responsive with a dedicated mobile tab bar and floating compose button. A native app isn't planned.",
  },
  {
    q: "Does it work offline?",
    a: "Reads, edits, and writes are optimistic — the UI updates instantly. A persistent offline mode is on the roadmap.",
  },
  {
    q: "How much does it cost?",
    a: "Free during early access. No credit card, no trial timer.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-[34px]">
            Questions we hear a lot.
          </h2>
          <p className="mt-4 text-[14px] text-muted">
            If something's missing, drop us a note. We answer everything.
          </p>
        </div>
        <ul className="divide-y divide-[color:var(--c-border)] border-y border-app lg:col-span-8">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14.5px] font-medium">{f.q}</span>
                  <FiChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition ${
                      isOpen ? "rotate-180 text-[color:var(--c-ink)]" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-[13.5px] leading-relaxed text-muted">
                    {f.a}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CTA                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function CTA() {
  return (
    <Section className="!pb-24">
      <div className="relative overflow-hidden rounded-card border border-app-strong bg-[color:var(--c-surface-solid)] px-8 py-14 sm:px-14 sm:py-20">
        <CtaGrid />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-xl">
            <h2 className="text-[30px] font-semibold leading-[1.1] tracking-tight sm:text-[38px]">
              Stop managing your task manager.
            </h2>
            <p className="mt-3 text-[14.5px] text-muted">
              Two minutes to set up. Sign in to keep your name on the greeting,
              or continue as guest.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/login">
              <Button
                size="lg"
                rightIcon={<FiArrowRight className="h-4 w-4" />}
              >
                Get started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CtaGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage:
          "linear-gradient(var(--c-border) 1px, transparent 1px), linear-gradient(90deg, var(--c-border) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage:
          "radial-gradient(ellipse at top right, black, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at top right, black, transparent 70%)",
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Footer                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const FOOTER = [
  {
    title: "Product",
    links: [
      { label: "Plan", href: "#plan" },
      { label: "Focus", href: "#focus" },
      { label: "Memory", href: "#memory" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Changelog", href: "#" },
      { label: "Keyboard shortcuts", href: "#" },
      { label: "Status", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "mailto:hello@taskflow.local" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-app">
      <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
            A focused task manager for people who'd rather ship than fiddle
            with their tools.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink href="https://github.com" label="GitHub">
              <FiGithub className="h-3.5 w-3.5" />
            </SocialLink>
            <SocialLink href="https://x.com" label="Twitter / X">
              <FiTwitter className="h-3.5 w-3.5" />
            </SocialLink>
            <SocialLink href="mailto:hello@taskflow.local" label="Email">
              <FiMail className="h-3.5 w-3.5" />
            </SocialLink>
          </div>
        </div>

        {FOOTER.map((col) => (
          <div key={col.title}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-2">
              {col.title}
            </div>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-1 text-[13px] text-muted transition hover:text-[color:var(--c-ink)]"
                  >
                    {l.label}
                    {l.href.startsWith("http") && (
                      <FiArrowUpRight className="h-3 w-3 opacity-60" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-app">
        <Container className="flex flex-col items-start justify-between gap-3 py-5 text-[11.5px] text-muted-2 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            All systems normal · v1.0.0
          </span>
        </Container>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-app text-muted transition hover:border-app-strong hover:text-[color:var(--c-ink)]"
    >
      {children}
    </a>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Shared bits                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Frame({ label, children }) {
  return (
    <div className="overflow-hidden rounded-card border border-app-strong bg-[color:var(--c-surface-solid)] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-app px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-danger/50" />
        <span className="h-2 w-2 rounded-full bg-warning/50" />
        <span className="h-2 w-2 rounded-full bg-success/50" />
        <span className="ml-2 text-[10.5px] font-mono text-muted-2">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Pill({ tone = "muted", dot = false, children }) {
  const map = {
    muted: "bg-[color:var(--c-border)] text-muted",
    brand: "bg-brand/15 text-brand",
    danger: "bg-danger/15 text-danger",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    purple: "bg-purple-500/15 text-purple-400 dark:text-purple-300",
    blue: "bg-sky-500/15 text-sky-500 dark:text-sky-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-medium ${map[tone]}`}
    >
      {dot && <span className="h-1 w-1 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function borderForPriority(p) {
  if (p === "High") return "#EF4444";
  if (p === "Low") return "#3B82F6";
  return "#F59E0B";
}
