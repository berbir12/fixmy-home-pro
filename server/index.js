const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// In-memory data storage (replace with database in production)
let users = [
  {
    id: '1',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    name: 'John Doe',
    phone: '+1234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    addresses: [
      {
        id: '1',
        type: 'home',
        address: '123 Main St, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true,
      },
      {
        id: '2',
        type: 'work',
        address: '456 Business Ave, Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        isDefault: false,
      },
    ],
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        shareLocation: true,
        shareContact: false,
      },
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'sarah@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    name: 'Sarah Johnson',
    phone: '+1987654321',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    addresses: [
      {
        id: '3',
        type: 'home',
        address: '789 Oak Drive',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        isDefault: true,
      },
    ],
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        shareLocation: false,
        shareContact: true,
      },
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

let bookings = [
  {
    id: '1',
    serviceId: 'ac-installation',
    serviceName: 'AC Installation',
    technicianId: 'tech-1',
    technicianName: 'John Smith',
    technicianAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    userId: '1',
    status: 'completed',
    scheduledDate: '2024-03-15',
    scheduledTime: '10:00 AM',
    address: '123 Main St, Apt 4B',
    description: 'Install new AC unit in living room',
    price: 150,
    rating: 5,
    review: 'Excellent service, very professional!',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    serviceId: 'washing-machine-repair',
    serviceName: 'Washing Machine Repair',
    technicianId: 'tech-2',
    technicianName: 'Sarah Wilson',
    technicianAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    userId: '1',
    status: 'scheduled',
    scheduledDate: '2024-03-20',
    scheduledTime: '2:00 PM',
    address: '123 Main St, Apt 4B',
    description: 'Washing machine not spinning properly',
    price: 80,
    createdAt: '2024-03-18T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z',
  },
  {
    id: '3',
    serviceId: 'plumbing-repair',
    serviceName: 'Plumbing Repair',
    technicianId: 'tech-3',
    technicianName: 'Mike Johnson',
    technicianAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    userId: '2',
    status: 'in_progress',
    scheduledDate: '2024-03-19',
    scheduledTime: '11:00 AM',
    address: '789 Oak Drive',
    description: 'Leaky faucet in kitchen',
    price: 95,
    createdAt: '2024-03-17T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z',
  },
];

let payments = [
  {
    id: '1',
    bookingId: '1',
    amount: 150,
    currency: 'USD',
    method: 'credit_card',
    status: 'completed',
    transactionId: 'txn_123456789',
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    bookingId: '2',
    amount: 80,
    currency: 'USD',
    method: 'paypal',
    status: 'pending',
    createdAt: '2024-03-18T00:00:00Z',
  },
  {
    id: '3',
    bookingId: '3',
    amount: 95,
    currency: 'USD',
    method: 'apple_pay',
    status: 'completed',
    transactionId: 'txn_987654321',
    createdAt: '2024-03-19T00:00:00Z',
  },
];

let chatContacts = [
  {
    id: 'support-1',
    name: 'Customer Support',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    type: 'support',
    lastMessage: 'How can I help you today?',
    lastMessageTime: '2024-03-19T10:30:00Z',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    type: 'ai',
    lastMessage: 'I can help you with booking and support questions',
    lastMessageTime: '2024-03-19T09:15:00Z',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'tech-1',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    type: 'technician',
    lastMessage: 'I\'ll be there in 15 minutes',
    lastMessageTime: '2024-03-15T09:45:00Z',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'tech-2',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    type: 'technician',
    lastMessage: 'Your appointment is confirmed for tomorrow',
    lastMessageTime: '2024-03-18T14:20:00Z',
    unreadCount: 1,
    isOnline: true,
  },
];

