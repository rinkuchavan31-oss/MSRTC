/**
 * MSRTC NextGen Backend Integration Test Suite
 * Validates all REST endpoints, business rules, cryptographic HMAC tickets, and role-based access control.
 */
import { createApp } from '../app';
import http from 'http';

let server: http.Server;
let baseUrl: string;

async function request(
  path: string,
  options: { method?: string; body?: any; headers?: Record<string, string> } = {},
) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
    failedCount++;
  }
}

async function runTests() {
  console.log('🚀 Starting MSRTC NextGen Backend Integration Tests…\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address() as any;
      baseUrl = `http://localhost:${addr.port}`;
      resolve();
    });
  });

  // Token storage
  let adminToken = '';
  let conductorToken = '';
  let driverToken = '';

  try {
    // ─── 1. Health Check ───────────────────────────────────────────────────
    console.log('📦 1. Health & System Diagnostics');
    const health = await request('/api/v1/health');
    assert(health.status === 200, 'GET /api/v1/health → 200');
    assert(health.data?.data?.status === 'ok', 'Health status is ok');

    // ─── 2. Authentication ────────────────────────────────────────────────
    console.log('\n📦 2. Staff Authentication & Token Issuance');

    const adminLogin = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { employeeId: 'ADM-SWG-9042', password: 'msrtc@2026', role: 'admin', authType: 'password' },
    });
    assert(adminLogin.status === 200, 'Admin login succeeds → 200');
    assert(!!adminLogin.data?.data?.token, 'JWT token returned');
    assert(adminLogin.data?.data?.user?.role === 'admin', 'Role is admin');
    adminToken = adminLogin.data?.data?.token ?? '';

    const conductorLogin = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { employeeId: 'CND-DDR-4418', password: 'msrtc@2026', role: 'conductor', authType: 'password' },
    });
    assert(conductorLogin.status === 200, 'Conductor login succeeds → 200');
    conductorToken = conductorLogin.data?.data?.token ?? '';

    const driverLogin = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { employeeId: 'DRV-NSK-8821', password: 'msrtc@2026', role: 'driver', authType: 'password' },
    });
    assert(driverLogin.status === 200, 'Driver login succeeds → 200');
    driverToken = driverLogin.data?.data?.token ?? '';

    const badLogin = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { employeeId: 'ADM-SWG-9042', password: 'wrong', role: 'admin', authType: 'password' },
    });
    assert(badLogin.status === 401, 'Bad credentials rejected → 401');

    const onboardingReq = await request('/api/v1/auth/register-request', {
      method: 'POST',
      body: { employeeId: 'CND-NEW-9912', fullName: 'Rohan Gaikwad', role: 'conductor', depot: 'Swargate, Pune', mobileNumber: '9822198221' },
    });
    assert(onboardingReq.status === 201, 'Staff onboarding request → 201');
    assert(!!onboardingReq.data?.data?.requestId, 'Returns requestId');

    // ─── 3. Authorization Enforcement ─────────────────────────────────────
    console.log('\n📦 3. Authorization — Reject Unauthenticated/Wrong Role');

    const noTokenAdmin = await request('/api/v1/admin/stats');
    assert(noTokenAdmin.status === 401, 'Admin stats without token → 401');

    const conductorAccessAdmin = await request('/api/v1/admin/stats', {
      headers: { Authorization: `Bearer ${conductorToken}` },
    });
    assert(conductorAccessAdmin.status === 403, 'Conductor accessing admin route → 403');

    const noTokenDriver = await request('/api/v1/driver/duty');
    assert(noTokenDriver.status === 401, 'Driver duty without token → 401');

    // ─── 4. Trips & Seat Map ──────────────────────────────────────────────
    console.log('\n📦 4. Trips & Seat Layout APIs');

    const allTrips = await request('/api/v1/trips/search');
    assert(allTrips.status === 200, 'GET /api/v1/trips/search → 200');
    assert(Array.isArray(allTrips.data?.data?.trips), 'Returns trips array');

    const filtered = await request('/api/v1/trips/search?from=pune&to=mumbai');
    assert(filtered.status === 200, 'Filtered Pune→Mumbai search → 200');
    assert((filtered.data?.data?.trips?.length ?? 0) > 0, 'Found Pune→Mumbai trips');

    const tripById = await request('/api/v1/trips/TRIP-SHIV-01');
    assert(tripById.status === 200, 'GET /api/v1/trips/TRIP-SHIV-01 → 200');

    const seats = await request('/api/v1/trips/TRIP-SHIV-01/seats');
    assert(seats.status === 200, 'GET /api/v1/trips/:id/seats → 200');
    assert((seats.data?.data?.seats?.length ?? 0) > 0, 'Seat layout returned');
    assert(seats.data?.data?.seats?.some((s: any) => s.category === 'women'), 'Has women reserved seats');

    const popularLocs = await request('/api/v1/trips/locations/popular');
    assert(popularLocs.status === 200, 'GET popular locations → 200');

    // ─── 5. Booking & Fare Engine ──────────────────────────────────────────
    console.log('\n📦 5. Booking, Fare Engine & Cryptographic HMAC QR');

    const newBooking = await request('/api/v1/bookings', {
      method: 'POST',
      body: {
        tripId: 'TRIP-SHIV-01',
        selectedSeats: ['2A', '2B'],
        concessionType: 'women',
        passengers: [
          { fullName: 'Priya Kadam', age: 28, gender: 'female', mobileNumber: '+919822012345', seatId: '2A', concessionType: 'women' },
          { fullName: 'Anita Kadam', age: 30, gender: 'female', mobileNumber: '+919822012345', seatId: '2B', concessionType: 'women' },
        ],
        paymentMethod: 'UPI',
      },
    });
    assert(newBooking.status === 201, 'Booking creation → 201');
    const bd = newBooking.data?.data;
    assert(bd?.concessionDiscountPercent === 50, 'Mahila Samman 50% discount applied');
    assert(bd?.discountAmount === 550, 'Discount amount = ₹550 (50% of ₹1100 base)');
    assert(!!bd?.qrPayload, 'HMAC QR payload generated');
    assert(bd?.qrPayload?.startsWith('HMAC_SHA256:'), 'QR has HMAC_SHA256 signature');

    // Seat 1B is pre-seeded as 'booked' — re-booking it should return 409 regardless of gender
    const dupBooking = await request('/api/v1/bookings', {
      method: 'POST',
      body: {
        tripId: 'TRIP-SHIV-01',
        selectedSeats: ['1B'],
        concessionType: 'none',
        passengers: [{ fullName: 'Test User', age: 25, gender: 'male', mobileNumber: '+919000000000', seatId: '1B', concessionType: 'none' }],
        paymentMethod: 'UPI',
      },
    });
    assert(dupBooking.status === 409, 'Double-booking same seat → 409 Conflict');

    const womenSeatViolation = await request('/api/v1/bookings', {
      method: 'POST',
      body: {
        tripId: 'TRIP-SHIV-02',
        selectedSeats: ['2A'],
        concessionType: 'none',
        passengers: [{ fullName: 'Ram Kumar', age: 30, gender: 'male', mobileNumber: '+919000000001', seatId: '2A', concessionType: 'none' }],
        paymentMethod: 'UPI',
      },
    });
    assert(womenSeatViolation.status === 422, 'Male passenger on women-only seat → 422');

    const bookingById = await request(`/api/v1/bookings/${bd?.bookingId}`);
    assert(bookingById.status === 200, 'GET /api/v1/bookings/:id → 200');

    // ─── 6. QR Verification ───────────────────────────────────────────────
    console.log('\n📦 6. Conductor QR Verification (with auth)');

    const qrValidation = await request('/api/v1/conductor/validate-qr', {
      method: 'POST',
      headers: { Authorization: `Bearer ${conductorToken}` },
      body: { qrPayload: bd?.qrPayload },
    });
    assert(qrValidation.status === 200, 'Conductor QR validation → 200');
    assert(qrValidation.data?.data?.status === 'VALID', 'Genuine HMAC ticket = VALID');

    const fakeQr = await request('/api/v1/conductor/validate-qr', {
      method: 'POST',
      headers: { Authorization: `Bearer ${conductorToken}` },
      body: { qrPayload: 'HMAC_SHA256:FAKE123:MH12FC9999:2026-08-21:1A:BADTOKEN1' },
    });
    assert(fakeQr.data?.data?.status === 'INVALID', 'Tampered QR = INVALID');

    // ─── 7. Conductor Terminal Operations ─────────────────────────────────
    console.log('\n📦 7. Conductor ETIM Terminal Operations');

    const manifest = await request('/api/v1/conductor/manifest/TRIP-SHIV-01', {
      headers: { Authorization: `Bearer ${conductorToken}` },
    });
    assert(manifest.status === 200, 'GET manifest → 200');

    const toggleBoarding = await request('/api/v1/conductor/toggle-boarding', {
      method: 'POST',
      headers: { Authorization: `Bearer ${conductorToken}` },
      body: { tripId: 'TRIP-SHIV-01', seatNumber: '1C' },
    });
    assert(toggleBoarding.status === 200, 'Toggle boarding status → 200');

    const spotTicket = await request('/api/v1/conductor/issue-spot-ticket', {
      method: 'POST',
      headers: { Authorization: `Bearer ${conductorToken}` },
      body: { tripId: 'TRIP-SHIV-01', seatNumber: '4D', from: 'Swargate', to: 'Dadar', fare: 550 },
    });
    assert(spotTicket.status === 201, 'Conductor spot ticket issued → 201');

    // ─── 8. Admin Depot & Dynamic Tariff ──────────────────────────────────
    console.log('\n📦 8. Admin Depot Analytics & Dynamic Tariff');

    const statsRes = await request('/api/v1/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(statsRes.status === 200, 'GET /api/v1/admin/stats (admin) → 200');
    assert(typeof statsRes.data?.data?.todayDigitalGmv === 'number', 'Contains digital GMV');

    const surchargeOk = await request('/api/v1/admin/tariff/surcharge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { surchargePercent: 15 },
    });
    assert(surchargeOk.status === 200, 'Holiday surcharge 15% → 200');
    assert(surchargeOk.data?.data?.surchargePercent === 15, 'Surcharge set to 15%');

    const surchargeExcessive = await request('/api/v1/admin/tariff/surcharge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { surchargePercent: 45 },
    });
    assert(surchargeExcessive.status === 422, 'Surcharge > 20% → 422 Business Rule Violation');

    // ─── 9. Driver Operations ─────────────────────────────────────────────
    console.log('\n📦 9. Driver Telemetry & Fitness Inspection');

    const driverDuty = await request('/api/v1/driver/duty', {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    assert(driverDuty.status === 200, 'GET driver duty (driver token) → 200');

    const checklist = await request('/api/v1/driver/checklist', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: { items: [{ id: '1', checked: true }, { id: '6', checked: true }] },
    });
    assert(checklist.status === 200, 'Driver checklist submission → 200');

    const telemetry = await request('/api/v1/driver/telemetry', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: { speedKmh: 76 },
    });
    assert(telemetry.status === 200, 'Driver telemetry update → 200');
    assert(telemetry.data?.data?.isSpeeding === false, 'Speed 76 km/h — not over limit');

    const sos = await request('/api/v1/driver/sos', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: { message: 'Engine overheated at Lonavala curve' },
    });
    assert(sos.status === 200, 'Driver SOS alert → 200');
    assert(sos.data?.data?.status === 'BROADCAST', 'SOS status is BROADCAST');

    // ─── 10. Booking Cancellation ─────────────────────────────────────────
    console.log('\n📦 10. Booking Cancellation & Seat Release');

    const cancelBooking = await request(`/api/v1/bookings/${bd?.bookingId}/cancel`, {
      method: 'POST',
    });
    assert(cancelBooking.status === 200, 'Booking cancellation → 200');
    assert(cancelBooking.data?.data?.status === 'CANCELLED', 'Status = CANCELLED');

    const doubleCancelBooking = await request(`/api/v1/bookings/${bd?.bookingId}/cancel`, {
      method: 'POST',
    });
    assert(doubleCancelBooking.status === 409, 'Double-cancel → 409 Conflict');

    // ─── 11. ST-Mitra AI Assistant ────────────────────────────────────────
    console.log('\n📦 11. ST-Mitra Vernacular AI Assistant');

    const assistantMr = await request('/api/v1/assistant/chat', {
      method: 'POST',
      body: { query: 'पुणे ते मुंबई बस वेळापत्रक काय आहे?', language: 'mr' },
    });
    assert(assistantMr.status === 200, 'Marathi query → 200');
    assert(!!assistantMr.data?.data?.reply, 'Returns Marathi reply');

    const assistantEn = await request('/api/v1/assistant/chat', {
      method: 'POST',
      body: { query: 'What is the Mahila Samman concession?', language: 'en' },
    });
    assert(assistantEn.status === 200, 'English query → 200');
    assert(assistantEn.data?.data?.reply?.includes('50%'), 'Mentions 50% concession');

    // ─── 12. Monsoon Advisories & Notifications ───────────────────────────
    console.log('\n📦 12. Monsoon Advisories & Platform Notifications');

    const monsoon = await request('/api/v1/advisories/monsoon');
    assert(monsoon.status === 200, 'GET monsoon advisories → 200');
    assert((monsoon.data?.data?.length ?? 0) > 0, 'Contains ghat advisories');

    const notifs = await request('/api/v1/advisories/notifications');
    assert(notifs.status === 200, 'GET notifications → 200');
    assert(Array.isArray(notifs.data?.data), 'Returns notifications array');

    const markRead = await request('/api/v1/advisories/notifications/n-1/read', { method: 'POST' });
    assert(markRead.status === 200, 'Mark notification read → 200');

    // ─── 13. Amrut Jyeshtha Free Travel (75+ age) ─────────────────────────
    console.log('\n📦 13. Amrut Jyeshtha Nagrik — Free Travel at 75+');

    const freeTravel = await request('/api/v1/bookings', {
      method: 'POST',
      body: {
        tripId: 'TRIP-ASIAD-01',
        selectedSeats: ['1A'],
        concessionType: 'senior',
        passengers: [
          { fullName: 'Baburao Apte', age: 78, gender: 'male', mobileNumber: '+919811111111', seatId: '1A', concessionType: 'senior' },
        ],
        paymentMethod: 'CASH',
      },
    });
    assert(freeTravel.status === 201, 'Senior 78yr booking → 201');
    assert(freeTravel.data?.data?.totalFare === 0, 'Amrut Jyeshtha: totalFare = ₹0 (free travel)');

    console.log('\n══════════════════════════════════════════');
    console.log(`📊  ${passedCount} PASSED  /  ${failedCount} FAILED`);
    console.log('══════════════════════════════════════════\n');

    if (failedCount > 0) process.exit(1);
  } finally {
    server?.close();
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
