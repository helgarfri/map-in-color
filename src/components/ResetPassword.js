// src/pages/ResetPassword.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import styles from "../components/Login.module.css";
import { resetPassword } from "../api";

function PasswordRequirement({ text, isValid }) {
  return (
    <div className={styles.pwReqItem}>
      <span className={`${styles.pwDot} ${isValid ? styles.pwValid : styles.pwInvalid}`} />
      <span>{text}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  // same validation rules as backend
  const isLongEnough = newPassword.length >= 6;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!?.#]/.test(newPassword);
  const passwordsMatch = newPassword === confirm && newPassword !== "";

  const isPasswordValid =
    isLongEnough && hasUpperCase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!token) return setErr("Missing token. Please request a new reset link.");

    // show specific guidance instead of generic error
    if (!isLongEnough || !hasUpperCase || !hasNumber || !hasSpecial) {
      return setErr("Password does not meet the requirements below.");
    }
    if (!passwordsMatch) return setErr("Passwords do not match.");

    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (e2) {
      const msg = e2?.response?.data?.msg || "Something went wrong. Try again.";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      <div className={styles.rightSide} style={{ width: "100%" }}>
        <div className={`${styles.loginBox} ${styles.resetBox}`} style={{ maxWidth: 520 }}>
          <h2 className={styles.loginTitle}>
            {done ? "Password updated" : "Reset password"}
          </h2>

          {!token && (
            <p className={styles.loginSubtitle}>
              This link is missing a token. Go back and request a new reset email.
            </p>
          )}

          {done ? (
            <p className={styles.loginSubtitle}>
              You can now log in with your new password. Redirecting…
            </p>
          ) : (
            <>
              <p className={styles.loginSubtitle}>
                Choose a strong password. It must meet all requirements below.
              </p>

              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label>New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className={styles.pwReqGrid}>
                  <PasswordRequirement text="At least 6 characters" isValid={isLongEnough} />
                  <PasswordRequirement text="One uppercase letter" isValid={hasUpperCase} />
                  <PasswordRequirement text="One number" isValid={hasNumber} />
                  <PasswordRequirement text="One special (! ? . #)" isValid={hasSpecial} />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className={styles.pwMatchRow}>
                  <span className={`${styles.pwDot} ${passwordsMatch ? styles.pwValid : styles.pwInvalid}`} />
                  <span>Passwords match</span>
                </div>

                {err && <p className={styles.resetError}>{err}</p>}

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={submitting || !token || !newPassword || !confirm}
                >
                  {submitting ? "Updating…" : "Set new password"}
                </button>
              </form>

              <p className={styles.loginFooter}>
                <Link to="/login">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
