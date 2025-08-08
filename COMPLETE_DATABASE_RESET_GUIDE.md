# Complete Database Reset Guide

## 🗑️ **Step 1: Complete Database Wipe**

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to SQL Editor

2. **Run the wipe script:**
   ```sql
   -- Copy and paste the contents of complete-database-wipe.sql
   ```
   This will:
   - Delete ALL users from `auth.users`
   - Delete ALL data from custom tables
   - Drop ALL tables, functions, and sequences
   - Give you a completely clean slate

3. **Verify the wipe:**
   - You should see "Database completely wiped!" message
   - No tables should remain in the public schema
   - No users should remain in auth.users

## 🏗️ **Step 2: Fresh Database Setup**

1. **Run the fresh setup script:**
   ```sql
   -- Copy and paste the contents of fresh-database-setup-complete.sql
   ```
   This will:
   - Create all tables from scratch
   - Set up proper foreign key relationships
   - Create indexes for performance
   - Add triggers for updated_at timestamps
   - Grant proper permissions
   - Disable RLS for direct API access
   - Add sample services
   - Create a super admin user

2. **Verify the setup:**
   - You should see "Database setup complete!" message
   - All tables should be created
   - Sample services should be added
   - Super admin should be created

## 🧪 **Step 3: Test the New System**

### **Test Customer Registration:**
1. Go to your app homepage
2. Click "Customer Portal"
3. Choose "Register" tab
4. Fill in the form:
   - Name: "Test Customer"
   - Email: "customer@test.com"
   - Password: "password123"
5. Click "Create Customer Account"
6. Should redirect to `/dashboard`

### **Test Admin Registration:**
1. Go to your app homepage
2. Click "Admin Portal"
3. Choose "Register" tab
4. Fill in the form:
   - Name: "Test Admin"
   - Email: "admin@test.com"
   - Password: "password123"
5. Click "Create Admin Account"
6. Should redirect to `/admin`

### **Test Login:**
1. Try logging in with the accounts you just created
2. Verify proper redirects based on role

## 📊 **Expected Results:**

### **After Wipe:**
- `auth.users`: 0 users
- All custom tables: 0 records
- No tables in public schema

### **After Setup:**
- `admins`: 1 record (super admin)
- `services`: 5 records (sample services)
- All other tables: 0 records (ready for new data)

## 🔧 **Troubleshooting:**

### **If wipe fails:**
- Check if you have proper permissions
- Try running the script in smaller chunks
- Contact Supabase support if needed

### **If setup fails:**
- Check for any remaining objects from previous setup
- Run the wipe script again
- Try the setup script again

### **If registration fails:**
- Check browser console for errors
- Verify environment variables are correct
- Check Supabase logs for API errors

## 🚀 **Next Steps:**

1. **Deploy your updated code:**
   ```bash
   git add .
   git commit -m "Complete database reset and fresh setup"
   git push
   ```

2. **Test the complete flow:**
   - Customer registration → Dashboard
   - Admin registration → Admin panel
   - Login for both user types

3. **Monitor for any issues:**
   - Check browser console
   - Check Supabase logs
   - Test all functionality

## ✅ **Success Indicators:**

- ✅ No 406 errors
- ✅ No "User not found" errors
- ✅ Proper role-based redirects
- ✅ Clean registration process
- ✅ Working login system
- ✅ Separate customer and admin portals

**Your database is now completely fresh and ready for production use!**
