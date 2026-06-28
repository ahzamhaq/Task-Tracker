import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiImage,
  FiInfo,
  FiMoon,
  FiRotateCcw,
  FiSun,
  FiTrash2,
  FiX,
  FiZap,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "../ui/Button.jsx";
import ConfirmDialog from "../tasks/ConfirmDialog.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useBackground } from "../../context/BackgroundContext.jsx";
import { usePreferences } from "../../context/PreferencesContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";

const APP_VERSION = "1.0.0";

export default function SettingsPanel({ open, onClose, onOpenBackground }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { reset: resetBackground } = useBackground();
  const { animations, setAnimations, reset: resetPrefs } = usePreferences();
  const { archived, refreshArchived, clearArchived } = useTasks();
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!open) return;
    refreshArchived();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, refreshArchived]);

  const handleResetPrefs = () => {
    resetPrefs();
    toast.success("Preferences reset");
  };

  const handleClearArchive = async () => {
    setClearing(true);
    try {
      await clearArchived();
      setConfirmClear(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-3 top-3 z-50 flex h-[calc(100vh-24px)] w-[380px] max-w-[calc(100vw-24px)] flex-col rounded-card border border-app-strong glass-strong shadow-glass-hover"
              role="dialog"
              aria-label="Settings"
            >
              <header className="flex items-center justify-between border-b border-app px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-tight">
                    Settings
                  </h2>
                  <p className="text-[12px] text-muted">
                    Personalize your workspace
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-md p-1.5 text-muted transition hover:bg-[color:var(--c-border)] hover:text-[color:var(--c-ink)]"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <Section title="Appearance">
                  <Row
                    icon={theme === "dark" ? FiMoon : FiSun}
                    label="Theme"
                    description="Switch between light and dark"
                  >
                    <Segmented
                      value={theme}
                      onChange={(v) => v !== theme && toggleTheme()}
                      options={[
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                      ]}
                    />
                  </Row>

                  <Row
                    icon={FiImage}
                    label="Background"
                    description="Image, blur and overlay"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onClose?.();
                        onOpenBackground?.();
                      }}
                    >
                      Customize
                    </Button>
                  </Row>

                  <Row
                    icon={FiZap}
                    label="Animations"
                    description="Enable interface motion"
                  >
                    <Toggle
                      checked={animations}
                      onChange={setAnimations}
                      label="Animations"
                    />
                  </Row>
                </Section>

                <Divider />

                <Section title="Data">
                  <Row
                    icon={FiTrash2}
                    label="Clear archived tasks"
                    description={`${archived.length} archived task${
                      archived.length === 1 ? "" : "s"
                    }`}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmClear(true)}
                      disabled={archived.length === 0}
                    >
                      Clear
                    </Button>
                  </Row>

                  <Row
                    icon={FiRotateCcw}
                    label="Reset preferences"
                    description="Restore animations & defaults"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleResetPrefs}
                    >
                      Reset
                    </Button>
                  </Row>

                  <Row
                    icon={FiImage}
                    label="Reset background"
                    description="Restore the default wallpaper"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        resetBackground();
                        toast.success("Background reset");
                      }}
                    >
                      Reset
                    </Button>
                  </Row>
                </Section>

                <Divider />

                <Section title="About">
                  <div className="rounded-card border border-app bg-[color:var(--c-surface)] p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover">
                        <span className="h-2 w-2 rounded-full bg-white/95" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[13.5px] font-semibold">
                            TaskFlow
                          </span>
                          <span className="text-[11px] text-muted-2">
                            v{APP_VERSION}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted">
                          A premium, focused task manager. Built with React,
                          Express, and MongoDB.
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-2">
                          <FiInfo className="h-3 w-3" /> All preferences are
                          stored on this device.
                        </p>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmClear}
        title="Clear archived tasks?"
        description={`This will permanently delete ${archived.length} archived task${
          archived.length === 1 ? "" : "s"
        }. This cannot be undone.`}
        confirmLabel="Clear all"
        loading={clearing}
        onConfirm={handleClearArchive}
        onClose={() => !clearing && setConfirmClear(false)}
      />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-5 last:mb-0">
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-2">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Divider() {
  return <div className="my-5 divider" />;
}

function Row({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--c-border)] text-muted">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium">{label}</div>
          {description && (
            <div className="mt-0.5 text-[11.5px] text-muted">{description}</div>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-btn border border-app bg-[color:var(--c-surface)] p-0.5">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`h-7 rounded-md px-2.5 text-[11.5px] font-medium transition ${
              active
                ? "bg-brand text-white"
                : "text-muted hover:text-[color:var(--c-ink)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
        checked ? "bg-brand" : "bg-[color:var(--c-border-strong)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
