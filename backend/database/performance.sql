USE ContactDB;
GO

-- Check existing indexes
SELECT i.name AS IndexName, OBJECT_NAME(i.object_id) AS TableName, i.type_desc AS IndexType, COL_NAME(ic.object_id, ic.column_id) AS ColumnName
FROM sys.indexes i
INNER JOIN sys.indexes.columns ic 
    ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
WHERE OBJECT_NAME(i.object_id) = 'Contacts'
ORDER BY i.name, ic.key_ordinal
GO

-- Check index usage statistics
SELECT 
    OBJECT_NAME(s.object_id) AS TableName,
    i.name AS IndexName,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats s
INNER JOIN sys.indexes i 
    ON s.object_id = i.object_id 
    AND s.index_id = i.index_id
WHERE OBJECT_NAME(s.object_id) = 'Contacts'
ORDER BY s.user_seeks + s.user_scans + s.user_lookups DESC;
GO

CREATE NONCLUSTERED INDEX IX_Contacts_Search
ON Contacts (FirstName, LastName, Email)
INCLUDE (Phone, CreatedAt, UpdatedAt);
GO