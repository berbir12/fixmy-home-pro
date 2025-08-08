# Rebuild Admin System - Complete Plan

## 🎯 **Goal**
Create a proper admin system with clear separation between user and admin roles:
- **Users** → Go to user dashboard (my account, bookings, etc.)
- **Admins** → Go to admin dashboard (control everything)

## 🔧 **Step 1: Clean Database**
First, we need to clean all existing users and start fresh:

```sql
-- Clean all existing data
DELETE FROM chat_messages;
DELETE FROM chat_contacts;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM technician_applications;
DELETE FROM technician_profiles;
DELETE FROM user_profiles;
DELETE FROM users;
```

## 🔧 **Step 2: Create New Admin User**
After cleaning, create a proper admin user:

```sql
-- Create admin user (replace with your email)
INSERT INTO users (id, email, name, role) 
VALUES (
    'your-supabase-user-id', 
    'your-email@example.com', 
    'Admin User', 
    'admin'
);
```

## 🔧 **Step 3: New Admin Dashboard Structure**

### Admin Dashboard Features:
1. **Overview Tab**
   - Total users, bookings, technicians
   - Revenue statistics
   - Recent activity

2. **Users Management Tab**
   - View all users
   - Edit user roles
   - Delete users
   - User statistics

3. **Bookings Management Tab**
   - View all bookings
   - Update booking status
   - Assign technicians
   - Booking analytics

4. **Technician Applications Tab**
   - Review applications
   - Approve/reject technicians
   - Manage technician profiles

5. **Technicians Management Tab**
   - View all technicians
   - Edit technician profiles
   - Manage availability
   - Performance metrics

## 🔧 **Step 4: New User Dashboard Structure**

### User Dashboard Features:
1. **My Account**
   - Profile information
   - Settings
   - Preferences

2. **My Bookings**
   - View booking history
   - Current bookings
   - Booking details

3. **Services**
   - Browse services
   - Book new services

4. **Support**
   - Contact support
   - FAQ

## 🔧 **Step 5: Authentication Flow**

### Login Process:
1. User enters credentials
2. System checks user role
3. **If admin** → Redirect to `/admin`
4. **If user** → Redirect to `/dashboard`

### Registration Process:
1. User registers
2. Default role is 'customer'
3. Redirect to user dashboard

## 🔧 **Step 6: Route Protection**

### Protected Routes:
- `/admin` → Only accessible by admin users
- `/dashboard` → Only accessible by regular users
- `/auth` → Public access

## 🔧 **Step 7: Implementation Steps**

1. **Clean database** (Step 1)
2. **Update authentication logic** (useAuth.ts)
3. **Create new admin dashboard** (AdminDashboard.tsx)
4. **Create new user dashboard** (Dashboard.tsx)
5. **Update routing** (App.tsx)
6. **Test both flows**

## 🎯 **Expected Behavior**

### Admin Login:
- Visit `/admin` → Shows admin dashboard
- Visit `/dashboard` → Redirects to `/admin`
- Full control over all data

### User Login:
- Visit `/dashboard` → Shows user dashboard
- Visit `/admin` → Redirects to `/dashboard`
- Limited to their own data

### Registration:
- New users → Default role 'customer'
- Redirect to user dashboard

This will create a clean, professional admin system with proper role separation.
