# FixNow Backend Server

This is the backend server for the FixNow home service platform. It provides RESTful APIs for authentication, bookings, payments, chat, and user management.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: User registration, login, profile management
- **Booking System**: Create, view, cancel, and rate bookings
- **Payment Processing**: Track payment history and transactions
- **Real-time Chat**: Message system for user-technician communication
- **Service Management**: Service catalog and technician matching

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP

### User Management
- `PUT /api/user/profile` - Update user profile (protected)

### Bookings
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get specific booking (protected)
- `POST /api/bookings` - Create new booking (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)
- `PUT /api/bookings/:id/rate` - Rate booking (protected)

### Payments
- `GET /api/payments` - Get user payments (protected)
- `POST /api/payments` - Create payment (protected)

### Chat
- `GET /api/chat/contacts` - Get chat contacts (protected)
- `GET /api/chat/:chatId/messages` - Get chat messages (protected)
- `POST /api/chat/:chatId/messages` - Send message (protected)

### Services
- `GET /api/services` - Get available services
- `GET /api/services/:id` - Get specific service
- `GET /api/services/:id/technicians` - Get technicians for service

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables** (optional):
   ```bash
   PORT=3001
   JWT_SECRET=your-secret-key
   ```

3. **Start the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Development

The server runs on `http://localhost:3001` by default.

### Test User
For testing purposes, a default user is created:
- **Email**: `john@example.com`
- **Password**: `password`

### API Testing
You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'
```

## Data Storage

Currently, the server uses in-memory storage for development. In production, you should:

1. Replace with a proper database (PostgreSQL, MongoDB, etc.)
2. Implement proper data persistence
3. Add data validation and sanitization
4. Implement proper error handling

## Security

- JWT tokens for authentication
- bcrypt for password hashing
- CORS enabled for frontend integration
- Input validation (basic)

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database
2. **Environment Variables**: Use proper environment management
3. **Logging**: Implement comprehensive logging
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Input Validation**: Implement comprehensive input validation
6. **Error Handling**: Add proper error handling and monitoring
7. **HTTPS**: Use HTTPS in production
8. **CORS**: Configure CORS properly for production domains

## License

MIT
