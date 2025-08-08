-- Clear Everything in auth.users
-- This will delete all users and start fresh

-- First, let's see what we have
SELECT 'Current state before clearing:' as info;
SELECT COUNT(*) as auth_users_count FROM auth.users;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

-- Clear all users from our tables first
DELETE FROM customers;
DELETE FROM admins;
DELETE FROM technicians;
DELETE FROM bookings;
DELETE FROM payments;
DELETE FROM technician_applications;
DELETE FROM chat_messages;

-- Clear auth.users (this will delete all authentication users)
-- Note: This is irreversible!
DELETE FROM auth.users;

-- Verify everything is cleared
SELECT 'After clearing:' as info;
SELECT COUNT(*) as auth_users_count FROM auth.users;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'technician_applications', COUNT(*) FROM technician_applications
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages;

-- Reset sequences if any
-- ALTER SEQUENCE IF EXISTS customers_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS admins_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS technicians_id_seq RESTART WITH 1;

SELECT 'All users cleared successfully!' as status;
SELECT 'You can now register fresh users.' as next_step;
