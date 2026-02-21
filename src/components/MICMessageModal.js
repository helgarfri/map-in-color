// src/components/MICMessageModal.js
import React, { useEffect } from "react";
import styles from "./MICMessageModal.module.css";

export default function MICMessageModal({
  isOpen,
  variant = "info", // "error" | "info" | "success"
  title = "Notice",
  message = "",
  details = null,
  confirmText = "OK",
  onClose,
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={() => closeOnOverlay && onClose?.()}
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mic-msg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              {variant === "error"
                ? "Something went wrong"
                : variant === "success"
                ? "Success"
                : "Info"}
            </div>
            <h2 id="mic-msg-title" className={styles.title}>
              {title}
            </h2>
            {message ? <p className={styles.subtitle}>{message}</p> : null}
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {details ? <div className={styles.details}>{details}</div> : null}

          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
