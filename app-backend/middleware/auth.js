// middleware/auth.js
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase'); // Make sure you import your supabaseAdmin client

async function auth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
  try {
    // 1) Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2) Fetch the user from DB to see if they're banned
    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select('id, status') // Make sure we fetch 'status'
      .eq('id', decoded.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user in auth middleware:', error);
      return res.status(500).json({ msg: 'Server error fetching user' });
    }
    if (!userRow) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // 3) If user is banned, block them
    if (userRow.status === 'banned') {
      console.log(`Banned user attempted to access: ID ${userRow.id}`);
      return res.status(403).json({ msg: 'Your account is banned.' });
    }

    // 4) Attach user to req & continue
    req.user = { id: userRow.id };
    next();
  } catch (err) {
    console.log('Token is invalid', err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
