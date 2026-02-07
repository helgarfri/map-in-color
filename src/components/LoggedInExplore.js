import React, { useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ExploreContent from './ExploreContent';
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

import styles from './LoggedInExplore.module.css';

export default function LoggedInExplore() {
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

useEffect(() => {
  if (width < 1000) setIsCollapsed(true);
  // else: do nothing (keep user preference)
}, [width, setIsCollapsed]);


  // If on a small screen and we are NOT collapsed => show overlay
  const showOverlay = !isCollapsed && width < 1000;

  return (
    <div className={styles.loggedInExploreContainer}>
      {/* Left: Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* If overlay should be shown on small screens, render it */}
      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Right: Main content area */}
      <div
        className={`${styles.mainContentWrapper} ${
          isCollapsed ? styles.collapsed : ''
        }`}
      >
        <Header title="Explore" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <ExploreContent />
      </div>
    </div>
  );
}
