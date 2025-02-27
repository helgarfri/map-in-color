// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.log('Token is invalid');
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
