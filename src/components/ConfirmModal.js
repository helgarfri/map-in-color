import React from "react";
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
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => closeOnOverlay && onCancel?.()}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
          &times;
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>

          {typeof message === "string" ? (
            <p className={styles.message}>{message}</p>
          ) : (
            <div className={styles.message}>{message}</div>
          )}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              {cancelText}
            </button>

            <button
              className={`${styles.confirmBtn} ${danger ? styles.danger : ""}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
