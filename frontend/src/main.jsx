import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import { ThemeProvider } from "./context/Themecontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);