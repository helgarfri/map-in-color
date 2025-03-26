require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// If you have an auth middleware:
const auth = require('./middleware/auth');

// Import your routes
const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/maps');
const profileRoutes = require('./routes/profile');
const commentsRoutes = require('./routes/comments');
const notificationsRoutes = require('./routes/notifications');
const usersRoutes = require('./routes/users');
const exploreRoutes = require('./routes/explore');
const notifyRoutes = require('./routes/notify');
const adminRoutes = require('./routes/admin');
const activityRoutes = require('./routes/activity');

const app = express();

// Proxy & security
app.set('trust proxy', 1); 
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000', 
      'https://mapincolor.com', 
      'https://www.mapincolor.com'
    ],
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
});
app.use(limiter);

// Public routes (no auth required)
app.use('/api/auth', authRoutes);       // signup, login, verify, resend
app.use('/api/notify', notifyRoutes);   // your newsletter subscription route

// Now apply `auth` for the REST of your routes
app.use(auth);

// Protected routes (user must be logged in)
app.use('/api/maps', mapRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activity', activityRoutes);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
