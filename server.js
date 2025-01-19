const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Authentication Tracker(Optional)/routes/auth');
const volunteerRoutes = require('./Authentication Tracker(Optional)/routes/volunteers');
const animalRoutes = require("./API/routes/animals");
const imageRoutes = require("./API/routes/images");
const cors = require('cors');

// Initialize environment variables
dotenv.config({ path: './huh.env' });

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Cross-Origin Resource Sharing

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use("./api/animals", animalRoutes);
app.use('./api/images', imageRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});