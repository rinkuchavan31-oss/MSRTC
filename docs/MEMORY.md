# PROJECT MEMORY

## Current State
- Backend: **COMPLETE** — all modules implemented, auth/authz applied, tests passing
- Stack: Express + TypeScript, in-memory stores (no external database)
- Frontend: React + Vite SPA, already exists and consumes all APIs

## Completed
- Authentication: JWT via `/api/v1/auth/login` (password + OTP simulation)
- Staff onboarding: `/api/v1/auth/register-request`
- Trip search + seat maps: `/api/v1/trips/search`, `/api/v1/trips/:id/seats`
- Booking engine with fare calculation, concession rules, HMAC QR tickets
- Conductor ETIM: QR validation, manifest, boarding toggle, spot tickets
- Admin depot: stats, trip list, dynamic surcharge (±20% policy enforced)
- Driver portal: pre-trip checklist, telemetry, SOS
- ST-Mitra AI assistant: Gemini + rule-engine fallback, Marathi/Hindi/English
- Monsoon advisories + notifications
- Auth middleware applied to protected routes (admin, conductor, driver)
- Security headers + CORS in app.ts
- Integration test suite (server/tests/api.test.ts) — run: `npm run test:api`

## Architecture

```
Route → Middleware → Controller → Service → Repository → In-memory store
```

- No external DB. All state in-memory Maps (resets on restart).
- Seed data in `server/config/database.ts`
- Types in `server/models/types.ts`

## Important Decisions
- SHA-256 (crypto module) used for password hashing (no bcrypt dep)
- HMAC-SHA256 for e-ticket QR integrity (12-char truncated hex token)
- 75+ senior citizen → 100% free travel (Amrut Jyeshtha Nagrik Yojana)
- Mahila Samman: 50% for female passengers; women-only seats enforced
- Dynamic surcharge: clamped ±20% per MSRTC Tariff Policy
- GST: 5% on AC services only; non-AC exempt
- In-memory rate limiter (no Redis dep): sliding window per IP

## Route Protection

| Route Prefix | Auth Required | Role Required |
|---|---|---|
| /api/v1/auth/* | ❌ Public | — |
| /api/v1/trips/* | ❌ Public | — |
| /api/v1/bookings POST | ❌ Public | — |
| /api/v1/bookings GET | ✅ Yes | any |
| /api/v1/bookings/:id GET | ❌ Public | — |
| /api/v1/bookings/:id/cancel | ❌ Public | — |
| /api/v1/conductor/* | ✅ Yes | conductor, admin |
| /api/v1/admin/* | ✅ Yes | admin |
| /api/v1/driver/* | ✅ Yes | driver, admin |
| /api/v1/assistant/* | ❌ Public | — |
| /api/v1/advisories/* | ❌ Public | — |

## Seed Credentials (dev only)

| Employee ID | Password | Role |
|---|---|---|
| ADM-SWG-9042 | msrtc@2026 | admin |
| CND-DDR-4418 | msrtc@2026 | conductor |
| DRV-NSK-8821 | msrtc@2026 | driver |

## Known Limitations
- No persistent database — state resets on process restart
- OTP validation is simulated (any 6-digit code accepted for known staff)
- Seat layout is generated fresh each request (changes persist via seatStatusMap)
- No email/SMS notifications (simulated)
- No payment gateway integration (all payments marked PAID immediately)

## Next Actions (if continuing development)
1. Integrate a persistent database (PostgreSQL/MongoDB)
2. Real OTP via SMS (Twilio/MSG91)
3. Payment gateway integration (Razorpay/PhonePe)
4. WebSocket for real-time bus tracking
5. Push notifications for platform updates

## Key Files
- `server/app.ts` — Express app factory, security headers, CORS
- `server/config/database.ts` — All seed data
- `server/models/types.ts` — All TypeScript interfaces
- `server/middlewares/authMiddleware.ts` — JWT verification
- `server/middlewares/roleMiddleware.ts` — Role-based access
- `server/utils/pricing.ts` — Fare calculation, GST, concessions
- `server/utils/crypto.ts` — HMAC QR generation/validation
- `server/tests/api.test.ts` — Integration test suite
