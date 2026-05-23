# Nexus Platform — Angular 14 + Node.js/TypeScript

## Quick Start

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- npm 8+

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start Backend API  (Terminal 1)
```bash
cd backend
npm run dev
# → API running at http://localhost:3000
```

### 3. Start Angular App  (Terminal 2)
```bash
cd frontend
npm start
# → App running at http://localhost:4200
```

## Demo Credentials

| Role  | User ID  | Password   |
|-------|----------|------------|
| Admin | admin01  | Admin123  |
| Admin | admin02  | Admin123  |
| User  | user01   | User123   |
| User  | user02   | User123   |

## API Endpoints

| Method | Path                          | Auth     | Description          |
|--------|-------------------------------|----------|----------------------|
| POST   | /api/v1/auth/login            | Public   | Login                |
| GET    | /api/v1/auth/me               | JWT      | Current user profile |
| GET    | /api/v1/records?delay=1200    | JWT      | Get records (filtered)|
| GET    | /api/v1/admin/users?delay=800 | Admin    | List all users       |
| POST   | /api/v1/admin/users           | Admin    | Create user          |
| PATCH  | /api/v1/admin/users/:id       | Admin    | Update user          |
| DELETE | /api/v1/admin/users/:id       | Admin    | Delete user          |
| PATCH  | /api/v1/admin/users/:id/toggle| Admin    | Toggle active status |
| GET    | /api/v1/health                | Public   | Health check         |

## Architecture

```
nexus-app/
├── backend/                    Node.js + TypeScript API
│   └── src/
│       ├── server.ts           Express app entry point
│       ├── models/             Shared TypeScript interfaces
│       ├── data/store.ts       In-memory DB (swap with MongoDB/DynamoDB)
│       ├── middleware/         JWT auth + delay simulation
│       ├── controllers/        Request handlers (auth, records, users)
│       └── routes/             Route definitions
│
└── frontend/                   Angular 14 SPA
    └── src/app/
        ├── core/               Singleton services, guards, interceptors
        │   ├── models/         Shared interfaces
        │   ├── services/       AuthService, RecordsService, UserService
        │   ├── guards/         AuthGuard, AdminGuard
        │   └── interceptors/   JwtInterceptor
        ├── modules/            Feature modules
        │   ├── auth/           Login page
        │   ├── dashboard/      Main dashboard + records table
        │   └── admin/          User management (admin only)
        └── shared/             Reusable components (Navbar, Badge, Skeleton)
```
