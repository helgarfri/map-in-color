import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignupRequiredModal.module.css";

const RETURN_TO_CREATE = "/create";

export default function SignupRequiredModal({ isOpen, onClose, onNavigateToLogin, onNavigateToSignup }) {
  const navigate = useNavigate();
  const cancelRef = useRef(null);

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
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      onClose?.();
      navigate("/login", { state: { returnTo: RETURN_TO_CREATE } });
    }
  };

  const goToSignup = () => {
    if (onNavigateToSignup) {
      onNavigateToSignup();
    } else {
      onClose?.();
      navigate("/signup", { state: { returnTo: RETURN_TO_CREATE } });
    }
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
        aria-labelledby="signup-required-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.badge} aria-hidden="true">
            💾
          </div>
          <div className={styles.headerText}>
            <div className={styles.eyebrow}>Save your map</div>
            <h2 id="signup-required-title" className={styles.title}>
              Sign up to save your map
            </h2>
            <p className={styles.subtitle}>
              Your work is saved on this device. Sign up or log in, then come back to Create to save it to your account.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
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
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
