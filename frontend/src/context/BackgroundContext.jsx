import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "taskflow-bg";

export const BG_PRESETS = [
  {
    id: "mountains",
    label: "Mountains",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "ocean",
    label: "Ocean",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "aurora",
    label: "Aurora",
    url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "forest",
    label: "Forest",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "gradient",
    label: "Minimal Gradient",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "city",
    label: "City Night",
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "abstract",
    label: "Abstract",
    url: "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "space",
    label: "Space",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "sunset",
    label: "Sunset",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=70",
  },
  {
    id: "texture",
    label: "Dark Texture",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=70",
  },
];

const DEFAULT_STATE = {
  url: BG_PRESETS[0].url,
  opacity: 0.7,
  blur: 4,
};

const BackgroundContext = createContext(null);

const load = () => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
};

export const BackgroundProvider = ({ children }) => {
  const [state, setState] = useState(load);

  useEffect(() => {
    const root = document.documentElement;
    if (state.url) {
      root.style.setProperty("--bg-image", `url("${state.url}")`);
    } else {
      root.style.setProperty("--bg-image", "none");
    }
    root.style.setProperty("--bg-overlay", String(state.opacity));
    root.style.setProperty("--bg-blur", `${state.blur}px`);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      setUrl: (url) => setState((s) => ({ ...s, url })),
      setOpacity: (opacity) => setState((s) => ({ ...s, opacity })),
      setBlur: (blur) => setState((s) => ({ ...s, blur })),
      reset: () => setState(DEFAULT_STATE),
    }),
    [state]
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const ctx = useContext(BackgroundContext);
  if (!ctx)
    throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
};
