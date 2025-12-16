-- ============================================
-- Common Queries for Contact Management
-- ============================================

USE ContactDB;
GO

-- Query 1: Get all contacts
SELECT * FROM Contacts ORDER BY LastName, FirstName;

-- Query 2: Search by name (partial match)
SELECT * FROM Contacts 
WHERE FirstName LIKE '%John%' OR LastName LIKE '%John%';

-- Query 3: Get contact by ID
SELECT * FROM Contacts WHERE Id = 1;

-- Query 4: Get contact by Email
SELECT * FROM Contacts WHERE Email = 'john.doe@example.com';

-- Query 5: Count total contacts
SELECT COUNT(*) AS TotalContacts FROM Contacts;

-- Query 6: Get recently added contacts (last 7 days)
SELECT * FROM Contacts 
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE())
ORDER BY CreatedAt DESC;

-- Query 7: Check for duplicate emails
SELECT Email, COUNT(*) AS Count
FROM Contacts
GROUP BY Email
HAVING COUNT(*) > 1;