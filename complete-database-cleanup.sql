-- Complete Database Cleanup Script
-- This will delete ALL existing tables and start completely fresh

-- Drop all existing triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_technician_profiles_updated_at ON technician_profiles;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_chat_contacts_updated_at ON chat_contacts;
DROP TRIGGER IF EXISTS update_technician_applications_updated_at ON technician_applications;
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_technicians_updated_at ON technicians;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop all existing tables in reverse dependency order
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_contacts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS technician_applications CASCADE;
DROP TABLE IF EXISTS technician_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- Drop all existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS handle_user_update() CASCADE;

-- Drop all existing indexes (they will be dropped with tables, but just to be sure)
-- Note: Indexes are automatically dropped when tables are dropped

-- Verify that all tables are gone
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'users', 'user_profiles', 'technician_profiles', 
        'admins', 'customers', 'technicians',
        'services', 'bookings', 'payments', 
        'technician_applications', 'chat_contacts', 'chat_messages'
    );

-- This should return no rows if cleanup was successful
