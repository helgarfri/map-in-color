// src/context/SidebarContext.js
import React, { createContext, useEffect, useMemo, useRef, useState } from "react";

export const SidebarContext = createContext(null);

const STORAGE_KEY = "mic_sidebar_collapsed";

export function SidebarProvider({ children }) {
  // Load saved preference once
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? false : saved === "1";
    } catch {
      return false;
    }
  });

  // Track if user manually changed it (so we stop auto-forcing)
  const userTouchedRef = useRef(false);

  const setCollapsed = (next) => {
    userTouchedRef.current = true;
    setIsCollapsed((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      try {
        localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
      } catch {}
      return value;
    });
  };

  const toggleCollapsed = () => setCollapsed((v) => !v);

  // Auto collapse on small screens ONLY if user hasn't touched it yet
  useEffect(() => {
    const onResize = () => {
      if (userTouchedRef.current) return;

      const mobile = window.innerWidth < 1000;

      // If no saved preference existed, this will still have default false,
      // so we can auto-collapse on first mobile encounter:
      setIsCollapsed((prev) => {
        const next = mobile ? true : prev; // don't force open on desktop
        return next;
      });
    };

    onResize(); // run once on mount
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value = useMemo(
    () => ({ isCollapsed, setIsCollapsed: setCollapsed, toggleCollapsed }),
    [isCollapsed]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
