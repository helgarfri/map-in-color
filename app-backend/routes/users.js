// routes/users.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { passwordRuleFailures } = require('../utils/password');

// Import the service_role client
const { supabaseAdmin } = require('../config/supabase');
const { resend } = require('../config/resend');

/* --------------------------------------------
   DELETE /api/users/deleteAccount
-------------------------------------------- */
router.delete('/deleteAccount', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1) Fetch user from "users"
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .maybeSingle();

    if (userErr) {
      console.error(userErr);
      return res.status(500).json({ msg: 'Server error (fetch user)' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2) Optionally extract "reason" and "feedback"
    const { reason, feedback } = req.body || {};

    // 3) Insert a row in "deletionfeedback" (lowercase)
    const { error: feedErr } = await supabaseAdmin
      .from('deletionfeedback')
      .insert([
        {
          user_id: userRow.id,
          reason,
          feedback,
        },
      ]);
    if (feedErr) {
      console.error(feedErr);
      // not fatal, we can continue
    }

    console.log(
      `User #${userRow.id} is deleting their account.\nReason: ${reason}\nFeedback: ${feedback}`
    );

    // 4) If you want an Activity record for "deleteAccount" if reason is present
    if (reason) {
      await supabaseAdmin.from('activities').insert([
        {
          type: 'deleteAccount',
          user_id: userRow.id,
          mapTitle: null,
          created_at: new Date(),
        },
      ]);
    }

    // 5) Actually delete the user from "users"
    const { error: delErr } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userRow.id);

    if (delErr) {
      console.error('Error deleting user account:', delErr);
      return res.status(500).json({ msg: 'Server error (delete user)' });
    }

    return res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error('Error deleting user account:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   PUT /api/users/change-password
-------------------------------------------- */
router.put('/change-password', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    const fails = passwordRuleFailures(newPassword);
    if (fails.length) {
      return res.status(400).json({
        msg: `New password must contain ${fails.join(', ')}.`,
        code: 'PASSWORD_WEAK',
      });
    }

    // 1) fetch user from "users" (email/first_name for confirmation email)
    const { data: userRow, error: fetchErr } = await supabaseAdmin
      .from('users')
      .select('id, password, email, first_name')
      .eq('id', user_id)
      .maybeSingle();

    if (fetchErr) {
      console.error(fetchErr);
      return res.status(500).json({ msg: 'Error fetching user' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2) compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, userRow.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

    // 3) hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4) update user row
    const { data: updatedUser, error: updateErr } = await supabaseAdmin
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userRow.id)
      .single();

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error updating password' });
    }

    // 5) Send confirmation email (non-blocking; don't fail the request if email fails)
    if (userRow.email) {
      try {
        await resend.emails.send({
          from: 'no-reply@mapincolor.com',
          to: userRow.email,
          subject: 'Your password was changed - Map in Color',
          html: `
            <p>Hello ${userRow.first_name || 'there'},</p>
            <p>This is to confirm that your Map in Color account password was changed successfully.</p>
            <p>If you did not make this change, please contact us or reset your password immediately.</p>
            <p>Cheers,<br/>The Map in Color team</p>
          `,
        });
        console.log(`Password-change confirmation email sent to: ${userRow.email}`);
      } catch (emailErr) {
        console.error('Error sending password-change confirmation email:', emailErr);
      }
    }

    return res.json({ msg: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
