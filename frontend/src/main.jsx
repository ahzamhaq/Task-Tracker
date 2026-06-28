import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BackgroundProvider } from "./context/BackgroundContext.jsx";
import { PreferencesProvider } from "./context/PreferencesContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <BackgroundProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </BackgroundProvider>
      </PreferencesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
