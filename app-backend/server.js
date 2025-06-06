require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


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
const unsubscribeRoutes = require('./routes/unsubscribe'); 

// If you want to test a Supabase connection at startup, 
// you can import the client (optional):
const supabase = require('./config/supabase');

// Initialize Express app
const app = express();

app.set('trust proxy', 1); // Trust first proxy


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://mapincolor.com', 'https://www.mapincolor.com'],
    credentials: true,
  })
);




// Configure Helmet to allow cross-origin resources
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Serve static files (like uploads) if needed
app.use('/uploads', express.static('uploads'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});
app.use(limiter);

// Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/notify', notifyRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/activity', activityRoutes);
app.use('/api/unsubscribe', unsubscribeRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});