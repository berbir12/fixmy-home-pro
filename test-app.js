// Test script to verify FixNow app functionality
// Run this in the browser console to test various features

console.log('🧪 FixNow App Test Suite');
console.log('========================');

// Test 1: Check if Supabase is configured
function testSupabaseConfig() {
  console.log('🔍 Test 1: Supabase Configuration');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseUrl !== 'your_supabase_project_url_here') {
    console.log('✅ Supabase URL configured');
  } else {
    console.log('❌ Supabase URL not configured');
  }
  
  if (supabaseKey && supabaseKey !== 'your_supabase_anon_key_here') {
    console.log('✅ Supabase Key configured');
  } else {
    console.log('❌ Supabase Key not configured');
  }
}

// Test 2: Check if API client is working
async function testApiClient() {
  console.log('🔍 Test 2: API Client');
  try {
    const { api } = await import('./src/lib/api.js');
    console.log('✅ API client loaded successfully');
    
    // Test services endpoint
    const servicesResponse = await api.getServices();
    if (servicesResponse.success) {
      console.log('✅ Services API working');
    } else {
      console.log('❌ Services API failed:', servicesResponse.error);
    }
  } catch (error) {
    console.log('❌ API client failed:', error.message);
  }
}

// Test 3: Check authentication state
function testAuthState() {
  console.log('🔍 Test 3: Authentication State');
  const token = localStorage.getItem('auth_token');
  if (token) {
    console.log('✅ Auth token found');
  } else {
    console.log('ℹ️ No auth token (user not logged in)');
  }
}

// Test 4: Check routing
function testRouting() {
  console.log('🔍 Test 4: Routing');
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  const validRoutes = [
    '/', '/auth', '/dashboard', '/admin', '/services', 
    '/chat', '/technician-registration'
  ];
  
  if (validRoutes.includes(currentPath)) {
    console.log('✅ Valid route');
  } else {
    console.log('⚠️ Unknown route');
  }
}

// Test 5: Check UI components
function testUIComponents() {
  console.log('🔍 Test 5: UI Components');
  
  // Check if main components are rendered
  const header = document.querySelector('header');
  if (header) {
    console.log('✅ Header component found');
  } else {
    console.log('❌ Header component missing');
  }
  
  const buttons = document.querySelectorAll('button');
  console.log(`Found ${buttons.length} buttons`);
  
  const cards = document.querySelectorAll('[class*="card"]');
  console.log(`Found ${cards.length} card elements`);
}

// Test 6: Check for errors
function testErrors() {
  console.log('🔍 Test 6: Error Checking');
  
  // Check console for errors
  const originalError = console.error;
  const errors = [];
  
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    if (errors.length > 0) {
      console.log(`⚠️ Found ${errors.length} errors:`, errors);
    } else {
      console.log('✅ No errors detected');
    }
    console.error = originalError;
  }, 1000);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting FixNow App Tests...\n');
  
  testSupabaseConfig();
  await testApiClient();
  testAuthState();
  testRouting();
  testUIComponents();
  testErrors();
  
  console.log('\n🏁 Test suite completed!');
  console.log('📋 Check the results above to identify any issues.');
}

// Auto-run tests when script is loaded
runAllTests();

// Export for manual testing
window.testFixNowApp = {
  testSupabaseConfig,
  testApiClient,
  testAuthState,
  testRouting,
  testUIComponents,
  testErrors,
  runAllTests
};
