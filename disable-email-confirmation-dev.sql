-- Disable Email Confirmation for Development
-- Run this in Supabase SQL Editor

-- Option 1: Confirm all existing users (for development only)
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Option 2: Confirm specific user (replace with your email)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW(),
--     confirmed_at = NOW()
-- WHERE email = 'your-email@example.com';

-- Verify the changes
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
