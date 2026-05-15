# ☕ ChaiPoll — Backend

> REST API + WebSocket server for the ChaiPoll real-time polling platform.  
> Built with **Node.js**, **Express**, **MongoDB** (Mongoose) and **Socket.io**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Features](#features)

---

## Overview

ChaiPoll backend powers a full-featured polling platform where:

- Users can **register / login** and create polls
- Each poll has **multiple questions** (single-option selection), **expiry time**, and **anonymous or authenticated** response mode
- Anyone with the poll link can **respond** (subject to mode)
- Poll creators see **live analytics** updated via Socket.io
- Creators can **publish results** publicly

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js (ESM) | Runtime |
| Express 4 | HTTP server & routing |
| MongoDB + Mongoose 9 | Database & ODM |
| Socket.io 4 | Real-time WebSocket events |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| nanoid | Unique poll code generation |
| morgan | HTTP request logging |
| dotenv | Environment config |
| nodemon | Dev auto-restart |

---

## Project Structure

```
backend/
├── server.js                        # Entry point — HTTP + Socket.io init
├── app.js                           # Express app — middleware & routes
├── .env                             # Environment variables (not committed)
├── package.json
│
└── src/
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── socket.js                # Socket.io init/get helpers
    │
    ├── models/
    │   ├── User.js                  # User schema
    │   ├── Poll.js                  # Poll + Questions + Options schema
    │   └── Response.js              # Response + Answers schema
    │
    ├── controllers/
    │   ├── auth.controller.js       # register, login
    │   ├── poll.controller.js       # createPoll, getPollByCode, getMyPolls, deletePoll
    │   ├── response.controller.js   # submitResponse
    │   └── analytics.controller.js  # getPollAnalytics, getPublicResults, publishresults
    │
    ├── routes/
    │   ├── auth.routes.js           # /api/auth
    │   ├── poll.routes.js           # /api/polls
    │   ├── response.routes.js       # /api/responses
    │   └── analytics.routes.js      # /api/analytics
    │
    ├── middleware/
    │   ├── auth.middleware.js        # protect — JWT verify, req.user set
    │   ├── optionalAuth.middleware.js# optionalAuth — token optional (for responses)
    │   ├── error.middleware.js       # Global error handler
    │   └── validate.middleware.js    # express-validator result check
    │
    ├── sockets/
    │   └── poll.socket.js           # Socket.io event handlers
    │
    ├── utils/
    │   ├── generateToken.js         # JWT sign
    │   ├── generatePollCode.js      # nanoid poll code
    │   └── validateExpiry.js        # Expiry date helper
    │
    └── validations/
        ├── auth.validation.js       # Register/login rules
        ├── poll.validation.js       # Poll create rules
        └── response.validation.js   # Response submit rules
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally OR MongoDB Atlas URI

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/iamdipanshugupta/ChaiPoll.git
cd chaipoll/backend

# 2. Install dependencies
npm install

# 3. Create .env file (see below)
cp .env.example .env

# 4. Start dev server
npm run dev

# 5. Production
npm start
```

Server starts at: `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the `backend/` root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ChaiPoll
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ChaiPoll` |
| `JWT_SECRET` | Secret for signing JWTs | Any long random string |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

---

## API Reference

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com" },
  "token": "eyJhbGci..."
}
```

---

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com" },
  "token": "eyJhbGci..."
}
```

---

### Polls — `/api/polls`

