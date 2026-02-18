🎬 Movie Review Platform (Full Stack MERN)
A professional full-stack movie review platform developed as a Technical Assignment. This application allows users to browse a library of films, search/filter content, view detailed movie insights, submit authenticated reviews, and manage a personalized watchlist.

Built with a focus on Clean Architecture, API Security, and Scalable Database Design.

🧱 Tech Stack
💻 Frontend
React 18 + Vite (Fast Development & Optimized Build)

React Router DOM (Client-side Routing)

Context API (State Management & Global Authentication)

Custom CSS (Responsive UI for Mobile & Desktop)

⚙️ Backend
Node.js & Express (RESTful API Design)

MongoDB & Mongoose (NoSQL Data Persistence)

JWT Authentication (Secure User Sessions)

bcryptjs (Industry-standard Password Hashing)

Zod (Schema-based Input Validation)

express-rate-limit (API Protection against DDoS/Spam)

CORS (Cross-Origin Resource Sharing Configuration)

✨ Features
🎨 Frontend (UI/UX)
Home Page: Dynamic sections for Featured Movies and Trending/Latest releases.

Movie Listing: - 🔍 Real-time Search: Search movies by title.

🧪 Advanced Filters: Filter by Genre, Release Year, and Minimum Rating.

📑 Pagination: Optimized loading for large movie databases.

Individual Movie Page: - Detailed metadata (Director, Cast, Synopsis).

Review section with timestamps and user-specific ratings.

Interactive Review Form (1–5 stars + text).

User Profile:

Personalized Dashboard with Review History.

Watchlist Management: Add or remove movies with a single click.

Profile customization (Username & Profile Picture).

UX Excellence: Implementation of Error Boundaries, Loading Skeletons, and Protected Route guards.

🔐 Backend (API & Security)
RESTful Endpoints: Standardized routing for Movies, Users, and Reviews.

Smart Ratings: Average ratings are automatically re-calculated and cached in the Movie document using MongoDB Aggregation for performance.

Robust Validation: Every request is sanitized and validated using Zod schemas.

Admin Controls: Middleware-protected routes for managing the movie database.

📁 Project Structure
Plaintext
movie-review-platform/  
├── backend/  
│   ├── src/  
│   │   ├── config/          # Database & Server configuration  
│   │   ├── controllers/     # Business logic (Auth, Movies, Reviews, Users)  
│   │   ├── middleware/      # JWT Auth, Error handling, Rate limiting  
│   │   ├── models/          # Mongoose schemas (User, Movie, Review)  
│   │   ├── routes/          # API endpoint definitions  
│   │   └── utils/           # Seed scripts and Async Wrappers  
│   ├── .env.example         # Template for environment variables  
│   ├── package.json  
│   └── server.js            # API entry point  
│  
├── frontend/  
│   ├── src/  
│   │   ├── api/             # Axios/Fetch client configuration  
│   │   ├── components/      # Reusable UI (Navbar, MovieCard, StarRating)  
│   │   ├── context/         # AuthContext for global state  
│   │   ├── pages/           # View components (Home, Profile, Login)  
│   │   └── App.jsx          # Route & Provider configuration  
│   ├── .env.example  
│   ├── package.json  
│   └── vite.config.js  
│  
└── README.md  
⚙️ Setup & Installation
1️⃣ Clone the Repository
Bash
git clone https://github.com/Maliniuppalapati/Movie_Review_Platform.git
cd movie-review-platform
2️⃣ Backend Configuration
Bash
cd backend
npm install
Create a .env file in the backend/ folder:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
CLIENT_ORIGIN=http://localhost:5173
Start the Server:

Bash
npm start
3️⃣ Frontend Configuration
Bash
cd ../frontend
npm install
Create a .env file in the frontend/ folder:

Code snippet
VITE_API_URL=http://localhost:5000/api
Start the Client:

Bash
npm run dev
4️⃣ Seed Data (Optional)
To populate your database with high-quality sample movie data:

Bash
cd backend
node src/utils/seed.js
📚 API Documentation
🔑 Authentication
POST /api/auth/register - Create user

POST /api/auth/login - Get JWT Token

🎬 Movies
GET /api/movies - List all (supports ?search=, ?genre=, ?page=)

GET /api/movies/:id - Get movie + populated reviews

POST /api/movies - Add new movie (Admin Only)

✍️ Reviews & Social
POST /api/movies/:id/reviews - Submit review (Auth Required)

GET /api/users/:id/watchlist - View saved movies

POST /api/users/:id/watchlist - Add movie to watchlist

🔒 Security & Performance Features
Data Persistence: MongoDB for flexible, document-based storage.

API Security: Protection against Brute Force via express-rate-limit.

Validation: Type-safe input handling with Zod prevents SQL/NoSQL injection.

Performance: Pagination and Average Rating caching to ensure fast response times even as data grows.
