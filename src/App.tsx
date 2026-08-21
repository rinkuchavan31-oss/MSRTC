import React, { useState, useEffect } from 'react';
import { 
  Language, 
  UserRole, 
  ScreenView, 
  BusTrip, 
  Booking, 
  ConcessionType, 
  NotificationItem 
} from './types';
import { 
  MOCK_TRIPS, 
  MOCK_BOOKINGS, 
  MOCK_NOTIFICATIONS, 
  MOCK_POPULAR_ROUTES 
} from './data/mockData';

// Subcomponents
import { TopNavBar } from './components/TopNavBar';
import { LandingHomeView } from './components/LandingHomeView';
import { SearchResultsView } from './components/SearchResultsView';
import { SeatSelectionView } from './components/SeatSelectionView';
import { TicketActiveJourneyView } from './components/TicketActiveJourneyView';
import { ConductorPortalView } from './components/ConductorPortalView';
import { AdminDepotPortalView } from './components/AdminDepotPortalView';
import { DriverPortalView } from './components/DriverPortalView';
import { StaffPortalAuthView } from './components/StaffPortalAuthView';
import { ConductorMobileSignIn } from './components/ConductorMobileSignIn';
import { MyBookingsView } from './components/MyBookingsView';
import { HelpCenterView } from './components/HelpCenterView';
import { StaticPages } from './components/StaticPages';
import { STMitraVoiceAssistant } from './components/STMitraVoiceAssistant';
import { Footer } from './components/Footer';

