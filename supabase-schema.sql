-- TechConnect Portal Database Schema
-- This script sets up the complete database structure for the TechConnect Portal

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
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

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    addresses JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{
        "notifications": {"email": true, "sms": true, "push": true},
        "privacy": {"shareLocation": false, "shareContact": false}
    }'::jsonb,
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    preferred_technicians TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technician profiles table
CREATE TABLE IF NOT EXISTS technician_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    features TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    warranty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
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
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
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

-- Chat contacts table
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

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('user', 'technician', 'support', 'ai')) NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('text', 'image', 'file', 'location')) DEFAULT 'text',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT CHECK (status IN ('sent', 'delivered', 'read')) DEFAULT 'sent'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technician_profiles_updated_at BEFORE UPDATE ON technician_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_contacts_updated_at BEFORE UPDATE ON chat_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Technician profiles policies
CREATE POLICY "Technicians can view their own profile" ON technician_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Technicians can update their own profile" ON technician_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Technicians can insert their own profile" ON technician_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view active technician profiles" ON technician_profiles FOR SELECT USING (is_active = true);

-- Services policies
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Technicians can view their assigned bookings" ON bookings FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Technicians can update their assigned bookings" ON bookings FOR UPDATE USING (auth.uid() = technician_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create payments for their bookings" ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Chat contacts policies
CREATE POLICY "Anyone can view chat contacts" ON chat_contacts FOR SELECT USING (true);

-- Chat messages policies
CREATE POLICY "Users can view messages in their chats" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON chat_messages FOR UPDATE USING (auth.uid() = sender_id);

-- Insert initial data

-- Sample services
INSERT INTO services (name, description, category, price, duration, features, requirements, warranty) VALUES
('Computer Diagnostics & Repair', 'Comprehensive computer diagnostics and repair services for all major brands', 'Computer Services', 89.99, 60, ARRAY['Virus Removal', 'Hardware Diagnostics', 'Software Installation', 'Data Recovery'], ARRAY['Computer must be accessible', 'Power supply available'], '30-day warranty on repairs'),
('Network Installation & Setup', 'Professional network installation and configuration for homes and small businesses', 'Network Services', 149.99, 90, ARRAY['WiFi Setup', 'Router Configuration', 'Network Security', 'Device Connection'], ARRAY['Internet service available', 'Access to router location'], '90-day warranty on installation'),
('Smart Home Setup', 'Complete smart home installation and configuration services', 'Smart Home', 199.99, 120, ARRAY['Smart Speaker Setup', 'Security Camera Installation', 'Smart Thermostat', 'Lighting Control'], ARRAY['Compatible devices available', 'WiFi network ready'], '1-year warranty on installation'),
('Printer Setup & Troubleshooting', 'Professional printer installation, configuration, and troubleshooting', 'Office Equipment', 69.99, 45, ARRAY['Printer Installation', 'Driver Setup', 'Network Configuration', 'Troubleshooting'], ARRAY['Printer available', 'Computer access'], '30-day warranty on setup'),
('Data Backup & Recovery', 'Secure data backup solutions and data recovery services', 'Data Services', 129.99, 90, ARRAY['Cloud Backup Setup', 'Local Backup', 'Data Recovery', 'Security Setup'], ARRAY['Storage device available', 'Data access required'], '90-day warranty on backup systems'),
('Laptop Repair & Maintenance', 'Professional laptop repair and maintenance services for all brands', 'Computer Services', 119.99, 75, ARRAY['Screen Replacement', 'Keyboard Repair', 'Battery Replacement', 'Performance Optimization'], ARRAY['Laptop must be accessible', 'Backup data recommended'], '60-day warranty on repairs'),
('Server Setup & Maintenance', 'Professional server installation, configuration, and maintenance services', 'Network Services', 299.99, 180, ARRAY['Server Installation', 'OS Configuration', 'Security Setup', 'Backup Configuration'], ARRAY['Server hardware available', 'Network infrastructure ready'], '1-year warranty on setup'),
('Security Camera Installation', 'Complete security camera system installation and setup', 'Security Services', 249.99, 120, ARRAY['Camera Installation', 'DVR Setup', 'Mobile App Configuration', 'Remote Monitoring'], ARRAY['Mounting locations available', 'Power outlets accessible'], '1-year warranty on installation'),
('Home Theater Setup', 'Professional home theater system installation and calibration', 'Entertainment', 179.99, 90, ARRAY['Speaker Installation', 'Receiver Setup', 'Video Calibration', 'Remote Programming'], ARRAY['Space available for setup', 'Power outlets accessible'], '90-day warranty on setup'),
('Gaming PC Build & Setup', 'Custom gaming PC assembly and optimization services', 'Computer Services', 199.99, 150, ARRAY['PC Assembly', 'OS Installation', 'Driver Setup', 'Performance Tuning'], ARRAY['Components available', 'Workspace ready'], '90-day warranty on build'),
('WiFi Network Optimization', 'Professional WiFi network optimization and troubleshooting', 'Network Services', 89.99, 60, ARRAY['Signal Analysis', 'Router Optimization', 'Dead Zone Elimination', 'Speed Testing'], ARRAY['WiFi network active', 'Access to router'], '30-day warranty on optimization'),
('Software Installation & Training', 'Professional software installation and user training services', 'Computer Services', 79.99, 60, ARRAY['Software Installation', 'User Training', 'Data Migration', 'Support Setup'], ARRAY['Computer available', 'Software licenses ready'], '30-day warranty on installation'),
('Mobile Device Repair', 'Professional smartphone and tablet repair services', 'Mobile Services', 99.99, 45, ARRAY['Screen Replacement', 'Battery Replacement', 'Water Damage Repair', 'Data Recovery'], ARRAY['Device available', 'Backup recommended'], '30-day warranty on repairs'),
('Website Development & Hosting', 'Professional website development and hosting services', 'Web Services', 399.99, 240, ARRAY['Website Design', 'Domain Setup', 'Hosting Configuration', 'SEO Optimization'], ARRAY['Content ready', 'Domain name available'], '1-year warranty on hosting'),
('Cloud Storage Setup', 'Professional cloud storage configuration and migration services', 'Data Services', 69.99, 45, ARRAY['Cloud Setup', 'Data Migration', 'Security Configuration', 'Backup Setup'], ARRAY['Internet connection', 'Data accessible'], '90-day warranty on setup'),
('Digital Marketing Setup', 'Professional digital marketing platform setup and optimization', 'Marketing Services', 149.99, 90, ARRAY['Social Media Setup', 'Analytics Configuration', 'Ad Platform Setup', 'Content Strategy'], ARRAY['Business information ready', 'Marketing goals defined'], '90-day warranty on setup'),
('E-commerce Platform Setup', 'Professional e-commerce website setup and configuration', 'Web Services', 299.99, 180, ARRAY['Platform Setup', 'Payment Integration', 'Inventory Management', 'Security Setup'], ARRAY['Product information ready', 'Payment processor available'], '1-year warranty on setup'),
('Video Editing Setup', 'Professional video editing workstation setup and training', 'Creative Services', 159.99, 120, ARRAY['Hardware Setup', 'Software Installation', 'Workflow Training', 'Optimization'], ARRAY['Computer available', 'Storage space ready'], '90-day warranty on setup'),
('Audio Recording Setup', 'Professional audio recording equipment setup and configuration', 'Creative Services', 129.99, 90, ARRAY['Equipment Setup', 'Software Configuration', 'Acoustic Treatment', 'Training'], ARRAY['Space available', 'Equipment ready'], '90-day warranty on setup'),
('Virtual Reality Setup', 'Professional VR system installation and configuration', 'Entertainment', 199.99, 120, ARRAY['VR Setup', 'Room Configuration', 'Software Installation', 'Training'], ARRAY['Space available', 'VR equipment ready'], '90-day warranty on setup'),
('Drone Setup & Training', 'Professional drone setup, configuration, and pilot training', 'Aerial Services', 249.99, 150, ARRAY['Drone Assembly', 'Controller Setup', 'Flight Training', 'Safety Training'], ARRAY['Open space available', 'Drone equipment ready'], '1-year warranty on setup'),
('3D Printing Setup', 'Professional 3D printer setup and configuration services', 'Manufacturing', 179.99, 120, ARRAY['Printer Assembly', 'Software Setup', 'Calibration', 'Training'], ARRAY['Space available', '3D printer ready'], '90-day warranty on setup'),
('Smart Office Setup', 'Complete smart office automation and configuration', 'Smart Home', 399.99, 240, ARRAY['Automation Setup', 'Device Integration', 'Workflow Optimization', 'Training'], ARRAY['Office space available', 'Devices ready'], '1-year warranty on setup'),
('IoT Device Integration', 'Professional IoT device integration and automation services', 'Smart Home', 159.99, 90, ARRAY['Device Setup', 'Network Integration', 'Automation Configuration', 'Training'], ARRAY['Devices available', 'WiFi network ready'], '90-day warranty on setup'),
('Cybersecurity Assessment', 'Professional cybersecurity assessment and protection setup', 'Security Services', 299.99, 180, ARRAY['Security Audit', 'Vulnerability Assessment', 'Protection Setup', 'Training'], ARRAY['Network access', 'Devices available'], '1-year warranty on assessment'),
('Digital Art Setup', 'Professional digital art workstation setup and training', 'Creative Services', 139.99, 90, ARRAY['Hardware Setup', 'Software Installation', 'Training', 'Workflow Optimization'], ARRAY['Computer available', 'Graphics tablet ready'], '90-day warranty on setup'),
('Podcast Studio Setup', 'Professional podcast recording studio setup and configuration', 'Creative Services', 199.99, 120, ARRAY['Equipment Setup', 'Software Configuration', 'Acoustic Treatment', 'Training'], ARRAY['Space available', 'Equipment ready'], '90-day warranty on setup'),
('Live Streaming Setup', 'Professional live streaming equipment setup and configuration', 'Creative Services', 179.99, 90, ARRAY['Equipment Setup', 'Platform Configuration', 'Stream Optimization', 'Training'], ARRAY['Space available', 'Equipment ready'], '90-day warranty on setup'),
('Photography Workstation', 'Professional photography editing workstation setup', 'Creative Services', 189.99, 120, ARRAY['Hardware Setup', 'Software Installation', 'Color Calibration', 'Training'], ARRAY['Computer available', 'Monitor ready'], '90-day warranty on setup'),
('CAD Workstation Setup', 'Professional CAD workstation setup and optimization', 'Engineering', 249.99, 150, ARRAY['Hardware Setup', 'Software Installation', 'Performance Optimization', 'Training'], ARRAY['Computer available', 'Software licenses ready'], '1-year warranty on setup'),
('Video Conferencing Setup', 'Professional video conferencing system setup and optimization', 'Communication', 129.99, 60, ARRAY['Equipment Setup', 'Platform Configuration', 'Network Optimization', 'Training'], ARRAY['Space available', 'Equipment ready'], '90-day warranty on setup'),
('Smart Retail Setup', 'Complete smart retail system setup and configuration', 'Retail Services', 499.99, 300, ARRAY['POS Setup', 'Inventory System', 'Security Integration', 'Training'], ARRAY['Retail space available', 'Equipment ready'], '1-year warranty on setup'),
('Fitness Tech Setup', 'Professional fitness technology setup and configuration', 'Health Services', 159.99, 90, ARRAY['Equipment Setup', 'App Configuration', 'Data Integration', 'Training'], ARRAY['Space available', 'Equipment ready'], '90-day warranty on setup'),
('Educational Tech Setup', 'Professional educational technology setup and training', 'Education Services', 199.99, 120, ARRAY['Equipment Setup', 'Software Installation', 'Training', 'Support Setup'], ARRAY['Classroom available', 'Equipment ready'], '90-day warranty on setup');

-- Sample chat contacts
INSERT INTO chat_contacts (name, type, last_message, last_message_time, unread_count, is_online) VALUES
('Tech Support', 'support', 'How can I help you today?', NOW(), 0, true),
('AI Assistant', 'ai', 'I can help you with any questions about our services', NOW(), 0, true),
('John Smith - Technician', 'technician', 'I''ll be there in 15 minutes', NOW() - INTERVAL '1 hour', 0, false);

-- Sample chat messages
INSERT INTO chat_messages (chat_id, sender_id, sender_name, sender_type, content, type, timestamp, status) VALUES
('support-1', NULL, 'Tech Support', 'support', 'Hello! How can I help you today?', 'text', NOW() - INTERVAL '1 day', 'read'),
('support-1', NULL, 'User', 'user', 'I need help with my computer', 'text', NOW() - INTERVAL '1 day', 'read'),
('ai-1', NULL, 'AI Assistant', 'ai', 'I can help you with any questions about our services', 'text', NOW() - INTERVAL '2 hours', 'read'),
('technician-1', NULL, 'John Smith - Technician', 'technician', 'I''ll be there in 15 minutes', 'text', NOW() - INTERVAL '1 hour', 'read');

-- Create a function to automatically create user profile when a user signs up
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

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update user data when auth.users is updated
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

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
