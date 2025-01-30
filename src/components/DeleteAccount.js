import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteAccount.module.css'; 
import { deleteUserAccount } from '../api';

export default function DeleteAccount() {
  const [selectedReason, setSelectedReason] = useState('');
  const [checked, setChecked] = useState(false);
  const [improveText, setImproveText] = useState(''); // NEW: for user feedback
  const navigate = useNavigate();

  const handleDeleteForever = async () => {
    // Ensure user has chosen a reason
    if (!selectedReason) {
      alert('Please select a reason for deleting your account.');
      return;
    }
    // Ensure user has acknowledged permanent loss
    if (!checked) {
      alert('You must confirm that you understand data deletion is permanent.');
      return;
    }

    try {
      // Optionally pass both reason and improveText to your API if needed
      await deleteUserAccount({ reason: selectedReason, feedback: improveText });
      localStorage.removeItem('token');

      alert('Account deleted successfully.');
      navigate('/'); // redirect to home or any page
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('There was a problem deleting your account.');
    }
  };

  const handleKeepData = () => {
    navigate('/settings');
  };

  // Show a feedback input if user has selected ANY reason
  const showFeedbackInput = !!selectedReason;

  return (
    <div className={styles.deleteContainer}>
      <h1 className={styles.heading}>
        Sorry to see you go 
        <span className={styles.brokenHeart}> 💔</span>
      </h1>

      <p className={styles.subheading}>
        Please let us know why you&apos;re deleting your account:
      </p>

      <div className={styles.reasonList}>
        <label className={styles.reasonItem}>
          <input
            type="radio"
            name="reason"
            value="I don't use my account enough"
            onChange={(e) => setSelectedReason(e.target.value)}
          />
          I don’t use my account enough
        </label>

        <label className={styles.reasonItem}>
          <input
            type="radio"
            name="reason"
            value="I have another account"
            onChange={(e) => setSelectedReason(e.target.value)}
          />
          I have another account
        </label>

        <label className={styles.reasonItem}>
          <input
            type="radio"
            name="reason"
            value="I don’t like Map in Color"
            onChange={(e) => setSelectedReason(e.target.value)}
          />
          I don’t like Map in Color
        </label>

        <label className={styles.reasonItem}>
          <input
            type="radio"
            name="reason"
            value="I have privacy concerns"
            onChange={(e) => setSelectedReason(e.target.value)}
          />
          I have privacy concerns
        </label>

        <label className={styles.reasonItem}>
          <input
            type="radio"
            name="reason"
            value="Other"
            onChange={(e) => setSelectedReason(e.target.value)}
          />
          Other
        </label>
      </div>

      {showFeedbackInput && (
        <div className={styles.feedbackContainer}>
          <label className={styles.feedbackLabel}>
            How can we improve?
          </label>
          <textarea
            className={styles.feedbackTextarea}
            value={improveText}
            onChange={(e) => setImproveText(e.target.value)}
            rows="4"
            placeholder="Let us know what we could do better..."
          />
        </div>
      )}

      <p className={styles.warningText}>
        All your data will be lost forever.
      </p>

      <div className={styles.checkboxContainer}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          &nbsp;I understand that my data will be lost forever
        </label>
      </div>

      <div className={styles.buttonsContainer}>
        <button
          className={styles.deleteForeverButton}
          onClick={handleDeleteForever}
        >
          Delete Forever
        </button>
        <button 
          className={styles.keepDataButton} 
          onClick={handleKeepData}
        >
          Keep My Data
        </button>
      </div>
    </div>
  );
}
