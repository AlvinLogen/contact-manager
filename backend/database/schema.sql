-- ============================================
-- Database: ContactDB
-- Purpose: Contact Management System Database
-- Author: Alvin Logenstein
-- Date: 2025-12-16
-- ============================================

--DROP Database if exists (Development Only)

IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = 'ContactDB')
BEGIN
    CREATE DATABASE ContactDB;
END
GO

--Use Database
USE ContactDB;
GO

-- ============================================
-- Table: Contacts
-- Purpose: Store contact information
-- ============================================

CREATE TABLE Contacts (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NULL,

    --Constraints
    CONSTRAINT CHK_Email_Format CHECK(Email LIKE '%_@__%.__%'),
    CONSTRAINT CHK_Names_Not_Empty CHECK (LEN(TRIM(FirstName)) > 0 AND LEN(TRIM(LastName)) > 0)
);
GO

--Create index on Email for faster lookups
CREATE NONCLUSTERED INDEX IX_Contacts_Email ON Contacts(Email);
GO

--Create index on LastnName for faster sorting
CREATE NONCLUSTERED INDEX IX_Contacts_LastName ON Contacts(LastName, FirstName);
GO

--Verify Table Creation
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Contacts'
ORDER BY ORDINAL_POSITION;
GO

PRINT 'Database schema created successfully';

