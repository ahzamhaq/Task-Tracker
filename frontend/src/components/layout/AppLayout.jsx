import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import BackgroundPanel from "./BackgroundPanel.jsx";
import MobileTabBar from "./MobileTabBar.jsx";
import SettingsPanel from "./SettingsPanel.jsx";
import CommandPalette from "./CommandPalette.jsx";
import { SearchContext } from "../../hooks/useSearch.js";
import { useBackground } from "../../context/BackgroundContext.jsx";

const dispatchCompose = () =>
  window.dispatchEvent(new Event("taskflow:compose"));

export default function AppLayout() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bgOpen, setBgOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { url } = useBackground();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div
        className="app-wallpaper"
        data-empty={url ? "false" : "true"}
        aria-hidden="true"
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="lg:pl-sidebar">
        <Topbar
          search={search}
          onSearch={setSearch}
          onOpenBackground={() => setBgOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <main className="mx-auto w-full max-w-content px-4 py-7 pb-24 sm:px-7 sm:py-9 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileTabBar onCompose={dispatchCompose} />

      <BackgroundPanel open={bgOpen} onClose={() => setBgOpen(false)} />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenBackground={() => setBgOpen(true)}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onCompose={dispatchCompose}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenBackground={() => setBgOpen(true)}
      />
    </SearchContext.Provider>
  );
}
