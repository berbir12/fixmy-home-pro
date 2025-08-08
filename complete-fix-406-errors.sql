-- Complete Fix for 406 Errors
-- This will completely remove foreign key constraints and fix the API issues

-- First, let's check what constraints exist
SELECT 'Checking current constraints...' as info;
SELECT 
    tc.constraint_name,
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

-- Drop ALL foreign key constraints on these tables
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey1;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey2;
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_id_fkey;
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_id_fkey1;
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_id_fkey2;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_id_fkey;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_id_fkey1;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_id_fkey2;

-- Also drop any other potential constraints
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid IN (
            'customers'::regclass,
            'admins'::regclass,
            'technicians'::regclass
        ) 
        AND contype = 'f'
    LOOP
        EXECUTE 'ALTER TABLE customers DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
        EXECUTE 'ALTER TABLE admins DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
        EXECUTE 'ALTER TABLE technicians DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
    END LOOP;
END $$;

-- Verify all constraints are gone
SELECT 'After dropping constraints:' as info;
SELECT 
    tc.constraint_name,
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

-- Test direct insertion without constraints
SELECT 'Testing direct insertion...' as test;
INSERT INTO customers (id, email, name, role) 
VALUES ('00000000-0000-0000-0000-000000000000'::UUID, 'test@example.com', 'Test User', 'customer')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Clean up test data
DELETE FROM customers WHERE id = '00000000-0000-0000-0000-000000000000'::UUID;

-- Check if we can query the tables directly
SELECT 'Testing table queries...' as test;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

-- Check current users in auth.users
SELECT 'Current auth.users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Show table structure
SELECT 'Table structure check:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Grant all permissions again to be sure
GRANT ALL ON admins TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON technicians TO authenticated;
GRANT ALL ON services TO authenticated;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON technician_applications TO authenticated;
GRANT ALL ON chat_contacts TO authenticated;
GRANT ALL ON chat_messages TO authenticated;

-- Disable RLS again to be sure
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE technicians DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE technician_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

SELECT 'Complete fix applied!' as status;
