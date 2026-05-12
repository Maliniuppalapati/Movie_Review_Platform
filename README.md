# 🎬 Movie Review Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-orange)
![JWT Auth](https://img.shields.io/badge/Security-JWT_Auth-green)
![Status](https://img.shields.io/badge/Status-Production_Ready-success)

A full-stack, production-ready Movie Review Platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). This application goes beyond basic CRUD functionality by implementing **Role-Based Access Control (RBAC)**, smart caching, **Google Gemini AI** integration, and robust API security.

---

## ✨ Key Features

- **🧠 AI-Powered Insights:** Automatically generates a one-sentence consensus of user reviews using Google's Gemini AI. Features a 24-hour database caching mechanism to optimize API token usage.
- **🛡️ Role-Based Access Control (RBAC):** Secure admin dashboard for movie management (Create, Update, Delete) accessible only to accounts with the `admin` role.
- **🔒 Robust Security:** 
  - JWT-based authentication.
  - Strict input validation using **Zod**.
  - Advanced MongoDB `ObjectId` validation middleware to prevent server-side casting crashes.
  - Granular API Rate Limiting (strict on mutations, relaxed on queries) to prevent abuse.
- **⚡ Optimistic UI Updates:** "Helpful (👍)" votes on reviews update instantly on the frontend without waiting for server round-trips.
- **📊 Advanced Data Handling:** Features paginated queries, robust text searching, and dynamic sorting (Latest, Oldest, Most Helpful).
- **📝 Resilient Error Handling:** Implements `express-async-errors` to ensure the Node.js server never crashes from unhandled promise rejections.

---

## 💻 Tech Stack

### Frontend
* **React.js** (Vite)
* **React Router v6**
* **Context API** for state management
* Vanilla CSS with Glassmorphism UI tokens

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose**
* **Google Generative AI SDK** (`@google/generative-ai`)
* **Zod** (Schema Validation)
* **Bcryptjs & jsonwebtoken** (Security)
* **Express Rate Limit** (DDoS prevention)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed. You will also need a MongoDB Atlas cluster and a free Google Gemini API Key.

### 1. Clone the Repository
```bash
git clone https://github.com/Maliniuppalapati/Movie_Review_Platform.git
cd Movie_Review_Platform
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory.

```bash
cd frontend
npm install
npm run dev
```
The application will now be running on `http://localhost:5173`.

---

## 👑 Admin Access
By default, new users are assigned the `user` role. To test the Admin Dashboard:
1. Register a new account on the frontend.
2. Open your MongoDB Database (via Atlas or Compass).
3. Find your user document in the `users` collection.
4. Change the `role` field from `"user"` to `"admin"`.
5. Log out and log back in on the frontend to access `http://localhost:5173/admin`.

---

## 🏗️ Architecture & Best Practices
- **Middleware-First Approach:** Heavy use of custom Express middleware for error handling, route protection, and data sanitization.
- **Separation of Concerns:** Clean architecture separating Routes, Controllers, Models, and Utils.
- **Predictable Error Formatting:** All API errors (including Zod validation failures) are caught by a global error handler and returned in a predictable JSON format.

---

