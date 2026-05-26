ChaiPoll ☕📊

A real-time full-stack polling and feedback platform where users can create polls, share them publicly, collect responses, and view live analytics.

✨ Features
🔐 Authentication
User Registration & Login
JWT Authentication
Protected Routes


📋 Poll System
Create polls dynamically
Add multiple questions
Single option based voting
Required & optional questions
Anonymous or authenticated responses
Poll expiry support

🌐 Public Poll Sharing
Share polls through public links
Anyone can submit responses
Poll automatically disables after expiry


📊 Real-Time Analytics
Live response count updates
Question-wise analytics
Option-wise vote summaries
Real-time updates using Socket.IO
Public result publishing


🎨 Modern UI
Responsive design
Tailwind CSS styling
Framer Motion animations
Recharts analytics graphs
Interactive dashboard

🛠️ Tech Stack
Frontend
React.js
Vite
Tailwind CSS
React Router DOM
Axios
React Hot Toast
Recharts
Framer Motion
Socket.IO Client


Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
Socket.IO
Express Validator


📁 Folder Structure
chai-poll/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── socket/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md


⚙️ Installation & Setup

1️⃣ Clone Repository
 git clone  https://github.com/iamdipanshugupta/ChaiPoll

 
2️⃣ Backend Setup
cd backend
npm install
Create .env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
Run Backend
npm run dev



3️⃣ Frontend Setup
cd frontend
npm install
Create .env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
Run Frontend
npm run dev

🔌 API Routes
Auth Routes

| Method | Route                |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |

Poll Routes

| Method | Route                 |
| ------ | --------------------- |
| POST   | `/api/polls`          |
| GET    | `/api/polls/my-polls` |
| GET    | `/api/polls/:code`    |
| DELETE | `/api/polls/:id`      |

Response Routes

| Method | Route                  |
| ------ | ---------------------- |
| POST   | `/api/responses/:code` |

Analytics Routes

| Method | Route                         |
| ------ | ----------------------------- |
| GET    | `/api/analytics/:pollId`      |
| GET    | `/api/analytics/public/:code` |

📡 Real-Time Features

Socket.IO is used for:

Live response count updates
Real-time analytics refresh
Instant dashboard synchronization

🎥 Demo Video
Add your demo video link here.
https://www.loom.com/share/71fe70cd0f004b31a20fc2ae32617564

👨‍💻 Author
Dipanshu

📜 License

This project is built for educational and hackathon purposes.
