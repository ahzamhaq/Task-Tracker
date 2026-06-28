import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiLink2, FiRotateCcw, FiUpload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "../ui/Button.jsx";
import { Input } from "../ui/Field.jsx";
import { BG_PRESETS, useBackground } from "../../context/BackgroundContext.jsx";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function BackgroundPanel({ open, onClose }) {
  const { url, opacity, blur, setUrl, setOpacity, setBlur, reset } =
    useBackground();
  const [draftUrl, setDraftUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Use JPG, PNG, or WebP");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const applyPreview = () => {
    if (!preview) return;
    setUrl(preview);
    setPreview(null);
    toast.success("Background updated");
  };

  const applyUrl = () => {
    const value = draftUrl.trim();
    if (!value) return;
    try {
      new URL(value);
    } catch {
      toast.error("Enter a valid image URL");
      return;
    }
    setUrl(value);
    setDraftUrl("");
    toast.success("Background updated");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-3 top-3 z-50 flex h-[calc(100vh-24px)] w-[360px] max-w-[calc(100vw-24px)] flex-col rounded-card border border-app-strong glass-strong shadow-glass-hover"
            role="dialog"
            aria-label="Background settings"
          >
            <header className="flex items-center justify-between border-b border-app px-5 py-3.5">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight">
                  Background
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
              <section>
                <SectionTitle>Curated</SectionTitle>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {BG_PRESETS.map((p) => {
                    const active = url === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setUrl(p.url);
                          toast.success(`Applied ${p.label}`);
                        }}
                        className={`group relative aspect-[4/3] overflow-hidden rounded-lg border transition ${
                          active
                            ? "border-brand ring-2 ring-brand/30"
                            : "border-app hover:border-app-strong"
                        }`}
                        title={p.label}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        {active && (
                          <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                            <FiCheck className="h-2.5 w-2.5" />
                          </span>
                        )}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-left text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <Divider />

              <section>
                <SectionTitle>Upload image</SectionTitle>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-btn border border-dashed border-app-strong px-3 py-3 text-[13px] font-medium text-muted transition hover:border-brand/60 hover:text-[color:var(--c-ink)]"
                >
                  <FiUpload className="h-3.5 w-3.5" />
                  Choose from your device
                </button>
                <p className="mt-1.5 text-[11px] text-muted-2">
                  JPG, PNG, WebP · up to 4MB
                </p>
              </section>

              <Divider />

              <section>
                <SectionTitle>From URL</SectionTitle>
                <div className="mt-3 flex gap-2">
                  <div className="relative flex-1">
                    <FiLink2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <Input
                      value={draftUrl}
                      onChange={(e) => setDraftUrl(e.target.value)}
                      placeholder="https://…"
                      className="pl-8"
                      onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                    />
                  </div>
                  <Button size="md" onClick={applyUrl} disabled={!draftUrl.trim()}>
                    Apply
                  </Button>
                </div>
              </section>

              {preview && (
                <>
                  <Divider />
                  <section>
                    <SectionTitle>Preview</SectionTitle>
                    <div className="mt-3 overflow-hidden rounded-lg border border-app">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreview(null)}
                      >
                        Discard
                      </Button>
                      <Button size="sm" onClick={applyPreview}>
                        Use this image
                      </Button>
                    </div>
                  </section>
                </>
              )}

              <Divider />

              <section className="space-y-4">
                <SectionTitle>Adjustments</SectionTitle>
                <Slider
                  label="Overlay"
                  value={Math.round(opacity * 100)}
                  min={0}
                  max={95}
                  onChange={(v) => setOpacity(v / 100)}
                  suffix="%"
                />
                <Slider
                  label="Blur"
                  value={blur}
                  min={0}
                  max={24}
                  onChange={setBlur}
                  suffix="px"
                />
              </section>
            </div>

            <footer className="border-t border-app px-5 py-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  reset();
                  toast.success("Background reset");
                }}
                leftIcon={<FiRotateCcw className="h-3.5 w-3.5" />}
              >
                Reset to default
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-2">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="my-5 divider" />;
}

function Slider({ label, value, min, max, onChange, suffix }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12.5px] font-medium">{label}</span>
        <span className="text-[11.5px] tabular-nums text-muted">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--c-border-strong)] accent-brand"
      />
    </div>
  );
}