let chatMessages = [
  {
    id: '1',
    chatId: 'support-1',
    senderId: 'support-1',
    senderName: 'Customer Support',
    senderType: 'support',
    content: 'Hello! How can I help you today?',
    type: 'text',
    timestamp: '2024-03-19T10:30:00Z',
    status: 'read',
  },
  {
    id: '2',
    chatId: 'support-1',
    senderId: '1',
    senderName: 'John Doe',
    senderType: 'user',
    content: 'I need help with my booking',
    type: 'text',
    timestamp: '2024-03-19T10:32:00Z',
    status: 'read',
  },
  {
    id: '3',
    chatId: 'ai-assistant',
    senderId: 'ai-assistant',
    senderName: 'AI Assistant',
    senderType: 'ai',
    content: 'Hello! I\'m your AI assistant. I can help you with booking services, checking your appointments, and answering questions about our services.',
    type: 'text',
    timestamp: '2024-03-19T09:15:00Z',
    status: 'read',
  },
  {
    id: '4',
    chatId: 'tech-1',
    senderId: 'tech-1',
    senderName: 'John Smith',
    senderType: 'technician',
    content: 'I\'ll be there in 15 minutes',
    type: 'text',
    timestamp: '2024-03-15T09:45:00Z',
    status: 'read',
  },
  {
    id: '5',
    chatId: 'tech-2',
    senderId: 'tech-2',
    senderName: 'Sarah Wilson',
    senderType: 'technician',
    content: 'Your appointment is confirmed for tomorrow at 2:00 PM',
    type: 'text',
    timestamp: '2024-03-18T14:20:00Z',
    status: 'delivered',
  },
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, and name are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters long' 
      });
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      phone,
      avatar: undefined,
      addresses: [],
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        privacy: {
          shareLocation: true,
          shareContact: false,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/send-otp', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid email is required' 
      });
    }

    // Mock OTP sending - in real app, send actual SMS/email
    console.log(`OTP sent to ${email}: 1234`);
    
    res.json({
      success: true,
      data: {
        message: 'OTP sent successfully',
      },
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and OTP are required' 
      });
    }
    
    // Mock OTP verification (1234 is valid)
    if (otp === '1234') {
      res.json({
        success: true,
        data: {
          message: 'OTP verified successfully',
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// User routes
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Only allow updating certain fields
    const allowedFields = ['name', 'phone', 'avatar', 'preferences'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    users[userIndex] = { 
      ...users[userIndex], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    
    // Remove password from response
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Address routes
app.post('/api/user/addresses', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { type, address, city, state, zipCode, isDefault } = req.body;
    
    if (!type || !address || !city || !state || !zipCode) {
      return res.status(400).json({ 
        success: false, 
        error: 'All address fields are required' 
      });
    }

    const newAddress = {
      id: (users[userIndex].addresses.length + 1).toString(),
      type,
      address,
      city,
      state,
      zipCode,
      isDefault: isDefault || false,
    };

    // If this is the default address, unset others
    if (isDefault) {
      users[userIndex].addresses.forEach(addr => addr.isDefault = false);
    }

    users[userIndex].addresses.push(newAddress);
    users[userIndex].updatedAt = new Date().toISOString();
    
    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Booking routes
app.get('/api/bookings', authenticateToken, (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.user.userId);
    res.json({
      success: true,
      data: userBookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.userId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { serviceId, technicianId, scheduledDate, scheduledTime, address, description } = req.body;
    
    if (!serviceId || !technicianId || !scheduledDate || !scheduledTime || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Service ID, technician ID, date, time, and address are required' 
      });
    }

    const newBooking = {
      id: (bookings.length + 1).toString(),
      serviceId,
      serviceName: 'Service Name', // Get from service data
      technicianId,
      technicianName: 'Technician Name', // Get from technician data
      technicianAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      userId: req.user.userId,
      status: 'pending',
      scheduledDate,
      scheduledTime,
      address,
      description: description || '',
      price: 100, // Get from service/technician data
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    bookings.push(newBooking);
    
    res.status(201).json({
      success: true,
      data: newBooking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.put('/api/bookings/:id/cancel', authenticateToken, (req, res) => {
  try {
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.userId === req.user.userId);
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    if (bookings[bookingIndex].status === 'completed' || bookings[bookingIndex].status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot cancel completed or already cancelled booking' 
      });
    }
    
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: bookings[bookingIndex],
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.put('/api/bookings/:id/rate', authenticateToken, (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }
    
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.userId === req.user.userId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    if (bookings[bookingIndex].status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Can only rate completed bookings' 
      });
    }
    
    bookings[bookingIndex].rating = rating;
    bookings[bookingIndex].review = review;
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: bookings[bookingIndex],
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Payment routes
app.get('/api/payments', authenticateToken, (req, res) => {
  try {
    const userPayments = payments.filter(p => {
      const booking = bookings.find(b => b.id === p.bookingId);
      return booking && booking.userId === req.user.userId;
    });
    
    res.json({
      success: true,
      data: userPayments,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/payments', authenticateToken, (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;
    
    if (!bookingId || !amount || !method) {
      return res.status(400).json({ 
        success: false, 
        error: 'Booking ID, amount, and payment method are required' 
      });
    }
    
    // Verify booking belongs to user
    const booking = bookings.find(b => b.id === bookingId && b.userId === req.user.userId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    const newPayment = {
      id: (payments.length + 1).toString(),
      bookingId,
      amount,
      currency: 'USD',
      method,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    payments.push(newPayment);
    
    res.status(201).json({
      success: true,
      data: newPayment,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Chat routes
app.get('/api/chat/contacts', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: chatContacts,
    });
  } catch (error) {
    console.error('Get chat contacts error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/chat/:chatId/messages', authenticateToken, (req, res) => {
  try {
    const messages = chatMessages.filter(msg => msg.chatId === req.params.chatId);
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/chat/:chatId/messages', authenticateToken, (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message content is required' 
      });
    }
    
    const user = users.find(u => u.id === req.user.userId);
    const newMessage = {
      id: (chatMessages.length + 1).toString(),
      chatId: req.params.chatId,
      senderId: req.user.userId,
      senderName: user?.name || 'User',
      senderType: 'user',
      content: content.trim(),
      type,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    chatMessages.push(newMessage);
    
    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Services routes
app.get('/api/services', (req, res) => {
  try {
    const services = [
      {
        id: 'ac-installation',
        name: 'AC Installation',
        description: 'Professional AC installation services with warranty',
        icon: 'AirVent',
        price: 150,
        duration: '2-3 hours',
        category: 'HVAC',
        features: ['Professional installation', 'Warranty included', 'Free consultation'],
      },
      {
        id: 'washing-machine-repair',
        name: 'Washing Machine Repair',
        description: 'Expert washing machine repair and maintenance',
        icon: 'WashingMachine',
        price: 80,
        duration: '1-2 hours',
        category: 'Appliances',
        features: ['Same-day service', 'Parts warranty', 'Emergency repairs'],
      },
      {
        id: 'plumbing-repair',
        name: 'Plumbing Repair',
        description: 'Professional plumbing services for all your needs',
        icon: 'Droplets',
        price: 95,
        duration: '1-3 hours',
        category: 'Plumbing',
        features: ['24/7 emergency service', 'Licensed plumbers', 'Free estimates'],
      },
      {
        id: 'electrical-repair',
        name: 'Electrical Repair',
        description: 'Safe and reliable electrical repair services',
        icon: 'Zap',
        price: 120,
        duration: '1-2 hours',
        category: 'Electrical',
        features: ['Licensed electricians', 'Safety certified', 'Emergency service'],
      },
    ];
    
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/services/:id', (req, res) => {
  try {
    const serviceId = req.params.id;
    const services = [
      {
        id: 'ac-installation',
        name: 'AC Installation',
        description: 'Professional AC installation services with warranty. Our certified technicians will install your new AC unit with precision and care.',
        icon: 'AirVent',
        price: 150,
        duration: '2-3 hours',
        category: 'HVAC',
        features: ['Professional installation', 'Warranty included', 'Free consultation'],
        requirements: ['Access to electrical panel', 'Clear installation area', 'Valid permit if required'],
        warranty: '1 year parts and labor',
      },
      {
        id: 'washing-machine-repair',
        name: 'Washing Machine Repair',
        description: 'Expert washing machine repair and maintenance. We diagnose and fix issues quickly to get your appliance working again.',
        icon: 'WashingMachine',
        price: 80,
        duration: '1-2 hours',
        category: 'Appliances',
        features: ['Same-day service', 'Parts warranty', 'Emergency repairs'],
        requirements: ['Access to machine', 'Water supply available', 'Electrical outlet nearby'],
        warranty: '90 days parts and labor',
      },
    ];
    
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    
    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/services/:id/technicians', (req, res) => {
  try {
    const technicians = [
      {
        id: 'tech-1',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
        reviews: 124,
        specialties: ['AC Installation', 'HVAC Repair'],
        experience: '5 years',
        responseTime: '15 min',
        price: 150,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        languages: ['English', 'Spanish'],
        certifications: ['HVAC Certified', 'EPA Certified'],
      },
      {
        id: 'tech-2',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        reviews: 89,
        specialties: ['Appliance Repair', 'Maintenance'],
        experience: '3 years',
        responseTime: '20 min',
        price: 120,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        languages: ['English'],
        certifications: ['Appliance Repair Certified'],
      },
      {
        id: 'tech-3',
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        rating: 4.7,
        reviews: 156,
        specialties: ['Plumbing', 'Electrical'],
        experience: '7 years',
        responseTime: '25 min',
        price: 95,
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        languages: ['English', 'French'],
        certifications: ['Licensed Plumber', 'Licensed Electrician'],
      },
    ];
    
    res.json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Test credentials:`);
  console.log(`   Email: john@example.com`);
  console.log(`   Password: password`);
});
