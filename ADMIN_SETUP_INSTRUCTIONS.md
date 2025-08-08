# Admin Setup Instructions

## Issue Fixed ✅
I've fixed the routing issue where `/admin` was redirecting to the sign-up page. The problem was that the Auth component wasn't preserving the intended destination when redirecting authenticated users.

## Current Status
- ✅ Routing fixed - `/admin` will now properly redirect to admin dashboard for admin users
- ✅ Auth component updated to preserve intended destination
- ⚠️ You need to create the database schema and admin user

## Step 1: Set Up Database Schema

First, you need to create the database tables in Supabase:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the complete schema script:**

```sql
-- TechConnect Portal Database Schema
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

-- Technician applications table
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
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_technician_applications_email ON technician_applications(email);
CREATE INDEX IF NOT EXISTS idx_technician_applications_status ON technician_applications(status);
```

## Step 2: Create Admin User

After the schema is set up, create an admin user:

### Option A: Make Your Current User an Admin
1. Go to your Supabase Dashboard → SQL Editor
2. Run this query (replace with your email):

```sql
-- First, check if your user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- If your user exists, insert them into the users table with admin role
INSERT INTO users (id, email, name, role) 
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', 'Admin User') as name,
    'admin' as role
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### Option B: Create a New Admin User
1. First, create a user account through your app (sign up)
2. Then run this query to make them admin:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@fixnow.com';
```

## Step 3: Verify Database Setup

Run these queries to verify everything is set up correctly:

```sql
-- Check if users table exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'users';

-- Check if admin user exists
SELECT id, email, name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check if technician_applications table exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'technician_applications';
```

## Step 4: Test the Admin Access

1. **Deploy the routing fixes:**
   ```bash
   git add .
   git commit -m "Fix admin routing and auth redirects"
   git push
   ```

2. **Wait for Vercel deployment to complete**

3. **Test the admin access:**
   - Visit `https://fixmy-home-pro.vercel.app/admin`
   - Sign in with your admin account
   - You should now see the admin dashboard instead of the sign-up page

## Troubleshooting

### If you get "table does not exist" errors:
1. Make sure you ran the complete schema script in Step 1
2. Check that all tables were created successfully
3. Verify the table names match exactly

### If you still see the sign-up page:
1. Check that your user has `role = 'admin'` in the `users` table
2. Clear your browser cache and cookies
3. Try accessing `/admin` in an incognito window

### If you can't access the admin dashboard:
1. Check the browser console for errors
2. Verify your user role in the database
3. Try logging out and logging back in

## Database Verification Commands

```sql
-- Check all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check admin users
SELECT id, email, name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check technician applications
SELECT COUNT(*) as application_count FROM technician_applications;
```

## Next Steps

Once the admin dashboard is working:
1. Test the technician application management
2. Set up additional admin features as needed
3. Configure admin notifications and alerts
