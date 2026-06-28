import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "./Topbar.jsx";
import { SearchContext } from "../../hooks/useSearch.js";

export default function AppLayout() {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div className="min-h-screen">
        <Topbar search={search} onSearch={setSearch} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </main>
      </div>
    </SearchContext.Provider>
  );
}
