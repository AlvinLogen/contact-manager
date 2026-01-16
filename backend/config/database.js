// ============================================
// Database Connection Module
// Purpose: Manage SQL Server connection pool
// ============================================

const sql = require('mssql');

require('dotenv').config();

// Database configuration from environment variables
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableAirthAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }, 
    requestTimeout: 30000
};

// Connection pool (singleton pattern)
let poolPromise = null;

// Get database connection pool
const getPool = async () => {
  if(!poolPromise){
    try {
        poolPromise = sql.connect(config);
        console.log('Database connection pool created.');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        poolPromise = null;
        throw error;
    }
  }  
  return poolPromise;
};

// Close database connection pool
const closePool = async () => {
    if(poolPromise){
        await(await poolPromise).close();
        poolPromise = null;
        console.log('Database connection pool closed.');
    }
};

module.exports = {
    sql, 
    getPool, 
    closePool
};


