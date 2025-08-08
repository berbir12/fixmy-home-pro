-- ADMIN USER CREATION SCRIPT
-- This script creates an admin user with confirmed email that can login immediately

-- Step 1: Clean up any existing admin with this email
DELETE FROM admins WHERE email = 'admin@gmail.com'; -- CHANGE THIS TO YOUR EMAIL
DELETE FROM auth.users WHERE email = 'admin@gmail.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 2: Create the user in auth.users table
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
    'admin@gmail.com', -- CHANGE THIS TO YOUR EMAIL
    crypt('admin123', gen_salt('bf')), -- CHANGE 'admin123' TO YOUR PASSWORD
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

-- Step 3: Get the user ID we just created
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'admin@gmail.com'; -- CHANGE THIS TO YOUR EMAIL
    
    -- Create admin record
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
        user_id,
        'admin@gmail.com', -- CHANGE THIS TO YOUR EMAIL
        'Admin User', -- CHANGE TO DESIRED NAME
        '+1234567890', -- CHANGE TO DESIRED PHONE
        'admin',
        true, -- Super admin privileges
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Admin created with ID: %', user_id;
END $$;

-- Step 4: Verify the admin was created successfully
SELECT 
    '✅ Admin created successfully!' as status,
    au.id,
    au.email,
    au.email_confirmed_at,
    a.name,
    a.role,
    a.is_super_admin,
    'Login credentials: ' || au.email || ' / admin123' as login_info
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@gmail.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 5: Test query to verify everything is working
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Admin exists and can login'
        ELSE '❌ Admin not found - something went wrong'
    END as final_status,
    COUNT(*) as admin_count
FROM auth.users au
JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@gmail.com'; -- CHANGE THIS TO YOUR EMAIL
