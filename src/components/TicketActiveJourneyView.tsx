import React, { useState, useEffect } from 'react';
import { Language, Booking } from '../types';
import { getTranslation } from '../locales/translations';
import { SOSModal } from './SOSModal';
import { ShareJourneyModal } from './ShareJourneyModal';
import { 
  ArrowLeft, 
  Share2, 
  AlertTriangle, 
  Download, 
  Printer, 
  WifiOff, 
  ShieldCheck, 
  MapPin, 
  Bus, 
  Clock, 
  Navigation,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface TicketActiveJourneyViewProps {
  booking: Booking;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => void;
  language: Language;
}

export const TicketActiveJourneyView: React.FC<TicketActiveJourneyViewProps> = ({
  booking,
  onBack,
  onCancelBooking,
  language,
}) => {
  const t = getTranslation(language);

  // Modals state
  const [showSOS, setShowSOS] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Moving Dynamic Watermark Timestamp (changes every second to prevent static screenshot tampering)
  const [currentTimestamp, setCurrentTimestamp] = useState(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  });

  // Simulated GPS Bus Motion
  const [busProgressPercent, setBusProgressPercent] = useState(62);
  const [currentSpeed, setCurrentSpeed] = useState(74);
  const [etaMinutes, setEtaMinutes] = useState(15);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTimestamp(now.toTimeString().split(' ')[0]);
    }, 1000);

    const gpsInterval = setInterval(() => {
      setBusProgressPercent((prev) => {
        if (prev >= 98) return 98;
        return prev + 0.5;
      });
      // gentle fluctuations for realistic sensor telemetry
      setCurrentSpeed(72 + Math.floor(Math.random() * 5));
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(gpsInterval);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="ticket-journey-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      
      {/* 1. Header Toolbar */}
      <section className="bg-[#00337c] text-white border-b border-[#001945] sticky top-[60px] z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-[#00429c] text-white/90 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                {booking.trip.fromCity} to {booking.trip.toCity}
              </h1>
              <p className="text-xs text-white/70 font-['JetBrains_Mono']">
                Today, {booking.trip.departureTime} - {booking.trip.serviceName} ({booking.trip.busTypeLabel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Share Live Journey Button */}
            <button
              id="share-live-journey-btn"
              onClick={() => setShowShare(true)}
              className="bg-[#001945] hover:bg-[#00429c] border border-white/20 text-white px-3.5 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-[#ffb59a]" />
              <span>{t.shareLiveJourney}</span>
            </button>

            {/* SOS Emergency Button */}
            <button
              id="sos-emergency-btn"
              onClick={() => setShowSOS(true)}
              className="bg-[#ba1a1a] hover:bg-[#93000a] text-white px-4 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.sosAlert}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Layout: Digital E-Ticket on Left + Live GPS Map on Right */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Digital E-Ticket Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* The Ticket Container with Side Punches */}
            <div className="bg-white rounded-2xl border border-[#e3bfb2] ambient-shadow relative overflow-hidden">
              
              {/* Decorative side ticket punch cutouts */}
              <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-[#f8f9fb] border-r border-[#e3bfb2] z-10"></div>
              <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-[#f8f9fb] border-l border-[#e3bfb2] z-10"></div>

              {/* Ticket Top Header */}
              <div className="bg-[#00337c] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#a43700] text-white flex items-center justify-center font-black text-sm">
                    ST
                  </div>
                  <div>
                    <h2 className="font-bold text-sm leading-tight">{t.brandName}</h2>
                    <span className="text-[10px] text-white/70 font-['JetBrains_Mono']">Digital E-Boarding Pass</span>
                  </div>
                </div>

                {/* Offline Access Active Badge */}
                <div className="flex items-center gap-1.5 bg-[#001945] px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-['JetBrains_Mono']">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
                  <span className="text-white/90">{t.offlineAccessActive}</span>
                </div>
              </div>

              {/* QR Code + Anti-Tamper Dynamic Watermark */}
              <div className="p-6 text-center border-b border-dashed border-[#e0e3e5] bg-radial from-white to-[#f8f9fb] relative">
                
                {/* Dynamic Watermark Ticker Overlay */}
                <div className="absolute top-3 left-0 right-0 text-center pointer-events-none">
                  <span className="bg-[#ffdbcf]/70 text-[#a43700] px-3 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] font-bold tracking-wider uppercase qr-watermark border border-[#ffb59a]">
                    LIVE HMAC SECURE • {currentTimestamp}
                  </span>
                </div>

                {/* High Resolution Scannable 2D QR Code */}
                <div className="w-48 h-48 mx-auto mt-4 mb-2 p-2 bg-white rounded-xl border-2 border-[#00337c] shadow-md flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQNNfyKwoz3Q-50iN6SzJb2ri0tf0C1Tko5ISahuHPqfG0vdydDsh-d4O0e9JC65lUnoydEvatO_ptfeM4yAyIYQ9d_ecXww9-skR-QJUlDjcLuGiM-DwDh8POIuU__QZiFuHnnRzUAKR2aZ8ogfPxnGp4mHV5_Zb_bp8-bOwURxNpHi3YPvtyo4BWn6XLlQoiWg-94kWTCHTyD6DFILAB_0W_eUpg2RhIDHEbTEqSXk8jl7wXa-zA"
                    alt="Digital MSRTC E-Ticket QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-[11px] text-[#5a4138] font-['JetBrains_Mono']">
                  Scan with MSRTC Conductor ETIM / Station Validator
                </p>
              </div>

              {/* Ticket Details Grid */}
              <div className="p-6 space-y-4 font-['JetBrains_Mono'] text-xs">
                
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#e0e3e5]">
                  <div>
                    <span className="text-[10px] text-[#515e64] uppercase tracking-wider block mb-0.5">
                      {t.pnr}
                    </span>
                    <strong className="text-base text-[#191c1e] font-bold block">{booking.pnr}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#515e64] uppercase tracking-wider block mb-0.5">
                      {t.busNumber}
                    </span>
                    <strong className="text-base text-[#a43700] font-bold block">{booking.trip.busNumber}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#e0e3e5]">
                  <div>
                    <span className="text-[10px] text-[#515e64] uppercase tracking-wider block mb-0.5">
                      {t.seats}
                    </span>
                    <strong className="text-xl text-[#00337c] font-black block">
                      {booking.selectedSeats.join(', ')}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#515e64] uppercase tracking-wider block mb-0.5">
                      Class & Service
                    </span>
                    <strong className="text-xs text-[#191c1e] font-bold block">
                      {booking.trip.serviceName}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#515e64] uppercase tracking-wider block mb-0.5">
                    {t.boardingPoint}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-[#191c1e] font-bold">
                    <MapPin className="w-4 h-4 text-[#a43700]" />
                    <span>{booking.trip.fromDepot} Bus Stand, {booking.platformNumber}</span>
                  </div>
                </div>

                {/* Primary Passenger info */}
                <div className="pt-2 flex justify-between items-center text-[11px] text-[#5a4138]">
                  <span>Passenger: <strong>{booking.passengers[0]?.fullName || 'Aniket Shinde'}</strong> ({booking.passengers[0]?.gender}, {booking.passengers[0]?.age}y)</span>
                  <span className="text-[#a43700] font-bold">₹{booking.totalFare.toFixed(2)} Paid</span>
                </div>
              </div>

              {/* Platform Update Callout */}
              <div className="bg-[#d9e2ff]/50 border-t border-[#00337c]/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00337c] text-white">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#00337c] block">{t.platformUpdate}</strong>
                  <span className="text-[#191c1e]">
                    Bus has arrived at <strong>{booking.platformNumber}</strong>. Boarding will commence shortly.
                  </span>
                </div>
              </div>

            </div>

            {/* Ticket Actions: Print, PDF, Cancel */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#f2f4f6] text-[#00337c] border border-[#00337c]/30 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Reservation</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live GPS Fleet Tracking Map & ETA */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Map Container */}
            <div className="bg-white rounded-2xl border border-[#e0e3e5] ambient-shadow overflow-hidden relative">
              
              {/* Map Canvas / Image */}
              <div className="relative h-[360px] w-full bg-[#e6e8ea] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5YzU1OTXOoEOGqcHGuabuJIxEH2aouT9K5YPmMC0puXLP5w83Uzi96sUXh0MUAUe_x4tkCjSpcZHZHVI4phUp-rt_kbAd2Q26B4e7z9rOSs5eo_M950RN7415JrXBMt9_T9E03a7XGvUr3a7PZi2MX4Llbs6HkQqzCpLsTVuojfeWmdkgEOJLSerc6lXKLZOEYdY8xUk8qxRvU1cIbIu6Ue8f2t9dXhlhlQATk8kfhwCfgxkbPFHM"
                  alt="Maharashtra GPS Fleet Route Map"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {/* Status: In Transit */}
                  <div className="bg-[#001945]/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-xs font-['JetBrains_Mono'] shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping"></span>
                    <span>{t.currentStatus}: <strong className="text-[#ffb59a]">{t.inTransit}</strong></span>
                  </div>

                  {/* ETA Badge */}
                  <div className="bg-white/95 backdrop-blur-xs text-[#191c1e] px-3 py-1.5 rounded-full border border-[#e0e3e5] flex items-center gap-1.5 text-xs font-['JetBrains_Mono'] font-bold shadow-md">
                    <Clock className="w-3.5 h-3.5 text-[#a43700]" />
                    <span>{t.etaToDestination}: <strong className="text-[#a43700]">{etaMinutes} mins</strong></span>
                  </div>
                </div>

                {/* Animated Bus Icon Pin on Map */}
                <div 
                  className="absolute z-20 transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${busProgressPercent}%`,
                    top: `${48 + Math.sin(busProgressPercent / 10) * 12}%`,
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#a43700] text-white flex items-center justify-center shadow-2xl border-2 border-white animate-bounce">
                      <Bus className="w-5 h-5" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#001945] text-white text-[10px] font-['JetBrains_Mono'] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      MH 12 FC 4589 ({currentSpeed} km/h)
                    </div>
                  </div>
                </div>

                {/* Telemetry Stats Strip on Bottom of Map */}
                <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-[#e0e3e5] shadow-lg flex items-center justify-between text-xs font-['JetBrains_Mono'] z-10">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#00337c]" />
                    <div>
                      <span className="text-[10px] text-[#515e64] block">Speed</span>
                      <strong className="text-[#191c1e]">{currentSpeed} km/h</strong>
                    </div>
                  </div>
                  <div className="border-l border-[#e0e3e5] pl-4">
                    <span className="text-[10px] text-[#515e64] block">Distance Left</span>
                    <strong className="text-[#191c1e]">18 km remaining</strong>
                  </div>
                  <div className="border-l border-[#e0e3e5] pl-4">
                    <span className="text-[10px] text-[#515e64] block">Next Landmark</span>
                    <strong className="text-[#a43700]">Vashi Toll Plaza</strong>
                  </div>
                </div>

              </div>

              {/* Progress Timeline below Map */}
              <div className="p-6 font-['Inter']">
                <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] mb-2">
                  <span className="font-bold text-[#00337c]">Pune (Swargate) • 14:30</span>
                  <span className="font-bold text-[#a43700]">Mumbai (Dadar) • 18:15</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#e0e3e5] h-2.5 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-[#a43700] h-full transition-all duration-1000 rounded-full"
                    style={{ width: `${busProgressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-3 text-[11px] text-[#515e64] font-['JetBrains_Mono']">
                  <span>Urse Toll Plaza passed</span>
                  <span className="text-[#00337c] font-semibold">On Schedule (Expressway Clear)</span>
                </div>
              </div>

            </div>

            {/* Journey Amenities & SOS Helpline Card */}
            <div className="bg-white rounded-xl p-5 border border-[#e0e3e5] ambient-shadow font-['Inter']">
              <h3 className="font-bold text-sm text-[#191c1e] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00337c]" />
                <span>Onboard Support & Helpline</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
                <div className="p-2.5 bg-[#f8f9fb] rounded-lg border border-[#e0e3e5]">
                  <span className="text-[#515e64] block text-[10px]">Conductor Hotline</span>
                  <strong className="text-[#00337c]">+91 94220 99881</strong>
                </div>
                <div className="p-2.5 bg-[#f8f9fb] rounded-lg border border-[#e0e3e5]">
                  <span className="text-[#515e64] block text-[10px]">Depot Control 24x7</span>
                  <strong className="text-[#a43700]">1800 22 1250</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* SOS Alert Modal */}
      {showSOS && (
        <SOSModal
          onClose={() => setShowSOS(false)}
          pnr={booking.pnr}
          busNumber={booking.trip.busNumber}
        />
      )}

      {/* Share Journey Modal */}
      {showShare && (
        <ShareJourneyModal
          booking={booking}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Inter']">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e0e3e5]">
            <h3 className="text-lg font-bold text-[#191c1e] mb-2">Cancel Ticket Reservation?</h3>
            <p className="text-xs text-[#5a4138] leading-relaxed mb-4">
              As per MSRTC policy, cancellation requested before 2 hours of departure qualifies for an 85% refund (₹{(booking.totalFare * 0.85).toFixed(2)}) returned to your original payment method.
            </p>
            <div className="flex justify-end gap-2 text-xs font-['JetBrains_Mono'] font-bold">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-[#f2f4f6] text-[#191c1e] rounded-lg"
              >
                Keep Ticket
              </button>
              <button
                onClick={() => {
                  onCancelBooking(booking.bookingId);
                  setShowCancelConfirm(false);
                }}
                className="px-4 py-2 bg-[#ba1a1a] text-white rounded-lg"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
