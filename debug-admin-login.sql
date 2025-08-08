-- Debug Admin Login Issues
-- Run this to check if your admin user exists and troubleshoot login problems

-- Step 1: Check if admin exists in auth.users table
SELECT 
    '🔍 Checking auth.users table' as step,
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
        ELSE '❌ Email not confirmed'
    END as email_status
FROM auth.users 
WHERE email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 2: Check if admin exists in admins table
SELECT 
    '🔍 Checking admins table' as step,
    id,
    email,
    name,
    role,
    is_super_admin,
    created_at
FROM admins 
WHERE email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 3: Check if admin exists in both tables (should match)
SELECT 
    '🔍 Checking both tables match' as step,
    au.id as auth_user_id,
    au.email as auth_email,
    au.email_confirmed_at,
    a.id as admin_id,
    a.email as admin_email,
    a.name,
    a.role,
    CASE 
        WHEN au.id = a.id THEN '✅ IDs match'
        ELSE '❌ IDs do not match'
    END as id_match,
    CASE 
        WHEN au.email = a.email THEN '✅ Emails match'
        ELSE '❌ Emails do not match'
    END as email_match
FROM auth.users au
FULL OUTER JOIN admins a ON au.id = a.id
WHERE au.email = 'admin@fixmyhomepro.com' OR a.email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL

-- Step 4: Check all users in auth.users (to see what's there)
SELECT 
    '🔍 All users in auth.users' as step,
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- Step 5: Check all admins (to see what's there)
SELECT 
    '🔍 All admins' as step,
    id,
    email,
    name,
    role,
    created_at
FROM admins 
ORDER BY created_at DESC
LIMIT 10;

-- Step 6: Delete existing admin if it exists (to start fresh)
-- UNCOMMENT THE LINES BELOW IF YOU WANT TO DELETE AND RECREATE
/*
DELETE FROM admins WHERE email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL
DELETE FROM auth.users WHERE email = 'admin@fixmyhomepro.com'; -- CHANGE THIS TO YOUR EMAIL
SELECT '🗑️ Deleted existing admin user' as status;
*/
