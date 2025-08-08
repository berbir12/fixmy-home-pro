-- Create Admin User Script
-- Replace 'your-email@example.com' with your actual email

-- First, check if your user exists in auth.users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- If your user exists, insert them into the users table with admin role
INSERT INTO users (id, email, name, role) 
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', 'Admin User') as name,
    'admin' as role
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify the admin user was created
SELECT id, email, name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check if user profile exists, create if not
INSERT INTO user_profiles (user_id)
SELECT id FROM users WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Show all admin users
SELECT 
    u.id, 
    u.email, 
    u.name, 
    u.role, 
    u.created_at,
    up.id as profile_id
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.role = 'admin'
ORDER BY u.created_at DESC;
