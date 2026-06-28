import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArchive,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiGithub,
  FiLayers,
  FiMail,
  FiMonitor,
  FiMoon,
  FiSearch,
  FiSmartphone,
  FiSun,
  FiZap,
} from "react-icons/fi";
import Logo from "../components/layout/Logo.jsx";
import Button from "../components/ui/Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const FEATURES = [
  {
    icon: FiLayers,
    title: "Smart Task Management",
    body: "Capture, organize, and triage work with quick edits, status pickers, and inline actions.",
  },
  {
    icon: FiBarChart2,
    title: "Productivity Insights",
    body: "Live counters for completion rate, overdue work, and what's due today — always one glance away.",
  },
  {
    icon: FiSearch,
    title: "Powerful Search & Filters",
    body: "Debounced search, multi-key sort, and stacked filters across status, priority, and date.",
  },
  {
    icon: FiArchive,
    title: "Archive & Restore",
    body: "Move tasks aside without losing them. Restore in one click or clear forever.",
  },
  {
    icon: FiMonitor,
    title: "Dark & Light Themes",
    body: "A premium dark mode and a real (not inverted) light mode — both tuned for long sessions.",
  },
  {
    icon: FiSmartphone,
    title: "Responsive Everywhere",
    body: "Desktop sidebar, tablet grid, mobile tab bar with floating compose. One workspace, every screen.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-app text-[color:var(--c-ink)]">
      <Nav />
      <Hero />
      <Features />
      <ProductivitySection />
      <WhyChoose />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all ${
        scrolled
          ? "border-app glass"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center px-5 sm:px-8">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="ml-auto flex items-center gap-1 sm:gap-3">
          <a
            href="#features"
            className="hidden rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition hover:text-[color:var(--c-ink)] sm:inline-flex"
          >
            Features
          </a>
          <a
            href="#about"
            className="hidden rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition hover:text-[color:var(--c-ink)] sm:inline-flex"
          >
            About
          </a>
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
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" rightIcon={<FiArrowRight className="h-3.5 w-3.5" />}>
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-content px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-app bg-[color:var(--c-surface)] px-3 py-1 text-[11.5px] font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            v1.0 · Now in early access
          </span>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
            Organize your work.
            <br />
            Stay focused.
            <br />
            <span className="text-brand">Achieve more.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[16px]">
            TaskFlow helps you manage projects, organize tasks, track
            productivity, and stay focused with a beautiful modern workspace.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/login">
              <Button size="lg" rightIcon={<FiArrowRight className="h-4 w-4" />}>
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-[11.5px] text-muted-2">
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle className="h-3 w-3 text-success" /> No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle className="h-3 w-3 text-success" /> Works offline-friendly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle className="h-3 w-3 text-success" /> Free forever
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        >
          <BrowserMockup>
            <DashboardPreview />
          </BrowserMockup>
        </motion.div>
      </div>
    </section>
  );
}

function BrowserMockup({ children }) {
  return (
    <div className="overflow-hidden rounded-card border border-app-strong glass shadow-glass-hover">
      <div className="flex items-center gap-2 border-b border-app px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <div className="ml-3 hidden h-5 flex-1 items-center rounded-md border border-app bg-[color:var(--c-surface)] px-2 text-[10.5px] text-muted-2 sm:flex">
          app.taskflow.com/dashboard
        </div>
      </div>
      {children}
    </div>
  );
}

