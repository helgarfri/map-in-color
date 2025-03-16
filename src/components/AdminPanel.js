// AdminPanel.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
// We'll create these new API helpers below
import { fetchPendingReports, approveReport, deleteReport } from '../api';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useContext(UserContext); // assume this has user info {id, username,...}
  const navigate = useNavigate();

  // 1) Check if the user is the admin (id=28). If not, redirect or show error.
  useEffect(() => {
    if (!profile) return;
    if (profile.id !== 28) {
      // If not me, redirect to home or show a 403 message
      navigate('/');
    }
  }, [profile, navigate]);

  // 2) Fetch pending reports
  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        const res = await fetchPendingReports();
        // res.data => array of pending reports
        setReports(res.data);
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  // 3) Approve
  async function handleApprove(reportId) {
    try {
      await approveReport(reportId);
      // Remove from local list
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error approving report:', err);
    }
  }

  // 4) Delete
  async function handleDelete(reportId) {
    try {
      await deleteReport(reportId);
      // Remove from local list
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading reports...</div>;
  }

  return (
    <div className={styles.adminPanelContainer}>
      <h1>Admin Panel - Pending Reports</h1>
      {reports.length === 0 ? (
        <p>No pending reports.</p>
      ) : (
        <table className={styles.reportsTable}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Comment ID</th>
              <th>Reported By</th>
              <th>Comment Author</th>
              <th>Comment Content</th>
              <th>Reasons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((rep) => (
              <tr key={rep.id}>
                <td>{rep.id}</td>
                <td>{rep.comment_id}</td>
                <td>{rep.reported_by}</td>
                <td>{rep.comments?.user_id}</td>
                <td>{rep.comments?.content}</td>
                <td>{(rep.reasons || []).join(', ')}</td>
                <td>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(rep.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(rep.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
