<div align="center">

<img src="https://img.shields.io/badge/MERN-Stack-6d28d9?style=for-the-badge" alt="MERN Stack" />
<img src="https://img.shields.io/badge/TypeScript-Frontend%20%26%20Backend-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Status-Live-22c55e?style=for-the-badge" alt="Status: Live" />

# 🚗 RideSync

### Stop posting "anyone going to Chandigarh?" on WhatsApp.

RideSync is a ride-matching platform built exclusively for **Thapar University** students — it connects people already travelling to the same destination at the same time, so they can share a cab, split the fare, and skip the messy group-chat chaos.

**RideSync does not book cabs, manage drivers, or handle payments.** It only helps students *find each other*. Everything after that — booking Uber/Ola/Rapido, paying, actually travelling — happens outside the app, exactly by design.

[Live Demo](https://ride-sync-weld.vercel.app/) 

</div>

---

## 📖 Table of Contents

- [Why RideSync](#-why-ridesync)
- [Core Concept](#-core-concept)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Design System](#-design-system)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 💡 Why RideSync

Every week, Thapar students post the same message in a dozen different WhatsApp groups:

> *"Anyone going to Chandigarh Airport tomorrow around 5?"*

The replies get lost. People see it too late. There's no way to search, filter, or organize any of it. RideSync replaces that entire broken workflow with a proper matching platform — searchable, filterable, and built only for verified students.

## 🎯 Core Concept

```
1. Post or browse    →  Create a ride request, or search for one already posted
2. Send interest     →  Found a match? Tap "I'm Interested" with an optional note
3. Get accepted      →  The creator accepts — a private chat unlocks instantly
4. Book together     →  Chat, exchange contact info, decide who books the cab
```

That's it. RideSync's job ends the moment two people are connected — no ride tracking, no fare splitting, no driver management. **Lightweight by design.**

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication
- Signup restricted to `@thapar.edu` emails
- Email OTP verification (Brevo)
- JWT-based sessions with protected routes
- Forgot / reset password flow
- Change password & delete account (Settings)

### 🚕 Ride Requests
- Create requests with pickup, destination, date/time, seats needed, gender preference, notes
- Live search & filters (pickup, destination, gender pref, sort)
- Real-time seats-remaining indicator (green/red)
- Creator can delete their own request (cascades cleanly)

### 🤝 Matching Flow
- "I'm Interested" with an optional message to the creator
- Creator inbox to Accept / Reject pending requests
- Remove an already-accepted participant if needed
- One-request-per-ride enforced at the database level

</td>
<td width="50%" valign="top">

### 💬 Chat & Contact
- Private chat auto-created only after acceptance
- Contact card with phone/email — direct call & email buttons
- Polling-based live updates (no page refresh needed)

### ⭐ Reviews & Ratings
- Rate & tag travel partners after a shared ride
- Average rating + trip count shown on profile
- Reviews gated behind proof of an actual match

### 🔔 Notifications
- In-app notification bell with unread badge
- Triggers on new interest, acceptance, and rejection

### 🎨 Experience
- Full dark mode, system-aware
- Framer Motion animations throughout
- Custom logo, color system & typography
- Fully responsive, mobile-first layouts

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<table>
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td><strong>Frontend</strong></td><td>React · Vite · TypeScript · Tailwind CSS v4 · Framer Motion · TanStack Query · React Hook Form · Zod · React Router · Axios · lucide-react</td></tr>
<tr><td><strong>Backend</strong></td><td>Node.js · Express · TypeScript · Mongoose · JWT · bcrypt · Zod</td></tr>
<tr><td><strong>Database</strong></td><td>MongoDB Atlas</td></tr>
<tr><td><strong>Email</strong></td><td>Brevo Transactional Email API</td></tr>
<tr><td><strong>Deployment</strong></td><td>Vercel (frontend) · Render (backend) · MongoDB Atlas (database)</td></tr>
</table>

---

## 🏗 Architecture

```
┌──────────────────┐        HTTPS / JSON        ┌──────────────────┐
│   React + Vite    │ ─────────────────────────▶ │  Express + TS     │
│   (Vercel)         │ ◀───────────────────────── │  (Render)          │
└──────────────────┘                              └──────────┬───────┘
                                                                │
                                                     Mongoose ODM
                                                                │
                                                       ┌────────▼────────┐
                                                       │  MongoDB Atlas   │
                                                       └──────────────────┘
```

**Backend layers:** `routes → middleware (auth) → controllers → models`, with shared Zod validation on every write endpoint and centralized error handling.

**Frontend layers:** `pages → components`, with all server state managed through TanStack Query and all cross-cutting client state (auth, theme) in React Context.

---

## 📸 Screenshots

<img width="1877" height="738" alt="image" src="https://github.com/user-attachments/assets/96a8e82d-3cdd-4881-82c3-8582965db7db" />
<img width="1507" height="807" alt="image" src="https://github.com/user-attachments/assets/aa6e016a-b58e-4928-acea-cbdef4baaaf6" />
<img width="1230" height="870" alt="image" src="https://github.com/user-attachments/assets/d8d3b564-3941-4e66-8348-b59676a5cb6a" />
<img width="722" height="611" alt="image" src="https://github.com/user-attachments/assets/6f44407b-a98b-486e-b79c-9d2cf6d17469" />



---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier works)
- A Brevo account for transactional email (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ridesync.git
cd ridesync
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env   # fill in your own values — see below
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # fill in your own values — see below
npm run dev
```

The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5000`.

---

## 🔑 Environment Variables

**`server/.env`**

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_string
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
CLIENT_URL=http://localhost:5173
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
ridesync/
├── client/                # React + Vite frontend
│   └── src/
│       ├── components/    # Reusable UI (Navbar, Logo, RideCard, ReviewModal...)
│       ├── context/       # AuthContext, ThemeContext
│       ├── lib/           # Axios instance + typed API functions
│       ├── pages/         # One component per route
│       └── App.tsx        # Route definitions
│
└── server/                # Express + TypeScript backend
    └── src/
        ├── config/        # Database connection
        ├── controllers/   # Route handlers / business logic
        ├── middleware/    # Auth (JWT) middleware
        ├── models/        # Mongoose schemas
        ├── routes/        # Express routers
        ├── utils/         # Validators, email, notifications, JWT helpers
        └── index.ts       # App entry point
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register with a Thapar email |
| `POST` | `/api/auth/verify-otp` | Verify email with OTP |
| `POST` | `/api/auth/login` | Log in, receive a JWT |
| `POST` | `/api/auth/forgot-password` | Request a password reset code |
| `GET` | `/api/ride-requests` | List/search open ride requests |
| `POST` | `/api/ride-requests` | Create a ride request |
| `POST` | `/api/join-requests` | Express interest in a ride |
| `PATCH` | `/api/join-requests/:id/respond` | Accept / reject a request |
| `GET` | `/api/chats/:chatId/messages` | Get messages in a chat |
| `POST` | `/api/reviews` | Leave a review for a matched rider |

_All endpoints except signup/login/health are protected by JWT middleware._

---

## 🎨 Design System

| Token | Value |
|---|---|
| Brand color | Electric indigo/purple (`#7c3aed` family) |
| Accent color | Electric pink (`#ec4899` family) |
| Typography | Plus Jakarta Sans |
| Motion | Framer Motion — staggered reveals, layout transitions, page-load fades |
| Theme | Full light/dark mode via Tailwind `dark:` variants + CSS custom properties |

---

## 🗺 Roadmap

- [ ] Real-time chat & notifications via Socket.io (currently polling-based)
- [ ] Profile photo upload
- [ ] Admin panel (user/report management)
- [ ] Multi-university support

---

## 👤 Author

**Chirag Gupta**
Built as a full end-to-end MERN project — architected, coded, debugged, deployed, and designed from scratch.

<div align="center">

⭐ If you found this project interesting, consider giving it a star!

</div>
