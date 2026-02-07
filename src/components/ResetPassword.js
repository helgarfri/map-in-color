// src/pages/ResetPassword.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import styles from "../components/Login.module.css"; // reuse your modal/card styles
import { resetPassword } from "../api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!token) {
      setErr("Missing token. Please request a new reset link.");
      return;
    }
    if (newPassword !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

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
        <div className={styles.loginBox} style={{ maxWidth: 520 }}>
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
                Enter a new password for your account.
              </p>

              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label>New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {err && <p className={styles.resetError}>{err}</p>}

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={submitting || !token}
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
