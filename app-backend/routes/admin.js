// routes/admin.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');
// (Or possibly a custom isAdmin middleware)

router.get('/reports', auth, async (req, res) => {
  try {
    // 1) Check if the user is an admin or mod
    // e.g. if (!req.user.is_admin) return res.status(403).json({ msg: 'Forbidden' });

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
      reported_user:users!profile_reports_reported_user_id_fkey (
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
    console.error('Error fetching reports:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/reports/:report_id/approve', auth, async (req, res) => {
  try {
    // Possibly check if user is admin
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the report
    const { data: report, error: repErr } = await supabaseAdmin
      .from('comment_reports')
      .select('id, comment_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    // 2) Mark report status "closed" (or "approved")
    const { error: updErr } = await supabaseAdmin
      .from('comment_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) “Unhide” the comment
    //    (only if your policy is to restore the comment rather than keep it hidden)
    const { error: comErr } = await supabaseAdmin
      .from('comments')
      .update({ status: 'visible' })
      .eq('id', report.comment_id);
    if (comErr) throw comErr;

    return res.json({ msg: 'Comment re-approved' });
  } catch (err) {
    console.error('Error approving comment:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/reports/:report_id/delete', auth, async (req, res) => {
  try {
    // Possibly check if user is admin
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the report
    const { data: report, error: repErr } = await supabaseAdmin
      .from('comment_reports')
      .select('id, comment_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    // 2) Mark report status "closed"
    const { error: updErr } = await supabaseAdmin
      .from('comment_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Permanently delete the comment
    const { error: delErr } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', report.comment_id);
    if (delErr) throw delErr;

    return res.json({ msg: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// routes/admin.js

router.get('/profile-reports', auth, async (req, res) => {
  try {
    // Check if user is admin, etc.

    // Fetch all pending profile reports
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
router.post('/profile-reports/:report_id/approve', auth, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the report
    const { data: report, error: repErr } = await supabaseAdmin
      .from('profile_reports')
      .select('id, reported_user_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    // 2) Mark the report "closed" or "approved"
    const { error: updErr } = await supabaseAdmin
      .from('profile_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Optionally “restore” the user’s status if it was set to 'flagged'
    // or do nothing if you only do manual admin actions
    // e.g.:
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
 * "Delete" or "Ban" the user’s profile
 */
router.post('/profile-reports/:report_id/ban', auth, async (req, res) => {
  try {
    const reportId = parseInt(req.params.report_id, 10);

    // 1) fetch the report
    const { data: report, error: repErr } = await supabaseAdmin
      .from('profile_reports')
      .select('id, reported_user_id')
      .eq('id', reportId)
      .maybeSingle();
    if (repErr) throw repErr;
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    // 2) Mark report status “closed”
    const { error: updErr } = await supabaseAdmin
      .from('profile_reports')
      .update({ status: 'closed' })
      .eq('id', reportId);
    if (updErr) throw updErr;

    // 3) Ban or remove the user entirely:
    //    - For “soft ban”, set "status" = "banned"
    //    - For “hard delete”, remove them from “users” table
    // Example: “soft ban” approach
    const { error: banErr } = await supabaseAdmin
      .from('users')
      .update({ status: 'banned' })
      .eq('id', report.reported_user_id);
    if (banErr) throw banErr;

    return res.json({ msg: 'User banned successfully' });
  } catch (err) {
    console.error('Error banning user:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
