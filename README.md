# Chat Application Backend with Supabase

A real-time chat application backend built with Node.js, Express, Socket.IO, and Supabase.

## Features

- User authentication (register/login)
- Real-time messaging with Socket.IO
- User profile management
- Image upload support
- PostgreSQL database with Supabase
- Row Level Security (RLS) for data protection

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and API keys
   - Run the migration file in your Supabase SQL editor

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials and JWT secret

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login

### Users
- `GET /user` - Get all users (with pagination and search)
- `GET /mydetails` - Get current user details (requires auth)
- `GET /detail/:id` - Get user by ID
- `PUT /user` - Update user profile (requires auth)
- `PUT /useremail` - Update user email (requires auth)
- `PUT /userpw` - Update user password (requires auth)
- `DELETE /user/:id` - Delete user (requires auth)

### Real-time Events (Socket.IO)

- `login` - Join user room
- `send-message` - Send message to another user
- `get-message` - Get message history
- `deleteMessage` - Delete a message
- `broadcast` - Broadcast user online status
- `offline` - Set user offline

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `username` (Text, Not Null)
- `email` (Text, Unique, Not Null)
- `password` (Text, Not Null)
- `img` (Text, Default: 'default.png')
- `phone` (Text)
- `tagname` (Text)
- `bio` (Text)
- `status` (Integer, Default: 1)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Messages Table
- `id` (UUID, Primary Key)
- `sender` (UUID, Foreign Key to Users)
- `receiver` (UUID, Foreign Key to Users)
- `text_msg` (Text, Not Null)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Security

The application implements Row Level Security (RLS) policies:
- Users can only read/update their own profiles
- Users can only access messages they sent or received
- All operations require proper authentication

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- Supabase (PostgreSQL)
- bcrypt (password hashing)
- JWT (authentication)
- Multer (file uploads)