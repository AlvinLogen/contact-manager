// API ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/database');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Retrieve all contacts
router.get('/contacts', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT
                Id,
                FirstName,
                LastName,
                Email,
                Phone, 
                CreatedAt,
                UpdatedAt
            FROM Contacts
            ORDER BY LastName, FirstName
        `);

        res.status(200).json({
            success: true, 
            data: result.recordset,
            count: result.recordset.length
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false, 
            error: 'Failed to fetch contacts',
            message: error.message
        });
    }
});

// Retrieve a single contact by id
router.get('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Input validation
        if (!id || isNaN(id)){
            return res.status(400).json({
                success: false, 
                error: 'Invalid contact Id'
            });
        }

        const pool = await getPool();
        const result = await pool.request().input('id', sql.Int, id).query(
            `
            SELECT
                Id, 
                FirstName,
                LastName,
                Email, 
                Phone,
                CreatedAt,
                UpdatedAt
            FROM Contacts
            WHERE Id = @id
            `
        );

        if(result.recordset.length === 0){
            return res.status(404).json({
                success: false,
                error: 'Contact not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contact',
            message: error.message
        });
    }
});

// Create a new contact
router.post('/contacts', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // Input validation 
        if(!firstName || !lastName || !email){
            return res.status(400).json({
                success: false,
                error: 'FirstName, LastName and Email are required.'
            });
        }

        // Email format validation 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        const pool = await getPool();
        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), firstName.trim())
            .input('lastName', sql.NVarChar(50), lastName.trim())
            .input('email', sql.NVarChar(100), email.trim().toLowerCase())
            .input('phone', sql.NVarChar(20), phone ? phone.trim(): null)
            .query(`
                INSERT INTO Contacts (FirstName, LastName, Email, Phone)
                OUTPUT INSERTED.*
                VALUES(@firstName, @lastName, @email, @phone)
            `);

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: result.recordset[0]
        });

    } catch (error) {
        console.error('Error creating contact:', error);

        // Handle duplicate email error
        if(error.number === 2627){
            return res.status(409).json({
                success: false,
                error: 'A contact with this email already exists'
            });
        }

        res.status(500).json({
            success:false,
            error: 'Failed to create contact',
            message: error.message
        });
    }
});

// Update an existing contact
router.put('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone } = req.body;

        // Input validation 
        if(!id || isNaN(id)){
            return res.status(400).json({
                success: false,
                error: 'Invalid contact Id.'
            });
        }

        if(!firstName || !lastName || !email){
            return res.status(400).json({
                success: false,
                error: 'FirstName, LastName and Email are required.'
            });
        }    
        
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('firstName', sql.NVarChar(50), firstName.trim())
            .input('lastName', sql.NVarChar(50), lastName.trim())
            .input('email', sql.NVarChar(100), email.trim().toLowerCase())
            .input('phone', sql.NVarChar(20), phone ? phone.trim(): null)
            .query(`
                UPDATE Contacts
                SET
                    FirstName = @firstName,
                    LastName = @lastName, 
                    Email = @email,
                    Phone = @phone,
                    UpdatedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE Id = @id
            `);
            
        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                error: 'Contact not found.'
            });
        }
            
        res.status(201).json({
            success: true,
            message: 'Contact updated successfully',
            data: result.recordset[0]
        });        

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update contact',
            message: error.message
        });
    }
});

// Delete a contact
router.delete('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Input validation 
        if(!id || isNaN(id)){
            return res.status(400).json({
                success: false,
                error: 'Invalid contact Id.'
            });
        }        

        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM Contacts
                OUTPUT DELETED.*
                WHERE Id = @id
            `);
            
        if(result.recordset.length === 0){
            return res.status(404).json({
                success:false,
                error: 'Contact not found.'
            });
        }
            
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
            data: result.recordset[0]
        });        
    } catch (error) {
        console.error('Error deleting contact', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete contact',
            message: error.message
        });
    }
});

// ERROR HANDLING
// ======================================

// Debug router
router.get('/debug', async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT DB_NAME() as CurrentDB');
    res.json(result.recordset);
});

// 404 handler for undefined routes
router.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found.',
        path: req.url
    });
});

// Global error handler
router.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

module.exports = router;