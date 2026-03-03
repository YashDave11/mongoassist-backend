# MongoDB Assistant Backend API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mongodb-assistant?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "identityKey": "sk_live_aBcDeFgHiJkLmNoP",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "identityKey": "sk_live_aBcDeFgHiJkLmNoP",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "identityKey": "sk_live_aBcDeFgHiJkLmNoP",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  identityKey: String (unique, 16 characters),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Unique identity key generation (16 characters)
- ✅ Email validation
- ✅ Password strength requirements (min 6 characters)
- ✅ CORS protection
- ✅ Input validation

## 📝 Identity Key Format

Identity keys are generated in the format: `sk_live_` + 16 random alphanumeric characters

Example: `sk_live_aBcDeFgHiJkLmNoP`

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured properly

### CORS Errors
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Check if the frontend is running on the correct port

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 30 days by default

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **express-validator**: Input validation

## 🚀 Deployment

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Start Production Server
```bash
npm start
```

## 📄 License

MIT
