-- Create Admin User Directly in Database
-- This script creates an admin user that can be used for login

-- First, create the user in Supabase auth.users table
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(), -- or use a specific UUID like '550e8400-e29b-41d4-a716-446655440000'
    'admin@fixmyhomepro.com', -- replace with your desired admin email
    crypt('admin123', gen_salt('bf')), -- replace 'admin123' with your desired password
    NOW(), -- email confirmed immediately
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin User", "phone": "+1234567890"}',
    false,
    '',
    '',
    '',
    ''
);

-- Then, create the admin record in the admins table
-- Note: You'll need to get the UUID from the auth.users table first
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
    (SELECT id FROM auth.users WHERE email = 'admin@fixmyhomepro.com'), -- replace with your email
    'admin@fixmyhomepro.com', -- replace with your desired admin email
    'Admin User', -- replace with desired name
    '+1234567890', -- replace with desired phone
    'admin',
    true, -- set to true for super admin
    NOW(),
    NOW()
);

-- Verify the admin was created
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    a.name,
    a.role,
    a.is_super_admin
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@fixmyhomepro.com'; -- replace with your email
