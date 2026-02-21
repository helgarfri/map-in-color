// routes/admin.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');

/** Require req.user.is_admin (must run after auth). Add column: users.is_admin BOOLEAN DEFAULT false */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.is_admin !== true) {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  next();
}

// =======================
// 1) COMMENT REPORTS
// =======================

// GET /admin/reports => fetch *pending* comment reports
router.get('/reports', auth, requireAdmin, async (req, res) => {
  try {
    // Load all pending comment reports from "comment_reports"
    const { data: reports, error } = await supabaseAdmin
      .from('comment_reports')
      .select(`
        id,
        comment_id,
        reported_by,
        reasons,
        details,
        status,
        created_at,
        updated_at,
        comments (
          content,
          status,
          user_id
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(reports);
  } catch (err) {
    console.error('Error fetching comment reports:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// POST /admin/reports/:report_id/approve => re-approve a comment
router.post('/reports/:report_id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the comment_reports row
    const { data: report, error: repErr } = await supabaseAdmin
      .from('comment_reports')
      .select('id, comment_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) {
      return res.status(404).json({ msg: 'Comment report not found' });
    }

    // 2) Mark report as closed/approved
    const { error: updErr } = await supabaseAdmin
      .from('comment_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Optionally “un-hide” the comment
    const { error: unhideErr } = await supabaseAdmin
      .from('comments')
      .update({ status: 'visible' })
      .eq('id', report.comment_id);
    if (unhideErr) throw unhideErr;

    return res.json({ msg: 'Comment re-approved successfully.' });
  } catch (err) {
    console.error('Error approving comment:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// POST /admin/reports/:report_id/delete => permanently delete the comment
router.post('/reports/:report_id/delete', auth, requireAdmin, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the comment_reports row
    const { data: report, error: repErr } = await supabaseAdmin
      .from('comment_reports')
      .select('id, comment_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) {
      return res.status(404).json({ msg: 'Comment report not found' });
    }

    // 2) Mark the report status to "closed"
    const { error: updErr } = await supabaseAdmin
      .from('comment_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Delete the comment from the DB
    const { error: delErr } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', report.comment_id);
    if (delErr) throw delErr;

    return res.json({ msg: 'Comment deleted successfully.' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// =======================
// 2) PROFILE REPORTS
// =======================

// GET /admin/profile-reports => fetch *pending* profile reports
router.get('/profile-reports', auth, requireAdmin, async (req, res) => {
  try {
    // Load all pending profile reports from "profile_reports"
    const { data: reports, error } = await supabaseAdmin
      .from('profile_reports')
      .select(`
        id,
        reported_user_id,
        reported_by,
        reasons,
        details,
        status,
        created_at,
        updated_at,
        users:reported_user_id ( 
          username,
          email,
          status
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(reports);
  } catch (err) {
    console.error('Error fetching profile reports:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * Approve or "close" a profile report, effectively dismissing it
 */
router.post('/profile-reports/:report_id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the profile_reports row
    const { data: report, error: repErr } = await supabaseAdmin
      .from('profile_reports')
      .select('id, reported_user_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) {
      return res.status(404).json({ msg: 'Profile report not found' });
    }

    // 2) Mark the report "closed" or "approved"
    const { error: updErr } = await supabaseAdmin
      .from('profile_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Optionally revert user status if previously flagged
    // e.g.
    // await supabaseAdmin
    //   .from('users')
    //   .update({ status: 'active' })
    //   .eq('id', report.reported_user_id);

    return res.json({ msg: 'Profile report closed. No action taken on user.' });
  } catch (err) {
    console.error('Error approving profile report:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * "Ban" the user’s profile
 */
router.post('/profile-reports/:report_id/ban', auth, requireAdmin, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the profile_reports row
    const { data: report, error: repErr } = await supabaseAdmin
      .from('profile_reports')
      .select('id, reported_user_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) {
      return res.status(404).json({ msg: 'Profile report not found' });
    }

    // 2) Mark report status “closed”
    const { error: updErr } = await supabaseAdmin
      .from('profile_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) For a “soft ban” => set user.status = 'banned'
    // For “hard delete,” remove them from users table.
    const { error: banErr } = await supabaseAdmin
      .from('users')
      .update({ status: 'banned' })
      .eq('id', report.reported_user_id);
    if (banErr) throw banErr;

    return res.json({ msg: 'User banned successfully.' });
  } catch (err) {
    console.error('Error banning user:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Export the router
module.exports = router;
