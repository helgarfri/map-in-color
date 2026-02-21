import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignupPromptModal.module.css";

const ACTIONS = {
  star: {
    eyebrow: "Save favorites",
    title: "Sign in to star this map",
    subtitle:
      "Create a free account to star maps, follow creators, and find them later in your dashboard.",
    badge: "⭐",
  },
  comment: {
    eyebrow: "Join the discussion",
    title: "Sign in to comment",
    subtitle:
      "Join the community to share your thoughts and ask questions on this map.",
    badge: "💬",
  },
  reply: {
    eyebrow: "Reply",
    title: "Sign in to reply",
    subtitle: "Create an account or log in to reply to this comment.",
    badge: "↩",
  },
  like: {
    eyebrow: "Engage",
    title: "Sign in to like or react",
    subtitle: "Log in to like comments and join the conversation.",
    badge: "👍",
  },
  download: {
    eyebrow: "Download",
    title: "Sign in to download",
    subtitle: "Create a free account to download map data and assets.",
    badge: "⬇",
  },
  share: {
    eyebrow: "Share",
    title: "Sign in to share",
    subtitle: "Create a free account to share this map with others.",
    badge: "🔗",
  },
  profile: {
    eyebrow: "Creator",
    title: "Sign in to view profiles",
    subtitle: "Create an account to explore creator profiles and their maps.",
    badge: "👤",
  },
  default: {
    eyebrow: "Map in Color",
    title: "Sign in to get the most out of maps",
    subtitle:
      "Join a worldwide community creating and exploring meaningful maps. Star favorites, comment, and download data.",
    badge: "🗺",
  },
};

export default function SignupPromptModal({ isOpen, onClose, action = "default" }) {
  const navigate = useNavigate();
  const cancelRef = useRef(null);
  const config = ACTIONS[action] || ACTIONS.default;

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus?.();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goToLogin = () => {
    onClose?.();
    navigate("/login");
  };

  const goToSignup = () => {
    onClose?.();
    navigate("/signup");
  };

  return (
    <div
      className={styles.overlay}
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-prompt-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.badge} aria-hidden="true">
            {config.badge}
          </div>
          <div className={styles.headerText}>
            <div className={styles.eyebrow}>{config.eyebrow}</div>
            <h2 id="signup-prompt-title" className={styles.title}>
              {config.title}
            </h2>
            <p className={styles.subtitle}>{config.subtitle}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            ref={cancelRef}
            className={styles.cancelPill}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.secondaryPill}
            onClick={goToLogin}
          >
            Log in
          </button>
          <button
            type="button"
            className={styles.primaryPill}
            onClick={goToSignup}
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
