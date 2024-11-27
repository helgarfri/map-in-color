// server.js
require('dotenv').config(); // Load environment variables first

const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/maps');
const profileRoutes = require('./routes/profile');
const commentsRoutes = require('./routes/comments');
const notificationsRoutes = require('./routes/notifications');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000', // Correct frontend origin
  credentials: true,
}));


// Configure helmet to set CORP to cross-origin
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Serve static files with appropriate headers
app.use('/uploads', express.static('uploads'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', commentsRoutes);
app.use('/api/notifications', notificationsRoutes); // Add this line

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Start Server after syncing with the database
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
