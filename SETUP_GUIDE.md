# FixNow Web App - Complete Setup Guide

## 🚨 Current Issues Identified

1. **Missing Environment Variables** - Supabase not configured
2. **RLS (Row Level Security) Infinite Recursion** - Database policies causing 500 errors
3. **Admin Dashboard Access** - No proper navigation to admin panel
4. **Authentication Flow** - Sign-in redirect issues
5. **Database Schema** - Missing tables and triggers
6. **API Integration** - Supabase connection issues

## 🔧 Step-by-Step Fix Guide

### Step 1: Environment Setup

1. **Create `.env` file** in the root directory:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
VITE_APP_NAME=FixNow
VITE_APP_VERSION=1.0.0
```

2. **Get Supabase Credentials**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing
   - Go to Settings > API
   - Copy the Project URL and anon/public key
   - Replace the placeholder values in `.env`

### Step 2: Database Setup

1. **Run the SQL Schema** in Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

2. **Fix RLS Issues** (run this first):
   ```sql
   -- Disable RLS temporarily to fix infinite recursion
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE technician_applications DISABLE ROW LEVEL SECURITY;
   ALTER TABLE services DISABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
   ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
   ```

3. **Create Admin User**:
   ```sql
   -- Check existing users
   SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;
   
   -- Make your user an admin (replace with your email)
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### Step 3: Application Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Test the Application**:
   - Go to `http://localhost:3000`
   - Sign up with a new account
   - Check if you can access the dashboard
   - Test admin functionality at `/admin`

### Step 4: Testing Each Feature

1. **Authentication**:
   - Sign up: `/auth`
   - Sign in: `/auth`
   - Dashboard: `/dashboard`

2. **Admin Features**:
   - Admin Dashboard: `/admin`
   - Technician Applications: Submit via `/technician-registration`

3. **Booking System**:
   - Browse Services: `/services`
   - Book Service: `/service/:id`
   - View Bookings: `/dashboard?tab=bookings`

4. **Chat System**:
   - Chat Interface: `/chat`

## 🐛 Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution**: Create `.env` file with proper Supabase credentials

### Issue 2: "infinite recursion detected in policy"
**Solution**: Run the RLS disable script above

### Issue 3: "Admin dashboard not accessible"
**Solution**: 
1. Make your user an admin in the database
2. Sign out and back in
3. Navigate to `/admin`

### Issue 4: "500 errors on API calls"
**Solution**: 
1. Check Supabase credentials in `.env`
2. Disable RLS temporarily
3. Ensure database tables exist

### Issue 5: "Authentication not working"
**Solution**:
1. Verify Supabase Auth is enabled
2. Check email confirmation settings
3. Ensure user triggers are working

## 🔍 Debugging Steps

1. **Check Browser Console** for errors
2. **Check Network Tab** for failed API calls
3. **Check Supabase Dashboard** for:
   - Authentication logs
   - Database errors
   - RLS policy issues

## 📋 Feature Checklist

- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] RLS issues fixed
- [ ] Admin user created
- [ ] Authentication working
- [ ] Dashboard accessible
- [ ] Admin panel working
- [ ] Booking system functional
- [ ] Chat system working
- [ ] Technician applications working

## 🚀 Production Deployment

1. **Vercel Setup**:
   - Connect GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

2. **Supabase Production**:
   - Enable Row Level Security properly
   - Set up proper authentication policies
   - Configure email templates

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase credentials
3. Test database connectivity
4. Check RLS policies

## 🎯 Next Steps

After fixing the current issues:
1. Implement proper RLS policies
2. Add payment integration
3. Implement real-time chat
4. Add mobile responsiveness
5. Implement advanced admin features
