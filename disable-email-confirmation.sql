-- Disable Email Confirmation for Development
-- Run this in Supabase SQL Editor to disable email confirmation

-- Option 1: Disable email confirmation globally (for development only)
UPDATE auth.config 
SET confirm_email_change = false,
    enable_signup = true,
    enable_confirmations = false;

-- Option 2: Update specific user to be confirmed (if you have a specific user)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW(),
--     confirmed_at = NOW()
-- WHERE email = 'your-email@example.com';

-- Option 3: Confirm all existing users (for development only)
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

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
