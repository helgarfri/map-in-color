// middleware/authOptional.js
const jwt = require('jsonwebtoken');

function authOptional(req, res, next) {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (err) {
      // Token is invalid, proceed without setting req.user
    }
  }
  // Proceed regardless of whether authentication succeeded
  next();
}

module.exports = authOptional;
