// middleware/auth.js
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

async function auth(req, res, next) {
  // If the request is for verification route, skip token check
  // e.g. if your verify route is /api/auth/verify/:token
  if (req.path.startsWith('/api/auth/verify')) {
    return next();
  }

  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify the JWT from the header
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the user from DB
    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select('id, status')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user in auth middleware:', error);
      return res.status(500).json({ msg: 'Server error fetching user' });
    }

    if (!userRow) {
      return res.status(401).json({ msg: 'User not found' });
    }

    if (userRow.status === 'banned') {
      console.log(`Banned user attempted to access: ID ${userRow.id}`);
      return res.status(403).json({ msg: 'Your account is banned.' });
    }

    // Attach user to req & continue
    req.user = { id: userRow.id };
    next();
  } catch (err) {
    console.log('Token is invalid', err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
