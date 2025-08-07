# FixNow Backend API Documentation

## Overview

The FixNow backend API provides a comprehensive RESTful interface for the home services platform. It handles authentication, user management, bookings, payments, chat, and service management.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check

#### GET /health
Check server status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-19T10:30:00Z",
  "version": "1.0.0"
}
```

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "avatar": null,
      "addresses": [],
      "preferences": {
        "notifications": {
          "email": true,
          "sms": true,
          "push": true
        },
        "privacy": {
          "shareLocation": true,
          "shareContact": false
        }
      },
      "createdAt": "2024-03-19T10:30:00Z",
      "updatedAt": "2024-03-19T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register response.

#### GET /auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://...",
    "addresses": [...],
    "preferences": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /auth/send-otp
Send OTP to email (for password reset/verification).

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully"
  }
}
```

#### POST /auth/verify-otp
Verify OTP code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP verified successfully"
  }
}
```

### User Management

#### PUT /user/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+1987654321",
  "avatar": "https://...",
  "preferences": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    },
    "privacy": {
      "shareLocation": false,
      "shareContact": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "john@example.com",
    "name": "Updated Name",
    "phone": "+1987654321",
    "avatar": "https://...",
    "addresses": [...],
    "preferences": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-03-19T10:30:00Z"
  }
}
```

#### POST /user/addresses
Add new address (requires authentication).

**Request Body:**
```json
{
  "type": "home",
  "address": "123 Main St, Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "type": "home",
    "address": "123 Main St, Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "isDefault": true
  }
}
```

### Services

#### GET /services
Get all available services.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ac-installation",
      "name": "AC Installation",
      "description": "Professional AC installation services with warranty",
      "icon": "AirVent",
      "price": 150,
      "duration": "2-3 hours",
      "category": "HVAC",
      "features": [
        "Professional installation",
        "Warranty included",
        "Free consultation"
      ]
    }
  ]
}
```

#### GET /services/:id
Get specific service details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ac-installation",
    "name": "AC Installation",
    "description": "Professional AC installation services with warranty...",
    "icon": "AirVent",
    "price": 150,
    "duration": "2-3 hours",
    "category": "HVAC",
    "features": [...],
    "requirements": [
      "Access to electrical panel",
      "Clear installation area",
      "Valid permit if required"
    ],
    "warranty": "1 year parts and labor"
  }
}
```

#### GET /services/:id/technicians
Get technicians for a specific service.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tech-1",
      "name": "John Smith",
      "avatar": "https://...",
      "rating": 4.8,
      "reviews": 124,
      "specialties": ["AC Installation", "HVAC Repair"],
      "experience": "5 years",
      "responseTime": "15 min",
      "price": 150,
      "availability": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "languages": ["English", "Spanish"],
      "certifications": ["HVAC Certified", "EPA Certified"]
    }
  ]
}
```

### Bookings

#### GET /bookings
Get user's bookings (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "serviceId": "ac-installation",
      "serviceName": "AC Installation",
      "technicianId": "tech-1",
      "technicianName": "John Smith",
      "technicianAvatar": "https://...",
      "userId": "1",
      "status": "completed",
      "scheduledDate": "2024-03-15",
      "scheduledTime": "10:00 AM",
      "address": "123 Main St, Apt 4B",
      "description": "Install new AC unit in living room",
      "price": 150,
      "rating": 5,
      "review": "Excellent service, very professional!",
      "createdAt": "2024-03-10T00:00:00Z",
      "updatedAt": "2024-03-15T00:00:00Z"
    }
  ]
}
```

#### GET /bookings/:id
Get specific booking (requires authentication).

**Response:** Same as booking object above.

#### POST /bookings
Create new booking (requires authentication).

**Request Body:**
```json
{
  "serviceId": "ac-installation",
  "technicianId": "tech-1",
  "scheduledDate": "2024-04-01",
  "scheduledTime": "10:00 AM",
  "address": "123 Main St, Apt 4B",
  "description": "Install new AC unit"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "serviceId": "ac-installation",
    "serviceName": "AC Installation",
    "technicianId": "tech-1",
    "technicianName": "John Smith",
    "technicianAvatar": "https://...",
    "userId": "1",
    "status": "pending",
    "scheduledDate": "2024-04-01",
    "scheduledTime": "10:00 AM",
    "address": "123 Main St, Apt 4B",
    "description": "Install new AC unit",
    "price": 150,
    "createdAt": "2024-03-19T10:30:00Z",
    "updatedAt": "2024-03-19T10:30:00Z"
  }
}
```

#### PUT /bookings/:id/cancel
Cancel booking (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "status": "cancelled",
    "updatedAt": "2024-03-19T10:30:00Z"
  }
}
```

#### PUT /bookings/:id/rate
Rate completed booking (requires authentication).

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "rating": 5,
    "review": "Excellent service!",
    "updatedAt": "2024-03-19T10:30:00Z"
  }
}
```

### Payments

#### GET /payments
Get user's payments (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "bookingId": "1",
      "amount": 150,
      "currency": "USD",
      "method": "credit_card",
      "status": "completed",
      "transactionId": "txn_123456789",
      "createdAt": "2024-03-15T00:00:00Z"
    }
  ]
}
```

#### POST /payments
Create new payment (requires authentication).

**Request Body:**
```json
{
  "bookingId": "1",
  "amount": 150,
  "method": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "bookingId": "1",
    "amount": 150,
    "currency": "USD",
    "method": "credit_card",
    "status": "pending",
    "createdAt": "2024-03-19T10:30:00Z"
  }
}
```

### Chat

#### GET /chat/contacts
Get chat contacts (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "support-1",
      "name": "Customer Support",
      "avatar": "https://...",
      "type": "support",
      "lastMessage": "How can I help you today?",
      "lastMessageTime": "2024-03-19T10:30:00Z",
      "unreadCount": 0,
      "isOnline": true
    }
  ]
}
```

#### GET /chat/:chatId/messages
Get chat messages (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "chatId": "support-1",
      "senderId": "support-1",
      "senderName": "Customer Support",
      "senderType": "support",
      "content": "Hello! How can I help you today?",
      "type": "text",
      "timestamp": "2024-03-19T10:30:00Z",
      "status": "read"
    }
  ]
}
```

#### POST /chat/:chatId/messages
Send message (requires authentication).

**Request Body:**
```json
{
  "content": "Hello, I need help with my booking",
  "type": "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6",
    "chatId": "support-1",
    "senderId": "1",
    "senderName": "John Doe",
    "senderType": "user",
    "content": "Hello, I need help with my booking",
    "type": "text",
    "timestamp": "2024-03-19T10:35:00Z",
    "status": "sent"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}
```

### Address
```typescript
interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  userId: string;
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  description: string;
  price: number;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'technician' | 'support' | 'ai';
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}
```

## Testing

Run the API tests:

```bash
cd server
npm test
```

## Development

Start the development server:

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001` with hot reload enabled.

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. **Environment Variables**: Use environment variables for sensitive data
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **CORS**: Configure CORS properly for production domains
5. **SSL**: Use HTTPS in production
6. **Logging**: Implement proper logging and monitoring
7. **Validation**: Add comprehensive input validation
8. **Security**: Implement additional security measures (helmet, etc.)
