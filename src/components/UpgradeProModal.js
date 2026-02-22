import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./UpgradeProModal.module.css";
import ComingSoonProModal from "./ComingSoonProModal";
import { openProCheckout } from "../utils/paddleCheckout";

const PRO_LOGO_SRC = "/assets/3-0/PRO-logo.png";
const PRO_PRICE = "4.99";

const BENEFITS = [
  "Remove the Map in Color watermark",
  "High-quality exports (max JPG quality)",
  "Transparent PNG exports",
  "SVG export (scalable vector)",
  "Interactive embeds without branding",
  "Private embeds for internal use",
  "Priority feature updates",
];

export default function UpgradeProModal({
  isOpen,
  onClose,
  onUpgrade,
  /** Optional: our user id for webhook (logged-in user) */
  passthroughUserId,
  /** Optional: prefill checkout email */
  passthroughEmail,
  /** Optional: called after checkout completes so parent can refetch profile */
  onProfileRefresh,
}) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    onClose?.();
  };

  const handleUpgrade = async () => {
    const result = await openProCheckout(passthroughUserId, passthroughEmail, onProfileRefresh).catch(() => ({ opened: false }));
    if (result.opened) {
      onClose?.();
    } else if (result.reason === "not_configured") {
      setShowComingSoon(true);
    }
  };

  const handleComingSoonClose = () => {
    setShowComingSoon(false);
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
              Publish without Map in Color branding.
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
              You've built something worth sharing.
              <br />
              Now publish it professionally.
            </p>
          </section>

          <section className={styles.section}>
            <p className={styles.priceLine}>
              ${PRO_PRICE}/month
            </p>
            <p className={styles.trust}>
              Cancel anytime. Subscription auto-renews unless cancelled.
            </p>
            <a
              href="/refund"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.refundLink}
            >
              Refund policy
            </a>
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
          <a
            href="/pro"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learnMoreLink}
          >
            Learn more about Pro
          </a>
        </div>
      </div>

      <ComingSoonProModal
        isOpen={showComingSoon}
        onClose={handleComingSoonClose}
      />
    </div>,
    document.body
  );
}
