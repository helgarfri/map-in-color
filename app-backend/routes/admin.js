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

module.exports = router;
