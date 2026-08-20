import React from 'react';
import { Language, Booking } from '../types';
import { getTranslation } from '../locales/translations';
import { Ticket, ArrowRight, ShieldCheck } from 'lucide-react';

interface RecentBookingsCardProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
  language: Language;
}

export const RecentBookingsCard: React.FC<RecentBookingsCardProps> = ({
  isLoggedIn,
  onLogin,
  bookings,
  onViewBooking,
  language,
}) => {
  const t = getTranslation(language);

  return (
    <div id="recent-bookings-card" className="bg-white rounded-xl p-6 border border-[#e3bfb2] ambient-shadow flex flex-col justify-between h-full font-['Inter']">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#a43700]" />
            <span>{t.recentBookings}</span>
          </h2>
          <span className="text-[#5a4138] font-['JetBrains_Mono'] text-xs font-medium">
            {t.yourHistory}
          </span>
        </div>

        {isLoggedIn && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 2).map((b) => (
              <div
                key={b.bookingId}
                onClick={() => onViewBooking(b)}
                className="p-3.5 bg-[#f8f9fb] hover:bg-[#ffdbcf]/30 border border-[#e0e3e5] hover:border-[#ffb59a] rounded-lg cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#191c1e] group-hover:text-[#a43700] transition-colors">
                      {b.trip.fromCity} ➔ {b.trip.toCity}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-['JetBrains_Mono'] font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-[#d9e2ff] text-[#00337c]' : 'bg-[#e0e3e5] text-[#515e64]'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#5a4138] font-['JetBrains_Mono'] flex items-center gap-2">
                    <span>PNR: {b.pnr}</span>
                    <span>•</span>
                    <span>Seats: {b.selectedSeats.join(', ')}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8f7066] group-hover:translate-x-1 group-hover:text-[#a43700] transition-all" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-left">
            <p className="text-sm text-[#5a4138] leading-relaxed mb-4">
              {t.loginToViewTrips}
            </p>
            <button
              onClick={onLogin}
              className="bg-[#00337c] hover:bg-[#00429c] active:scale-95 text-white font-['JetBrains_Mono'] text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          </div>
        )}
      </div>

      {isLoggedIn && bookings.length > 0 && (
        <div className="pt-4 border-t border-[#e0e3e5] mt-4 flex justify-between items-center text-xs font-['JetBrains_Mono']">
          <span className="text-[#515e64]">Total: {bookings.length} reservations</span>
          <button
            onClick={() => onViewBooking(bookings[0])}
            className="text-[#a43700] font-bold hover:underline"
          >
            View Active E-Ticket ➔
          </button>
        </div>
      )}
    </div>
  );
};
