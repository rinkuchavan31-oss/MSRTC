import { BusTrip, BusSeat } from '../models/types';
import { SEED_TRIPS, generateBusSeats, POPULAR_LOCATIONS } from '../config/database';
import { BusServiceType } from '../constants/busTypes';

/** In-memory mutable trip availability map: tripId → availableSeatsCount */
const tripAvailability = new Map<string, number>(
  SEED_TRIPS.map((t) => [t.id, t.availableSeatsCount]),
);

/** In-memory mutable seat status map: `${tripId}:${seatId}` → 'available' | 'booked' */
const seatStatusMap = new Map<string, BusSeat['status']>();

export interface TripSearchFilters {
  from?: string;
  to?: string;
  date?: string;
  serviceTypes?: BusServiceType[];
  windows?: string[];
  sortBy?: 'earliest' | 'cheapest' | 'fastest';
  maxPrice?: number;
}

function matchesWindow(departureTime: string, windows: string[]): boolean {
  const [hourStr] = departureTime.split(':');
  const hour = parseInt(hourStr, 10);
  return windows.some((w) => {
    if (w === 'morning') return hour >= 6 && hour < 12;
    if (w === 'afternoon') return hour >= 12 && hour < 18;
    if (w === 'evening') return hour >= 18 && hour < 24;
    if (w === 'night') return hour >= 0 && hour < 6;
    return false;
  });
}

export const tripRepository = {
  search(filters: TripSearchFilters): BusTrip[] {
    let results = [...SEED_TRIPS];

    if (filters.from) {
      const q = filters.from.toLowerCase();
      results = results.filter(
        (t) => t.fromCity.toLowerCase().includes(q) || t.fromDepot.toLowerCase().includes(q),
      );
    }

    if (filters.to) {
      const q = filters.to.toLowerCase();
      results = results.filter(
        (t) => t.toCity.toLowerCase().includes(q) || t.toDepot.toLowerCase().includes(q),
      );
    }

    if (filters.serviceTypes && filters.serviceTypes.length > 0) {
      results = results.filter((t) => filters.serviceTypes!.includes(t.serviceType as BusServiceType));
    }

    if (filters.windows && filters.windows.length > 0) {
      results = results.filter((t) => matchesWindow(t.departureTime, filters.windows!));
    }

    if (filters.maxPrice) {
      results = results.filter((t) => t.baseFare <= filters.maxPrice!);
    }

    // Update live seat counts from mutable availability map
    results = results.map((t) => ({
      ...t,
      availableSeatsCount: tripAvailability.get(t.id) ?? t.availableSeatsCount,
    }));

    if (filters.sortBy === 'cheapest') {
      results.sort((a, b) => a.baseFare - b.baseFare);
    } else if (filters.sortBy === 'fastest') {
      results.sort((a, b) => {
        const toMins = (dur: string) => {
          const m = dur.match(/(\d+)h\s*(\d+)m/);
          return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0;
        };
        return toMins(a.duration) - toMins(b.duration);
      });
    } else {
      results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    return results;
  },

  findById(id: string): BusTrip | undefined {
    const trip = SEED_TRIPS.find((t) => t.id === id);
    if (!trip) return undefined;
    return { ...trip, availableSeatsCount: tripAvailability.get(id) ?? trip.availableSeatsCount };
  },

  getSeats(tripId: string): BusSeat[] | undefined {
    const trip = SEED_TRIPS.find((t) => t.id === tripId);
    if (!trip) return undefined;

    const seats = generateBusSeats(tripId, trip.baseFare);
    return seats.map((seat) => {
      const key = `${tripId}:${seat.number}`;
      const liveStatus = seatStatusMap.get(key);
      return liveStatus ? { ...seat, status: liveStatus } : seat;
    });
  },

  /** Atomically book seats — returns false if any seat is already taken. */
  reserveSeats(tripId: string, seatNumbers: string[]): boolean {
    const seats = this.getSeats(tripId);
    if (!seats) return false;

    const available = seats.filter(
      (s) => seatNumbers.includes(s.number) && s.status === 'available',
    );
    if (available.length !== seatNumbers.length) return false;

    for (const num of seatNumbers) {
      seatStatusMap.set(`${tripId}:${num}`, 'booked');
    }
    const current = tripAvailability.get(tripId) ?? 0;
    tripAvailability.set(tripId, Math.max(0, current - seatNumbers.length));
    return true;
  },

  /** Releases seats back to available (on cancellation). */
  releaseSeats(tripId: string, seatNumbers: string[]): void {
    for (const num of seatNumbers) {
      seatStatusMap.delete(`${tripId}:${num}`);
    }
    const current = tripAvailability.get(tripId) ?? 0;
    tripAvailability.set(tripId, current + seatNumbers.length);
  },

  getPopularLocations() {
    return POPULAR_LOCATIONS;
  },
};
