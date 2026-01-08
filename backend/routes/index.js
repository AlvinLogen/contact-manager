const express = require("express");
const router = express.Router();
const sql = require("mssql");

const { getPool } = require("../config/database");
const asyncHandler = require("../middleware/asyncHandler");
const { validateContact, validateId } = require("../middleware/validator");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Retrieve all contacts
router.get(
  "/contacts",
  asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT *
        FROM Contacts
        ORDER BY LastName, FirstName
    `);

    res.status(200).json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
    });
  })
);

// Retrieve a single contact by id
router.get(
  "/contacts/:id",
  validateId,
  asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query(
        `
            SELECT *
            FROM Contacts
            WHERE Id = @id;
            `
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0],
    });
  })
);

// Create a new contact
router.post("/contacts", validateContact, asyncHandler(
    async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const pool = await getPool();
    const result = await pool
        .request()
        .input("firstName", sql.NVarChar(50), firstName.trim())
        .input("lastName", sql.NVarChar(50), lastName.trim())
        .input("email", sql.NVarChar(100), email.trim().toLowerCase())
        .input("phone", sql.NVarChar(20), phone ? phone.trim() : null).query(`
            INSERT INTO Contacts (FirstName, LastName, Email, Phone)
            VALUES(@firstName, @lastName, @email, @phone)
            SELECT SCOPE_IDENTITY() as id;
        `);
    
    const newId = result.recordset[0].id;
    const newContact = await pool.request().input('id', sql.Int, newId).query('SELECT * FROM Contacts WHERE Id = @id');

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: newContact.recordset[0],
    });
}));

// Update an existing contact
router.put("/contacts/:id", validateId, validateContact, asyncHandler(
 async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("firstName", sql.NVarChar(50), firstName.trim())
      .input("lastName", sql.NVarChar(50), lastName.trim())
      .input("email", sql.NVarChar(100), email.trim().toLowerCase())
      .input("phone", sql.NVarChar(20), phone ? phone.trim() : null).query(`
                UPDATE Contacts
                SET
                    FirstName = @firstName,
                    LastName = @lastName, 
                    Email = @email,
                    Phone = @phone,
                    UpdatedAt = GETDATE()
                WHERE Id = @id;
                SELECT @@ROWCOUNT as affected;
            `);

    if (result.recordset[0].affected === 0) {
      return res.status(404).json({
        success: false,
        error: "Contact not found.",
      });
    }

    const updateContact = await pool.request().input('id', sql.Int, req.params.id).query('SELECT * FROM Contacts WHERE Id = @id');

    res.status(201).json({
      success: true,
      message: "Contact updated successfully",
      data: updateContact.recordset[0],
    });
}));

// Delete a contact
router.delete("/contacts/:id", validateId, asyncHandler(
async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().input('id', sql.Int, req.params.id).query(`
                DELETE FROM Contacts
                WHERE Id = @id;
                SELECT @@ROWCOUNT as affected;
            `);

    if (result.recordset[0].affected === 0) {
      return res.status(404).json({
        success: false,
        error: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: result.recordset[0],
    });
}));

// ERROR HANDLING
// ======================================

// Debug router
router.get("/debug", asyncHandler(
async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT DB_NAME() as CurrentDB");
  res.json(result.recordset);
}));

module.exports = router;
