# 🔧 Fixing Supabase Email Confirmation Issue

## Problem
You're getting this error when trying to register:
```
http://localhost:3000/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

This happens because Supabase requires email confirmation by default, but the confirmation links are expiring too quickly.

## Solution

### Option 1: Disable Email Confirmation (Recommended for Development)

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to **Authentication** → **Settings**
   - Scroll down to **Email Auth**

3. **Disable Email Confirmation**
   - Uncheck **"Enable email confirmations"**
   - Click **Save**

4. **Test Registration**
   - Try registering again
   - Users should now be able to sign up without email confirmation

### Option 2: Configure Email Settings (For Production)

If you want to keep email confirmation for production:

1. **Configure Email Provider**
   - Go to **Authentication** → **Settings** → **Email Templates**
   - Set up a proper email provider (SMTP or Supabase's built-in email)

2. **Adjust Confirmation Settings**
   - Set **"Confirmation link expiry"** to a longer time (e.g., 24 hours)
   - Configure proper redirect URLs

3. **Update Site URL**
   - Go to **Authentication** → **Settings** → **URL Configuration**
   - Set **Site URL** to your domain
   - Add redirect URLs for your domain

### Option 3: Use Magic Link (Alternative)

If you prefer passwordless authentication:

1. **Enable Magic Link**
   - Go to **Authentication** → **Settings** → **Email Auth**
   - Enable **"Enable magic links"**

2. **Update Code**
   - Use `supabase.auth.signInWithOtp()` instead of `signUp()`

## Current Code Changes

The code has been updated to:
- Handle email confirmation requirements
- Show appropriate error messages
- Add debugging logs to track the registration process

## Testing

After making the Supabase settings changes:

1. **Clear browser cache**
2. **Try registering again**
3. **Check browser console** for debug logs:
   ```
   🔗 API Client: Using SupabaseApiClient
   🔗 SupabaseApiClient register called with: { email, name, phone }
   🔗 Supabase signUp response: { data, error }
   ```

## Environment Variables

Make sure your Vercel environment variables are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Next Steps

1. **Disable email confirmation** in Supabase dashboard
2. **Test registration** with a new email
3. **Check that users can log in** immediately after registration
4. **Verify data is saved** to your Supabase database

The registration should now work without email confirmation delays!
