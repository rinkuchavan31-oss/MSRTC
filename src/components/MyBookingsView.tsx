import React from 'react';
import { Language, Booking } from '../types';
import { getTranslation } from '../locales/translations';
import { Ticket, ArrowRight, Calendar, MapPin, Bus, Clock, ShieldCheck } from 'lucide-react';

interface MyBookingsViewProps {
  language: Language;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onBookNewTrip: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  language,
  bookings,
  onSelectBooking,
  onBookNewTrip,
}) => {
  const t = getTranslation(language);

  return (
    <div id="my-bookings-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      
      {/* Header */}
      <section className="bg-[#00337c] text-white py-8 border-b border-[#001945]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Ticket className="w-6 h-6 text-[#ffb59a]" />
              <span>{t.myBookings}</span>
            </h1>
            <p className="text-xs text-white/70 font-['JetBrains_Mono'] mt-1">
              Active Digital Passes & Historic Trips
            </p>
          </div>

          <button
            onClick={onBookNewTrip}
            className="bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-['JetBrains_Mono'] font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
          >
            <Bus className="w-4 h-4" />
            <span>Book Another Journey</span>
          </button>
        </div>
      </section>

      {/* Main List */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e0e3e5] ambient-shadow">
            <Ticket className="w-12 h-12 text-[#515e64] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#191c1e] mb-1">No Active Bookings Found</h3>
            <p className="text-xs text-[#5a4138] mb-6">You haven't reserved any bus tickets yet.</p>
            <button
              onClick={onBookNewTrip}
              className="px-6 py-3 bg-[#a43700] text-white text-xs font-['JetBrains_Mono'] font-bold rounded-xl shadow-sm hover:bg-[#cd4700]"
            >
              Search Buses & Book
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                onClick={() => onSelectBooking(b)}
                className="bg-white rounded-2xl p-6 border border-[#e0e3e5] hover:border-[#a43700] ambient-shadow hover:ambient-shadow-active transition-all cursor-pointer group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e0e3e5]">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-xs font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#e0e3e5] text-[#515e64]'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-[#5a4138] font-['JetBrains_Mono']">
                      PNR: <strong>{b.pnr}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">
                    Journey Date: {b.journeyDate}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-[#191c1e] group-hover:text-[#a43700] transition-colors">
                        {b.trip.fromCity} ({b.trip.fromDepot}) ➔ {b.trip.toCity} ({b.trip.toDepot})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#5a4138]">
                      <span>Service: <strong>{b.trip.serviceName}</strong></span>
                      <span>•</span>
                      <span>Bus: <strong>{b.trip.busNumber}</strong></span>
                      <span>•</span>
                      <span>Seats: <strong className="text-[#00337c]">{b.selectedSeats.join(', ')}</strong></span>
                      <span>•</span>
                      <span>Time: <strong>{b.trip.departureTime}</strong></span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#515e64] block font-['JetBrains_Mono']">Total Paid</span>
                      <span className="text-xl font-black text-[#a43700] font-['Inter']">₹{b.totalFare.toFixed(2)}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#00337c] text-white group-hover:bg-[#a43700] transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex justify-between items-center text-xs font-['JetBrains_Mono'] text-[#00337c]">
                  <span>Tap to view live digital QR pass and realtime bus GPS tracking</span>
                  <span className="font-bold">Open Boarding Pass ➔</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
