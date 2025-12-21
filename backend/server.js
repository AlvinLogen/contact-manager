// ============================================
// Contact Manager API Server
// Purpose: RESTful API for contact management
// Author: Alvin Logenstein
// Date: 2025-12-16
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const routes = require('./routes/index');
const { closePool } = require('./config/database');

// Initialize Express Application
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
// ============================================

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({extended: true}));

// Enable CORS for all routes
app.use(cors());

// Serve static files from frontend/public 
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Request Logging middleware 
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Use routes with /api prefix
app.use('/api', routes);

// Start Server
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log('====================================');
});

// Graceful shutdown
process.on('SIGINT', async() => {
    console.log('\nShutting down gracefully....');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully....');
    await closePool();
    process.exit(0);   
});
