# New Database Structure - Separate Tables

## ✅ **Why Separate Tables?**

### 🎯 **Benefits:**
- **Better Organization**: Clear separation of concerns
- **Enhanced Security**: Different permissions per user type
- **Improved Performance**: Smaller, focused tables
- **Easier Maintenance**: Simpler queries and updates
- **Scalability**: Can add role-specific fields easily

## 🏗️ **New Table Structure**

### 1. **`admins` Table**
```sql
CREATE TABLE admins (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    phone TEXT,
    avatar TEXT,
    permissions JSONB, -- Granular permissions
    is_super_admin BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- ✅ Granular permissions system
- ✅ Super admin flag
- ✅ Last login tracking
- ✅ Role-specific fields

### 2. **`customers` Table**
```sql
CREATE TABLE customers (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    avatar TEXT,
    addresses JSONB DEFAULT '[]',
    preferences JSONB, -- Notification preferences
    total_spent DECIMAL(10,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    preferred_technicians TEXT[],
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- ✅ Address management
- ✅ Preferences system
- ✅ Loyalty program
- ✅ Verification status

### 3. **`technicians` Table**
```sql
CREATE TABLE technicians (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'technician',
    phone TEXT,
    avatar TEXT,
    specialties TEXT[],
    certifications TEXT[],
    experience TEXT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    availability JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    skills TEXT[],
    languages TEXT[],
    vehicle_info JSONB,
    is_verified BOOLEAN DEFAULT false,
    application_status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- ✅ Specialties and certifications
- ✅ Availability management
- ✅ Rating system
- ✅ Application status tracking

## 🔗 **Relationships**

### **Bookings Table:**
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    service_id UUID REFERENCES services(id),
    technician_id UUID REFERENCES technicians(id),
    customer_id UUID REFERENCES customers(id),
    -- ... other fields
);
```

### **Payments Table:**
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES customers(id),
    -- ... other fields
);
```

## 🔐 **Authentication Flow**

### **Registration Process:**
1. User registers → Creates `auth.users` record
2. Application creates record in appropriate table:
   - **Customer** → `customers` table
   - **Technician** → `technicians` table
   - **Admin** → `admins` table (manual creation)

### **Login Process:**
1. User logs in → Authenticates with `auth.users`
2. Application checks all three tables:
   - Check `admins` table first
   - Check `customers` table
   - Check `technicians` table
3. Returns user with appropriate role and data

## 🚀 **Implementation Steps**

### 1. **Set Up New Schema**
```sql
-- Run new-database-schema.sql in Supabase SQL Editor
```

### 2. **Create First Admin**
```sql
-- Run create-first-admin.sql
-- Replace 'your-email@example.com' with your email
```

### 3. **Update Application Code**
- Update API functions to work with separate tables
- Update authentication logic
- Update dashboard components

### 4. **Test All Flows**
- Admin registration/login
- Customer registration/login
- Technician registration/login

## 🎯 **Expected Behavior**

### **Admin Users:**
- ✅ Stored in `admins` table
- ✅ Access to admin dashboard
- ✅ Full permissions system
- ✅ Super admin capabilities

### **Customer Users:**
- ✅ Stored in `customers` table
- ✅ Access to customer dashboard
- ✅ Booking management
- ✅ Profile preferences

### **Technician Users:**
- ✅ Stored in `technicians` table
- ✅ Access to technician dashboard
- ✅ Job management
- ✅ Application status tracking

## 🔧 **Key Advantages**

### **Security:**
- ✅ Role-based access control
- ✅ Granular permissions
- ✅ Separate data isolation

### **Performance:**
- ✅ Smaller, focused tables
- ✅ Better indexing
- ✅ Faster queries

### **Maintenance:**
- ✅ Clear data organization
- ✅ Easier debugging
- ✅ Simple backups

### **Scalability:**
- ✅ Easy to add new roles
- ✅ Role-specific features
- ✅ Flexible permissions

This new structure provides a much more organized, secure, and scalable database design!
