import { UserRole } from '../constants/roles';
import { BusServiceType } from '../constants/busTypes';
import { ConcessionType } from '../constants/concessions';

export type SeatCategory = 'regular' | 'women' | 'senior' | 'conductor';
export type SeatStatus = 'available' | 'selected' | 'booked';

export interface BusSeat {
  id: string; // e.g. '1A'
  row: number;
  col: number;
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
  hindiName?: string;
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
  statusBadge: string;
  statusBadgeColor: 'teal' | 'orange' | 'green' | 'red';
  isAc: boolean;
  busTypeLabel: string;
  stops: BusStop[];
  totalSeats: number;
}

export interface PassengerDetails {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
  email?: string;
  seatId: string;
  concessionType: ConcessionType;
  concessionProofId?: string;
}

export interface Booking {
  bookingId: string;
  bookingRef: string;
  pnr: string;
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
  busCoordinates?: {
    lat: number;
    lng: number;
    speedKmh: number;
    heading: number;
    etaMinutes: number;
    distanceRemainingKm: number;
  };
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: UserRole;
  depot: string;
  mobileNumber: string;
  passwordHash: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
}

export interface ManifestItem {
  tripId: string;
  seat: string;
  pnr: string;
  name: string;
  gender: string;
  status: 'BOARDED' | 'UNBOARDED' | 'VACANT';
  category: string;
  boardedAt?: string;
}

export interface MonsoonUpdate {
  id: string;
  route: string;
  status: string;
  severity: 'low' | 'medium' | 'high';
  details: string;
  detailsMr: string;
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

export interface AdminDepotStats {
  activeFleetCount: number;
  onTimePercent: number;
  averageLoadFactor: number;
  loadFactorChangeMoM: number;
  todayDigitalGmv: number;
  upiPercentage: number;
  mahilaSammanSubsidyClaimed: number;
  surchargePercent: number;
}
