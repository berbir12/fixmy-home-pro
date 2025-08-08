# Fresh Database Start - Complete Guide

## 🗑️ **Step 1: Complete Cleanup**

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Execute complete-database-cleanup.sql
```

This will:
- ✅ Delete ALL existing tables
- ✅ Remove all triggers and functions
- ✅ Clean up all indexes
- ✅ Start completely fresh

## 🏗️ **Step 2: Create New Schema**

In the same SQL Editor, run:

```sql
-- Execute fresh-database-setup.sql
```

This will create:
- ✅ **`admins`** table (for admin users)
- ✅ **`customers`** table (for customer users)
- ✅ **`technicians`** table (for technician users)
- ✅ **`services`** table (with sample services)
- ✅ **`bookings`** table (for all bookings)
- ✅ **`payments`** table (for payment tracking)
- ✅ **`technician_applications`** table (for applications)
- ✅ **`chat_contacts`** and **`chat_messages`** tables
- ✅ All necessary indexes and triggers

## 👤 **Step 3: Create Your Admin User**

Replace `'your-email@example.com'` with your actual email and run:

```sql
-- Execute create-admin-user.sql
```

This will:
- ✅ Find your user in `auth.users`
- ✅ Create an admin record in the `admins` table
- ✅ Set you as a super admin
- ✅ Verify the creation

## 🚀 **Step 4: Deploy Application Changes**

```bash
git add .
git commit -m "Fresh database start with separate tables"
git push
```

## 🧪 **Step 5: Test the New System**

### **Test Admin Flow:**
1. Visit `https://fixmy-home-pro.vercel.app/admin`
2. Sign in with your admin account
3. Should see admin dashboard with full control

### **Test Customer Flow:**
1. Visit `https://fixmy-home-pro.vercel.app/auth`
2. Register a new account (will be customer)
3. Should be redirected to customer dashboard

## ✅ **Expected Results**

After running the scripts, you should see:

### **Database Tables:**
```
admins: 1 (your admin user)
customers: 0 (empty)
technicians: 0 (empty)
services: 5 (sample services)
bookings: 0 (empty)
payments: 0 (empty)
technician_applications: 0 (empty)
chat_contacts: 2 (support and AI)
chat_messages: 0 (empty)
```

### **Admin User:**
- ✅ Stored in `admins` table
- ✅ Role: 'admin'
- ✅ Super admin: true
- ✅ Full permissions

## 🔧 **New Database Structure Benefits**

### **Security:**
- ✅ Role-based access control
- ✅ Separate data isolation
- ✅ Granular permissions

### **Performance:**
- ✅ Smaller, focused tables
- ✅ Better indexing
- ✅ Faster queries

### **Maintenance:**
- ✅ Clear organization
- ✅ Easy debugging
- ✅ Simple backups

## 🎯 **Next Steps**

1. **Run the cleanup script** (Step 1)
2. **Run the setup script** (Step 2)
3. **Create your admin user** (Step 3)
4. **Deploy the changes** (Step 4)
5. **Test both flows** (Step 5)

This will give you a completely fresh, well-organized database with separate tables for admins, customers, and technicians!
