# MSRTC NextGen

Maharashtra State Road Transport Corporation — Next Generation Digital Platform

## Project Structure

```
msrtc-nextgen/
├── backend/          # Express + TypeScript REST API
│   ├── server/       # Route → Controller → Service → Repository
│   ├── server.ts     # Entry point
│   └── package.json
└── frontend/         # React + Vite + Tailwind SPA
    ├── src/          # Components, services, types
    ├── index.html
    └── package.json
```

## Getting Started

### 1. Install dependencies

```bash
# From root — installs both backend and frontend
npm run install:all

# Or individually
cd backend && npm install
cd frontend && npm install
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — set JWT_SECRET, HMAC_SECRET, optionally GEMINI_API_KEY

# Frontend
cp frontend/.env.example frontend/.env
# VITE_API_URL defaults to http://localhost:3000 — no change needed for local dev
```

### 3. Run in development

Open two terminals:

```bash
# Terminal 1 — API server on :3000
cd backend && npm run dev

# Terminal 2 — Vite dev server on :5173 (proxies /api → :3000)
cd frontend && npm run dev
```

Or from the root (requires a shell that supports `&`):

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
# backend/dist/server.cjs  — Node.js bundle
# frontend/dist/           — Static SPA bundle (serve via CDN or nginx)
```

## API

Base URL: `http://localhost:3000/api/v1`

| Module | Route prefix |
|---|---|
| Auth | `/auth` |
| Trips | `/trips` |
| Bookings | `/bookings` |
| Conductor ETIM | `/conductor` |
| Admin Depot | `/admin` |
| Driver | `/driver` |
| ST-Mitra AI | `/assistant` |
| Advisories | `/advisories` |

Health check: `GET /api/v1/health`

## Seed Credentials (development only)

| Role | Employee ID | Password |
|---|---|---|
| Admin | ADM-SWG-9042 | msrtc@2026 |
| Conductor | CND-DDR-4418 | msrtc@2026 |
| Driver | DRV-NSK-8821 | msrtc@2026 |

## Tests

```bash
cd backend && npm run test:api
# or from root:
npm run test:api
```
