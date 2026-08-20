import React, { useState, useEffect } from 'react';
import { Language, BusTrip, BusSeat, ConcessionType } from '../types';
import { getTranslation } from '../locales/translations';
import { generateBusSeats } from '../data/mockData';
import { 
  ArrowLeft, 
  Timer, 
  ShieldAlert, 
  Check, 
  Info, 
  ArrowRight,
  UserCheck,
  Percent
} from 'lucide-react';

interface SeatSelectionViewProps {
  trip: BusTrip;
  onBack: () => void;
  onProceedToPayment: (selectedSeatIds: string[], concession: ConcessionType, calculatedTotal: number) => void;
  language: Language;
}

export const SeatSelectionView: React.FC<SeatSelectionViewProps> = ({
  trip,
  onBack,
  onProceedToPayment,
  language,
}) => {
  const t = getTranslation(language);

  // 10:00 countdown timer for seat lock
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Bus Seats Matrix
  const [seats, setSeats] = useState<BusSeat[]>(() => generateBusSeats(trip.baseFare));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['1A']);
  const [concession, setConcession] = useState<ConcessionType>('none');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Toggle seat click
  const handleSeatClick = (seat: BusSeat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
      setErrorNotice(null);
    } else {
      if (selectedSeatIds.length >= 6) {
        setErrorNotice('Maximum 6 seats can be reserved per transaction.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
      setErrorNotice(null);
    }
  };

  // Calculation
  const baseFarePerSeat = trip.baseFare;
  const count = selectedSeatIds.length;
  const rawSubtotal = count * baseFarePerSeat;

  let discountMultiplier = 0;
  if (concession === 'senior' || concession === 'women') {
    discountMultiplier = 0.5; // 50% off
  } else if (concession === 'student') {
    discountMultiplier = 0.3; // 30% off
  }

  const discountAmount = rawSubtotal * discountMultiplier;
  const taxableFare = rawSubtotal - discountAmount;
  const gstAmount = trip.isAc ? taxableFare * 0.05 : 0; // 5% GST on AC services
  const finalTotal = taxableFare + gstAmount;

  return (
    <div id="seat-selection-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      {/* Top Lock Bar with Back button & 10:00 Countdown Timer */}
      <section className="bg-[#00337c] text-white border-b border-[#001945] sticky top-[60px] z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <button
            id="seat-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white font-['JetBrains_Mono'] text-xs font-semibold py-1 px-2.5 rounded hover:bg-[#00429c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Search</span>
          </button>

          <div className="text-center font-['Inter']">
            <h1 className="text-sm sm:text-base font-bold text-white leading-snug">
              {trip.fromCity} ({trip.fromDepot}) ➔ {trip.toCity} ({trip.toDepot})
            </h1>
            <p className="text-[11px] text-white/70 font-['JetBrains_Mono']">
              {language === 'mr' ? trip.serviceNameMr : trip.serviceName} • {trip.departureTime}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#001945] px-3 py-1.5 rounded-lg border border-[#ffdbcf]/20">
            <Timer className="w-3.5 h-3.5 text-[#ffb59a] animate-pulse" />
            <span className="text-xs font-['JetBrains_Mono'] text-white">
              {t.seatLockTimer}: <strong className="text-[#ffb59a]">{formatTimer(timeLeftSeconds)}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Seat Map + Legend */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Seat State Legend */}
            <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] ambient-shadow">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-['JetBrains_Mono']">
                {/* Available */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border-2 border-[#00337c] bg-white"></div>
                  <span className="text-[#191c1e]">{t.available}</span>
                </div>

                {/* Selected */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#a43700] border-2 border-[#a43700]"></div>
                  <span className="text-[#191c1e] font-bold">{t.selected}</span>
                </div>

                {/* Booked */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#e0e3e5] border-2 border-[#bbc8d0]"></div>
                  <span className="text-[#515e64]">{t.booked}</span>
                </div>

                {/* Women */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#fce7f3] border-2 border-[#db2777]"></div>
                  <span className="text-[#db2777] font-semibold">{t.women}</span>
                </div>

                {/* Senior */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#dbeafe] border-2 border-[#2563eb]"></div>
                  <span className="text-[#2563eb] font-semibold">{t.senior}</span>
                </div>
              </div>
            </div>

            {/* Bus Cabin Visual Layout */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e0e3e5] ambient-shadow relative max-w-md mx-auto">
              
              {/* Front Cabin / Driver steering wheel */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e0e3e5]">
                <div className="text-xs text-[#515e64] font-['JetBrains_Mono'] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#a43700]"></span>
                  <span>FRONT ENTRANCE</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] text-[#5a4138]">
                  <span className="material-symbols-outlined text-sm text-[#00337c]">sports_motorsports</span>
                  <span>Driver Cabin</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-4">
                {/* Row 1 */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    {renderSeatButton('1A')}
                    {renderSeatButton('1B')}
                  </div>
                  <div className="text-[10px] text-[#515e64]/50 font-['JetBrains_Mono'] uppercase tracking-widest px-2">
                    AISLE
                  </div>
                  <div className="flex gap-3">
                    {renderSeatButton('1C')}
                    {renderSeatButton('1D')}
                  </div>
                </div>

                {/* Row 2 (Women Reserved) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    {renderSeatButton('2A')}
                    {renderSeatButton('2B')}
                  </div>
                  <div className="text-[10px] text-[#515e64]/50 font-['JetBrains_Mono'] uppercase tracking-widest px-2">
                    AISLE
                  </div>
                  <div className="flex gap-3">
                    {renderSeatButton('2C')}
                    {renderSeatButton('2D')}
                  </div>
                </div>

                {/* Row 3 (Senior Reserved) */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    {renderSeatButton('3A')}
                    {renderSeatButton('3B')}
                  </div>
                  <div className="text-[10px] text-[#515e64]/50 font-['JetBrains_Mono'] uppercase tracking-widest px-2">
                    AISLE
                  </div>
                  <div className="flex gap-3">
                    {renderSeatButton('3C')}
                    {renderSeatButton('3D')}
                  </div>
                </div>

                {/* Row 4 */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-3">
                    {renderSeatButton('4A')}
                    {renderSeatButton('4B')}
                  </div>
                  <div className="text-[10px] text-[#515e64]/50 font-['JetBrains_Mono'] uppercase tracking-widest px-2">
                    AISLE
                  </div>
                  <div className="flex gap-3">
                    {renderSeatButton('4C')}
                    {renderSeatButton('4D')}
                  </div>
                </div>

                {/* Row 5 (Back 5 Seats) */}
                <div className="pt-2 border-t border-dashed border-[#e0e3e5]">
                  <div className="flex items-center justify-between gap-2">
                    {renderSeatButton('5A')}
                    {renderSeatButton('5B')}
                    {renderSeatButton('5C')}
                    {renderSeatButton('5D')}
                    {renderSeatButton('5E')}
                  </div>
                </div>
              </div>

              {/* Rear info */}
              <div className="mt-8 pt-4 border-t border-[#e0e3e5] text-center text-[11px] text-[#515e64] font-['JetBrains_Mono']">
                REAR EMERGENCY EXIT & LUGGAGE BAY
              </div>
            </div>

            {/* Error Notification */}
            {errorNotice && (
              <div className="p-3.5 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] rounded-xl text-xs flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Female Safety Protocol Hint */}
            <div className="bg-[#fce7f3]/50 border border-[#db2777]/30 p-3.5 rounded-xl text-xs text-[#5a4138] flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-[#db2777] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#db2777]">Maharashtra Passenger Safety Rule:</strong> Seats 2A & 2B are earmarked for solo women travelers. Male passengers cannot reserve adjacent seats when booked by female commuters.
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Trip Summary & Fare Breakdown */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow sticky top-[130px] space-y-6">
              
              <h2 className="text-xl font-bold text-[#191c1e] pb-3 border-b border-[#e0e3e5] flex items-center justify-between">
                <span>{t.tripSummary}</span>
                <span className="text-xs text-[#00337c] font-['JetBrains_Mono']">{trip.routeCode}</span>
              </h2>

              {/* Route Itinerary */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#5a4138] font-['JetBrains_Mono'] uppercase tracking-wider text-[10px] block">
                      {t.departure}
                    </span>
                    <strong className="text-sm text-[#191c1e] block">{trip.fromDepot}, {trip.fromCity}</strong>
                  </div>
                  <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#00337c]">{trip.departureTime}</span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#5a4138] font-['JetBrains_Mono'] uppercase tracking-wider text-[10px] block">
                      {t.arrival}
                    </span>
                    <strong className="text-sm text-[#191c1e] block">{trip.toDepot}, {trip.toCity}</strong>
                  </div>
                  <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#00337c]">{trip.arrivalTime}</span>
                </div>
              </div>

              {/* Selected Seats Display */}
              <div className="p-3.5 bg-[#f8f9fb] rounded-xl border border-[#e0e3e5] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5a4138] font-['JetBrains_Mono']">{t.selectedSeats}</span>
                  <span className="font-bold text-[#a43700] font-['JetBrains_Mono'] text-sm">
                    {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5a4138] font-['JetBrains_Mono']">{t.baseFare}</span>
                  <span className="font-bold text-[#191c1e] font-['JetBrains_Mono']">₹{baseFarePerSeat}</span>
                </div>
              </div>

              {/* Concession Selection Dropdown */}
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] font-bold text-[#5a4138] mb-2 flex items-center justify-between">
                  <span>{t.applyConcession}</span>
                  <span className="text-[10px] text-[#00337c] font-semibold flex items-center gap-0.5">
                    <Percent className="w-3 h-3" /> Govt. Schemes
                  </span>
                </label>
                <select
                  value={concession}
                  onChange={(e) => setConcession(e.target.value as ConcessionType)}
                  className="w-full py-2.5 px-3 rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] text-xs font-medium text-[#191c1e] outline-none focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c]"
                >
                  <option value="none">{t.noneFullFare}</option>
                  <option value="women">{t.womenConcession}</option>
                  <option value="senior">{t.seniorConcession}</option>
                  <option value="student">{t.studentConcession}</option>
                </select>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#e0e3e5] text-xs font-['JetBrains_Mono']">
                <div className="flex justify-between text-[#5a4138]">
                  <span>Subtotal ({count} seat{count > 1 ? 's' : ''})</span>
                  <span>₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#00337c] font-semibold">
                    <span>Govt Concession ({discountMultiplier * 100}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {trip.isAc && (
                  <div className="flex justify-between text-[#5a4138]">
                    <span>GST (5% AC Service)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
                  <div>
                    <span className="text-xs font-bold text-[#5a4138] block">{t.total}</span>
                    <span className="text-[10px] text-[#515e64]">{t.inclusiveOfTaxes}</span>
                  </div>
                  <span className="text-2xl font-black text-[#a43700] font-['Inter']">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Payment CTA */}
              <button
                id="proceed-to-payment-btn"
                disabled={selectedSeatIds.length === 0}
                onClick={() => onProceedToPayment(selectedSeatIds, concession, finalTotal)}
                className={`w-full py-3.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  selectedSeatIds.length > 0
                    ? 'bg-[#a43700] hover:bg-[#cd4700] active:scale-95 text-white'
                    : 'bg-[#e0e3e5] text-[#515e64] cursor-not-allowed'
                }`}
              >
                <span>{t.proceedToPayment}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );

  function renderSeatButton(seatId: string) {
    const seat = seats.find((s) => s.id === seatId) || {
      id: seatId,
      row: 1,
      col: 1,
      number: seatId,
      category: 'regular',
      status: 'available',
      price: trip.baseFare,
    };

    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';
    const isWomen = seat.category === 'women';
    const isSenior = seat.category === 'senior';

    let seatClasses = 'w-11 h-11 rounded-lg flex flex-col items-center justify-center text-xs font-["JetBrains_Mono"] font-bold transition-all seat ';

    if (isBooked) {
      seatClasses += 'bg-[#e0e3e5] border-2 border-[#bbc8d0] text-[#515e64] cursor-not-allowed opacity-60';
    } else if (isSelected) {
      seatClasses += 'bg-[#a43700] border-2 border-[#a43700] text-white shadow-md scale-105';
    } else if (isWomen) {
      seatClasses += 'bg-[#fce7f3] border-2 border-[#db2777] text-[#db2777] hover:border-[#a43700]';
    } else if (isSenior) {
      seatClasses += 'bg-[#dbeafe] border-2 border-[#2563eb] text-[#2563eb] hover:border-[#a43700]';
    } else {
      seatClasses += 'bg-white border-2 border-[#00337c] text-[#00337c] hover:border-[#a43700] hover:bg-[#ffdbcf]/20';
    }

    return (
      <button
        key={seat.id}
        id={`seat-${seat.id}`}
        type="button"
        disabled={isBooked}
        onClick={() => handleSeatClick(seat as BusSeat)}
        className={seatClasses}
        title={`Seat ${seat.number} ${isWomen ? '(Women)' : isSenior ? '(Senior)' : ''}`}
      >
        <span>{seat.number}</span>
        {isWomen && !isSelected && <span className="text-[8px] leading-none">♀</span>}
        {isSenior && !isSelected && <span className="text-[8px] leading-none">Sr</span>}
      </button>
    );
  }
};
