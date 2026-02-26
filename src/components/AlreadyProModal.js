import React from "react";
import { createPortal } from "react-dom";
import styles from "./ComingSoonProModal.module.css";

export default function AlreadyProModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    onClose?.();
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="already-pro-title"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="already-pro-title" className={styles.title}>
            You're already Pro
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>
            You already have a Pro subscription. You can manage it from your account settings.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
