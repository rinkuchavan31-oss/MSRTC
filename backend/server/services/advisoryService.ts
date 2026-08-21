import { advisoryRepository, notificationRepository } from '../repositories/advisoryRepository';
import { MonsoonUpdate, NotificationItem } from '../models/types';

export const advisoryService = {
  getMonsoonAdvisories(): MonsoonUpdate[] {
    return advisoryRepository.getAll();
  },

  getNotifications(): NotificationItem[] {
    return notificationRepository.getAll();
  },

  markNotificationRead(id: string): void {
    notificationRepository.markRead(id);
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem {
    const notification: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    notificationRepository.add(notification);
    return notification;
  },
};
