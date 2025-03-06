// NotifyForm.jsx
import React, { useState } from 'react';
// Remove direct axios import
import { subscribeEmail } from '../api'; // Make sure path is correct

function NotifyForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // This calls src/api.js -> subscribeEmail(email)
      await subscribeEmail(email);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Subscription failed:', err);
      setError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div>
      {submitted ? (
        <p>Thank you! We will notify you when we launch.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Get Notified</button>
          {error && <p>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default NotifyForm;
