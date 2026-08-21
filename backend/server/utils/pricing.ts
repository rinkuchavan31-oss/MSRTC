import { ConcessionType, CONCESSION_DISCOUNT_RATES } from '../constants/concessions';
import { AC_SERVICE_TYPES, BusServiceType } from '../constants/busTypes';

export const GST_RATE_AC = 0.05; // 5% GST on AC services per Indian tax rules
export const GST_RATE_NON_AC = 0; // Exempt

export interface FareBreakdown {
  baseFare: number;
  concessionType: ConcessionType;
  concessionDiscountPercent: number;
  discountAmount: number;
  gstAmount: number;
  totalFare: number;
}

/**
 * Calculates the complete fare breakdown for a transit booking.
 * Applies: concession discount → then GST on discounted fare (AC only).
 */
export function calculateFare(
  baseFarePerSeat: number,
  seatCount: number,
  concessionType: ConcessionType,
  serviceType: BusServiceType,
  passengerAge?: number,
): FareBreakdown {
  const totalBaseFare = baseFarePerSeat * seatCount;

  // Amrut Jyeshtha Nagrik: 75+ years gets 100% free travel
  if (concessionType === 'senior' && passengerAge !== undefined && passengerAge >= 75) {
    return {
      baseFare: totalBaseFare,
      concessionType,
      concessionDiscountPercent: 100,
      discountAmount: totalBaseFare,
      gstAmount: 0,
      totalFare: 0,
    };
  }

  const discountRate = CONCESSION_DISCOUNT_RATES[concessionType] ?? 0;
  const discountAmount = Math.round(totalBaseFare * discountRate * 100) / 100;
  const discountedFare = totalBaseFare - discountAmount;

  const gstRate = AC_SERVICE_TYPES.includes(serviceType as any) ? GST_RATE_AC : GST_RATE_NON_AC;
  const gstAmount = Math.round(discountedFare * gstRate * 100) / 100;
  const totalFare = Math.round((discountedFare + gstAmount) * 100) / 100;

  return {
    baseFare: totalBaseFare,
    concessionType,
    concessionDiscountPercent: discountRate * 100,
    discountAmount,
    gstAmount,
    totalFare,
  };
}

/**
 * Applies a depot dynamic surcharge (holiday/monsoon) to a base fare.
 * surchargePercent must be in range [-20, +20].
 */
export function applyDepotSurcharge(amount: number, surchargePercent: number): number {
  const clamped = Math.max(-20, Math.min(20, surchargePercent));
  const multiplier = 1 + clamped / 100;
  return Math.round(amount * multiplier * 100) / 100;
}
