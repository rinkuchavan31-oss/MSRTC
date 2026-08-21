import { BusTrip, Booking, ConcessionType, NotificationItem, StaffRole } from '../types';
import { MOCK_BUS_TRIPS, MOCK_RECENT_BOOKINGS, MOCK_NOTIFICATIONS, POPULAR_LOCATIONS } from '../data/mockData';

const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data.data;
}

export const api = {
  // ─── Trips ────────────────────────────────────────────────────────────────
  async searchTrips(params?: {
    from?: string;
    to?: string;
    date?: string;
    serviceTypes?: string[];
    windows?: string[];
    sortBy?: string;
  }): Promise<BusTrip[]> {
    try {
      const query = new URLSearchParams();
      if (params?.from) query.set('from', params.from);
      if (params?.to) query.set('to', params.to);
      if (params?.date) query.set('date', params.date);
      if (params?.serviceTypes?.length) query.set('serviceTypes', params.serviceTypes.join(','));
      if (params?.windows?.length) query.set('windows', params.windows.join(','));
      if (params?.sortBy) query.set('sortBy', params.sortBy);

      const res = await fetchJson<{ trips: BusTrip[]; total: number }>(`${BASE_URL}/trips/search?${query.toString()}`);
      return res.trips;
    } catch {
      return MOCK_BUS_TRIPS;
    }
  },

  async getTripSeats(tripId: string) {
    try {
      return await fetchJson<{ tripId: string; totalSeats: number; availableCount: number; seats: any[] }>(
        `${BASE_URL}/trips/${tripId}/seats`,
      );
    } catch {
      return null;
    }
  },

  async getPopularLocations() {
    try {
      return await fetchJson<typeof POPULAR_LOCATIONS>(`${BASE_URL}/trips/locations/popular`);
    } catch {
      return POPULAR_LOCATIONS;
    }
  },

  // ─── Bookings ─────────────────────────────────────────────────────────────
  async createBooking(bookingData: {
    tripId: string;
    selectedSeats: string[];
    concessionType: ConcessionType;
    passengers: any[];
    paymentMethod: string;
  }): Promise<Booking> {
    return await fetchJson<Booking>(`${BASE_URL}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getBookings(): Promise<Booking[]> {
    try {
      return await fetchJson<Booking[]>(`${BASE_URL}/bookings`);
    } catch {
      return MOCK_RECENT_BOOKINGS;
    }
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    return await fetchJson<Booking>(`${BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  },

  // ─── Conductor Portal ─────────────────────────────────────────────────────
  async validateQr(qrPayload: string) {
    return await fetchJson<{
      status: 'VALID' | 'INVALID';
      pnr?: string;
      bookingRef?: string;
      seats?: string[];
      passengerName?: string;
      message: string;
    }>(`${BASE_URL}/conductor/validate-qr`, {
      method: 'POST',
      body: JSON.stringify({ qrPayload }),
    });
  },

  async getManifest(tripId: string) {
    return await fetchJson<any[]>(`${BASE_URL}/conductor/manifest/${tripId}`);
  },

  async toggleBoarding(tripId: string, seatNumber: string) {
    return await fetchJson<any>(`${BASE_URL}/conductor/toggle-boarding`, {
      method: 'POST',
      body: JSON.stringify({ tripId, seatNumber }),
    });
  },

  async issueSpotTicket(data: { tripId: string; seatNumber: string; from: string; to: string; fare: number }) {
    return await fetchJson<any>(`${BASE_URL}/conductor/issue-spot-ticket`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ─── Admin Portal ─────────────────────────────────────────────────────────
  async getAdminStats() {
    return await fetchJson<any>(`${BASE_URL}/admin/stats`);
  },

  async updateSurcharge(surchargePercent: number) {
    return await fetchJson<any>(`${BASE_URL}/admin/tariff/surcharge`, {
      method: 'POST',
      body: JSON.stringify({ surchargePercent }),
    });
  },

  // ─── Driver Portal ────────────────────────────────────────────────────────
  async getDriverDuty() {
    return await fetchJson<any>(`${BASE_URL}/driver/duty`);
  },

  async submitDriverChecklist(items: Array<{ id: string; checked: boolean }>) {
    return await fetchJson<any>(`${BASE_URL}/driver/checklist`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  async triggerDriverSos(message?: string) {
    return await fetchJson<any>(`${BASE_URL}/driver/sos`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // ─── Staff Authentication ─────────────────────────────────────────────────
  async staffLogin(data: {
    employeeId: string;
    password?: string;
    role: StaffRole;
    authType?: 'password' | 'otp';
    otpCode?: string;
  }) {
    return await fetchJson<{
      token: string;
      user: { id: string; employeeId: string; name: string; role: string; depot: string };
    }>(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async registerStaffRequest(data: {
    employeeId: string;
    fullName: string;
    role: StaffRole;
    depot: string;
    mobileNumber: string;
  }) {
    return await fetchJson<{ requestId: string; status: string }>(`${BASE_URL}/auth/register-request`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ─── ST-Mitra Vernacular AI Assistant ─────────────────────────────────────
  async chatWithAssistant(query: string, language: string) {
    return await fetchJson<{ reply: string; action?: any }>(`${BASE_URL}/assistant/chat`, {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    });
  },

  // ─── Advisories & Notifications ───────────────────────────────────────────
  async getMonsoonAdvisories() {
    try {
      return await fetchJson<any[]>(`${BASE_URL}/advisories/monsoon`);
    } catch {
      return [];
    }
  },

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      return await fetchJson<NotificationItem[]>(`${BASE_URL}/advisories/notifications`);
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },
};
