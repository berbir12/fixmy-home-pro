-- FixNow Web App - Complete Database Fix Script
-- This script fixes all database issues in one go

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_technician_profiles_updated_at ON technician_profiles;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_chat_contacts_updated_at ON chat_contacts;
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
DROP TRIGGER IF EXISTS update_technician_applications_updated_at ON technician_applications;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Step 3: Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    addresses JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    preferred_technicians TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technician_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    experience TEXT,
    hourly_rate DECIMAL(10,2),
    availability JSONB DEFAULT '{}'::jsonb,
    rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    skills TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    vehicle_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    features TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    warranty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    technician_name TEXT NOT NULL,
    technician_avatar TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    method TEXT CHECK (method IN ('credit_card', 'paypal', 'apple_pay', 'google_pay')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    type TEXT CHECK (type IN ('technician', 'support', 'ai')) NOT NULL,
    last_message TEXT,
    last_message_time TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('user', 'technician', 'support', 'ai')) NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('text', 'image', 'file', 'location')) DEFAULT 'text',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT CHECK (status IN ('sent', 'delivered', 'read')) DEFAULT 'sent'
);

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

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_technician_profiles_user_id ON technician_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_technician_applications_email ON technician_applications(email);
CREATE INDEX IF NOT EXISTS idx_technician_applications_status ON technician_applications(status);
CREATE INDEX IF NOT EXISTS idx_technician_applications_created_at ON technician_applications(created_at);

-- Step 5: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technician_profiles_updated_at BEFORE UPDATE ON technician_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_contacts_updated_at BEFORE UPDATE ON chat_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technician_applications_updated_at BEFORE UPDATE ON technician_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Disable RLS to fix infinite recursion issues
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE technician_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE technician_applications DISABLE ROW LEVEL SECURITY;

-- Step 8: Create user management functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), COALESCE(NEW.raw_user_meta_data->>'role', 'customer'));
    
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET 
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', OLD.raw_user_meta_data->>'name', 'User'),
        role = COALESCE(NEW.raw_user_meta_data->>'role', OLD.raw_user_meta_data->>'role', 'customer'),
        phone = COALESCE(NEW.raw_user_meta_data->>'phone', OLD.raw_user_meta_data->>'phone'),
        avatar = COALESCE(NEW.raw_user_meta_data->>'avatar', OLD.raw_user_meta_data->>'avatar'),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create triggers for user management
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Step 10: Insert sample data (only if tables are empty)
DO $$
BEGIN
    -- Insert sample services if none exist
    IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
        INSERT INTO services (name, description, category, price, duration, features, requirements, warranty) VALUES
        ('Computer Repair', 'Diagnose and fix computer hardware and software issues', 'computer-services', 89.99, 60, ARRAY['Hardware diagnostics', 'Software troubleshooting', 'Virus removal'], ARRAY['Computer must be accessible'], '30-day warranty'),
        ('Network Setup', 'Install and configure home or office networks', 'network-services', 149.99, 120, ARRAY['Router configuration', 'WiFi optimization', 'Security setup'], ARRAY['Router provided by customer'], '90-day warranty'),
        ('Smart Home Setup', 'Install and configure smart home devices', 'smart-home', 199.99, 180, ARRAY['Device installation', 'App configuration', 'Automation setup'], ARRAY['Devices provided by customer'], '60-day warranty'),
        ('Security Camera Installation', 'Install and configure security cameras', 'security-services', 299.99, 240, ARRAY['Camera mounting', 'DVR setup', 'Remote access'], ARRAY['Cameras provided by customer'], '90-day warranty'),
        ('Website Development', 'Create professional websites', 'web-digital', 999.99, 480, ARRAY['Custom design', 'Responsive layout', 'SEO optimization'], ARRAY['Content provided by customer'], '1-year warranty'),
        ('Video Editing', 'Professional video editing services', 'creative-services', 299.99, 240, ARRAY['Footage editing', 'Color correction', 'Final export'], ARRAY['Raw footage provided'], '30-day warranty');
    END IF;

    -- Insert sample chat contacts if none exist
    IF NOT EXISTS (SELECT 1 FROM chat_contacts LIMIT 1) THEN
        INSERT INTO chat_contacts (name, type, last_message, last_message_time, unread_count, is_online) VALUES
        ('Support Team', 'support', 'How can we help you today?', NOW(), 0, true),
        ('AI Assistant', 'ai', 'I can help you with any questions!', NOW(), 0, true),
        ('John Smith', 'technician', 'I''ll be there in 15 minutes', NOW() - INTERVAL '10 minutes', 0, true),
        ('Sarah Johnson', 'technician', 'The repair is complete', NOW() - INTERVAL '1 hour', 0, false);
    END IF;

    -- Insert sample chat messages if none exist
    IF NOT EXISTS (SELECT 1 FROM chat_messages LIMIT 1) THEN
        INSERT INTO chat_messages (chat_id, sender_id, sender_name, sender_type, content, type, timestamp, status) VALUES
        ('support-1', 'support-1', 'Support Team', 'support', 'Hello! How can we help you today?', 'text', NOW() - INTERVAL '5 minutes', 'read'),
        ('support-1', 'user-1', 'You', 'user', 'I need help with my computer', 'text', NOW() - INTERVAL '3 minutes', 'read'),
        ('support-1', 'support-1', 'Support Team', 'support', 'I can help you with that. What seems to be the issue?', 'text', NOW() - INTERVAL '2 minutes', 'delivered'),
        ('ai-1', 'ai-1', 'AI Assistant', 'ai', 'Hello! I''m here to help you with any questions about our services.', 'text', NOW() - INTERVAL '1 minute', 'read');
    END IF;
END $$;

-- Step 11: Create admin user (replace with your email)
-- Uncomment and modify the line below to create an admin user
-- INSERT INTO users (id, email, name, role) VALUES (gen_random_uuid(), 'admin@fixnow.com', 'Admin User', 'admin');

-- Step 12: Show current status
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as services_count FROM services;
SELECT COUNT(*) as applications_count FROM technician_applications;
