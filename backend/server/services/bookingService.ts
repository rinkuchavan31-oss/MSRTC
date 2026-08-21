import { tripRepository } from '../repositories/tripRepository';
import { bookingRepository } from '../repositories/bookingRepository';
import { adminRepository } from '../repositories/adminRepository';
import { AppError } from '../utils/response';
import { calculateFare, applyDepotSurcharge } from '../utils/pricing';
import { generateTicketQrPayload } from '../utils/crypto';
import { Booking, PassengerDetails } from '../models/types';
import { ConcessionType } from '../constants/concessions';

export interface CreateBookingPayload {
  tripId: string;
  selectedSeats: string[];
  concessionType: ConcessionType;
  passengers: Array<{
    fullName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    mobileNumber: string;
    email?: string;
    seatId: string;
    concessionType: ConcessionType;
    concessionProofId?: string;
  }>;
  paymentMethod: Booking['paymentMethod'];
}

export const bookingService = {
  create(payload: CreateBookingPayload): Booking {
    const { tripId, selectedSeats, concessionType, passengers, paymentMethod } = payload;

    // Validate
    if (!tripId || !selectedSeats || selectedSeats.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Trip ID and at least one seat selection are required.');
    }

    if (selectedSeats.length > 6) {
      throw new AppError(400, 'VALIDATION_ERROR', 'A maximum of 6 seats can be booked in a single transaction.');
    }

    if (!passengers || passengers.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Passenger details are required.');
    }

    const trip = tripRepository.findById(tripId);
    if (!trip) throw new AppError(404, 'RESOURCE_NOT_FOUND', `Trip '${tripId}' not found.`);

    // Business Rule: Women-only seat validation
    const seats = tripRepository.getSeats(tripId) ?? [];
    for (const seatId of selectedSeats) {
      const seat = seats.find((s) => s.number === seatId);
      if (seat?.genderReserved === 'female') {
        const passenger = passengers.find((p) => p.seatId === seatId);
        if (passenger && passenger.gender !== 'female') {
          throw new AppError(
            422,
            'BUSINESS_RULE_VIOLATION',
            `Seat ${seatId} is reserved for female passengers only (Mahila Samman).`,
          );
        }
      }
    }

    // Atomically reserve seats
    const reserved = tripRepository.reserveSeats(tripId, selectedSeats);
    if (!reserved) {
      throw new AppError(409, 'SEATS_UNAVAILABLE', 'One or more selected seats are no longer available. Please refresh and try again.');
    }

    // Fare calculation
    const primaryPassenger = passengers[0];
    const surcharge = adminRepository.getSurchargePercent();
    const fare = calculateFare(trip.baseFare, selectedSeats.length, concessionType, trip.serviceType as any, primaryPassenger.age);
    const totalFareWithSurcharge = applyDepotSurcharge(fare.totalFare, surcharge);

    // Generate unique identifiers
    const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
    const pnr = `MSRTC-${randomSuffix}`;
    const bookingRef = `MSR2026${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const bookingId = `BK-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const qrPayload = generateTicketQrPayload(bookingRef, trip.busNumber, today, selectedSeats);

    const booking: Booking = {
      bookingId,
      bookingRef,
      pnr,
      trip,
      selectedSeats,
      passengers: passengers as PassengerDetails[],
      concessionType,
      concessionDiscountPercent: fare.concessionDiscountPercent,
      baseFare: fare.baseFare,
      discountAmount: fare.discountAmount,
      gstAmount: fare.gstAmount,
      totalFare: totalFareWithSurcharge,
      paymentMethod,
      paymentStatus: 'PAID',
      bookingDate: today,
      journeyDate: today,
      qrPayload,
      status: 'CONFIRMED',
      platformNumber: 'Platform 3',
      offlineCached: true,
      currentStopIndex: 0,
      busCoordinates: { lat: 18.5204, lng: 73.8567, speedKmh: 0, heading: 0, etaMinutes: 180, distanceRemainingKm: 168 },
    };

    return bookingRepository.save(booking);
  },

  findById(bookingId: string): Booking {
    const booking = bookingRepository.findById(bookingId);
    if (!booking) throw new AppError(404, 'RESOURCE_NOT_FOUND', `Booking '${bookingId}' not found.`);
    return booking;
  },

  findAll(): Booking[] {
    return bookingRepository.findAll();
  },

  cancel(bookingId: string): Booking {
    const booking = bookingRepository.findById(bookingId);
    if (!booking) throw new AppError(404, 'RESOURCE_NOT_FOUND', `Booking '${bookingId}' not found.`);
    if (booking.status === 'CANCELLED') {
      throw new AppError(409, 'CONFLICT', 'Booking is already cancelled.');
    }
    if (booking.status === 'BOARDED') {
      throw new AppError(422, 'BUSINESS_RULE_VIOLATION', 'Cannot cancel a booking that has already been boarded.');
    }

    // Release seats back to available
    tripRepository.releaseSeats(booking.trip.id, booking.selectedSeats);

    return bookingRepository.updateStatus(bookingId, 'CANCELLED')!;
  },
};
