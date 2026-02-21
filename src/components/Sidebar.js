// src/components/Sidebar.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  FaHome,
  FaMap,
  FaStar,
  FaPlus,
  FaBell,
  FaUserCog,
  FaSearch,
  FaExternalLinkAlt,
  FaBook,
  FaUser,
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

function Sidebar() {

  const { width } = useWindowSize();
const isMobile = width < 1000;

const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

const closeSidebarIfMobile = () => {
  if (isMobile) setIsCollapsed(true);
};
  const { profile, loadingProfile } = useContext(UserContext);
  const navigate = useNavigate();

  if (loadingProfile) return null;
  if (!profile) return null;

  const handleCreateMap = () => navigate("/create");
  const DOCS_URL = "https://mapincolor.com/docs";
  const myProfilePath = profile?.username ? `/profile/${profile.username}` : "/dashboard";

  

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.contentWrapper}>
        <div className={styles.brandRow}>
          <div className={styles.brandDot} aria-hidden="true" />
          {!isCollapsed && <div className={styles.brandText}>Map in Color</div>}
        </div>

        <button className={styles.primaryCta} onClick={handleCreateMap}>
          <FaPlus className={styles.icon} />
          {!isCollapsed && <span>Create New Map</span>}
        </button>

        <div className={styles.divider} />

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <NavLink
                to="/dashboard"
                onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                
                }
              >
                <FaHome className={styles.icon} />
                {!isCollapsed && <span>Dashboard</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={myProfilePath}
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaUser className={styles.icon} />
                {!isCollapsed && <span>Profile</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/explore"
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaSearch className={styles.icon} />
                {!isCollapsed && <span>Explore</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/your-maps"
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaMap className={styles.icon} />
                {!isCollapsed && <span>Your Maps</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/starred-maps"
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaStar className={styles.icon} />
                {!isCollapsed && <span>Starred Maps</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/notifications"
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaBell className={styles.icon} />
                {!isCollapsed && <span>Notifications</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                  onClick={closeSidebarIfMobile}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaUserCog className={styles.icon} />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <a
          className={styles.docsButton}
            onClick={closeSidebarIfMobile}
          href={DOCS_URL}
          target="_blank"
          rel="noreferrer"
          title="Open docs (external)"
        >
          <FaBook className={styles.icon} />
          {!isCollapsed && <span>Docs</span>}
          {!isCollapsed && <FaExternalLinkAlt className={styles.externalIcon} />}
        </a>

        <div className={styles.copyright}>
          {!isCollapsed ? "© 2026 Map in Color. All rights reserved." : "© 2026"}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
