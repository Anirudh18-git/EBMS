# Backend Integration TODO

## Step 1: Create Backend Directory Structure
- [x] Create `backend/` directory in root.
- [x] Create subdirectories: `models/`, `routes/`, `middleware/`.

## Step 2: Set Up Backend Package.json and Dependencies
- [x] Create `backend/package.json` with scripts and deps (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon).
- [x] Install dependencies via npm.

## Step 3: Create Database Models
- [x] Create `backend/models/User.js` (Mongoose schema for User, with hashed password).
- [x] Create `backend/models/Bill.js` (Mongoose schema for Bill, referencing User).

## Step 4: Create Middleware
- [x] Create `backend/middleware/auth.js` (JWT verification, role checks).

## Step 5: Create API Routes
- [x] Create `backend/routes/auth.js` (register, login).
- [x] Create `backend/routes/users.js` (add/get users, admin-only).
- [x] Create `backend/routes/bills.js` (generate/get/update bills).

## Step 6: Create Main Server File
- [x] Create `backend/server.js` (Express setup, MongoDB connection, route registration, CORS).

## Step 7: Update Frontend Constants
- [x] Update `constants.ts` to add API_BASE_URL.

## Step 8: Update Frontend Services
- [x] Create `services/apiService.ts` for shared fetch utilities.
- [x] Overhaul `services/storageService.ts` to use API calls instead of localStorage.

## Step 9: Add Environment Configuration
- [x] Create `backend/.env` with MONGO_URI and JWT_SECRET placeholders.

## Step 10: Followup Steps
- [x] Install backend deps.
- [x] Set up MongoDB Atlas and update .env.
- [x] Seed initial admin user.
- [ ] Test locally (run backend and frontend).
- [ ] Prepare for deployment (update prod API URL, deploy instructions).
