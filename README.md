# AI-Based Multilingual Mass Communication Platform

This project is the first module (**Audience Management & Campaign Planning**) of the AI-Based Multilingual Mass Communication Platform. It features a secure user registration and login system with Role-Based Access Control (RBAC) supporting **Administrators**, **Campaign Managers**, and **Communication Teams**.

## Tech Stack
- **Frontend:** React.js, React Router, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), bcryptjs hashing

---

## Folder Structure
```text
project/
├── backend/
│   ├── config/db.js          # MongoDB connection handler
│   ├── middleware/auth.js    # JWT verification & Role-based authentication (RBAC)
│   ├── models/User.js        # User mongoose schema with bcrypt hooks
│   ├── routes/auth.js        # Registration, Login, and Profile endpoints
│   ├── seed.js               # Database initialization & test-user generator
│   ├── package.json          # Node dependencies
│   ├── server.js             # Main server entrypoint
│   └── .env                  # Configuration variables
├── frontend/
│   ├── src/
│   │   ├── components/       # Pages (Home, Login, Register, Dashboard, etc.)
│   │   ├── context/          # Authentication state management
│   │   ├── App.jsx           # Routing & Guards
│   │   ├── index.css         # Custom typography and Tailwind CSS configurations
│   │   └── main.jsx
│   ├── index.html            # Main markup and SEO tags
│   ├── tailwind.config.js    # Tailwind theme colors
│   └── package.json          # Vite dependencies
└── README.md                 # Setup manual
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- A running MongoDB instance (Local or MongoDB Atlas cloud connection URI)

### 1. Database Configuration
Open `backend/.env` and verify/update your configuration variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mass_comm
JWT_SECRET=supersecretkeyformasscommunicationplatformai
```
*(Note: If you are using MongoDB Atlas, replace the `MONGODB_URI` value with your cloud cluster connection string.)*

### 2. Seed Test Credentials
Run the seeding script to test your database connection and create a default **Campaign Manager** account:
```bash
# Navigate to backend and run the seed script
cd backend
npm run seed
```
**Default Seeded Credentials:**
- **Email:** `vishnu@masscomm.com`
- **Password:** `password123`
- **Role:** `Campaign Manager`

---

## Running the Platform

### Start Backend Server
In the `backend/` folder:
```bash
npm run dev
```
The server will start on port `5000` (http://localhost:5000).

### Start Frontend Client
In the `frontend/` folder:
```bash
# Install node packages (if not already done)
npm install
# Run Vite dev server
npm run dev
```
The client will start (usually on http://localhost:5173). Open the URL in your browser to view and interact with the platform.

---

## Implemented Features
1. **Home Landing Page:** Styled with brand gradients and Poppins typography.
2. **Registration Form:** Validates required fields, email format, minimum 8 password characters, password equality, and unique email database check. Handles roles and language preferences.
3. **Login Form:** Allows signing in with session storage or local persistence ("Remember Me" option).
4. **Interactive Dashboard:** Tailored to the user's role displaying quick actions and campaign statistics metrics (Total Campaigns, Active Campaigns, Audience size, Languages).
5. **Profile page:** Card view showing active credentials, joined date, and workspace metadata.
6. **Auxiliary Views:** Campaigns planner, Audience cohorts manager, AI content generator simulation, and telemetry Analytics page.
