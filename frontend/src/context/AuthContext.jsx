import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "taskflow-auth";

const load = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.isLoggedIn) return null;
    return parsed;
  } catch {
    return null;
  }
};

const persist = (user) => {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota */
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(load);

  useEffect(() => {
    persist(user);
  }, [user]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setUser(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(({ name, email }) => {
    const next = {
      userName: name.trim(),
      userEmail: email.trim().toLowerCase(),
      loginTimestamp: Date.now(),
      isLoggedIn: true,
      isGuest: false,
    };
    setUser(next);
    return next;
  }, []);

  const loginAsGuest = useCallback(() => {
    const next = {
      userName: "Guest",
      userEmail: "guest@taskflow.local",
      loginTimestamp: Date.now(),
      isLoggedIn: true,
      isGuest: true,
    };
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      loginAsGuest,
      logout,
    }),
    [user, login, loginAsGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const userInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
