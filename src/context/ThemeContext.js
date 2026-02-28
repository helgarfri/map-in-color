// src/context/ThemeContext.js
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "mic_theme_dark";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [darkMode]);

  const setDarkMode = useCallback((value) => {
    setDarkModeState((prev) => {
      const next = typeof value === "function" ? value(prev) : !!value;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ darkMode, setDarkMode }),
    [darkMode, setDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
