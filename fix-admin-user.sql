-- Fix Admin User Registration
-- This will move the admin user from customers table to admins table

-- First, let's see what we have
SELECT 'Current state:' as info;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers;

-- Check if there are any users in customers that should be admins
SELECT 'Checking for potential admin users in customers table:' as info;
SELECT id, email, name, role FROM customers WHERE email LIKE '%admin%' OR name LIKE '%admin%';

-- Get the user ID from auth.users for the admin
SELECT 'Getting user ID from auth.users:' as info;
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email LIKE '%admin%';

-- Move the admin user from customers to admins
-- Replace 'admin@test.com' with the actual admin email you used
INSERT INTO admins (id, email, name, phone, role, is_super_admin)
SELECT 
    id,
    email,
    name,
    phone,
    'admin' as role,
    false as is_super_admin
FROM customers 
WHERE email = 'admin@test.com'  -- Replace with your actual admin email
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = 'admin',
    phone = EXCLUDED.phone;

-- Delete the admin user from customers table
DELETE FROM customers WHERE email = 'admin@test.com';  -- Replace with your actual admin email

-- Verify the fix
SELECT 'After fix:' as info;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers;

SELECT 'Admin user details:' as info;
SELECT id, email, name, role, is_super_admin FROM admins WHERE email LIKE '%admin%';

SELECT 'Admin user fixed successfully!' as status;
