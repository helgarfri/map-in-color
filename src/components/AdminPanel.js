// AdminPanel.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import {
  // For comment reports
  fetchPendingReports,
  approveReport,
  deleteReport,
  // For profile reports
  fetchPendingProfileReports,
  approveProfileReport,
  banProfileReport
} from '../api';

import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  // We store comment vs. profile reports in separate arrays
  const [commentReports, setCommentReports] = useState([]);
  const [profileReports, setProfileReports] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useContext(UserContext);
  const navigate = useNavigate();

  // Check if current user is admin => if not, redirect or show error
  useEffect(() => {
    if (!profile) return;
    if (profile.id !== 2) {
      navigate('/'); // or show a 403 message
    }
  }, [profile, navigate]);

  // Fetch both comment + profile reports in one go
  useEffect(() => {
    async function loadAllReports() {
      setIsLoading(true);
      try {
        // 1) Load comment reports
        const resComments = await fetchPendingReports();
        setCommentReports(resComments.data);

        // 2) Load profile reports
        const resProfiles = await fetchPendingProfileReports();
        setProfileReports(resProfiles.data);
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllReports();
  }, []);

  // Handlers for COMMENT reports
  async function handleApproveComment(reportId) {
    try {
      await approveReport(reportId);
      // Remove from local state
      setCommentReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error approving comment report:', err);
    }
  }

  async function handleDeleteComment(reportId) {
    try {
      await deleteReport(reportId);
      // Remove from local state
      setCommentReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error deleting comment report:', err);
    }
  }

  // Handlers for PROFILE reports
  async function handleApproveProfile(reportId) {
    try {
      await approveProfileReport(reportId);
      // Remove from local state
      setProfileReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error approving profile report:', err);
    }
  }

  async function handleBanProfile(reportId) {
    try {
      await banProfileReport(reportId);
      // Remove from local state
      setProfileReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error banning user:', err);
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading reports...</div>;
  }

  return (
    <div className={styles.adminPanelContainer}>
      <h1>Admin Panel - Pending Reports</h1>

      {/* COMMENT REPORTS TABLE */}
      <h2>Comment Reports</h2>
      {commentReports.length === 0 ? (
        <p>No pending comment reports.</p>
      ) : (
        <table className={styles.reportsTable}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Comment ID</th>
              <th>Reported By</th>
              <th>Comment Author</th>
              <th>Content</th>
              <th>Reasons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commentReports.map((rep) => (
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
                    onClick={() => handleApproveComment(rep.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteComment(rep.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PROFILE REPORTS TABLE */}
      <h2>Profile Reports</h2>
      {profileReports.length === 0 ? (
        <p>No pending profile reports.</p>
      ) : (
        <table className={styles.reportsTable}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported User</th>
              <th>Reported By</th>
              <th>Reasons</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileReports.map((rep) => (
              <tr key={rep.id}>
                <td>{rep.id}</td>
                <td>{rep.reported_user?.username} (ID: {rep.reported_user_id})</td>
                <td>{rep.reported_by}</td>
                <td>{(rep.reasons || []).join(', ')}</td>
                <td>{rep.details}</td>
                <td>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApproveProfile(rep.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleBanProfile(rep.id)}
                  >
                    Ban
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
