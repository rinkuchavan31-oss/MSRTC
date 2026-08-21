import { BusTrip, BusSeat, MonsoonUpdate, NotificationItem, ManifestItem, AdminDepotStats } from '../models/types';

// ─── Trips & Routes ───────────────────────────────────────────────────────────

export const POPULAR_LOCATIONS = [
  { city: 'Pune', depot: 'Swargate', alias: 'Swargate, Pune', marathiCity: 'पुणे', marathiDepot: 'स्वारगेट' },
  { city: 'Pune', depot: 'Shivajinagar', alias: 'Shivajinagar, Pune', marathiCity: 'पुणे', marathiDepot: 'शिवाजीनगर' },
  { city: 'Mumbai', depot: 'Dadar', alias: 'Dadar, Mumbai', marathiCity: 'मुंबई', marathiDepot: 'दादर' },
  { city: 'Mumbai', depot: 'Borivali', alias: 'Borivali, Mumbai', marathiCity: 'मुंबई', marathiDepot: 'बोरिवली' },
  { city: 'Nashik', depot: 'CBS', alias: 'CBS, Nashik', marathiCity: 'नाशिक', marathiDepot: 'मध्यवर्ती बस स्थानक (CBS)' },
  { city: 'Aurangabad', depot: 'Central Bus Stand', alias: 'Central, Aurangabad', marathiCity: 'छ. संभाजीनगर', marathiDepot: 'मध्यवर्ती स्थानक' },
  { city: 'Kolhapur', depot: 'CBS Stand', alias: 'CBS, Kolhapur', marathiCity: 'कोल्हापूर', marathiDepot: 'मध्यवर्ती बस स्थानक' },
  { city: 'Solapur', depot: 'Central Bus Stand', alias: 'Central, Solapur', marathiCity: 'सोलापूर', marathiDepot: 'मध्यवर्ती स्थानक' },
  { city: 'Nagpur', depot: 'Mor Bhavan', alias: 'Mor Bhavan, Nagpur', marathiCity: 'नागपूर', marathiDepot: 'मोर भवन' },
  { city: 'Amravati', depot: 'Rajkamal Square', alias: 'Rajkamal, Amravati', marathiCity: 'अमरावती', marathiDepot: 'राजकमल चौक' },
  { city: 'Ratnagiri', depot: 'Depot Central', alias: 'Depot, Ratnagiri', marathiCity: 'रत्नागिरी', marathiDepot: 'रत्नागिरी डेपो' },
  { city: 'Shirdi', depot: 'Sai Nagar Stand', alias: 'Sai Nagar, Shirdi', marathiCity: 'शिर्डी', marathiDepot: 'साई नगर स्थानक' },
];

