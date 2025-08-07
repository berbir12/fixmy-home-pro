-- Fix RLS policies to avoid infinite recursion
-- This script updates the RLS policies to prevent infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all applications" ON technician_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON technician_applications;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- Create fixed policies that avoid infinite recursion
-- For technician_applications, allow anyone to submit and only check admin role via metadata
CREATE POLICY "Anyone can submit applications" ON technician_applications FOR INSERT WITH CHECK (true);

-- For viewing applications, check admin role via user metadata instead of querying users table
CREATE POLICY "Admins can view all applications" ON technician_applications FOR SELECT USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update applications" ON technician_applications FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Fix users policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Fix services policies
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Fix bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Technicians can view their assigned bookings" ON bookings FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Technicians can update their assigned bookings" ON bookings FOR UPDATE USING (auth.uid() = technician_id);

-- Fix payments policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create payments for their bookings" ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND user_id = auth.uid())
);
