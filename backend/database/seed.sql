-- ============================================
-- Seed Data for Contacts Table
-- Purpose: Insert sample data for testing
-- ============================================

USE ContactDB;
GO

-- Clear existing data (for development)
IF OBJECT_ID('Contacts', 'U') IS NOT NULL
    DELETE FROM Contacts;
GO

--Reset Identity Seed
DBCC CHECKIDENT ('Contacts', RESEED, 0);
GO

--Insert Sample contacts
INSERT INTO Contacts (FirstName, LastName, Email, Phone)
VALUES 
    ('John', 'Doe', 'john.doe@example.com', '+1-555-0101'),
    ('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0102'),
    ('Michael', 'Johnson', 'michael.j@example.com', '+1-555-0103'),
    ('Emily', 'Williams', 'emily.w@example.com', '+1-555-0104'),
    ('David', 'Brown', 'david.brown@example.com', '+1-555-0105');
GO

--Verify Inserted Data
SELECT *
FROM Contacts
ORDER Id; 
GO

SELECT COUNT(*) AS TotalContacts FROM Contacts;
GO

PRINT 'See data inserted successfully';


