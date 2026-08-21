# Deployment & Infrastructure Guide: MSRTC NextGen

---

## 1. Environment Configuration (`.env`)

| Variable Name | Purpose | Example / Default | Required |
|---|---|---|---|
| `PORT` | HTTP Server port | `3000` | Optional |
| `NODE_ENV` | Environment mode | `development` / `production` | Optional |
| `GEMINI_API_KEY` | Google Gemini AI Key | `AIzaSy...` | Optional (fallback active) |
| `JWT_SECRET` | Secret key for JWT tokens | `msrtc_secret_key_2026` | Recommended |
| `HMAC_SECRET` | Secret key for E-Ticket HMAC signing | `msrtc_hmac_transit_key_2026` | Recommended |
| `APP_URL` | Base application URL | `http://localhost:3000` | Optional |

---

## 2. Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Express + Vite HMR)
npm run dev
```

---

## 3. Production Build & Execution
```bash
# 1. Build client bundle and bundle server
npm run build

# 2. Run production server
npm start
```

---

## 4. Health Check Endpoint
- **Endpoint:** `GET /api/v1/health`
- **Response:** `200 OK` `{ "status": "ok", "service": "msrtc-nextgen-backend", "timestamp": "..." }`