function MiniBadge({ tone = "muted", children }) {
  const map = {
    muted: "bg-[color:var(--c-border)] text-muted",
    brand: "bg-brand/15 text-brand",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    purple: "bg-purple-500/15 text-purple-400 dark:text-purple-300",
    danger: "bg-danger/15 text-danger",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9.5px] font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function DashboardPreview() {
  const rows = [
    { title: "Draft Q3 launch plan", priority: "High", status: "In Progress", tone: "danger", statusTone: "purple" },
    { title: "Review onboarding copy", priority: "Medium", status: "Pending", tone: "warning", statusTone: "muted" },
    { title: "Ship release notes", priority: "Medium", status: "Pending", tone: "warning", statusTone: "muted" },
    { title: "Sync with design team", priority: "Low", status: "Completed", tone: "brand", statusTone: "success" },
  ];

  return (
    <div className="grid grid-cols-[160px_1fr] bg-app">
      <aside className="hidden border-r border-app px-3 py-4 sm:block">
        <Logo />
        <ul className="mt-5 space-y-1 text-[11.5px]">
          <li className="rounded-md bg-brand/10 px-2 py-1.5 font-medium text-brand">
            Dashboard
          </li>
          <li className="px-2 py-1.5 text-muted">Today</li>
          <li className="px-2 py-1.5 text-muted">Upcoming</li>
          <li className="px-2 py-1.5 text-muted">Completed</li>
          <li className="px-2 py-1.5 text-muted">Archived</li>
        </ul>
      </aside>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold">Good afternoon 👋</div>
            <div className="text-[11px] text-muted">Let's make today productive.</div>
          </div>
          <div className="flex items-center gap-3 rounded-card border border-app bg-[color:var(--c-surface)] px-3 py-1.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
                <circle cx="18" cy="18" r="14" stroke="var(--c-border-strong)" strokeWidth="3" fill="none" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${(85 / 100) * 88} 88`}
                />
              </svg>
              <span className="absolute text-[9px] font-semibold">85%</span>
            </div>
            <div className="text-[10px] text-muted-2">
              <div className="text-[11px] font-semibold text-[color:var(--c-ink)]">11 done</div>
              this week
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { v: 24, l: "Total" },
            { v: 8, l: "Pending" },
            { v: 5, l: "Active" },
            { v: 11, l: "Done" },
          ].map((s) => (
            <div key={s.l} className="rounded-md border border-app bg-[color:var(--c-surface)] px-2 py-1.5">
              <div className="text-[12px] font-semibold">{s.v}</div>
              <div className="text-[9.5px] text-muted-2">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <div
              key={r.title}
              className="relative flex items-center gap-2 overflow-hidden rounded-md border border-app bg-[color:var(--c-surface)] px-2.5 py-1.5"
            >
              <span
                className="absolute inset-y-0 left-0 w-[2px]"
                style={{
                  background:
                    r.tone === "danger" ? "#EF4444" : r.tone === "warning" ? "#F59E0B" : "#3B82F6",
                }}
              />
              <span className="ml-1 h-3 w-3 rounded-full border border-app-strong" />
              <span className="flex-1 truncate text-[11px] font-medium">
                {r.title}
              </span>
              <MiniBadge tone={r.tone}>{r.priority}</MiniBadge>
              <MiniBadge tone={r.statusTone}>{r.status}</MiniBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need. Nothing you don't."
        subtitle="The essentials, carefully designed. Built around focus, not feature bloat."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 transition-shadow hover:shadow-glass-hover"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-[14.5px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>
    </motion.div>
  );
}

function ProductivitySection() {
  return (
    <section className="mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Productivity Insights"
            title="See your progress at a glance."
            subtitle="A live widget on the dashboard turns your activity into clear, motivating signals — without any setup."
          />
          <ul className="mt-6 space-y-3 text-[13.5px]">
            <Bullet>Live completion rate that updates with every check-off</Bullet>
            <Bullet>Counts for due-today, overdue, and high-priority remaining</Bullet>
            <Bullet>"This week" rollup from your real activity timeline</Bullet>
          </ul>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-card p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium">
              <FiZap className="h-3.5 w-3.5 text-brand" /> Insights
            </span>
            <span className="text-[11px] text-muted">85% done</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--c-border)]">
            <div className="h-full rounded-full bg-brand" style={{ width: "85%" }} />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
            <li className="flex items-center justify-between">
              <span className="text-muted">This week</span>
              <span className="font-semibold tabular-nums">8</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">Due today</span>
              <span className="font-semibold tabular-nums text-warning">2</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">Overdue</span>
              <span className="font-semibold tabular-nums text-danger">1</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">High priority</span>
              <span className="font-semibold tabular-nums">3</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    {
      title: "Modern UI",
      body: "A handcrafted interface inspired by the apps you already love.",
    },
    {
      title: "Fast Performance",
      body: "Optimistic updates, debounced search, and instant filters.",
    },
    {
      title: "Simple Workflow",
      body: "Zero learning curve. Open it, capture a task, get back to work.",
    },
  ];
  return (
    <section id="about" className="mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Why TaskFlow"
        title="Built for focus, not friction."
        subtitle="Three principles guide every decision."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="text-center">
            <h3 className="text-[15px] font-semibold tracking-tight">{i.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-content px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="glass-card relative overflow-hidden p-10 text-center sm:p-14">
        <h2 className="text-[28px] font-semibold tracking-tight sm:text-[36px]">
          Ready to organize your work?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
          Set up takes less than a minute. Bring your tasks, your way.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login">
            <Button size="lg" rightIcon={<FiArrowRight className="h-4 w-4" />}>
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-app">
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-[11.5px] text-muted-2">v1.0.0</span>
        </div>
        <nav className="flex items-center gap-5 text-[12.5px] text-muted">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--c-ink)]"
          >
            <FiGithub className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            href="mailto:hello@taskflow.local"
            className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--c-ink)]"
          >
            <FiMail className="h-3.5 w-3.5" /> Contact
          </a>
          <span className="text-muted-2">
            © {new Date().getFullYear()} TaskFlow
          </span>
        </nav>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={align === "left" ? "" : "mx-auto max-w-2xl text-center"}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-[26px] font-semibold tracking-tight sm:text-[34px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[14px] leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      <span className="text-muted">{children}</span>
    </li>
  );
}
