import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import styles from "./VerifyAccount.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCircleNotch,
  faCheckCircle,
  faTriangleExclamation,
  faArrowRightToBracket,
  faHome,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

/** MIC message modal (local, single-file solution) */
function MicMessageModal({
  isOpen,
  variant = "info", // "info" | "success" | "error"
  title,
  message,
  confirmText = "OK",
  onClose,
  closeOnOverlay = true,
}) {
  if (!isOpen) return null;

  const icon =
    variant === "success"
      ? faCheckCircle
      : variant === "error"
      ? faTriangleExclamation
      : faEnvelope;

  return (
    <div
      className={styles.micMsgOverlay}
      onClick={() => closeOnOverlay && onClose?.()}
      role="presentation"
    >
      <div
        className={styles.micMsgCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mic-msg-title"
      >
        <div className={styles.micMsgHeader}>
          <div>
            <div className={styles.micMsgEyebrow}>Map in Color</div>
            <h2 id="mic-msg-title" className={styles.micMsgTitle}>
              {title}
            </h2>
            {message ? <p className={styles.micMsgSubtitle}>{message}</p> : null}
          </div>

          <button
            type="button"
            className={styles.micMsgClose}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className={styles.micMsgBody}>
          <div className={`${styles.iconWrap} ${styles[variant]}`}>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
          </div>

          <div className={styles.micMsgActions}>
            <button
              type="button"
              className={styles.micMsgPrimary}
              onClick={onClose}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = useMemo(() => location.state?.email || "", [location.state]);

  const [loading, setLoading] = useState(false);

  // modal state
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgVariant, setMsgVariant] = useState("info");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgText, setMsgText] = useState("");

  const openMsg = (variant, title, text) => {
    setMsgVariant(variant);
    setMsgTitle(title);
    setMsgText(text);
    setMsgOpen(true);
  };

  const handleResendClick = async () => {
    if (!email) {
      openMsg(
        "error",
        "No email available",
        "We didn’t receive an email from signup. Please go to signup again, or contact support@mapincolor.com."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/resend-verification", { email });

      openMsg(
        "success",
        "Verification email resent",
        "Check your inbox (and spam folder). The link may take a minute to arrive."
      );
    } catch (err) {
      console.error("Error resending verification:", err);

      const serverMsg = err?.response?.data?.msg;
      openMsg(
        "error",
        "Couldn’t resend email",
        serverMsg ||
          "Please try again in a moment. If it keeps failing, contact support@mapincolor.com."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* MIC message modal */}
      <MicMessageModal
        isOpen={msgOpen}
        variant={msgVariant}
        title={msgTitle}
        message={msgText}
        confirmText="Got it"
        onClose={() => setMsgOpen(false)}
      />

      {/* Top-left home button (same vibe as login/signup) */}
      <button onClick={() => navigate("/")} className={styles.goBackButton}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* Left brand side */}
      <div className={styles.leftSide}>
        <div className={styles.brandContainer}>
          <img
            src="/assets/map-in-color-logo.png"
            alt="Map in Color Logo"
            className={styles.logo}
          />
          <h1 className={styles.brandText}>Map in Color</h1>
        </div>
      </div>

      {/* Right content side */}
      <div className={styles.rightSide}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconPill}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <h2 className={styles.title}>Verify your account</h2>
            <p className={styles.subtitle}>
              We sent a verification link to{" "}
              <strong>{email || "your email address"}</strong>.
              <br />
              Check your inbox and spam folder.
            </p>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={handleResendClick}
                disabled={!email || loading}
                type="button"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className={styles.spinner}
                    />
                    Resending…
                  </>
                ) : (
                  "Resend verification email"
                )}
              </button>

              <button
                className={styles.secondaryBtn}
                type="button"
                onClick={() => navigate("/login")}
              >
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                Go to login
              </button>
            </div>

            <div className={styles.helper}>
              Didn’t sign up with this email?{" "}
              <Link to="/signup" className={styles.linkLike}>
                Go back to signup
              </Link>
              .
            </div>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.footerHint}>
              Once verified, you can log in and start creating maps.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
