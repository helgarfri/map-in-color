import React from "react";
import { createPortal } from "react-dom";
import styles from "./ProThankYouModal.module.css";

export default function ProThankYouModal({ isOpen, onClose }) {
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
      aria-labelledby="pro-thank-you-title"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <span className={styles.checkIcon} aria-hidden="true">✓</span>
          </div>
          <h2 id="pro-thank-you-title" className={styles.title}>
            Thank you for going Pro
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
            You now have access to watermark-free exports, high-quality downloads, SVG export, and unbranded embeds. Enjoy the full Map in Color experience.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
