require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const ticketRoutes = require('./routes/tickets');
const articlesRoutes = require('./routes/articles');
const slaRoutes = require('./routes/sla');

// Using routes
app.use('/api/articles', articlesRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/slas', slaRoutes);


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});