export const SEED_TRIPS: BusTrip[] = [
  {
    id: 'TRIP-SHIV-01',
    busNumber: 'MH 12 FC 4589',
    serviceType: 'SHIVNERI',
    serviceName: 'SHIVNERI AC',
    serviceNameMr: 'शिवनेरी वातानुकूलित (AC)',
    routeCode: 'MH12-9901',
    fromCity: 'Pune',
    fromCityMr: 'पुणे',
    fromDepot: 'Swargate',
    fromDepotMr: 'स्वारगेट',
    toCity: 'Mumbai',
    toCityMr: 'मुंबई',
    toDepot: 'Dadar',
    toDepotMr: 'दादर',
    departureTime: '14:30',
    arrivalTime: '18:15',
    duration: '3h 45m',
    stopsCount: 0,
    stopsDescription: 'Non-stop',
    stopsDescriptionMr: 'विनाथांबा',
    baseFare: 550,
    rating: 4.8,
    reviewsCount: 124,
    availableSeatsCount: 12,
    statusBadge: '12 Seats Left',
    statusBadgeColor: 'teal',
    isAc: true,
    busTypeLabel: 'Volvo Multi-Axle AC',
    totalSeats: 41,
    stops: [
      { id: 'ST-01', name: 'Swargate, Pune', marathiName: 'स्वारगेट, पुणे', city: 'Pune', time: '14:30', distanceKm: 0 },
      { id: 'ST-02', name: 'Wakad Bridge', marathiName: 'वाकड पूल', city: 'Pune', time: '15:10', distanceKm: 18 },
      { id: 'ST-03', name: 'Urse Toll Plaza', marathiName: 'उर्से टोल नाका', city: 'Expressway', time: '15:40', distanceKm: 42 },
      { id: 'ST-04', name: 'Khalapur Toll Plaza', marathiName: 'खालापूर टोल नाका', city: 'Expressway', time: '16:50', distanceKm: 110 },
      { id: 'ST-05', name: 'Vashi Plaza', marathiName: 'वाशी प्लाझा', city: 'Navi Mumbai', time: '17:35', distanceKm: 145 },
      { id: 'ST-06', name: 'Dadar Asiad Stand, Mumbai', marathiName: 'दादर एशियाड बस स्थानक', city: 'Mumbai', time: '18:15', distanceKm: 168 },
    ],
  },
  {
    id: 'TRIP-SHIV-02',
    busNumber: 'MH 14 CW 8822',
    serviceType: 'SHIVSHAHI',
    serviceName: 'SHIVSHAHI',
    serviceNameMr: 'शिवशाही शयन-आसन',
    routeCode: 'MH14-8822',
    fromCity: 'Pune',
    fromCityMr: 'पुणे',
    fromDepot: 'Swargate',
    fromDepotMr: 'स्वारगेट',
    toCity: 'Mumbai',
    toCityMr: 'मुंबई',
    toDepot: 'Dadar',
    toDepotMr: 'दादर',
    departureTime: '15:00',
    arrivalTime: '19:10',
    duration: '4h 10m',
    stopsCount: 1,
    stopsDescription: '1 Stop (Lonavala)',
    stopsDescriptionMr: '१ थांबा (लोणावळा)',
    baseFare: 380,
    rating: 4.4,
    reviewsCount: 89,
    availableSeatsCount: 6,
    statusBadge: 'Fast Filling',
    statusBadgeColor: 'orange',
    isAc: true,
    busTypeLabel: 'Shivshahi AC Seater',
    totalSeats: 45,
    stops: [
      { id: 'ST-01', name: 'Swargate, Pune', marathiName: 'स्वारगेट, पुणे', city: 'Pune', time: '15:00', distanceKm: 0 },
      { id: 'ST-02', name: 'Lonavala Center', marathiName: 'लोणावळा केंद्र', city: 'Lonavala', time: '16:30', distanceKm: 65 },
      { id: 'ST-03', name: 'Dadar, Mumbai', marathiName: 'दादर, मुंबई', city: 'Mumbai', time: '19:10', distanceKm: 168 },
    ],
  },
  {
    id: 'TRIP-PARI-01',
    busNumber: 'MH 20 BL 3102',
    serviceType: 'PARIVARTAN',
    serviceName: 'PARIVARTAN ORDINARY',
    serviceNameMr: 'परिवर्तन लालपरी',
    routeCode: 'MH20-3102',
    fromCity: 'Pune',
    fromCityMr: 'पुणे',
    fromDepot: 'Swargate',
    fromDepotMr: 'स्वारगेट',
    toCity: 'Mumbai',
    toCityMr: 'मुंबई',
    toDepot: 'Dadar',
    toDepotMr: 'दादर',
    departureTime: '15:45',
    arrivalTime: '20:15',
    duration: '4h 30m',
    stopsCount: 3,
    stopsDescription: '3 Stops',
    stopsDescriptionMr: '३ थांबे',
    baseFare: 220,
    rating: 4.2,
    reviewsCount: 64,
    availableSeatsCount: 24,
    statusBadge: 'Available',
    statusBadgeColor: 'green',
    isAc: false,
    busTypeLabel: 'Express Ordinary 2x3',
    totalSeats: 52,
    stops: [],
  },
  {
    id: 'TRIP-SHIV-03',
    busNumber: 'MH 04 FK 7711',
    serviceType: 'E_SHIVNERI',
    serviceName: 'SHIVNERI AC (EV)',
    serviceNameMr: 'ई-शिवनेरी इलेक्ट्रिक AC',
    routeCode: 'MH04-7711',
    fromCity: 'Pune',
    fromCityMr: 'पुणे',
    fromDepot: 'Shivajinagar',
    fromDepotMr: 'शिवाजीनगर',
    toCity: 'Mumbai',
    toCityMr: 'मुंबई',
    toDepot: 'Borivali',
    toDepotMr: 'बोरिवली',
    departureTime: '08:30',
    arrivalTime: '12:00',
    duration: '3h 30m',
    stopsCount: 0,
    stopsDescription: 'Non-stop',
    stopsDescriptionMr: 'विनाथांबा',
    baseFare: 550,
    rating: 4.9,
    reviewsCount: 210,
    availableSeatsCount: 4,
    statusBadge: 'Almost Full',
    statusBadgeColor: 'red',
    isAc: true,
    busTypeLabel: 'Electric Superfast Volvo',
    totalSeats: 41,
    stops: [],
  },
  {
    id: 'TRIP-ASIAD-01',
    busNumber: 'MH 15 AG 9044',
    serviceType: 'ASIAD',
    serviceName: 'ASIAD SEMI-LUXURY',
    serviceNameMr: 'एशियाड निमआराम',
    routeCode: 'MH15-9044',
    fromCity: 'Nashik',
    fromCityMr: 'नाशिक',
    fromDepot: 'CBS',
    fromDepotMr: 'सीबीएस',
    toCity: 'Aurangabad',
    toCityMr: 'छ. संभाजीनगर',
    toDepot: 'Central Bus Stand',
    toDepotMr: 'मध्यवर्ती स्थानक',
    departureTime: '11:15',
    arrivalTime: '14:45',
    duration: '3h 30m',
    stopsCount: 2,
    stopsDescription: '2 Stops (Niphad, Yeola)',
    stopsDescriptionMr: '२ थांबे (निफाड, येवला)',
    baseFare: 280,
    rating: 4.5,
    reviewsCount: 78,
    availableSeatsCount: 18,
    statusBadge: 'Available',
    statusBadgeColor: 'green',
    isAc: false,
    busTypeLabel: 'Semi-Luxury 2x2',
    totalSeats: 45,
    stops: [],
  },
  {
    id: 'TRIP-SHIV-04',
    busNumber: 'MH 09 CM 6543',
    serviceType: 'SHIVSHAHI',
    serviceName: 'SHIVSHAHI AC',
    serviceNameMr: 'शिवशाही वातानुकूलित',
    routeCode: 'MH09-6543',
    fromCity: 'Kolhapur',
    fromCityMr: 'कोल्हापूर',
    fromDepot: 'CBS Stand',
    fromDepotMr: 'मध्यवर्ती बस स्थानक',
    toCity: 'Pune',
    toCityMr: 'पुणे',
    toDepot: 'Swargate',
    toDepotMr: 'स्वारगेट',
    departureTime: '06:00',
    arrivalTime: '10:45',
    duration: '4h 45m',
    stopsCount: 2,
    stopsDescription: '2 Stops (Karad, Satara)',
    stopsDescriptionMr: '२ थांबे (कराड, सातारा)',
    baseFare: 420,
    rating: 4.6,
    reviewsCount: 112,
    availableSeatsCount: 9,
    statusBadge: 'Fast Filling',
    statusBadgeColor: 'orange',
    isAc: true,
    busTypeLabel: 'Shivshahi 2x2 AC',
    totalSeats: 45,
    stops: [],
  },
  {
    id: 'TRIP-NAG-01',
    busNumber: 'MH 31 DX 1209',
    serviceType: 'PARIVARTAN',
    serviceName: 'LAL PARI EXPRESS',
    serviceNameMr: 'लालपरी एक्सप्रेस',
    routeCode: 'MH31-1209',
    fromCity: 'Nagpur',
    fromCityMr: 'नागपूर',
    fromDepot: 'Mor Bhavan',
    fromDepotMr: 'मोर भवन',
    toCity: 'Amravati',
    toCityMr: 'अमरावती',
    toDepot: 'Rajkamal Square',
    toDepotMr: 'राजकमल चौक',
    departureTime: '07:30',
    arrivalTime: '10:15',
    duration: '2h 45m',
    stopsCount: 1,
    stopsDescription: '1 Stop (Kondhali)',
    stopsDescriptionMr: '१ थांबा (कोंढाळी)',
    baseFare: 210,
    rating: 4.3,
    reviewsCount: 42,
    availableSeatsCount: 31,
    statusBadge: 'Available',
    statusBadgeColor: 'green',
    isAc: false,
    busTypeLabel: 'MSRTC Express',
    totalSeats: 52,
    stops: [],
  },
];

