-- Test Database Access
-- This will verify that the database is accessible and working

-- Test 1: Check if we can query tables directly
SELECT 'Test 1: Direct table queries' as test;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

-- Test 2: Check if we can insert into customers
SELECT 'Test 2: Insert test' as test;
INSERT INTO customers (id, email, name, role) 
VALUES ('11111111-1111-1111-1111-111111111111'::UUID, 'test@example.com', 'Test User', 'customer')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Test 3: Check if we can query the inserted data
SELECT 'Test 3: Query inserted data' as test;
SELECT id, email, name, role FROM customers WHERE id = '11111111-1111-1111-1111-111111111111'::UUID;

-- Test 4: Clean up test data
SELECT 'Test 4: Cleanup' as test;
DELETE FROM customers WHERE id = '11111111-1111-1111-1111-111111111111'::UUID;

-- Test 5: Verify cleanup
SELECT 'Test 5: Verify cleanup' as test;
SELECT COUNT(*) as remaining_customers FROM customers;

-- Test 6: Check auth.users
SELECT 'Test 6: Auth users' as test;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 3;

-- Test 7: Check if foreign key constraints exist
SELECT 'Test 7: Foreign key constraints' as test;
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('customers', 'admins', 'technicians');

-- Test 8: Check RLS status
SELECT 'Test 8: RLS status' as test;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('admins', 'customers', 'technicians');

SELECT 'All tests completed!' as status;
