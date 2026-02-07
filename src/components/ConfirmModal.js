import React, { useEffect, useRef } from "react";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  closeOnOverlay = true,
  danger = false,
}) {
  const cancelRef = useRef(null);
  const lastActiveElRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // remember focus + focus cancel by default (safer)
    lastActiveElRef.current = document.activeElement;
    cancelRef.current?.focus?.();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") {
        // avoid Enter triggering confirm accidentally while user just wants close
        // only confirm if focus is on confirm button
        const active = document.activeElement;
        if (active?.dataset?.role === "confirm") onConfirm?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      // restore focus
      lastActiveElRef.current?.focus?.();
    };
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => closeOnOverlay && onCancel?.()}
      role="presentation"
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.badge} data-danger={danger ? "1" : "0"} aria-hidden="true">
            {danger ? "!" : "?"}
          </div>

          <div className={styles.headerText}>
            <div className={styles.eyebrow}>{danger ? "Confirm action" : "Confirmation"}</div>
            <h2 id="confirm-modal-title" className={styles.title}>
              {title}
            </h2>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onCancel}
            aria-label="Close"
            title="Close"
          >
            &times;
          </button>
        </div>

        <div className={styles.body}>
          {typeof message === "string" ? (
            <p id="confirm-modal-message" className={styles.message}>
              {message}
            </p>
          ) : (
            <div id="confirm-modal-message" className={styles.message}>
              {message}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            ref={cancelRef}
            type="button"
            className={`${styles.actionPill} ${styles.cancelPill}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            data-role="confirm"
            className={`${styles.actionPill} ${danger ? styles.dangerPill : styles.primaryPill}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
