-- Fix Foreign Key Constraint Issue
-- This will check and fix the foreign key constraints

-- First, let's check what tables exist
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check the foreign key constraints on customers table
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
    AND tc.table_name = 'customers';

-- Check if there are any users in auth.users
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Check if there are any users in our tables
SELECT 
    'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

-- Let's temporarily disable the foreign key constraint to allow registration
-- This is a temporary fix to allow user registration to work

-- Drop the foreign key constraint temporarily
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey;
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_id_fkey;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_id_fkey;

-- Recreate the constraints with ON DELETE CASCADE and deferrable
ALTER TABLE customers ADD CONSTRAINT customers_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE admins ADD CONSTRAINT admins_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE technicians ADD CONSTRAINT technicians_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Verify the constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('customers', 'admins', 'technicians');
