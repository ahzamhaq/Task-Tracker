import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import Logo from "../components/layout/Logo.jsx";
import Button from "../components/ui/Button.jsx";
import { FieldShell, Input } from "../components/ui/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (values) => {
    login(values);
    toast.success(`Welcome, ${values.name.split(" ")[0]}`);
    navigate(redirectTo, { replace: true });
  };

  const handleGuest = () => {
    loginAsGuest();
    toast.success("Continuing as guest");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-app text-[color:var(--c-ink)]">
      <div className="mx-auto grid min-h-screen max-w-content lg:grid-cols-[1.05fr_1fr]">
        <BrandPanel />

        <div className="flex flex-col px-5 py-8 sm:px-10 sm:py-12">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-[color:var(--c-ink)]"
            >
              <FiArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
          </div>

          <div className="flex flex-1 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <div className="mb-7">
                <h1 className="text-[26px] font-semibold tracking-tight">
                  Welcome to TaskFlow
                </h1>
                <p className="mt-1.5 text-[13.5px] text-muted">
                  Sign in to access your workspace. We'll keep things on this
                  device.
                </p>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-4"
                >
                  <FieldShell
                    label="Full name"
                    required
                    error={errors.name?.message}
                  >
                    <div className="relative">
                      <FiUser className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                      <Input
                        autoComplete="name"
                        placeholder="Jane Cooper"
                        className="pl-9"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Minimum 2 characters",
                          },
                          maxLength: { value: 60, message: "Too long" },
                        })}
                      />
                    </div>
                  </FieldShell>

                  <FieldShell
                    label="Email address"
                    required
                    error={errors.email?.message}
                  >
                    <div className="relative">
                      <FiMail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: EMAIL_RE,
                            message: "Enter a valid email",
                          },
                        })}
                      />
                    </div>
                  </FieldShell>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isSubmitting}
                    rightIcon={<FiArrowRight className="h-4 w-4" />}
                  >
                    Continue
                  </Button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[color:var(--c-border)]" />
                  <span className="text-[10.5px] uppercase tracking-wider text-muted-2">
                    or
                  </span>
                  <div className="h-px flex-1 bg-[color:var(--c-border)]" />
                </div>

                <div className="space-y-2.5">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={handleGuest}
                  >
                    Continue as Guest
                  </Button>

                  <button
                    type="button"
                    disabled
                    className="relative flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-btn border border-app bg-[color:var(--c-surface)] px-4 py-2.5 text-[13px] font-medium text-muted opacity-80"
                  >
                    <GoogleGlyph />
                    Continue with Google
                    <span className="absolute right-3 inline-flex items-center rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                      Coming Soon
                    </span>
                  </button>
                </div>
              </div>

              <p className="mt-5 inline-flex items-center gap-1.5 text-[11.5px] text-muted-2">
                <FiLock className="h-3 w-3" />
                Your data stays on this device.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between border-r border-app px-10 py-10 lg:flex">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Link to="/">
        <Logo />
      </Link>

      <div>
        <h2 className="text-[34px] font-semibold leading-[1.1] tracking-tight">
          Your workspace, <br />
          <span className="text-brand">ready when you are.</span>
        </h2>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted">
          Capture tasks, see your progress, and stay in flow. No setup, no
          clutter.
        </p>

        <ul className="mt-7 space-y-3 text-[13px]">
          <Feature>Optimistic, instant interface</Feature>
          <Feature>Activity timeline & notes per task</Feature>
          <Feature>⌘K command palette and smart search</Feature>
        </ul>

        <div className="glass-card mt-8 p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">
              <FiShield className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[12.5px] font-semibold">Privacy first</div>
              <div className="text-[11.5px] text-muted">
                No password. No tracking. Local session only.
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-2">
        © {new Date().getFullYear()} TaskFlow · v1.0.0
      </p>
    </div>
  );
}

function Feature({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      <span className="text-muted">{children}</span>
    </li>
  );
}

function GoogleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.8 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 16.2 4.5 9.5 8.9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.6-1.9 13-5l-6-5c-1.9 1.4-4.4 2.3-7 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.5 39.1 16.2 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 5c4.2-3.9 6.5-9.6 6.5-15.7 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
