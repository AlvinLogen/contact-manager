const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes/index');
const { closePool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

app.use(express.static(path.join(__dirname, '../frontend/public')));
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// Use routes with /api prefix
app.use('/api', routes);
app.use(errorHandler);
app.use(compression());

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`URL: http://localhost:${PORT}`);
    });
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully....');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully....');
    await closePool();
    process.exit(0);
});
