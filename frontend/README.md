# ☕ ChaiPoll — Frontend

> React + Vite frontend for the ChaiPoll real-time polling platform.  
> Built with **React 19**, **Tailwind CSS**, **React Router v7**, **Socket.io Client** and **Axios**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Key Components](#key-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [WebSocket Integration](#websocket-integration)
- [Features](#features)

---

## Overview

ChaiPoll frontend is a fully responsive single-page application where:

- Users **register / login** and land on a branded home page
- Logged-in users can **create polls** with multiple questions, set expiry, choose anonymous or auth-required mode
- A shareable public link is generated — **anyone** can open it and respond
- The poll creator has a **live analytics dashboard** (bar charts, response counts, winner highlight) updated in real-time via Socket.io
- Creators can **publish final results** — the same public link then shows the outcome to everyone

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP requests to backend |
| Socket.io Client 4 | Real-time WebSocket connection |
| React Hook Form | Form state & validation |
| React Hot Toast | Toast notifications |
| Zod | Schema validation |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                          # Environment variables
├── package.json
│
└── src/
    ├── main.jsx                  # App entry point
    ├── App.jsx                   # Root component
    ├── index.css                 # Global styles + Tailwind + design tokens
    │
    ├── api/
    │   └── axios.js              # Axios instance — baseURL + auth interceptor
    │
    ├── context/
    │   └── AuthContext.jsx       # Global auth state (user, token, login, logout)
    │
    ├── socket/
    │   └── socket.js             # Socket.io client instance
    │
    ├── routes/
    │   └── AppRoutes.jsx         # All route definitions
    │
    ├── components/
    │   ├── Navbar.jsx            # Sticky navbar with social links, mobile menu
    │   ├── ProtectedRoute.jsx    # Redirect to /login if not authenticated
    │   ├── PollCard.jsx          # Reusable poll card for dashboard
    │   └── Loader.jsx            # Spinner component
    │
    ├── layouts/
    │   └── DashboardLayout.jsx   # Shared layout wrapper
    │
    └── pages/
        ├── Home.jsx              # Landing page (opens first — no login required)
        ├── Login.jsx             # Sign in page
        ├── Register.jsx          # Sign up page
        ├── Dashboard.jsx         # My polls list (protected)
        ├── CreatePoll.jsx        # Poll builder form (protected)
        ├── Analytics.jsx         # Live analytics for a poll (protected, creator only)
        ├── PollPage.jsx          # Public poll response form
        ├── PublicResults.jsx     # Published results (public)
        └── NotFound.jsx          # 404 page
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend server running at `http://localhost:5000`

### Installation

```bash
# 1. Navigate to frontend folder
cd chaipoll/frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start dev server
npm run dev
```

App runs at: `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_BACKEND_URL` | Backend root URL (for Socket.io) | `http://localhost:5000` |

> **Note:** All Vite env variables must start with `VITE_` to be accessible in the browser.

---

## Pages & Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | `Home.jsx` | Public | Landing page — hero, features, CTA |
| `/login` | `Login.jsx` | Public | Sign in form |
| `/register` | `Register.jsx` | Public | Sign up form |
| `/dashboard` | `Dashboard.jsx` | 🔒 Protected | All polls created by logged-in user |
| `/create-poll` | `CreatePoll.jsx` | 🔒 Protected | Poll builder |
| `/analytics/:pollId` | `Analytics.jsx` | 🔒 Protected | Live analytics (creator only) |
| `/poll/:code` | `PollPage.jsx` | 🌐 Public | Poll response form |
| `/results/:code` | `PublicResults.jsx` | 🌐 Public | Published poll results |
| `*` | `NotFound.jsx` | Public | 404 error page |

### Protected Routes

`ProtectedRoute` wraps any route that needs authentication:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

If the user is not logged in, they are redirected to `/login` with `state={{ from: location }}` so they return to the original page after signing in.

---

## Key Components

### `Navbar.jsx`
- Sticky glassmorphism header
- Logo links to `/`
- Shows **Dashboard** and **Create Poll** links when logged in
- Shows **Home**, **Login**, **Register** when logged out
- Displays user avatar and name when logged in
- Social links: GitHub, Twitter/X, LinkedIn
- Fully responsive with hamburger menu on mobile

### `ProtectedRoute.jsx`
```jsx
// Redirects to /login if user not in AuthContext
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
```

### `AuthContext.jsx`
Global context that stores:
- `user` — logged-in user object
- `token` — JWT string
- `login(user, token)` — saves to state + localStorage
- `logout()` — clears state + localStorage

### `axios.js`
Axios instance with:
- `baseURL` from `VITE_API_URL`
- Request interceptor that automatically attaches `Authorization: Bearer <token>` to every request if a token exists in localStorage

```js
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### `socket.js`
Single Socket.io client instance shared across the app:

```js
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL);
export default socket;
```

---

## State Management

ChaiPoll uses React's built-in state management — no Redux or Zustand needed.

| Scope | Tool | Used for |
|-------|------|---------|
| Global auth | `AuthContext` (Context API) | user object, token, login/logout |
| Local page state | `useState` | polls list, form inputs, analytics data |
| Form state | `React Hook Form` | login, register, create poll forms |
| Server state | `useState` + `useEffect` | fetching polls, analytics |

---

## API Integration

All API calls go through the custom Axios instance at `src/api/axios.js`:

```js
import API from "../api/axios";

// GET example
const res = await API.get("/polls/my-polls");
const polls = res.data.polls;

// POST example
await API.post("/polls", { title, questions, expiresAt, allowAnonymous });

// PATCH example
await API.patch(`/analytics/${pollId}/publish`);

// DELETE example
await API.delete(`/polls/${id}`);
```

Token is **automatically attached** by the interceptor — no need to pass headers manually in any component.

---

## WebSocket Integration

Socket.io is used for real-time analytics updates.

### How it works

1. When User B submits a response on `PollPage`, the backend emits `response_submitted` to the poll's Socket.io room.
2. User A (creator) is already in that room (joined via `join_poll`) on the `Analytics` page.
3. `Analytics.jsx` listens for `response_submitted` and re-fetches analytics automatically.

### PollPage.jsx — respondent joins the room

```js
useEffect(() => {
  const joinRoom = () => socket.emit("join_poll", code);

  if (socket.connected) {
    joinRoom();
  } else {
    socket.on("connect", joinRoom);
  }

  return () => socket.off("connect", joinRoom);
}, [code]);
```

### Analytics.jsx — creator listens for updates

```js
// Listen for new responses
useEffect(() => {
  socket.on("response_submitted", fetchAnalytics);
  return () => socket.off("response_submitted", fetchAnalytics);
}, [pollId]);

// Join poll room when pollCode is available
useEffect(() => {
  if (!analytics?.pollCode) return;

  const joinRoom = () => socket.emit("join_poll", analytics.pollCode);

  if (socket.connected) {
    joinRoom();
  } else {
    socket.on("connect", joinRoom);
  }

  return () => socket.off("connect", joinRoom);
}, [analytics?.pollCode]);
```

---

## Features

- ✅ Home landing page opens first (not login page)
- ✅ JWT-based auth — token stored in localStorage
- ✅ Protected routes — redirect to login, return after auth
- ✅ Poll builder — add/remove questions, toggle required, add/remove options
- ✅ Anonymous vs authenticated response mode toggle
- ✅ Expiry date picker (`datetime-local`) with future-date validation
- ✅ Public poll link — `/poll/:code` — anyone can open
- ✅ Auth-gate on PollPage — sign-in prompt for auth-required polls
- ✅ Progress bar on poll form — shows answered/total
- ✅ Required question validation before submit
- ✅ Live analytics — bar charts, option %, winner trophy 🏆
- ✅ Real-time response count via Socket.io
- ✅ Publish results button — makes results public
- ✅ Public results page — `/results/:code`
- ✅ Copy share link on Dashboard and Analytics
- ✅ Toast notifications for all actions
- ✅ Fully responsive — mobile, tablet, desktop
- ✅ Dark theme with ChaiPoll brand (orange/amber gradient)
- ✅ Smooth animations (fade-up, stagger)
- ✅ 404 page with navigation