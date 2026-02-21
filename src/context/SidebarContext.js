// src/context/SidebarContext.js
import React, { createContext, useEffect, useMemo, useRef, useState } from "react";

export const SidebarContext = createContext(null);

const STORAGE_KEY = "mic_sidebar_collapsed";

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? false : saved === "1";
    } catch {
      return false;
    }
  });

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

  useEffect(() => {
    const onResize = () => {
      if (userTouchedRef.current) return;
      const mobile = window.innerWidth < 1000;

      setIsCollapsed((prev) => {
        const next = mobile ? true : prev; // don't force open on desktop
        return next;
      });
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value = useMemo(
    () => ({ isCollapsed, setIsCollapsed: setCollapsed, toggleCollapsed }),
    [isCollapsed]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
