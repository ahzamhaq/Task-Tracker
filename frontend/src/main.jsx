import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BackgroundProvider } from "./context/BackgroundContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BackgroundProvider>
        <BrowserRouter>
          <TaskProvider>
            <App />
          </TaskProvider>
        </BrowserRouter>
      </BackgroundProvider>
    </ThemeProvider>
  </React.StrictMode>
);
