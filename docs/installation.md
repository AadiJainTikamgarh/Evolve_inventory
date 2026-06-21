# ⚙️ Installation & Operations Guide

This guide provides step-by-step instructions on setting up, configuring, seeding, running, and testing the **Evolve Lab Inventory Management System** locally.

---

## 📋 System Requirements

Ensure your machine meets the following pre-requisites:
- **Node.js**: `v18.x` or higher (tested on `v20.x` and `v22.x`)
- **npm**: `v9.x` or higher
- **MongoDB**: Community Server `v6.x` or higher (or an active MongoDB Atlas cluster URL)

---

## 🗝️ Environment Variables Configuration

The backend server relies on a `.env` configuration file to establish connections and handle JSON Web Tokens. Create a file named `.env` in your `server/` directory and populate it with:

```env
# The port the backend Express server will run on
PORT=5000

# The MongoDB URI connection string
MONGODB_URI=mongodb://localhost:27017/evolve_inventory

# Secret string used to sign and verify JSON Web Tokens (JWT) for authentication
JWT_SECRET=your_super_secret_jwt_token_key_here

# The URL of your React frontend app (used to configure CORS)
CLIENT_URL=http://localhost:5173

# Node execution environment (development or production)
NODE_ENV=development
```

> [!IMPORTANT]
> Never commit your `.env` file to version control. It is already added to the project's `.gitignore`.

---

## 🚀 Setting Up the Application Locally

Follow these commands to get the application up and running in development mode:

### 1. Install Project Dependencies
Run `npm install` at the root, server, and client directories:
```bash
# Install root package-runner dependencies
npm install

# Install backend dependencies
npm install --prefix server

# Install frontend dependencies
npm install --prefix client
```

### 2. Seed Mock Database Data
To populate your database with ready-to-use lab components (sensors, microcontrollers, cables, actuators), run the seed script:
```bash
npm run seed:mock --prefix server
```
*Expected Output:*
```bash
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🧹 Cleaning existing components...
🌱 Seeding 15 high-quality hardware components...
✅ Successfully seeded mock components!
🔌 Disconnecting from MongoDB...
```

### 3. Run the Development Server
You can launch both the React Vite app and the Express backend concurrently using a single command from the root directory:
```bash
npm run dev
```
- **Frontend** will be served at: [http://localhost:5173](http://localhost:5173)
- **Backend API** will be served at: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing

The backend is backed by a native Node.js test runner using `Supertest` and `mongodb-memory-server` to mock transactions with high fidelity.

### Running Backend Tests
To execute all backend unit and integration tests:
```bash
npm run test --prefix server
```
The test suite utilizes a dynamic `MongoMemoryReplSet` (a single-node in-memory replica set) allowing the mongoose services to perform nested transactions safely inside the tests.

---

## 📦 Production Builds

To compile the React frontend into highly optimized static assets:

```bash
# Build the production bundle
npm run build --prefix client

# Preview the built production client locally
npm run preview --prefix client
```
The production bundle will be generated under `client/dist/`.

---

## 🔍 Troubleshooting

### 1. MongoDB Connection Refused
If you see the error `MongooseServerSelectionError: connect ECONNREFUSED 127.5.5.1:27017`:
- Verify your local MongoDB service is running:
  - **Windows (PowerShell)**: `Get-Service -Name MongoDB` or `Start-Service -Name MongoDB`
  - **Linux / macOS**: `sudo systemctl status mongod`
- If you are using IPv6, swap `localhost` to `127.0.0.1` inside your `.env` file.

### 2. Ports Already in Use
If ports `5000` or `5173` are occupied by other active background processes:
- Change the `PORT` variable in the `server/.env` to another number (e.g. `5050`).
- Ensure the frontend's API calls are updated to target the new backend port.
