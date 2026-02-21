import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Verified.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHome, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Verified() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* top-left home button (same vibe as login/signup) */}
      <button onClick={() => navigate("/")} className={styles.goBackButton} type="button" aria-label="Home">
        <FontAwesomeIcon icon={faHome} />
      </button>

      <div className={styles.card} role="status" aria-live="polite">
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>

          <div className={styles.eyebrow}>Map in Color</div>
          <h1 className={styles.title}>Account verified</h1>
          <p className={styles.subtitle}>
            Your account has been successfully verified. You can now log in and start using Map in Color.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={styles.primaryBtn}>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Go to login
          </Link>

          <button className={styles.secondaryBtn} type="button" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            If you run into issues, contact support@mapincolor.com.
          </span>
        </div>
      </div>
    </div>
  );
}
