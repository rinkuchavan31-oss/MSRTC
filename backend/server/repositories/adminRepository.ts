import { AdminDepotStats } from '../models/types';
import { SEED_ADMIN_STATS } from '../config/database';

let statsStore: AdminDepotStats = { ...SEED_ADMIN_STATS };

export const adminRepository = {
  getStats(): AdminDepotStats {
    return { ...statsStore };
  },

  getSurchargePercent(): number {
    return statsStore.surchargePercent;
  },

  updateSurcharge(percent: number): AdminDepotStats {
    statsStore = { ...statsStore, surchargePercent: Math.max(-20, Math.min(20, percent)) };
    return statsStore;
  },
};
