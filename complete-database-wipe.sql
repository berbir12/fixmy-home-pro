-- Complete Database Wipe
-- This will delete ALL data from your Supabase database
-- WARNING: This is irreversible and will delete everything!

-- First, let's see what we have before wiping
SELECT 'Current state before wipe:' as info;
SELECT COUNT(*) as auth_users_count FROM auth.users;
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians
UNION ALL
SELECT 'services', COUNT(*) FROM services
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

-- Disable all triggers temporarily
SELECT 'Disabling triggers...' as info;
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || trigger_record.event_object_table || ' DISABLE TRIGGER ' || trigger_record.trigger_name;
    END LOOP;
END $$;

-- Clear ALL data from custom tables
SELECT 'Clearing all custom table data...' as info;
DELETE FROM chat_messages;
DELETE FROM chat_contacts;
DELETE FROM technician_applications;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM services;
DELETE FROM technicians;
DELETE FROM customers;
DELETE FROM admins;

-- Clear ALL users from auth.users
SELECT 'Clearing all auth users...' as info;
DELETE FROM auth.users;

-- Drop all tables to start completely fresh
SELECT 'Dropping all tables...' as info;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_contacts CASCADE;
DROP TABLE IF EXISTS technician_applications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop all functions
SELECT 'Dropping all functions...' as info;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user_registration() CASCADE;
DROP FUNCTION IF EXISTS insert_customer_safe() CASCADE;
DROP FUNCTION IF EXISTS insert_admin_safe() CASCADE;

-- Drop all sequences
SELECT 'Dropping all sequences...' as info;
DROP SEQUENCE IF EXISTS customers_id_seq CASCADE;
DROP SEQUENCE IF EXISTS admins_id_seq CASCADE;
DROP SEQUENCE IF EXISTS technicians_id_seq CASCADE;
DROP SEQUENCE IF EXISTS services_id_seq CASCADE;
DROP SEQUENCE IF EXISTS bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payments_id_seq CASCADE;
DROP SEQUENCE IF EXISTS technician_applications_id_seq CASCADE;
DROP SEQUENCE IF EXISTS chat_contacts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS chat_messages_id_seq CASCADE;

-- Verify everything is cleared
SELECT 'After complete wipe:' as info;
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Check if any tables still exist
SELECT 'Remaining tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check if any functions still exist
SELECT 'Remaining functions:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';

SELECT 'Database completely wiped!' as status;
SELECT 'You can now run the fresh-database-setup.sql to create everything from scratch.' as next_step;
