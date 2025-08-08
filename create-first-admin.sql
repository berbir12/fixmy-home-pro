-- Create First Admin User
-- Run this after setting up the new database schema

-- First, check if your user exists in auth.users
-- Replace 'your-email@example.com' with your actual email
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'berbir901@gmail.com';

-- If your user exists, insert them into the admins table
-- Replace 'your-email@example.com' with your actual email
INSERT INTO admins (id, email, name, role, is_super_admin) 
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', 'Admin User') as name,
    'admin' as role,
    true as is_super_admin
FROM auth.users 
WHERE email = 'berbir901@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    is_super_admin = true;

-- Verify the admin user was created
SELECT 
    id, 
    email, 
    name, 
    role, 
    is_super_admin,
    created_at
FROM admins 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check total users by type
SELECT 
    'admins' as user_type, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;
