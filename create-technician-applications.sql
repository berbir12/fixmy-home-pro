-- Create technician_applications table
-- This script creates the technician_applications table and its dependencies

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist (required for foreign key)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('customer', 'technician', 'admin')) DEFAULT 'customer',
    phone TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technician_applications table
CREATE TABLE IF NOT EXISTS technician_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    experience TEXT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    has_vehicle BOOLEAN DEFAULT false,
    vehicle_type TEXT,
    vehicle_info TEXT,
    availability JSONB DEFAULT '{}'::jsonb,
    resume_url TEXT,
    certification_files JSONB DEFAULT '[]'::jsonb,
    references_text TEXT,
    agree_to_terms BOOLEAN NOT NULL,
    agree_to_background_check BOOLEAN NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'hired')) DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for technician_applications
CREATE INDEX IF NOT EXISTS idx_technician_applications_email ON technician_applications(email);
CREATE INDEX IF NOT EXISTS idx_technician_applications_status ON technician_applications(status);
CREATE INDEX IF NOT EXISTS idx_technician_applications_created_at ON technician_applications(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for technician_applications
DROP TRIGGER IF EXISTS update_technician_applications_updated_at ON technician_applications;
CREATE TRIGGER update_technician_applications_updated_at 
    BEFORE UPDATE ON technician_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE technician_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can submit applications" ON technician_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON technician_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON technician_applications;

-- Create RLS policies
CREATE POLICY "Anyone can submit applications" ON technician_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all applications" ON technician_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update applications" ON technician_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
