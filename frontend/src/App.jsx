import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Archive from "./pages/Archive.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import { Protected, PublicOnly } from "./components/auth/Protected.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";

function DashboardShell() {
  return (
    <Protected>
      <TaskProvider>
        <AppLayout />
      </TaskProvider>
    </Protected>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnly>
              <Landing />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />

        <Route element={<DashboardShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/today" element={<Dashboard />} />
          <Route path="/upcoming" element={<Dashboard />} />
          <Route path="/completed" element={<Dashboard />} />
          <Route path="/archived" element={<Archive />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
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
