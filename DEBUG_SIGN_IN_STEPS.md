# Debug Sign-In Issue

## Steps to Debug:

1. **Open Browser Developer Tools**
   - Press F12 or right-click and select "Inspect"
   - Go to the "Console" tab

2. **Clear Browser Data**
   - Clear localStorage: `localStorage.clear()` in console
   - Clear sessionStorage: `sessionStorage.clear()` in console
   - Refresh the page

3. **Test Sign-In**
   - Go to http://localhost:8081/auth
   - Enter test credentials (or register a new account)
   - Click "Sign In"
   - Watch the console logs

## Expected Console Logs:

```
🔗 Auth component: Attempting login with: {email: "test@example.com"}
🔗 Auth component: Current auth state before login: {isAuthenticated: false, isLoading: false}
🔗 Login mutation called with: {email: "test@example.com"}
🔗 SupabaseApiClient login called with: {email: "test@example.com"}
🔗 Login success response: {success: true, data: {...}}
🔗 Setting auth state with user: {...}
🔗 Auth state changed: {user: {...}, isAuthenticated: true, isLoading: false}
🔗 Setting navigation flag to dashboard
🔗 Effect: shouldNavigate changed to /dashboard
🔗 Effect: Navigating to /dashboard
🔗 ProtectedRoute: {isAuthenticated: true, isLoading: false, requireAuth: true, pathname: "/dashboard"}
🔗 ProtectedRoute: Rendering children
```

## If Sign-In Still Doesn't Work:

### Check 1: Token Storage
```javascript
// In browser console, check if token is stored:
console.log('Token:', localStorage.getItem('auth_token'));
```

### Check 2: Auth State
```javascript
// Check if auth state is correct:
console.log('Auth state:', window.authState);
```

### Check 3: Network Requests
- Go to "Network" tab in DevTools
- Look for failed requests to Supabase
- Check if environment variables are set correctly

### Check 4: Environment Variables
Make sure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Common Issues:

1. **Email Confirmation Required**: Check if email confirmation is enabled in Supabase
2. **Invalid Credentials**: Make sure the user exists and password is correct
3. **Environment Variables**: Ensure Supabase URL and key are correct
4. **CORS Issues**: Check if Supabase is configured for your domain

## Quick Test:

1. Register a new account first
2. Then try to sign in with those credentials
3. Check if the user appears in your Supabase dashboard

## If Still Not Working:

1. Check the browser console for any error messages
2. Look for network request failures
3. Verify Supabase configuration
4. Try disabling email confirmation in Supabase dashboard for testing
