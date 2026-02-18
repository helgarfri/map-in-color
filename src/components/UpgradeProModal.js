import React from "react";
import { createPortal } from "react-dom";
import styles from "./UpgradeProModal.module.css";

const PRO_LOGO_SRC = "/assets/3-0/PRO-logo.png";
const PRO_PRICE = "4.99";

const BENEFITS = [
  "Remove the Map in Color watermark",
  "High-quality exports (max JPG quality)",
  "Transparent PNG exports",
  "SVG export (scalable vector)",
  "Interactive embeds without branding",
  "Custom embed controls",
  "Priority feature updates",
];

export default function UpgradeProModal({
  isOpen,
  onClose,
  onUpgrade,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    onClose?.();
  };

  const handleUpgrade = () => {
    onUpgrade?.();
    onClose?.();
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-pro-title"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <img
            className={styles.logo}
            src={PRO_LOGO_SRC}
            alt="Map in Color Pro"
          />
          <div className={styles.headerText}>
            <h2 id="upgrade-pro-title" className={styles.title}>
              Upgrade to Map in Color Pro
            </h2>
            <p className={styles.subtitle}>
            Turn your maps into professional visuals.
            </p>
          </div>
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
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>With Pro you get:</h3>
            <ul className={styles.benefitsList}>
              {BENEFITS.map((text, i) => (
                <li key={i} className={styles.benefitItem}>
                  <span className={styles.check} aria-hidden="true">✔</span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <p className={styles.hook}>
              You've already built something worth sharing.
              <br />
              Now make it look professional.
            </p>
          </section>

          <section className={styles.section}>
            <p className={styles.value}>
              Less than a coffee per month.
            </p>
            <p className={styles.trust}>
              No contracts. Cancel anytime.
            </p>
          </section>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleUpgrade}
          >
            Upgrade to Pro
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Maybe later
          </button>
          <p className={styles.priceNote}>
            ${PRO_PRICE}/month
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
