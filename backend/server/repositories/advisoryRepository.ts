import { ManifestItem, NotificationItem, MonsoonUpdate } from '../models/types';
import { SEED_MANIFEST, SEED_ADVISORIES, SEED_NOTIFICATIONS } from '../config/database';

// ─── Manifest ─────────────────────────────────────────────────────────────────

const manifestStore = new Map<string, ManifestItem[]>([
  ['TRIP-SHIV-01', [...SEED_MANIFEST]],
]);

export const manifestRepository = {
  getByTrip(tripId: string): ManifestItem[] {
    return manifestStore.get(tripId) ?? [];
  },

  toggleBoardingStatus(tripId: string, seatNumber: string): ManifestItem | undefined {
    const manifest = manifestStore.get(tripId);
    if (!manifest) return undefined;
    const item = manifest.find((m) => m.seat === seatNumber);
    if (!item) return undefined;

    if (item.status === 'UNBOARDED') {
      item.status = 'BOARDED';
      item.boardedAt = new Date().toISOString();
    } else if (item.status === 'BOARDED') {
      item.status = 'UNBOARDED';
      item.boardedAt = undefined;
    }
    return item;
  },

  addSpotTicket(tripId: string, spotItem: ManifestItem): void {
    const manifest = manifestStore.get(tripId) ?? [];
    const idx = manifest.findIndex((m) => m.seat === spotItem.seat);
    if (idx >= 0) manifest.splice(idx, 1);
    manifest.push(spotItem);
    manifestStore.set(tripId, manifest);
  },
};

// ─── Advisories ───────────────────────────────────────────────────────────────

let advisoriesStore = [...SEED_ADVISORIES];

export const advisoryRepository = {
  getAll(): MonsoonUpdate[] {
    return advisoriesStore;
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

let notificationsStore = [...SEED_NOTIFICATIONS];

export const notificationRepository = {
  getAll(): NotificationItem[] {
    return notificationsStore;
  },

  add(item: NotificationItem): void {
    notificationsStore = [item, ...notificationsStore];
  },

  markRead(id: string): void {
    const n = notificationsStore.find((x) => x.id === id);
    if (n) n.read = true;
  },
};
