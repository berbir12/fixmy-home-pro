-- Add Missing User
-- This will add the user to the customers table

-- First, let's check what users exist in auth.users
SELECT 'Current auth.users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Check if the user exists in any of our tables
SELECT 'Checking if user exists in our tables:' as info;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins WHERE email = 'beckybire904@gmail.com'
UNION ALL
SELECT 'customers', COUNT(*) FROM customers WHERE email = 'beckybire904@gmail.com'
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians WHERE email = 'beckybire904@gmail.com';

-- Get the user ID from auth.users
SELECT 'Getting user ID from auth.users:' as info;
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'beckybire904@gmail.com';

-- Add the user to customers table
INSERT INTO customers (id, email, name, role, phone)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', 'Customer User') as name,
    'customer' as role,
    raw_user_meta_data->>'phone' as phone
FROM auth.users 
WHERE email = 'beckybire904@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = 'customer',
    phone = EXCLUDED.phone;

-- Verify the user was added
SELECT 'Verifying user was added:' as info;
SELECT id, email, name, role FROM customers WHERE email = 'beckybire904@gmail.com';

-- Show current user counts
SELECT 'Current user counts:' as info;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

SELECT 'User added successfully!' as status;
