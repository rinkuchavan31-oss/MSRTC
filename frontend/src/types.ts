export type BusServiceType = 'SHIVNERI' | 'SHIVSHAHI' | 'PARIVARTAN' | 'ASIAD' | 'LAL_PARI' | 'E_SHIVNERI';

export type SeatCategory = 'regular' | 'women' | 'senior' | 'conductor';
export type SeatStatus = 'available' | 'selected' | 'booked';

export interface BusSeat {
  id: string; // e.g. '1A'
  row: number;
  col: number; // 1, 2, 4, 5 (col 3 is aisle) or 1..5 for back row
  number: string;
  category: SeatCategory;
  status: SeatStatus;
  price: number;
  genderReserved?: 'female' | 'male' | null;
}

export interface BusStop {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  city: string;
  time: string;
  distanceKm: number;
}

export interface BusTrip {
  id: string;
  busNumber: string;
  serviceType: BusServiceType;
  serviceName: string;
  serviceNameMr: string;
  routeCode: string;
  fromCity: string;
  fromCityMr: string;
  fromDepot: string;
  fromDepotMr: string;
  toCity: string;
  toCityMr: string;
  toDepot: string;
  toDepotMr: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stopsCount: number;
  stopsDescription: string;
  stopsDescriptionMr: string;
  baseFare: number;
  rating: number;
  reviewsCount: number;
  availableSeatsCount: number;
  statusBadge: '12 Seats Left' | 'Fast Filling' | 'Available' | 'Almost Full';
  statusBadgeColor: 'teal' | 'orange' | 'green' | 'red';
  isAc: boolean;
  busTypeLabel: string;
  stops: BusStop[];
  totalSeats: number;
}

export type ConcessionType = 'none' | 'senior' | 'student' | 'women';

export interface PassengerDetails {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
  email: string;
  seatId: string;
  concessionType: ConcessionType;
  concessionProofId?: string;
}

export interface Booking {
  bookingId: string;
  bookingRef: string; // e.g. MSR2026X9F
  pnr: string; // e.g. MSRTC-9823471
  trip: BusTrip;
  selectedSeats: string[];
  passengers: PassengerDetails[];
  concessionType: ConcessionType;
  concessionDiscountPercent: number;
  baseFare: number;
  discountAmount: number;
  gstAmount: number;
  totalFare: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'CASH';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  bookingDate: string;
  journeyDate: string;
  qrPayload: string;
  status: 'CONFIRMED' | 'BOARDED' | 'CANCELLED';
  platformNumber: string;
  offlineCached: boolean;
  currentStopIndex: number;
  busCoordinates: {
    lat: number;
    lng: number;
    speedKmh: number;
    heading: number;
    etaMinutes: number;
    distanceRemainingKm: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'PLATFORM_UPDATE' | 'MONSOON_ALERT' | 'TICKET_CONFIRMED' | 'DELAY_NOTICE';
  read: boolean;
  pnr?: string;
}

export type Language = 'en' | 'mr' | 'hi';
export type UserRole = 'passenger' | 'conductor' | 'admin' | 'driver';
export type StaffRole = 'admin' | 'conductor' | 'driver';

export type ScreenView = 
  | 'home'
  | 'search_results'
  | 'seat_selection'
  | 'ticket_journey'
  | 'conductor_portal'
  | 'conductor_login'
  | 'admin_portal'
  | 'driver_portal'
  | 'staff_auth'
  | 'my_bookings'
  | 'help_center'
  | 'about_us'
  | 'terms'
  | 'privacy';

export interface FilterState {
  busServices: {
    shivneri: boolean;
    shivshahi: boolean;
    parivartan: boolean;
    asiad: boolean;
  };
  departureWindows: {
    morning: boolean; // 6 AM - 12 PM
    afternoon: boolean; // 12 PM - 6 PM
    evening: boolean; // 6 PM - 12 AM
    night: boolean; // 12 AM - 6 AM
  };
  sortBy: 'earliest' | 'cheapest' | 'fastest';
  maxPrice?: number;
}
