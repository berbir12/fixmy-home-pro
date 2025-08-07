-- Debug Database Structure
-- Run this to check if everything is set up correctly

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'technician_applications', 'services', 'bookings', 'payments')
ORDER BY table_name;

-- Check users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check technician_applications table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'technician_applications' 
ORDER BY ordinal_position;

-- Check if there are any applications
SELECT COUNT(*) as application_count FROM technician_applications;

-- Check user roles
SELECT email, role FROM users ORDER BY created_at DESC;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'technician_applications', 'services', 'bookings', 'payments');
