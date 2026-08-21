import { createHmac } from 'crypto';
import { ENV } from '../config/env';

/**
 * Generates a tamper-proof HMAC-SHA256 QR payload for a transit e-ticket.
 * Format: HMAC_SHA256:{bookingRef}:{busNumber}:{date}:{seats}:{status}
 */
export function generateTicketQrPayload(
  bookingRef: string,
  busNumber: string,
  date: string,
  seats: string[],
): string {
  const seatsStr = seats.join(',');
  const rawPayload = `${bookingRef}:${busNumber.replace(/\s+/g, '')}:${date}:${seatsStr}`;
  const hmac = createHmac('sha256', ENV.HMAC_SECRET)
    .update(rawPayload)
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();
  return `HMAC_SHA256:${bookingRef}:${busNumber.replace(/\s+/g, '')}:${date}:${seatsStr}:${hmac}`;
}

/**
 * Validates a QR payload HMAC signature to detect counterfeiting or tampering.
 * Returns validation result with parsed fields.
 */
export function validateTicketQrPayload(qrPayload: string): {
  valid: boolean;
  bookingRef?: string;
  busNumber?: string;
  date?: string;
  seats?: string[];
  hmacToken?: string;
  reason?: string;
} {
  if (!qrPayload || typeof qrPayload !== 'string') {
    return { valid: false, reason: 'Empty or invalid QR payload.' };
  }

  const parts = qrPayload.split(':');
  // Expect: HMAC_SHA256 : bookingRef : busNumber : date : seats : hmacToken
  if (parts.length < 6 || parts[0] !== 'HMAC_SHA256') {
    return { valid: false, reason: 'Malformed QR payload format.' };
  }

  const [, bookingRef, busNumber, date, seatsStr, hmacToken] = parts;
  const seats = seatsStr.split(',');

  const rawPayload = `${bookingRef}:${busNumber}:${date}:${seatsStr}`;
  const expectedHmac = createHmac('sha256', ENV.HMAC_SECRET)
    .update(rawPayload)
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();

  if (expectedHmac !== hmacToken) {
    return { valid: false, reason: 'HMAC signature mismatch. Ticket may be tampered or forged.' };
  }

  return { valid: true, bookingRef, busNumber, date, seats, hmacToken };
}
