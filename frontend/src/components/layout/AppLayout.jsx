import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import BackgroundPanel from "./BackgroundPanel.jsx";
import MobileTabBar from "./MobileTabBar.jsx";
import { SearchContext } from "../../hooks/useSearch.js";
import { useBackground } from "../../context/BackgroundContext.jsx";

export default function AppLayout() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bgOpen, setBgOpen] = useState(false);
  const { url } = useBackground();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div
        className="app-wallpaper"
        data-empty={url ? "false" : "true"}
        aria-hidden="true"
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-sidebar">
        <Topbar
          search={search}
          onSearch={setSearch}
          onOpenBackground={() => setBgOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
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

      <MobileTabBar onCompose={() => window.dispatchEvent(new Event("taskflow:compose"))} />

      <BackgroundPanel open={bgOpen} onClose={() => setBgOpen(false)} />
    </SearchContext.Provider>
  );
}
