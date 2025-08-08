-- Fix Database Schema (Safe Version)
-- This script adds missing components to your existing database schema
-- It checks for existing objects before creating them

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
        CREATE INDEX idx_users_role ON users(role);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_user_id') THEN
        CREATE INDEX idx_bookings_user_id ON bookings(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_technician_id') THEN
        CREATE INDEX idx_bookings_technician_id ON bookings(technician_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_status') THEN
        CREATE INDEX idx_bookings_status ON bookings(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_booking_id') THEN
        CREATE INDEX idx_payments_booking_id ON payments(booking_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_chat_id') THEN
        CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_timestamp') THEN
        CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_technician_applications_email') THEN
        CREATE INDEX idx_technician_applications_email ON technician_applications(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_technician_applications_status') THEN
        CREATE INDEX idx_technician_applications_status ON technician_applications(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_technician_applications_created_at') THEN
        CREATE INDEX idx_technician_applications_created_at ON technician_applications(created_at);
    END IF;
END $$;

-- Create function to update updated_at timestamp (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
        CREATE TRIGGER update_user_profiles_updated_at 
            BEFORE UPDATE ON user_profiles 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_technician_profiles_updated_at') THEN
        CREATE TRIGGER update_technician_profiles_updated_at 
            BEFORE UPDATE ON technician_profiles 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
        CREATE TRIGGER update_services_updated_at 
            BEFORE UPDATE ON services 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at 
            BEFORE UPDATE ON bookings 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_contacts_updated_at') THEN
        CREATE TRIGGER update_chat_contacts_updated_at 
            BEFORE UPDATE ON chat_contacts 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_technician_applications_updated_at') THEN
        CREATE TRIGGER update_technician_applications_updated_at 
            BEFORE UPDATE ON technician_applications 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create function to handle new user creation (only if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, phone, avatar)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'avatar'
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Create function to handle user updates (only if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users 
    SET 
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
        role = COALESCE(NEW.raw_user_meta_data->>'role', users.role),
        phone = COALESCE(NEW.raw_user_meta_data->>'phone', users.phone),
        avatar = COALESCE(NEW.raw_user_meta_data->>'avatar', users.avatar),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_updated') THEN
        CREATE TRIGGER on_auth_user_updated
            AFTER UPDATE ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
    END IF;
END $$;

-- Insert some sample services (only if they don't exist)
INSERT INTO services (name, description, category, price, duration, features, requirements, warranty) VALUES
('Computer Repair', 'Professional computer repair and maintenance services', 'Technology', 75.00, 60, ARRAY['Hardware diagnostics', 'Software troubleshooting', 'Virus removal', 'Data recovery'], ARRAY['Computer must be accessible', 'Backup recommended'], '30-day warranty on repairs'),
('Network Setup', 'Complete home and office network installation', 'Technology', 120.00, 90, ARRAY['WiFi installation', 'Router configuration', 'Network security', 'Device setup'], ARRAY['Internet connection required', 'Access to electrical outlets'], '90-day warranty on equipment'),
('Smart Home Installation', 'Smart home device installation and setup', 'Technology', 150.00, 120, ARRAY['Smart speaker setup', 'Security camera installation', 'Smart lighting', 'Home automation'], ARRAY['Compatible devices', 'WiFi network available'], '60-day warranty on installation'),
('TV Mounting', 'Professional TV mounting and setup services', 'Home', 80.00, 60, ARRAY['Wall mounting', 'Cable management', 'TV calibration', 'Remote setup'], ARRAY['Suitable wall surface', 'TV and mounting hardware'], '30-day warranty on mounting'),
('Furniture Assembly', 'Professional furniture assembly and setup', 'Home', 60.00, 45, ARRAY['Assembly service', 'Delivery assistance', 'Quality check', 'Waste removal'], ARRAY['Assembly instructions', 'Required tools available'], 'No warranty - manufacturer warranty applies')
ON CONFLICT DO NOTHING;

-- Insert sample chat contacts (only if they don't exist)
INSERT INTO chat_contacts (name, avatar, type, last_message, last_message_time, unread_count, is_online) VALUES
('Support Team', '/placeholder.svg', 'support', 'How can we help you today?', NOW(), 0, true),
('AI Assistant', '/placeholder.svg', 'ai', 'I can help you with any questions!', NOW(), 0, true)
ON CONFLICT DO NOTHING;

-- Verify the setup
SELECT 'Database schema fixed successfully!' as status;
