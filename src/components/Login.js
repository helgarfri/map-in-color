// Login.js
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import { logIn, requestPasswordReset } from "../api"; // ✅ add this
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTriangleExclamation, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const { setAuthToken, authToken, loadingProfile } = useContext(UserContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);
  // error modal
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("Login failed");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState(null);

  // ✅ NEW: show support hint
  const [showSupportContact, setShowSupportContact] = useState(false);

  const openError = ({
    title,
    message,
    onCloseNavigateTo = null,
    showSupport = false, // ✅ NEW
  }) => {
    setErrorTitle(title || "Login failed");
    setErrorMessage(message || "Something went wrong. Please try again.");
    setErrorAction(onCloseNavigateTo);
    setShowSupportContact(!!showSupport); // ✅ NEW
    setErrorOpen(true);
  };

  const closeError = () => {
    setErrorOpen(false);
    const target = errorAction;
    setErrorAction(null);
    setShowSupportContact(false); // ✅ NEW reset
    if (target) navigate(target);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 10000)
    );

    try {
      const res = await Promise.race([logIn({ identifier, password }), timeout]);
      const token = res.data.token;

      localStorage.setItem("token", token);
      setAuthToken(token);
    } catch (err) {
      console.error("Login Error:", err);

      if (err.message === "timeout") {
        openError({
          title: "Server timed out",
          message: "The server didn’t respond within 10 seconds. Please try again in a moment.",
        });
      } else if (err.response) {
        const serverStatus = err.response.status;
        const serverMsg = err.response.data?.msg || "Unknown error";

        if (serverStatus === 403) {
          if (serverMsg === "Your account is banned.") {
            openError({
              title: "Account banned",
              message: "Your account has been banned. You can’t log in.",
              showSupport: true,           // ✅ show support line
              onCloseNavigateTo: null,     // ✅ do NOT navigate
            });

          } else {
            openError({ title: "Access denied", message: serverMsg });
          }
        } else if (serverStatus === 401) {
          openError({
            title: "Incorrect login",
            message: "The email/username or password is incorrect.",
          });
        } else {
          openError({ title: "Server error", message: serverMsg });
        }
      } else if (err.request) {
        openError({
          title: "No response",
          message: "We couldn’t reach the server. Check your connection and try again.",
        });
      } else {
        openError({ title: "Unexpected error", message: err.message });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const location = useLocation();
  const returnTo = location.state?.returnTo;

  useEffect(() => {
    if (authToken && !loadingProfile) {
      navigate(returnTo || "/dashboard", { replace: true });
    }
  }, [authToken, loadingProfile, navigate, returnTo]);

  return (
    <div className={styles.splitContainer}>
      {/* ✅ Reset password modal MUST be inside return */}
      {showResetModal && (
        <ResetPasswordRequestModal onClose={() => setShowResetModal(false)} />
      )}

      {/* ✅ MIC logging modal */}
      {isLoggingIn && (
        <div className={styles.micModalOverlay} role="presentation">
          <div
            className={styles.micModalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logging-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.micModalHeader}>
              <div>
                <div className={styles.micModalEyebrow}>Authentication</div>
                <h2 id="logging-title" className={styles.micModalTitle}>
                  Logging you in…
                </h2>
                <p className={styles.micModalSubtitle}>
                  This usually takes a couple seconds.
                </p>
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
      )}

      {/* ✅ MIC error modal */}
      {errorOpen && (
        <div className={styles.micModalOverlay} onClick={closeError} role="presentation">
          <div
            className={styles.micModalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="error-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.micModalHeader}>
              <div>
                <div className={styles.micModalEyebrow}>Login</div>
                <h2 id="error-title" className={styles.micModalTitle}>
                  {errorTitle}
                </h2>
                  <p className={styles.micModalSubtitle}>{errorMessage}</p>

                  {showSupportContact && (
                    <p className={styles.supportHint}>
                      If you believe this is a mistake, please contact{" "}
                      <a className={styles.supportLink} href="mailto:support@mapincolor.com">
                        support@mapincolor.com
                      </a>
                      .
                    </p>
                  )}
              </div>

              <div className={styles.errorBadge} title="Error">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
            </div>

            <div className={styles.micModalFooter}>
              <button
                type="button"
                className={`${styles.actionPill} ${styles.primaryPill}`}
                onClick={closeError}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/")} className={styles.goBackButton} type="button">
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* Left side */}
      <div className={styles.leftSide}>
        <div className={styles.brandContainer}>
          <img src="/assets/3-0/mic-logo-2-5-text.png" alt="Map in Color Logo" className={styles.logo} />
        </div>
      </div>

      {/* Right side */}
      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Login</h2>
          <p className={styles.loginSubtitle}>Welcome back. Sign in to continue.</p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="identifier">Email or Username</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ✅ put it ABOVE login button */}
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => setShowResetModal(true)}
            >
              Forgot password?
            </button>

            <button type="submit" className={styles.loginButton} disabled={isLoggingIn}>
              Login
            </button>
          </form>

          <p className={styles.loginFooter}>
            Don&rsquo;t have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordRequestModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setErr("");

    setSending(true);
    try {
    await requestPasswordReset(email); 

      setDone(true);
    } catch (e) {
      const msg = e?.response?.data?.msg || "Something went wrong. Please try again.";
      setErr(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.micModalOverlay} onClick={onClose} role="presentation">
      <div
        className={styles.micModalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
      >
        <div className={`${styles.micModalHeader} ${done ? styles.micModalHeaderTight : ""}`}>
          <div>
            <div className={styles.micModalEyebrow}>Password</div>
            <h2 id="reset-title" className={styles.micModalTitle}>
              {done ? "Check your email" : "Reset your password"}
            </h2>
            <p className={styles.micModalSubtitle}>
              {done
                ? "If an account with that email exists, we sent a reset link."
                : "Enter your email and we’ll send a reset link."}
            </p>
          </div>

          {/* clean close button (instead of OK) */}
          {!done && (
            <button type="button" className={styles.modalX} onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
        </div>

     <div className={styles.micModalBody}>
  {done ? (
    <div className={styles.doneBody}>
      <div className={styles.doneIcon}>✓</div>
      <div>
        <div className={styles.doneTitle}>Email sent</div>
        <div className={styles.doneText}>
          Check your inbox for the reset link. It may take a minute.
        </div>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSend} className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="resetEmail">Email</label>
        <input
          id="resetEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {err && <p className={styles.resetError}>{err}</p>}

      <button type="submit" className={styles.loginButton} disabled={sending}>
        {sending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  )}
</div>

{done && (
  <div className={styles.micModalFooter}>
    <button
      type="button"
      className={`${styles.actionPill} ${styles.primaryPill}`}
      onClick={onClose}
    >
      OK
    </button>
  </div>
)}


      </div>
    </div>
  );
}


