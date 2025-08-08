-- Fix Registration Process and Foreign Key Constraints
-- This will make the registration process work properly

-- First, let's check the current state
SELECT 
    'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians;

-- Drop the strict foreign key constraints
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey;
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_id_fkey;
ALTER TABLE technicians DROP CONSTRAINT IF EXISTS technicians_id_fkey;

-- Recreate the constraints with DEFERRABLE to allow deferred checking
ALTER TABLE customers ADD CONSTRAINT customers_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE admins ADD CONSTRAINT admins_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE technicians ADD CONSTRAINT technicians_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Create a function to handle user creation in our tables
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called when a new user is created in auth.users
    -- We'll handle the actual user creation in our tables via the application
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- Create a function to safely insert customer records
CREATE OR REPLACE FUNCTION public.insert_customer_safe(
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    user_phone TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Try to insert the customer record
    INSERT INTO customers (id, email, name, phone, role)
    VALUES (user_id, user_email, user_name, user_phone, 'customer')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        role = 'customer';
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail
        RAISE WARNING 'Failed to insert customer record: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely insert admin records
CREATE OR REPLACE FUNCTION public.insert_admin_safe(
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    user_phone TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Try to insert the admin record
    INSERT INTO admins (id, email, name, phone, role, is_super_admin)
    VALUES (user_id, user_email, user_name, user_phone, 'admin', true)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        role = 'admin',
        is_super_admin = true;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail
        RAISE WARNING 'Failed to insert admin record: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the functions were created
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name IN ('insert_customer_safe', 'insert_admin_safe');

-- Test the customer insertion function with a dummy user (if exists)
-- This is just to test the function, not to create actual data
-- SELECT public.insert_customer_safe(
--     '00000000-0000-0000-0000-000000000000'::UUID,
--     'test@example.com',
--     'Test User',
--     '1234567890'
-- );

-- Show the current constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    tc.is_deferrable,
    tc.initially_deferred
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('customers', 'admins', 'technicians');