// ─── Seat Layout Generator ────────────────────────────────────────────────────

export function generateBusSeats(tripId: string, baseFare: number): BusSeat[] {
  const seats: BusSeat[] = [];
  const mk = (id: string, row: number, col: number, cat: BusSeat['category'], status: BusSeat['status'] = 'available', gender?: 'female' | 'male') => ({
    id: `${tripId}:${id}`,
    row, col, number: id,
    category: cat,
    status,
    price: baseFare,
    genderReserved: gender ?? null,
  });

  // Row 1
  seats.push(mk('1A', 1, 1, 'regular'));
  seats.push(mk('1B', 1, 2, 'regular', 'booked'));
  seats.push(mk('1C', 1, 4, 'regular'));
  seats.push(mk('1D', 1, 5, 'regular'));
  // Row 2 - Women reserved
  seats.push(mk('2A', 2, 1, 'women', 'available', 'female'));
  seats.push(mk('2B', 2, 2, 'women', 'available', 'female'));
  seats.push(mk('2C', 2, 4, 'regular', 'booked'));
  seats.push(mk('2D', 2, 5, 'regular', 'booked'));
  // Row 3 - Senior
  seats.push(mk('3A', 3, 1, 'senior'));
  seats.push(mk('3B', 3, 2, 'regular'));
  seats.push(mk('3C', 3, 4, 'regular'));
  seats.push(mk('3D', 3, 5, 'regular'));
  // Row 4
  seats.push(mk('4A', 4, 1, 'regular'));
  seats.push(mk('4B', 4, 2, 'regular'));
  seats.push(mk('4C', 4, 4, 'regular'));
  seats.push(mk('4D', 4, 5, 'regular'));
  // Row 5 - Back row (5 seats)
  seats.push(mk('5A', 5, 1, 'regular'));
  seats.push(mk('5B', 5, 2, 'regular'));
  seats.push(mk('5C', 5, 3, 'regular'));
  seats.push(mk('5D', 5, 4, 'regular'));
  seats.push(mk('5E', 5, 5, 'regular'));

  return seats;
}

