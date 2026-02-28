import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import styles from "./PublicLayout.module.css";

/**
 * Shared layout for public routes (Home, Playground).
 * Keeps HomeHeader mounted so navigation between / and /playground feels smooth
 * with no header flash. On home, outlet is transparent so hero can show behind header.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`forceLightMode ${styles.wrap}`}>
      {isHome && <div className={styles.heroBackgroundLayer} aria-hidden="true" />}
      <HomeHeader />
      <div className={`${styles.outletWrap} ${isHome ? styles.outletWrapHome : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}
