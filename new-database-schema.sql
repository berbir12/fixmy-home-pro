-- New Database Schema with Separate Admin and Customer Tables
-- This provides better organization and security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing triggers if they exist (to avoid conflicts)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_technician_profiles_updated_at ON technician_profiles;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_chat_contacts_updated_at ON chat_contacts;
DROP TRIGGER IF EXISTS update_technician_applications_updated_at ON technician_applications;
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_contacts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS technician_applications;
DROP TABLE IF EXISTS technician_profiles;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS customers;

-- Create admins table
CREATE TABLE admins (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role = 'admin'),
    phone TEXT,
    avatar TEXT,
    permissions JSONB DEFAULT '{
        "users": {"view": true, "edit": true, "delete": true},
        "bookings": {"view": true, "edit": true, "delete": true},
        "technicians": {"view": true, "edit": true, "delete": true},
        "applications": {"view": true, "approve": true, "reject": true},
        "reports": {"view": true, "export": true},
        "settings": {"view": true, "edit": true}
    }'::jsonb,
    is_super_admin BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'customer' CHECK (role = 'customer'),
    phone TEXT,
    avatar TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{
        "notifications": {"email": true, "sms": true, "push": true},
        "privacy": {"shareLocation": false, "shareContact": false}
    }'::jsonb,
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    preferred_technicians TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technicians table
CREATE TABLE technicians (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'technician' CHECK (role = 'technician'),
    phone TEXT,
    avatar TEXT,
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    experience TEXT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    availability JSONB DEFAULT '{}'::jsonb,
    rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    skills TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    vehicle_info JSONB,
    is_verified BOOLEAN DEFAULT false,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    features TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    warranty TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    technician_name TEXT NOT NULL,
    technician_avatar TEXT,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    method TEXT NOT NULL CHECK (method IN ('credit_card', 'paypal', 'apple_pay', 'google_pay')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technician applications table
CREATE TABLE technician_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2) NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES admins(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat contacts table
CREATE TABLE chat_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    type TEXT NOT NULL CHECK (type IN ('technician', 'support', 'ai')),
    last_message TEXT,
    last_message_time TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id TEXT NOT NULL,
    sender_id UUID REFERENCES auth.users(id),
    sender_name TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'technician', 'support', 'ai')),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'location')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read'))
);

-- Create indexes for better performance
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_role ON customers(role);
CREATE INDEX idx_technicians_email ON technicians(email);
CREATE INDEX idx_technicians_role ON technicians(role);
CREATE INDEX idx_technicians_status ON technicians(application_status);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_technician_applications_email ON technician_applications(email);
CREATE INDEX idx_technician_applications_status ON technician_applications(status);
CREATE INDEX idx_technician_applications_created_at ON technician_applications(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_contacts_updated_at BEFORE UPDATE ON chat_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technician_applications_updated_at BEFORE UPDATE ON technician_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample services
INSERT INTO services (name, description, category, price, duration, features, requirements) VALUES
('Plumbing Repair', 'Professional plumbing repair services for residential and commercial properties', 'Plumbing', 150.00, 120, ARRAY['24/7 Emergency Service', 'Licensed Technicians', 'Warranty Included'], ARRAY['Valid ID', 'Property Access']),
('Electrical Work', 'Complete electrical services including installation, repair, and maintenance', 'Electrical', 200.00, 180, ARRAY['Licensed Electricians', 'Safety Certified', 'Code Compliant'], ARRAY['Valid ID', 'Property Access', 'Power Shut-off']),
('HVAC Service', 'Heating, ventilation, and air conditioning installation and repair', 'HVAC', 250.00, 240, ARRAY['Certified Technicians', 'Energy Efficient', 'Maintenance Plans'], ARRAY['Valid ID', 'Property Access']),
('Home Cleaning', 'Professional home cleaning services for all types of properties', 'Cleaning', 100.00, 120, ARRAY['Eco-friendly Products', 'Insured Service', 'Satisfaction Guaranteed'], ARRAY['Valid ID', 'Property Access']),
('Carpentry Work', 'Custom carpentry and woodworking services', 'Carpentry', 175.00, 150, ARRAY['Custom Designs', 'Quality Materials', 'Expert Craftsmanship'], ARRAY['Valid ID', 'Property Access']);

-- Insert sample chat contacts
INSERT INTO chat_contacts (name, avatar, type, last_message, last_message_time, is_online) VALUES
('Support Team', '/avatars/support.jpg', 'support', 'How can we help you today?', NOW(), true),
('AI Assistant', '/avatars/ai.jpg', 'ai', 'I can help you with booking and questions', NOW(), true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called when a new user is created in auth.users
    -- The actual user creation in our tables will be handled by the application
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called when a user is updated in auth.users
    -- The actual user updates in our tables will be handled by the application
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Verify the schema
SELECT 
    'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'technicians', COUNT(*) FROM technicians
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'technician_applications', COUNT(*) FROM technician_applications
UNION ALL
SELECT 'chat_contacts', COUNT(*) FROM chat_contacts
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages;
