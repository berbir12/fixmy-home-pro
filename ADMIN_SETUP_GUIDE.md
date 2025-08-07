# 🛡️ Admin Dashboard Setup Guide

## Overview

The FixNow web app now includes a comprehensive **Admin Dashboard** with role-based access control. Only users with the `admin` role can access this dashboard.

## 🔐 Admin Access Setup

### Step 1: Create Admin User

1. **Sign up as a regular user** first:
   - Go to `/auth`
   - Create a new account with your email
   - Complete the registration process

2. **Make your user an admin** in the database:
   ```sql
   -- Check existing users
   SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;
   
   -- Make your user an admin (replace with your email)
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   
   -- Verify the change
   SELECT id, email, name, role FROM users WHERE email = 'your-email@example.com';
   ```

3. **Sign out and back in** to refresh your session

### Step 2: Access Admin Dashboard

1. **Navigate to admin dashboard**:
   - Click the "Admin" button in the header (if you're an admin)
   - Or go directly to `/admin`

2. **Verify access**:
   - You should see the admin dashboard with overview stats
   - If you get redirected, check that your user role is set to 'admin'

## 🎯 Admin Dashboard Features

### 📊 Overview Tab
- **Dashboard Statistics**: Total users, revenue, bookings, applications
- **Recent Activity**: Latest system events and activities
- **Quick Metrics**: Key performance indicators

### 📝 Applications Tab
- **View All Applications**: See all technician applications
- **Search & Filter**: Find specific applications by name, email, or status
- **Status Management**: Update application status (pending → reviewing → approved → hired)
- **Detailed View**: Click on any application to see full details
- **Admin Notes**: Add internal notes for each application

### 👥 Users Tab (Coming Soon)
- User management interface
- Role assignment
- Account activation/deactivation
- User activity monitoring

### 📅 Bookings Tab (Coming Soon)
- View all bookings
- Assign technicians
- Monitor progress
- Generate reports

### ⚙️ Settings Tab (Coming Soon)
- System configuration
- Email templates
- Notification settings
- Security settings

## 🔧 Application Management

### Application Statuses
1. **Pending** - New application, needs review
2. **Reviewing** - Under admin review
3. **Approved** - Application approved, ready for hiring
4. **Rejected** - Application rejected
5. **Hired** - Technician hired and onboarded

### How to Review Applications

1. **Navigate to Applications tab**
2. **Search or filter** applications as needed
3. **Click on an application** to view details
4. **Review the information**:
   - Personal details
   - Experience and skills
   - Hourly rate
   - Specialties
5. **Update status** using the dropdown
6. **Add admin notes** if needed
7. **Save changes**

### Application Details Include
- **Personal Info**: Name, email, phone, address
- **Experience**: Years of experience, background
- **Skills**: Specialties, certifications, languages
- **Rates**: Hourly rate expectations
- **Availability**: Schedule and availability
- **Documents**: Resume, certifications (if uploaded)

## 🚨 Security Features

### Role-Based Access Control
- Only users with `admin` role can access `/admin`
- Automatic redirect for unauthorized users
- Session-based authentication

### Admin Session Management
- Secure logout functionality
- Session timeout handling
- Activity logging (coming soon)

## 🐛 Troubleshooting

### Issue: "Access Denied" when trying to access admin
**Solution**:
1. Check that your user role is set to 'admin' in the database
2. Sign out and back in to refresh your session
3. Clear browser cache and try again

### Issue: Admin dashboard not loading
**Solution**:
1. Check browser console for errors
2. Verify Supabase connection
3. Ensure database tables exist
4. Check network connectivity

### Issue: Can't update application status
**Solution**:
1. Check that you're logged in as admin
2. Verify the application exists in the database
3. Check for any API errors in browser console
4. Try refreshing the page

### Issue: No applications showing
**Solution**:
1. Check if technician applications have been submitted
2. Verify the `technician_applications` table exists
3. Check for any database connection issues
4. Try the search/filter functions

## 📋 Admin Checklist

### Daily Tasks
- [ ] Review new technician applications
- [ ] Update application statuses
- [ ] Check dashboard statistics
- [ ] Monitor recent activity

### Weekly Tasks
- [ ] Review pending applications
- [ ] Update admin notes
- [ ] Check system performance
- [ ] Review user feedback

### Monthly Tasks
- [ ] Generate application reports
- [ ] Review hiring statistics
- [ ] Update admin settings
- [ ] Backup important data

## 🔄 Future Enhancements

### Planned Features
- **User Management**: Full user administration interface
- **Booking Management**: Complete booking oversight
- **Analytics Dashboard**: Advanced reporting and analytics
- **Email Templates**: Customizable email notifications
- **Bulk Operations**: Mass application processing
- **Audit Logs**: Complete activity tracking

### Advanced Admin Features
- **Role Management**: Create and assign custom roles
- **Permission System**: Granular access control
- **System Monitoring**: Real-time system health
- **Data Export**: Export data in various formats
- **API Management**: Admin API endpoints

## 📞 Support

If you encounter issues with the admin dashboard:

1. **Check the browser console** for JavaScript errors
2. **Verify your admin role** in the database
3. **Test the application flow** end-to-end
4. **Check the network tab** for failed API calls
5. **Review the database logs** in Supabase

## 🎯 Success Metrics

### Admin Dashboard Success Indicators
- ✅ Admin can access dashboard without issues
- ✅ Application status updates work correctly
- ✅ Search and filter functions work
- ✅ Admin notes are saved properly
- ✅ Role-based access control works
- ✅ Dashboard statistics are accurate

The admin dashboard is now fully functional and ready for managing technician applications and system administration!
