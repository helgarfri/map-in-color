// server.js
require('dotenv').config(); // Load environment variables first

const express = require('express');
const { sequelize } = require('./models'); // Destructure sequelize from models
const cors = require('cors');

const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/maps');
const profileRoutes = require('./routes/profile');
const commentsRoutes = require('./routes/comments');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', commentsRoutes);

// Optional: Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Start Server after syncing with the database
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
