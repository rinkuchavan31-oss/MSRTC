import { tripRepository, TripSearchFilters } from '../repositories/tripRepository';
import { AppError } from '../utils/response';
import { BusTrip, BusSeat } from '../models/types';

export const tripService = {
  search(filters: TripSearchFilters): { trips: BusTrip[]; total: number } {
    const trips = tripRepository.search(filters);
    return { trips, total: trips.length };
  },

  getById(id: string): BusTrip {
    const trip = tripRepository.findById(id);
    if (!trip) throw new AppError(404, 'RESOURCE_NOT_FOUND', `Trip '${id}' not found.`);
    return trip;
  },

  getSeats(tripId: string): { tripId: string; totalSeats: number; availableCount: number; seats: BusSeat[] } {
    const trip = tripRepository.findById(tripId);
    if (!trip) throw new AppError(404, 'RESOURCE_NOT_FOUND', `Trip '${tripId}' not found.`);

    const seats = tripRepository.getSeats(tripId) ?? [];
    const available = seats.filter((s) => s.status === 'available');

    // Strip internal tripId prefix from seat IDs before sending to frontend
    const cleanSeats = seats.map((s) => ({
      ...s,
      id: s.number, // Frontend expects '1A', not 'TRIP-SHIV-01:1A'
    }));

    return {
      tripId,
      totalSeats: trip.totalSeats,
      availableCount: available.length,
      seats: cleanSeats,
    };
  },

  getPopularLocations() {
    return tripRepository.getPopularLocations();
  },
};
