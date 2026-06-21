# 🧪 Evolve Lab - Secure Inventory Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.x-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-v19.x-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4.x-38bdf8.svg)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Evolve Lab is a next-generation, high-performance, and visually stunning **Laboratory Inventory Management System** built with the MERN stack (**React 19, Express.js, MongoDB, Node.js**). It features strict role-based access control, a visual borrow-request system, rich interactive analytics, and a fully sandboxed, zero-data-loss **Demo Mode** with interactive credentials autofill.

---

## ✨ Features & Highlights

- **📊 Lab Overview Dashboard**: Live analytics powered by `Recharts` showcasing total working stock, broken components, items in-use, and category distribution with elegant dark mode aesthetics.
- **📦 Advanced Inventory CRUD**: Seamless component lifecycle tracking including automatic quantity compilation, sub-status categories, and fuzzy autocomplete search.
- **🔄 Request & Return Workflow**: Dynamic borrow/return lifecycle with a full double-sided dashboard. Managers can approve/reject request, and users can track items in real-time.
- **🔑 Role-Based Access Control (RBAC)**: Fine-grained user access policies distinguishing between `Managers` (full admin access) and `Users` (standard view/borrow requests).
- **🛡️ Sandboxed Demo Mode (New)**: A bulletproof demo experience with 100% database safety. Users can test editing, deleting, and approving records in a memory-isolated sandbox (`isDemo: true`) without touching active production database records.
- **🪄 Floating Demo Helper**: A stunning glassmorphic credentials drawer with a **one-click Autofill & Go** action that makes onboarding incredibly smooth.
- **🎨 Glassmorphic Dark UI**: Responsively designed dashboard elements using **Tailwind CSS v4** and fluid transitions powered by **Framer Motion**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (ODM: [Mongoose](https://mongoosejs.com/))
- **Testing**: Native Node `node --test` with `Supertest` and `MongoMemoryReplSet` for full transaction-supported replica sets.

---

## 📂 Repository Structure

The project is cleanly split into frontend, backend, and documentation folders:

```bash
evolve-inventory/
├── client/                 # React 19 Frontend (Vite)
├── server/                 # Express.js API Backend
├── docs/                   # Detailed Architecture & Guides (Separate Documentation)
│   ├── installation.md     # Setup, Environment variables, Running locally
│   ├── architecture.md     # Models, Middlewares, Database Schema
│   ├── demo-mode.md        # Deep dive into the Sandboxed Demo system
│   └── api.md              # Backend REST API Endpoints Specification
├── README.md               # Main repository entrypoint
└── package.json            # Root configuration for concurrent execution
```

---

## 🚀 Quick Start

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/evolve-inventory.git
cd evolve-inventory
```

### 2. Install dependencies
Install all root, client, and server dependencies:
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Setup Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/evolve_inventory
JWT_SECRET=your_super_secret_jwt_token_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed Mock Data (Optional)
To populate the database with original hardware component data:
```bash
npm run seed:mock --prefix server
```

### 5. Run the Application
Start both the client and server concurrently with one command from the root directory:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📚 Project Documentation

For deeper technical breakdowns, please refer to our dedicated documentation guides located in the [`docs/`](./docs) folder:

1. **[⚙️ Installation & Operations](./docs/installation.md)**: A complete walkthrough on setting up, environment variables, troubleshooting, seeding mock data, and testing.
2. **[📐 System Architecture & Models](./docs/architecture.md)**: Deep dive into the database architecture, mongoose schemas, role permissions configurations, and system-level middlewares.
3. **[🛡️ Secure Demo Mode Deep-dive](./docs/demo-mode.md)**: Read how the sandbox isolation protects your production data and how automatic cleaning runs in the background.
4. **[🔌 REST API Specification](./docs/api.md)**: Full mapping of all endpoint contracts including request formats and expected responses.

---

## 📄 License
This project is licensed under the [ISC License](./LICENSE).
