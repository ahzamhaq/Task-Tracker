import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Sidebar shortcuts reuse the same view, scoped via search/filters */}
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/today" element={<Dashboard />} />
          <Route path="/upcoming" element={<Dashboard />} />
          <Route path="/completed" element={<Dashboard />} />
          <Route path="/archived" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--c-surface-solid)",
            color: "var(--c-ink)",
            border: "1px solid var(--c-border-strong)",
            borderRadius: "12px",
            fontSize: "13px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
          },
          success: { iconTheme: { primary: "#22C55E", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#ffffff" } },
        }}
      />
    </>
  );
}
