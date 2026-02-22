import React from "react";
import styles from "./ProBadge.module.css";

/**
 * Renders the PRO logo badge. Only renders when show is true.
 * @param {boolean} show - Whether to show the badge
 * @param {"default"|"small"} size - Badge size (default for profile/header, small for comments/chips)
 */
export default function ProBadge({ show, size = "default" }) {
  if (!show) return null;
  return (
    <span
      className={size === "small" ? styles.wrapSmall : styles.wrap}
      title="Pro member"
    >
      <img
        src="/assets/3-0/PRO-logo.png"
        alt="Pro"
        className={styles.img}
      />
    </span>
  );
}

/** Helper: true if user object has pro plan (from API) */
export function isProUser(user) {
  if (!user) return false;
  if (user.is_pro === true) return true;
  return String(user.plan || "").toLowerCase() === "pro";
}
