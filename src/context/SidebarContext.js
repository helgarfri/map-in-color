// src/context/SidebarContext.js
import React, { createContext, useState } from 'react';

export const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  // Single source of truth for isCollapsed:
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}