#### `POST /api/polls` 🔒 Auth required
Create a new poll.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Team lunch preferences",
  "description": "Help us pick the venue",
  "allowAnonymous": true,
  "expiresAt": "2025-12-31T23:59:00",
  "questions": [
    {
      "question": "Which cuisine do you prefer?",
      "required": true,
      "options": ["Italian", "Indian", "Japanese", "Mexican"]
    },
    {
      "question": "Preferred time?",
      "required": false,
      "options": ["12 PM", "1 PM", "2 PM"]
    }
  ]
}
```

**Response `201`:**
```json
{
  "message": "Poll created successfully",
  "poll": { "_id": "...", "pollCode": "abc123", "title": "...", ... }
}
```

---

#### `GET /api/polls/my-polls` 🔒 Auth required
Get all polls created by the logged-in user.

**Response `200`:**
```json
{
  "polls": [ { "_id": "...", "title": "...", "pollCode": "abc123", ... } ]
}
```

---

#### `GET /api/polls/:code` 🌐 Public
Get a poll by its unique code (for respondents).
Returns 400 if the poll has expired.

**Response `200`:**
```json
{
  "poll": {
    "_id": "...", "title": "...", "pollCode": "abc123",
    "allowAnonymous": true, "expiresAt": "...",
    "questions": [ { "_id": "...", "question": "...", "required": true, "options": [...] } ]
  }
}
```

---

#### `DELETE /api/polls/:id` 🔒 Auth required
Delete a poll (only the creator can delete).

**Response `200`:**
```json
{ "message": "Poll deleted successfully" }
```

---

### Responses — `/api/responses`

#### `POST /api/responses/:code` 🌐 Public (optionalAuth)
Submit a response to a poll.
- Anonymous polls: anyone can respond
- Auth-required polls: user must be logged in (send Bearer token)

**Request Body:**
```json
{
  "answers": [
    { "questionId": "64abc...", "selectedOption": "Indian" },
    { "questionId": "64def...", "selectedOption": "1 PM" }
  ]
}
```

**Response `201`:**
```json
{
  "message": "Response submitted successfully",
  "responseId": "64xyz..."
}
```

**Error cases:**
- `400` — Poll expired
- `400` — Required question not answered
- `400` — Invalid option selected
- `401` — Auth-required poll, user not logged in

---

### Analytics — `/api/analytics`

#### `GET /api/analytics/public/:code` 🌐 Public
Get published results for a poll (only works after creator publishes).

**Response `200`:**
```json
{
  "results": {
    "title": "Team lunch preferences",
    "totalResponses": 42,
    "questions": [
      {
        "question": "Which cuisine do you prefer?",
        "optionCounts": {
          "Italian": 10,
          "Indian": 18,
          "Japanese": 9,
          "Mexican": 5
        }
      }
    ]
  }
}
```

---

#### `GET /api/analytics/:pollId` 🔒 Auth required (creator only)
Get detailed analytics for a poll.

**Response `200`:**
```json
{
  "analytics": {
    "pollTitle": "Team lunch preferences",
    "totalResponses": 42,
    "pollCode": "abc123",
    "ispublished": false,
    "questions": [
      {
        "questionId": "64abc...",
        "question": "Which cuisine do you prefer?",
        "required": true,
        "answered": 40,
        "skipped": 2,
        "optionCounts": { "Italian": 10, "Indian": 18, "Japanese": 9, "Mexican": 3 }
      }
    ]
  }
}
```

---

#### `PATCH /api/analytics/:pollId/publish` 🔒 Auth required (creator only)
Publish poll results publicly.

**Response `200`:**
```json
{ "message": "Poll results published successfully" }
```

---

## WebSocket Events

The server uses Socket.io for real-time updates.

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_poll` | `pollCode: string` | Join a poll room to receive live updates |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `response_submitted` | `{ pollCode, message }` | Fired when a new response is submitted to a poll |

### Usage Example (frontend)

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

// Join poll room
socket.emit("join_poll", "abc123");

// Listen for new responses
socket.on("response_submitted", () => {
  fetchAnalytics(); // refresh analytics
});
```

---

## Database Schema

### User
```
_id, name, email, password (bcrypt hashed), createdAt, updatedAt
```

### Poll
```
_id, title, description, creator (ref: User),
questions: [{ question, required, options: [{ text }] }],
allowAnonymous, expiresAt, ispublished, pollCode (unique nanoid),
createdAt, updatedAt
```

### Response
```
_id, poll (ref: Poll), user (ref: User | null),
isAnonymous, answers: [{ questionId, selectedOption }],
createdAt, updatedAt
```

---

## Authentication

- JWT tokens are signed with `JWT_SECRET` (payload: `{ id: userId }`)
- Token is sent as `Authorization: Bearer <token>` header
- `protect` middleware — verifies token, sets `req.user`, returns 401 if invalid
- `optionalAuth` middleware — same as protect but does NOT fail if no token (used for response submission)

---

## Features

- ✅ JWT Authentication (register / login)
- ✅ Poll creation with multiple questions and options
- ✅ Mandatory / optional questions
- ✅ Anonymous and authenticated response modes
- ✅ Poll expiry — responses rejected after expiry
- ✅ Unique poll code (nanoid) for sharing
- ✅ Per-question analytics with option counts
- ✅ Publish results publicly
- ✅ Real-time updates via Socket.io
- ✅ CORS configured for frontend origin
- ✅ Global error handling middleware