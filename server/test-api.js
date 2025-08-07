const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  phone: '+1234567890'
};

let authToken = '';

// Helper function to make authenticated requests
const authRequest = (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...(data && { data })
  };
  return axios(config);
};

// Test functions
const runTests = async () => {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Register new user
    console.log('\n2. Testing User Registration...');
    const registerResponse = await authRequest('POST', '/auth/register', testUser);
    console.log('✅ Registration successful:', registerResponse.data.success);
    authToken = registerResponse.data.data.token;

    // Test 3: Login
    console.log('\n3. Testing Login...');
    const loginResponse = await authRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.success);
    authToken = loginResponse.data.data.token;

    // Test 4: Get user profile
    console.log('\n4. Testing Get User Profile...');
    const profileResponse = await authRequest('GET', '/auth/me');
    console.log('✅ Profile retrieved:', profileResponse.data.data.name);

    // Test 5: Update profile
    console.log('\n5. Testing Profile Update...');
    const updateResponse = await authRequest('PUT', '/user/profile', {
      name: 'Updated Test User',
      phone: '+1987654321'
    });
    console.log('✅ Profile updated:', updateResponse.data.data.name);

    // Test 6: Add address
    console.log('\n6. Testing Add Address...');
    const addressResponse = await authRequest('POST', '/user/addresses', {
      type: 'home',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      isDefault: true
    });
    console.log('✅ Address added:', addressResponse.data.data.address);

    // Test 7: Get services
    console.log('\n7. Testing Get Services...');
    const servicesResponse = await axios.get(`${BASE_URL}/services`);
    console.log('✅ Services retrieved:', servicesResponse.data.data.length, 'services');

    // Test 8: Get technicians
    console.log('\n8. Testing Get Technicians...');
    const techniciansResponse = await axios.get(`${BASE_URL}/services/ac-installation/technicians`);
    console.log('✅ Technicians retrieved:', techniciansResponse.data.data.length, 'technicians');

    // Test 9: Create booking
    console.log('\n9. Testing Create Booking...');
    const bookingResponse = await authRequest('POST', '/bookings', {
      serviceId: 'ac-installation',
      technicianId: 'tech-1',
      scheduledDate: '2024-04-01',
      scheduledTime: '10:00 AM',
      address: '123 Test Street, Test City, TS 12345',
      description: 'Test booking for AC installation'
    });
    console.log('✅ Booking created:', bookingResponse.data.data.id);

    // Test 10: Get bookings
    console.log('\n10. Testing Get Bookings...');
    const bookingsResponse = await authRequest('GET', '/bookings');
    console.log('✅ Bookings retrieved:', bookingsResponse.data.data.length, 'bookings');

    // Test 11: Create payment
    console.log('\n11. Testing Create Payment...');
    const paymentResponse = await authRequest('POST', '/payments', {
      bookingId: bookingResponse.data.data.id,
      amount: 150,
      method: 'credit_card'
    });
    console.log('✅ Payment created:', paymentResponse.data.data.id);

    // Test 12: Get payments
    console.log('\n12. Testing Get Payments...');
    const paymentsResponse = await authRequest('GET', '/payments');
    console.log('✅ Payments retrieved:', paymentsResponse.data.data.length, 'payments');

    // Test 13: Get chat contacts
    console.log('\n13. Testing Get Chat Contacts...');
    const contactsResponse = await authRequest('GET', '/chat/contacts');
    console.log('✅ Chat contacts retrieved:', contactsResponse.data.data.length, 'contacts');

    // Test 14: Send chat message
    console.log('\n14. Testing Send Chat Message...');
    const messageResponse = await authRequest('POST', '/chat/support-1/messages', {
      content: 'Hello, this is a test message!',
      type: 'text'
    });
    console.log('✅ Message sent:', messageResponse.data.data.content);

    // Test 15: Get chat messages
    console.log('\n15. Testing Get Chat Messages...');
    const messagesResponse = await authRequest('GET', '/chat/support-1/messages');
    console.log('✅ Chat messages retrieved:', messagesResponse.data.data.length, 'messages');

    // Test 16: Rate booking
    console.log('\n16. Testing Rate Booking...');
    const rateResponse = await authRequest('PUT', `/bookings/${bookingResponse.data.data.id}/rate`, {
      rating: 5,
      review: 'Excellent service!'
    });
    console.log('✅ Booking rated:', rateResponse.data.data.rating, 'stars');

    // Test 17: Cancel booking
    console.log('\n17. Testing Cancel Booking...');
    const cancelResponse = await authRequest('PUT', `/bookings/${bookingResponse.data.data.id}/cancel`);
    console.log('✅ Booking cancelled:', cancelResponse.data.data.status);

    // Test 18: Send OTP
    console.log('\n18. Testing Send OTP...');
    const otpResponse = await authRequest('POST', '/auth/send-otp', {
      email: testUser.email
    });
    console.log('✅ OTP sent:', otpResponse.data.data.message);

    // Test 19: Verify OTP
    console.log('\n19. Testing Verify OTP...');
    const verifyResponse = await authRequest('POST', '/auth/verify-otp', {
      email: testUser.email,
      otp: '1234'
    });
    console.log('✅ OTP verified:', verifyResponse.data.data.message);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Health Check');
    console.log('✅ User Registration');
    console.log('✅ User Login');
    console.log('✅ Profile Management');
    console.log('✅ Address Management');
    console.log('✅ Services API');
    console.log('✅ Technicians API');
    console.log('✅ Booking Management');
    console.log('✅ Payment Processing');
    console.log('✅ Chat System');
    console.log('✅ Rating System');
    console.log('✅ OTP System');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
};

// Run tests
runTests();
