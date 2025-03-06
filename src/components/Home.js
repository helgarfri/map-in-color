import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './Home.module.css';

const TARGET_DATE = new Date('2025-03-24T00:00:00');

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const total = TARGET_DATE - new Date();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      const remaining = getTimeRemaining();
      if (remaining.total <= 0) {
        clearInterval(timerId);
      }
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={styles.countdown}>
      <div className={styles.countItem}>
        <span className={styles.countNumber}>{timeLeft.days}</span>
        <span className={styles.countLabel}>Days</span>
      </div>
      <div className={styles.countItem}>
        <span className={styles.countNumber}>{timeLeft.hours}</span>
        <span className={styles.countLabel}>Hours</span>
      </div>
      <div className={styles.countItem}>
        <span className={styles.countNumber}>{timeLeft.minutes}</span>
        <span className={styles.countLabel}>Minutes</span>
      </div>
      <div className={styles.countItem}>
        <span className={styles.countNumber}>{timeLeft.seconds}</span>
        <span className={styles.countLabel}>Seconds</span>
      </div>
    </div>
  );
}

function TiltImage() {
  return (
    <div className={styles.tiltContainer}>
      <img
        src="/assets/mic_preview.png"
        alt="Map in Color Preview"
        className={styles.tiltImage}
      />
    </div>
  );
}

function NotifyForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Replace '/api/notify' with your actual endpoint for email subscriptions
      await axios.post('http://localhost:5000/api/notify', { email });

      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      setError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className={styles.notifyFormContainer}>
      {submitted ? (
        <p className={styles.successMessage}>
          Thank you! We will notify you when we launch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.notifyForm}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.emailInput}
          />
          <button type="submit" className={styles.submitButton}>
            Get Notified
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <HomeHeader />

      <main className={styles.mainContent}>
        <h2 className={styles.betaNotice}>
          Map in Color v2.0 will launch in:
        </h2>
        <CountdownTimer />

        <div className={styles.previewSection}>
          <TiltImage />
          <NotifyForm />
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
