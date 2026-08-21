import { validateTicketQrPayload } from '../utils/crypto';
import { bookingRepository } from '../repositories/bookingRepository';
import { manifestRepository } from '../repositories/advisoryRepository';
import { AppError } from '../utils/response';
import { ManifestItem } from '../models/types';

export const conductorService = {
  validateQr(qrPayload: string): {
    status: 'VALID' | 'INVALID';
    pnr?: string;
    bookingRef?: string;
    seats?: string[];
    passengerName?: string;
    message: string;
  } {
    if (!qrPayload?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'QR payload is required.');
    }

    const result = validateTicketQrPayload(qrPayload);

    if (!result.valid) {
      return { status: 'INVALID', message: `Authentication failed: ${result.reason}` };
    }

    // Look up booking to check status
    const booking = bookingRepository.findByRef(result.bookingRef!);

    if (!booking) {
      // QR is cryptographically valid but booking not found in this process (e.g. offline)
      return {
        status: 'VALID',
        pnr: `MSRTC-${result.bookingRef}`,
        bookingRef: result.bookingRef,
        seats: result.seats,
        message: 'HMAC Authentication Verified. Valid MSRTC E-Ticket (Offline Mode).',
      };
    }

    if (booking.status === 'CANCELLED') {
      return { status: 'INVALID', message: 'Error: This ticket has been cancelled.' };
    }

    const names = booking.passengers.map((p) => p.fullName).join(' & ');
    return {
      status: 'VALID',
      pnr: booking.pnr,
      bookingRef: booking.bookingRef,
      seats: booking.selectedSeats,
      passengerName: names,
      message: 'HMAC Authentication Verified. Valid MSRTC E-Ticket.',
    };
  },

  getManifest(tripId: string): ManifestItem[] {
    if (!tripId?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Trip ID is required.');
    }
    return manifestRepository.getByTrip(tripId);
  },

  toggleBoarding(tripId: string, seatNumber: string): ManifestItem {
    if (!tripId?.trim() || !seatNumber?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Trip ID and seat number are required.');
    }

    const updated = manifestRepository.toggleBoardingStatus(tripId, seatNumber);
    if (!updated) {
      throw new AppError(404, 'RESOURCE_NOT_FOUND', `Seat '${seatNumber}' not found in manifest for trip '${tripId}'.`);
    }
    return updated;
  },

  issueSpotTicket(payload: {
    tripId: string;
    seatNumber: string;
    from: string;
    to: string;
    fare: number;
    passengerName?: string;
  }): ManifestItem {
    const { tripId, seatNumber, from, to, passengerName } = payload;

    if (!tripId?.trim() || !seatNumber?.trim() || !from?.trim() || !to?.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Trip ID, seat, origin, and destination are required.');
    }

    const spotPnr = `CASH-${Math.floor(1000 + Math.random() * 9000)}`;
    const spotItem: ManifestItem = {
      tripId,
      seat: seatNumber,
      pnr: spotPnr,
      name: passengerName || 'Spot Cash Passenger',
      gender: '-',
      status: 'BOARDED',
      category: 'Spot Ticket',
      boardedAt: new Date().toISOString(),
    };

    manifestRepository.addSpotTicket(tripId, spotItem);
    return spotItem;
  },
};
