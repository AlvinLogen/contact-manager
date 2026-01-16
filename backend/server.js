const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes/index');
const { closePool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Use routes with /api prefix
app.use('/api', routes);
app.use(errorHandler);

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`URL: http://localhost:${PORT}`);
    });  
};

startServer();

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
