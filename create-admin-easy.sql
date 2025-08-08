-- EASIEST METHOD: Create Admin User
-- This is the most reliable way to create an admin user

-- Step 1: Create the user in auth.users table
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
    gen_random_uuid(),
    'admin@fixmyhomepro.com', -- CHANGE THIS TO YOUR DESIRED EMAIL
    crypt('admin123', gen_salt('bf')), -- CHANGE 'admin123' TO YOUR DESIRED PASSWORD
    NOW(), -- Email confirmed immediately
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

-- Step 2: Create admin record in admins table
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
    (SELECT id FROM auth.users WHERE email = 'admin@fixmyhomepro.com'), -- CHANGE EMAIL HERE TOO
    'admin@fixmyhomepro.com', -- CHANGE THIS TO YOUR DESIRED EMAIL
    'Admin User', -- CHANGE TO DESIRED NAME
    '+1234567890', -- CHANGE TO DESIRED PHONE
    'admin',
    true, -- Super admin privileges
    NOW(),
    NOW()
);

-- Step 3: Verify the admin was created
SELECT 
    '✅ Admin created successfully!' as status,
    au.email,
    au.email_confirmed_at,
    a.name,
    a.role,
    a.is_super_admin,
    'Login with: ' || au.email || ' / admin123' as login_info
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 4: Check if admin exists
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Admin exists and can login'
        ELSE '❌ Admin not found'
    END as status
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL
