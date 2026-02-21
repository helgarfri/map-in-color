// src/components/FullScreenLoader.js
import React from "react";
import styles from "./FullScreenLoader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function FullScreenLoader({
  eyebrow = "Loading",
  title = "Loading your profile…",
  subtitle = "This usually takes a couple seconds.",
}) {
  return (
    <div className={styles.micModalOverlay} role="presentation">
      <div
        className={styles.micModalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fs-loader-title"
      >
        <div className={styles.micModalHeader}>
          <div>
            <div className={styles.micModalEyebrow}>{eyebrow}</div>
            <h2 id="fs-loader-title" className={styles.micModalTitle}>
              {title}
            </h2>
            <p className={styles.micModalSubtitle}>{subtitle}</p>
          </div>
        </div>

        <div className={styles.micModalBody}>
          <div className={styles.loaderRow}>
            <FontAwesomeIcon icon={faCircleNotch} className={styles.loaderIcon} />
            <span className={styles.loaderText}>Please wait</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFillIndeterminate} />
          </div>
        </div>
      </div>
    </div>
  );
}
