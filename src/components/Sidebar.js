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

function Sidebar() {
  const { profile, loadingProfile } = useContext(UserContext);
  const { isCollapsed } = useContext(SidebarContext);
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