export function App() {
  // 1. Core State
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole>('passenger');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [staffInfo, setStaffInfo] = useState<{ name: string; employeeId: string; depot: string } | null>(null);

  // Search parameters
  const [fromLocation, setFromLocation] = useState('Pune (Swargate)');
  const [toLocation, setToLocation] = useState('Mumbai (Dadar)');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Active selection & Bookings
  const [selectedTrip, setSelectedTrip] = useState<BusTrip>(MOCK_TRIPS[0]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>(MOCK_BOOKINGS[0]);
  
  // Bookings with local storage synchronization
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('msrtc_bookings_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_BOOKINGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    try {
      localStorage.setItem('msrtc_bookings_v1', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  // Handle Search Submission from Landing / Widget
  const handleSearchSubmit = () => {
    setCurrentScreen('search_results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Search on a specific predefined route (e.g. from Frequent Routes or ST-Mitra)
  const handleQuickRouteSelect = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setFromLocation(trip.fromCity);
    setToLocation(trip.toCity);
    setCurrentScreen('seat_selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomSearchRoute = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    setCurrentScreen('search_results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Selecting a Trip from Search Results -> goes to Seat Selection
  const handleSelectTripForBooking = (trip: BusTrip) => {
    setSelectedTrip(trip);
    setCurrentScreen('seat_selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Successful Booking from Payment Modal -> goes to Live Digital E-Ticket Screen
  const handlePaymentSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedBooking(newBooking);
    setCurrentScreen('ticket_journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Booking Confirmed: ${newBooking.pnr}`,
      message: `Seats ${newBooking.selectedSeats.join(', ')} confirmed for ${newBooking.trip.fromCity} to ${newBooking.trip.toCity}. Digital QR is ready.`,
      timestamp: 'Just now',
      type: 'TICKET_CONFIRMED',
      read: false,
      pnr: newBooking.pnr,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle View a Specific Booking (from Recent Bookings card or My Bookings list)
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentScreen('ticket_journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
    if (selectedBooking.bookingId === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, status: 'CANCELLED' }));
    }
  };

  // Handle Role Change
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'conductor') {
      setCurrentScreen('conductor_portal');
    } else if (role === 'admin') {
      setCurrentScreen('admin_portal');
    } else if (role === 'driver') {
      setCurrentScreen('driver_portal');
    } else {
      setCurrentScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Staff Login Success from StaffPortalAuthView
  const handleStaffLoginSuccess = (
    role: 'admin' | 'conductor' | 'driver', 
    info: { name: string; employeeId: string; depot: string }
  ) => {
    setUserRole(role);
    setStaffInfo(info);
    
    // Add staff security session notification
    const newNotif: NotificationItem = {
      id: `staff-notif-${Date.now()}`,
      title: `Staff Access Granted: ${info.employeeId}`,
      message: `Authenticated as ${role.toUpperCase()} for ${info.depot}. Session active.`,
      timestamp: 'Just now',
      type: 'PLATFORM_UPDATE',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (role === 'admin') {
      setCurrentScreen('admin_portal');
    } else if (role === 'conductor') {
      setCurrentScreen('conductor_portal');
    } else if (role === 'driver') {
      setCurrentScreen('driver_portal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Notification Read
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb] text-[#191c1e] selection:bg-[#ffb59a] selection:text-[#a43700]">
      
      {/* 1. Global Navigation Bar */}
      <TopNavBar
        language={language}
        onLanguageChange={setLanguage}
        currentRole={userRole}
        onRoleChange={handleRoleChange}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
      />

      {/* 2. Main Viewport Router */}
      <main className="flex-1 w-full">
        
        {/* Screen 1: Home / Landing Screen */}
        {currentScreen === 'home' && (
          <LandingHomeView
            language={language}
            fromLocation={fromLocation}
            toLocation={toLocation}
            travelDate={travelDate}
            onFromChange={setFromLocation}
            onToChange={setToLocation}
            onDateChange={setTravelDate}
            onSearch={handleSearchSubmit}
            onSelectTrip={handleQuickRouteSelect}
            onViewAllRoutes={() => {
              setCurrentScreen('search_results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLoggedIn={isLoggedIn}
            onToggleLogin={() => setIsLoggedIn(!isLoggedIn)}
            bookings={bookings}
            onViewBooking={handleViewBooking}
            trips={MOCK_TRIPS}
          />
        )}

        {/* Screen 2: Search Results List (matching Image 5 / HTML 5) */}
        {currentScreen === 'search_results' && (
          <SearchResultsView
            fromLocation={fromLocation}
            toLocation={toLocation}
            travelDate={travelDate}
            onFromChange={setFromLocation}
            onToChange={setToLocation}
            onDateChange={setTravelDate}
            trips={MOCK_TRIPS}
            onSelectTrip={handleSelectTripForBooking}
            onModifySearch={() => setCurrentScreen('home')}
            language={language}
          />
        )}

        {/* Screen 3: Seat Selection & Bus Layout (matching Image 7 / HTML 7) */}
        {currentScreen === 'seat_selection' && (
          <SeatSelectionView
            trip={selectedTrip}
            onBack={() => setCurrentScreen('search_results')}
            onProceedToPayment={handlePaymentSuccess}
            language={language}
          />
        )}

        {/* Screen 4: Digital E-Ticket & Real-time Live GPS Tracking (matching Image 4 / HTML 4) */}
        {currentScreen === 'ticket_journey' && (
          <TicketActiveJourneyView
            booking={selectedBooking}
            onBack={() => setCurrentScreen('home')}
            onCancelBooking={handleCancelBooking}
            language={language}
          />
        )}

        {/* Conductor Mobile/Tablet Sign-In Terminal Screen */}
        {currentScreen === 'conductor_login' && (
          <ConductorMobileSignIn
            language={language}
            onLanguageChange={(lang) => setLanguage(lang)}
            onDutyStart={(conductorDetails) => {
              setUserRole('conductor');
              setStaffInfo({
                name: `Conductor #${conductorDetails.badgeId}`,
                employeeId: `CND-${conductorDetails.badgeId}`,
                depot: conductorDetails.origin.split(',')[0] || 'Swargate',
              });
              
              // Notification for shift start
              const shiftNotif: NotificationItem = {
                id: `shift-notif-${Date.now()}`,
                title: `Duty Shift Started: ${conductorDetails.busNumber}`,
                message: `Active on Route ${conductorDetails.origin} ➔ ${conductorDetails.destination}. ETIM linked.`,
                timestamp: 'Just now',
                type: 'PLATFORM_UPDATE',
                read: false,
              };
              setNotifications((prev) => [shiftNotif, ...prev]);

              setCurrentScreen('conductor_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEmergencyOfflineIssue={() => {
              setUserRole('conductor');
              setCurrentScreen('conductor_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 5: Conductor ETIM & QR Scanner Portal */}
        {currentScreen === 'conductor_portal' && (
          <ConductorPortalView
            language={language}
            activeBookings={bookings}
          />
        )}

        {/* Screen 6: Depot Admin Fleet & Dynamic Surcharge Portal */}
        {currentScreen === 'admin_portal' && (
          <AdminDepotPortalView
            language={language}
            trips={MOCK_TRIPS}
          />
        )}

        {/* Screen 6B: Driver Operations & Telemetry Portal */}
        {currentScreen === 'driver_portal' && (
          <DriverPortalView
            language={language}
            staffName={staffInfo?.name}
            badgeNumber={staffInfo?.employeeId}
            depot={staffInfo?.depot}
          />
        )}

        {/* Staff Portal Web Sign In & Sign Up Screen */}
        {currentScreen === 'staff_auth' && (
          <StaffPortalAuthView
            language={language}
            onLoginSuccess={handleStaffLoginSuccess}
            onBackToHome={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 7: My Bookings Dashboard */}
        {currentScreen === 'my_bookings' && (
          <MyBookingsView
            language={language}
            bookings={bookings}
            onSelectBooking={handleViewBooking}
            onBookNewTrip={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 8: Help Center & Concessions Helpline */}
        {currentScreen === 'help_center' && (
          <HelpCenterView language={language} />
        )}

        {/* Static Institutional Pages: About Us, Terms, Privacy */}
        {(currentScreen === 'about_us' || currentScreen === 'terms' || currentScreen === 'privacy') && (
          <StaticPages
            page={currentScreen}
            onBack={() => setCurrentScreen('home')}
            language={language}
          />
        )}

      </main>

      {/* 3. Vernacular AI Assistant ST-Mitra (Floating FAB + Drawer) */}
      <STMitraVoiceAssistant
        language={language}
        onSearchRoute={handleCustomSearchRoute}
        trips={MOCK_TRIPS}
      />

      {/* 4. Global Footer */}
      <Footer
        language={language}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default App;
