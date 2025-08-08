-- Clean Database Script
-- This will remove all existing data and start fresh

-- Clean all existing data in reverse dependency order
DELETE FROM chat_messages;
DELETE FROM chat_contacts;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM technician_applications;
DELETE FROM technician_profiles;
DELETE FROM user_profiles;
DELETE FROM users;

-- Reset sequences if they exist
-- Note: This is optional but helps ensure clean IDs

-- Verify the cleanup
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'technician_profiles', COUNT(*) FROM technician_profiles
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'technician_applications', COUNT(*) FROM technician_applications
UNION ALL
SELECT 'chat_contacts', COUNT(*) FROM chat_contacts
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages;

-- All counts should be 0 after running this script
