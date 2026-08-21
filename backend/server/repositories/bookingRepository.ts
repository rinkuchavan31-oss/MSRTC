import { Booking } from '../models/types';
import { SEED_TRIPS } from '../config/database';

/** In-memory bookings store (persisted across requests for this process lifetime). */
const bookingsStore = new Map<string, Booking>([
  [
    'BK-2026-9823471',
    {
      bookingId: 'BK-2026-9823471',
      bookingRef: 'MSR2026X9F',
      pnr: 'MSRTC-9823471',
      trip: SEED_TRIPS[0],
      selectedSeats: ['W12', 'W13'],
      passengers: [
        { fullName: 'Aniket Shinde', age: 26, gender: 'male', mobileNumber: '+919822012345', email: 'aniket@example.com', seatId: 'W12', concessionType: 'none' },
        { fullName: 'Priya Shinde', age: 24, gender: 'female', mobileNumber: '+919822012345', email: 'aniket@example.com', seatId: 'W13', concessionType: 'women' },
      ],
      concessionType: 'women',
      concessionDiscountPercent: 50,
      baseFare: 1100,
      discountAmount: 275,
      gstAmount: 41.25,
      totalFare: 866.25,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      bookingDate: '2026-08-20',
      journeyDate: '2026-08-20',
      qrPayload: 'HMAC_SHA256:MSR2026X9F:MH12FC4589:2026-08-20:W12,W13:VALID',
      status: 'CONFIRMED',
      platformNumber: 'Platform 3',
      offlineCached: true,
      currentStopIndex: 2,
      busCoordinates: { lat: 18.7523, lng: 73.4068, speedKmh: 74, heading: 315, etaMinutes: 15, distanceRemainingKm: 18 },
    },
  ],
]);

export const bookingRepository = {
  findById(bookingId: string): Booking | undefined {
    return bookingsStore.get(bookingId);
  },

  findByPnr(pnr: string): Booking | undefined {
    for (const booking of bookingsStore.values()) {
      if (booking.pnr === pnr) return booking;
    }
    return undefined;
  },

  findByRef(bookingRef: string): Booking | undefined {
    for (const booking of bookingsStore.values()) {
      if (booking.bookingRef === bookingRef) return booking;
    }
    return undefined;
  },

  findAll(): Booking[] {
    return Array.from(bookingsStore.values());
  },

  save(booking: Booking): Booking {
    bookingsStore.set(booking.bookingId, booking);
    return booking;
  },

  updateStatus(bookingId: string, status: Booking['status']): Booking | undefined {
    const booking = bookingsStore.get(bookingId);
    if (!booking) return undefined;
    const updated = { ...booking, status };
    bookingsStore.set(bookingId, updated);
    return updated;
  },
};
