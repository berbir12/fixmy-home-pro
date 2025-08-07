# Supabase Setup Guide for TechConnect Portal

This guide will help you set up Supabase as the backend database for the TechConnect Portal.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The TechConnect Portal project set up

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `techconnect-portal`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql` from this project
4. Click "Run" to execute the schema
5. Verify that all tables are created by going to **Table Editor**

## Step 4: Configure Environment Variables

1. In your project root, edit the `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_USE_REAL_API=false

# Supabase Configuration
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace `your_project_url_here` with your actual Supabase project URL
3. Replace `your_anon_key_here` with your actual Supabase anon key

## Step 5: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Open your browser and navigate to the application
3. Try to register a new user or sign in
4. Check the browser console for any errors

## Step 6: Verify Database Integration

### Check User Registration
1. Register a new user through the app
2. Go to Supabase Dashboard → **Table Editor** → **users**
3. Verify that a new user record was created
4. Check **user_profiles** table for the corresponding profile

### Check Authentication
1. Sign in with the registered user
2. Verify that the user can access the dashboard
3. Check that user data is being retrieved from Supabase

## Step 7: Test Core Features

### Services
1. Navigate to the Services page
2. Verify that services are loaded from the database
3. Check the **services** table in Supabase

### Bookings
1. Create a new booking
2. Verify it appears in the **bookings** table
3. Test booking management features

### Chat
1. Navigate to the Chat page
2. Verify chat contacts are loaded
3. Test sending messages

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables" error
- Check that your `.env` file has the correct Supabase URL and anon key
- Ensure the environment variables are prefixed with `VITE_`
- Restart your development server after changing environment variables

#### 2. Authentication errors
- Verify your Supabase project is active
- Check that the anon key is correct
- Ensure Row Level Security (RLS) policies are properly set up

#### 3. Database connection errors
- Verify your Supabase project URL is correct
- Check that the database schema was applied successfully
- Ensure your project is not paused (free tier limitation)

#### 4. CORS errors
- Go to Supabase Dashboard → **Settings** → **API**
- Add your localhost URL to the allowed origins:
  - `http://localhost:5173` (Vite dev server)
  - `http://localhost:3000` (if using different port)

### Debugging Steps

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any JavaScript errors
   - Check Network tab for failed requests

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → **Logs**
   - Look for any error messages

3. **Verify Database Tables**
   - Go to Supabase Dashboard → **Table Editor**
   - Ensure all tables exist and have the correct structure

4. **Test Direct Database Access**
   - Go to Supabase Dashboard → **SQL Editor**
   - Run a simple query: `SELECT * FROM users LIMIT 5;`

## Advanced Configuration

### Row Level Security (RLS)
The schema includes RLS policies for security. You can modify these in the Supabase Dashboard:
1. Go to **Authentication** → **Policies**
2. Review and modify policies as needed

### Real-time Features
To enable real-time features (chat, notifications):
1. Go to **Database** → **Replication**
2. Enable real-time for specific tables

### Storage (for file uploads)
To enable file uploads (avatars, documents):
1. Go to **Storage**
2. Create buckets for different file types
3. Set up appropriate policies

## Production Deployment

### Environment Variables for Production
```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Security Considerations
1. **Never expose your service role key** - only use the anon key in the frontend
2. **Set up proper RLS policies** - the schema includes basic policies
3. **Use environment variables** - never hardcode credentials
4. **Enable SSL** - ensure all connections use HTTPS in production

### Performance Optimization
1. **Database Indexes** - the schema includes basic indexes
2. **Connection Pooling** - Supabase handles this automatically
3. **Caching** - consider implementing client-side caching with React Query

## Monitoring and Analytics

### Supabase Dashboard
- **Database**: Monitor query performance and usage
- **Authentication**: Track user sign-ups and sessions
- **Logs**: Review error logs and API usage

### Application Monitoring
- Implement error tracking (Sentry, LogRocket)
- Monitor user interactions and performance
- Set up alerts for critical errors

## Backup and Recovery

### Database Backups
- Supabase automatically creates daily backups
- You can also create manual backups via the dashboard
- Consider setting up additional backup strategies

### Data Export
- Use Supabase's export functionality
- Implement regular data exports for compliance
- Set up automated backup verification

## Support and Resources

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Guide](https://supabase.com/docs/guides/database)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Troubleshooting Resources
- [Supabase Status](https://status.supabase.com)
- [Common Issues](https://supabase.com/docs/guides/troubleshooting)
- [Performance Tips](https://supabase.com/docs/guides/performance)

## Next Steps

After setting up Supabase:

1. **Implement Real-time Features**
   - Real-time chat updates
   - Live booking notifications
   - Status updates

2. **Add Advanced Features**
   - File uploads for documents
   - Image storage for avatars
   - Email notifications

3. **Optimize Performance**
   - Implement caching strategies
   - Optimize database queries
   - Add pagination for large datasets

4. **Enhance Security**
   - Implement additional RLS policies
   - Add rate limiting
   - Set up monitoring and alerts

5. **Scale the Application**
   - Monitor usage patterns
   - Optimize database performance
   - Plan for increased load

## Migration from Mock API

To switch from the mock API to Supabase:

1. Set `VITE_USE_SUPABASE=true` in your `.env` file
2. Restart your development server
3. Test all features to ensure they work with real data
4. Remove mock data and API files if no longer needed

The application will automatically use Supabase when the environment variable is set to `true`.
