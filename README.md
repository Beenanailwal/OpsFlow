# 🚀 ProTasker – Ultimate MERN Stack Project

ProTasker is a production-level MERN stack application built with modern backend architecture, authentication, security, real-time updates, and advanced frontend engineering.

This is not just a basic CRUD app — it is designed to simulate real-world scalable applications used in modern companies.


# 🌟 Features

## 👤 Authentication & Authorization
- User Signup/Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control (Admin/User)

## ✅ Task Management System
- Create Tasks
- Update Tasks
- Delete Tasks
- Task Status Management
- Search Tasks
- Filter Tasks by Status & Date

## 🛒 Product & Order System
- Product Management
- Add to Cart
- Quantity Management in Cart
- Checkout System
- Order Creation
- Order Summary Page
- My Orders Page

## 📦 Inventory Management (Stock System)
- Product stock maintain in database
- Stock decreases after order
- Prevent order if stock = 0
- "Out of Stock" validation
- Stock check during checkout

## 📡 Real-Time Features
- Live Order Status Updates

## 📁 File Upload System
- Profile Image Upload(uploads folder)
- File path saved in MongoDB 

## 🔐 Advanced Security
- Helmet.js Security Headers
- Rate Limiting
- Password Encryption
- Protected APIs
- CORS Protection
- JWT Verification

## ⚡ Performance Optimization
- Lazy Loading
- Debouncing
- Optimized API Calls

## 🎨 Frontend Engineering
- Fully Responsive UI
- Clean Component Structure
- React Hooks
- Reusable Components

---------

# 🧠 Concepts Covered

- MongoDB Schemas & Relations
- Express REST APIs
- React Components & Hooks
- Node.js Server
- MVC Architecture
- Middleware
- Error Handling
- Search & Filter APIs
- JWT Authentication
- Socket.IO
- Multer
- Helmet
- Rate Limiting

----------

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Helmet
- Socket.IO

----------

# 📂 Project Structure

```bash
ProTasker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx

-----------

🔄 Order Flow

👤 User Flow
User logs in
Browse products
Add products to cart
Proceed to checkout
Confirm order
Cart clears automatically
Order appears in My Orders

🛠️ Admin Flow
Admin logs in
Add/Edit/Delete products
Manage order statuses
Monitor users/orders

🔌 API Features
RESTful APIs
JWT Protected Routes
Error Handling Middleware
Search & Filter APIs
Real-Time Socket Events

🚀 Installation
Clone Repository
git clone https://github.com/Beenanailwal/Protasker.git

Backend Setup
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm run dev

🔑 Environment Variables
Create .env file inside backend:
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

📸 Main Modules
Authentication System
Task Management
Product Management
Cart System
Order Management
Admin Dashboard
Real-Time Updates

🧪 Testing
API Testing
Error Handling Testing
Protected Route Testing

📈 Future Improvements
AI Task Suggestions
Smart Reminders
Payment Gateway Integration
Email Notifications
Redis Caching

👩‍💻 Author
Beena Nailwal
Software Engineer | MERN Stack Developer
GitHub: https://github.com/Beenanailwal
LinkedIn: https://linkedin.com/in/beena-nailwal
