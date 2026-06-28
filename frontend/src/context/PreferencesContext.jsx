import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "taskflow-prefs";

const DEFAULTS = {
  animations: true,
};

const load = () => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
};

const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(load);

  useEffect(() => {
    document.documentElement.dataset.animations = prefs.animations ? "on" : "off";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* noop */
    }
  }, [prefs]);

  const setAnimations = useCallback(
    (animations) => setPrefs((p) => ({ ...p, animations })),
    []
  );
  const reset = useCallback(() => setPrefs(DEFAULTS), []);

  const value = useMemo(
    () => ({ ...prefs, setAnimations, reset }),
    [prefs, setAnimations, reset]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
};
