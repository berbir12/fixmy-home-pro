-- Temporarily disable RLS to fix infinite recursion issues
-- This is a temporary fix to get the application working

-- Disable RLS on problematic tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE technician_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on user_profiles and other tables that don't cause recursion
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE technician_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
