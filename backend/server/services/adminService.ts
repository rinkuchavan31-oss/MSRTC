import { adminRepository } from '../repositories/adminRepository';
import { AppError } from '../utils/response';
import { AdminDepotStats } from '../models/types';
import { SEED_TRIPS } from '../config/database';

export const adminService = {
  getStats(): AdminDepotStats {
    return adminRepository.getStats();
  },

  getTrips() {
    return SEED_TRIPS;
  },

  updateSurcharge(percent: number): AdminDepotStats {
    if (typeof percent !== 'number' || isNaN(percent)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Surcharge percent must be a number.');
    }

    if (percent < -20 || percent > 20) {
      throw new AppError(
        422,
        'BUSINESS_RULE_VIOLATION',
        'Depot surcharge must be between -20% and +20% (MSRTC Dynamic Tariff Policy).',
      );
    }

    return adminRepository.updateSurcharge(percent);
  },
};
