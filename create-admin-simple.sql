-- Simple Admin Creation Script
-- This creates an admin user that you can use to login

-- First, create the user using Supabase's auth.signup function
-- You'll need to run this in the Supabase SQL Editor

-- Create admin user with confirmed email
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'admin@fixmyhomepro.com', -- REPLACE WITH YOUR DESIRED EMAIL
    crypt('admin123', gen_salt('bf')), -- REPLACE 'admin123' WITH YOUR DESIRED PASSWORD
    NOW(), -- Email is confirmed immediately
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin User", "phone": "+1234567890"}'
);

-- Then create the admin record in your admins table
INSERT INTO admins (
    id,
    email,
    name,
    phone,
    role,
    is_super_admin,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@fixmyhomepro.com'), -- REPLACE WITH YOUR EMAIL
    'admin@fixmyhomepro.com', -- REPLACE WITH YOUR EMAIL
    'Admin User', -- REPLACE WITH DESIRED NAME
    '+1234567890', -- REPLACE WITH DESIRED PHONE
    'admin',
    true,
    NOW(),
    NOW()
);

-- Verify the admin was created successfully
SELECT 
    'Admin created successfully!' as status,
    au.email,
    a.name,
    a.role,
    a.is_super_admin
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@fixmyhomepro.com'; -- REPLACE WITH YOUR EMAIL
