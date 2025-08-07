-- Setup Admin User Script
-- This script helps you set up an admin user for the TechConnect Portal

-- First, let's see what users exist
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- To make your current user an admin, run this (replace with your email):
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- To create a new admin user, run this (replace with your details):
-- INSERT INTO users (id, email, name, role) 
-- VALUES (
--   gen_random_uuid(), 
--   'admin@fixnow.com', 
--   'Admin User', 
--   'admin'
-- );

-- Check if technician_applications table exists and has data
SELECT COUNT(*) as application_count FROM technician_applications;

-- Check the structure of technician_applications
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'technician_applications' 
ORDER BY ordinal_position;