// ─── Monsoon Advisories ───────────────────────────────────────────────────────

export const SEED_ADVISORIES: MonsoonUpdate[] = [
  {
    id: 'ADV-01',
    route: 'Mumbai - Goa (via Poladpur / Khed Ghat)',
    status: 'Caution',
    severity: 'high',
    details: 'Heavy rains in Mahad & Kashedi Ghat. Buses running with controlled speed. Expected delay 25-35 mins.',
    detailsMr: 'महाड व कशेडी घाटात मुसळधार पाऊस. बसेस सावकाश चालवत आहेत. २५-३५ मिनिटे विलंब.',
  },
  {
    id: 'ADV-02',
    route: 'Pune - Mumbai Expressway (Bhor Ghat)',
    status: 'Clear & Smooth',
    severity: 'low',
    details: 'All Expressway lanes clear. Shivneri AC buses operating on exact schedule.',
    detailsMr: 'मुंबई-पुणे एक्सप्रेसवे सुरळीत. शिवनेरी बसेस अचूक वेळेवर.',
  },
  {
    id: 'ADV-03',
    route: 'Kolhapur - Ratnagiri (Amba Ghat)',
    status: 'Advisory',
    severity: 'medium',
    details: 'Intermittent fog in Amba Ghat. Day services operational; night express restricted to 45 km/h.',
    detailsMr: 'आंबा घाटात धुक्याचे सावट. रात्रीच्या गाड्यांवर वेग मर्यादा.',
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Bus Arrived at Platform 3',
    message: 'Shivneri MH 12 FC 4589 has arrived at Swargate Platform 3. Boarding active.',
    timestamp: new Date().toISOString(),
    type: 'PLATFORM_UPDATE',
    read: false,
    pnr: 'MSRTC-9823471',
  },
  {
    id: 'n-2',
    title: 'Monsoon Route Advisory',
    message: 'Bhor Ghat expressway is clear. Khed Ghat route experiencing controlled speeds.',
    timestamp: new Date().toISOString(),
    type: 'MONSOON_ALERT',
    read: false,
  },
];

// ─── Conductor Manifest ───────────────────────────────────────────────────────

export const SEED_MANIFEST: ManifestItem[] = [
  { tripId: 'TRIP-SHIV-01', seat: '1A', pnr: 'MSRTC-9823471', name: 'Aniket Shinde', gender: 'M/26', status: 'BOARDED', category: 'General' },
  { tripId: 'TRIP-SHIV-01', seat: '1B', pnr: 'MSRTC-8812903', name: 'Suresh Patil', gender: 'M/45', status: 'BOARDED', category: 'General' },
  { tripId: 'TRIP-SHIV-01', seat: '1C', pnr: 'MSRTC-7719201', name: 'Ramesh Kadam', gender: 'M/34', status: 'UNBOARDED', category: 'General' },
  { tripId: 'TRIP-SHIV-01', seat: '2A', pnr: 'MSRTC-9823471', name: 'Priya Shinde', gender: 'F/24', status: 'BOARDED', category: 'Mahila Samman (50%)' },
  { tripId: 'TRIP-SHIV-01', seat: '2B', pnr: 'MSRTC-5521908', name: 'Sunita More', gender: 'F/42', status: 'BOARDED', category: 'Mahila Samman (50%)' },
  { tripId: 'TRIP-SHIV-01', seat: '3A', pnr: 'MSRTC-4419082', name: 'Babanrao Joshi', gender: 'M/68', status: 'BOARDED', category: 'Senior (50%)' },
  { tripId: 'TRIP-SHIV-01', seat: '4A', pnr: 'VACANT', name: 'Spot Ticket Available', gender: '-', status: 'VACANT', category: 'Open' },
];

// ─── Admin Depot Stats ────────────────────────────────────────────────────────

export const SEED_ADMIN_STATS: AdminDepotStats = {
  activeFleetCount: 148,
  onTimePercent: 96,
  averageLoadFactor: 84.2,
  loadFactorChangeMoM: 5.4,
  todayDigitalGmv: 842150,
  upiPercentage: 78,
  mahilaSammanSubsidyClaimed: 320400,
  surchargePercent: 0,
};
