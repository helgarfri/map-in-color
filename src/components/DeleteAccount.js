import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteAccount.module.css';
import { deleteUserAccount } from '../api';

export default function DeleteAccount() {
  const [selectedReason, setSelectedReason] = useState('');
  const [checked, setChecked] = useState(false);
  const [improveText, setImproveText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  const handleDeleteForever = async () => {
    if (!selectedReason) {
      alert('Please select a reason for deleting your account.');
      return;
    }
    if (!checked) {
      alert('You must confirm that you understand data deletion is permanent.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserAccount({ reason: selectedReason, feedback: improveText });
      localStorage.removeItem('token');
      setIsDeleting(false);
      setDeleteSuccess(true);
    } catch (err) {
      console.error('Error deleting account:', err);
      setIsDeleting(false);
      alert('There was a problem deleting your account.');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleKeepData = () => {
    navigate('/settings');
  };

  const reasons = [
    "I don't use my account enough",
    "I have another account",
    "I don't like Map in Color",
    "I have privacy concerns",
    "Other",
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Sorry to see you go</h1>
            <p className={styles.subtitle}>
              Please let us know why you&apos;re deleting your account:
            </p>
          </div>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <div className={styles.reasonList}>
              {reasons.map((reason) => (
                <label key={reason} className={styles.reasonItem}>
                  <span className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className={styles.radio}
                    />
                    <span className={styles.radioText}>{reason}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>How can we improve?</h3>
            <textarea
              className={styles.textarea}
              value={improveText}
              onChange={(e) => setImproveText(e.target.value)}
              rows={4}
              placeholder="Let us know what we could do better..."
            />
            <p className={styles.optionalHint}>Optional</p>
          </section>

          <section className={styles.section}>
            <p className={styles.warning}>All your data will be lost forever.</p>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <span className={styles.checkboxText}>
                I understand that my data will be lost forever
              </span>
            </label>
          </section>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleDeleteForever}
            disabled={isDeleting}
          >
            Delete Forever
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleKeepData}
            disabled={isDeleting}
          >
            Keep My Data
          </button>
        </div>
      </div>

      {/* Loading modal */}
      {isDeleting && (
        <div className={styles.overlay} role="status" aria-live="polite" aria-busy="true">
          <div className={styles.overlayModal}>
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <p className={styles.loadingText}>Deleting your account</p>
            <p className={styles.loadingSubtext}>This may take a moment…</p>
          </div>
        </div>
      )}

      {/* Success confirmation modal */}
      {deleteSuccess && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="delete-success-title">
          <div className={styles.overlayModal}>
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h2 id="delete-success-title" className={styles.successTitle}>Account deleted</h2>
            <p className={styles.successSubtext}>
              Your account and data have been permanently removed. Thank you for using Map in Color.
            </p>
            <button
              type="button"
              className={styles.successBtn}
              onClick={handleBackToHome}
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
