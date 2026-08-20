import React, { useState } from 'react';
import { Language, BusTrip, ConcessionType, Booking, PassengerDetails } from '../types';
import { getTranslation } from '../locales/translations';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  User
} from 'lucide-react';

interface PaymentModalProps {
  trip: BusTrip;
  selectedSeats: string[];
  concession: ConcessionType;
  totalAmount: number;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
  language: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  trip,
  selectedSeats,
  concession,
  totalAmount,
  onClose,
  onPaymentSuccess,
  language,
}) => {
  const t = getTranslation(language);

  // Passenger form
  const [passengerName, setPassengerName] = useState('Aniket Shinde');
  const [passengerAge, setPassengerAge] = useState('26');
  const [passengerGender, setPassengerGender] = useState<'male' | 'female' | 'other'>('male');
  const [passengerMobile, setPassengerMobile] = useState('+91 98220 12345');
  const [passengerEmail, setPassengerEmail] = useState('aniket@example.com');

  // Payment tab
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');
  const [upiId, setUpiId] = useState('aniket@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrScan, setShowQrScan] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a43700', '#00337c', '#ffb59a', '#22c55e'],
      });

      // Generate realistic booking object
      const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
      const newPnr = `MSRTC-${randomSuffix}`;
      const bookingRef = `MSR2026${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const primaryPassenger: PassengerDetails = {
        fullName: passengerName || 'Passenger',
        age: parseInt(passengerAge, 10) || 25,
        gender: passengerGender,
        mobileNumber: passengerMobile || '+91 98220 12345',
        email: passengerEmail || 'passenger@msrtc.gov.in',
        seatId: selectedSeats[0] || '1A',
        concessionType: concession,
      };

      const newBooking: Booking = {
        bookingId: `BK-${Date.now()}`,
        bookingRef,
        pnr: newPnr,
        trip,
        selectedSeats,
        passengers: [primaryPassenger],
        concessionType: concession,
        concessionDiscountPercent: concession === 'women' || concession === 'senior' ? 50 : concession === 'student' ? 30 : 0,
        baseFare: selectedSeats.length * trip.baseFare,
        discountAmount: (selectedSeats.length * trip.baseFare) - totalAmount + (trip.isAc ? totalAmount * 0.05 : 0),
        gstAmount: trip.isAc ? totalAmount * 0.05 : 0,
        totalFare: totalAmount,
        paymentMethod,
        paymentStatus: 'PAID',
        bookingDate: new Date().toISOString().split('T')[0],
        journeyDate: new Date().toISOString().split('T')[0],
        qrPayload: `HMAC_SHA256:${bookingRef}:${trip.busNumber.replace(/\s+/g, '')}:${new Date().toISOString().split('T')[0]}:${selectedSeats.join(',')}:VALID`,
        status: 'CONFIRMED',
        platformNumber: 'Platform 3',
        offlineCached: true,
        currentStopIndex: 1,
        busCoordinates: {
          lat: 18.7523,
          lng: 73.4068,
          speedKmh: 72,
          heading: 315,
          etaMinutes: 15,
          distanceRemainingKm: 18,
        },
      };

      setIsProcessing(false);
      onPaymentSuccess(newBooking);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Inter']">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#f2f4f6] text-[#515e64] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e0e3e5]">
          <div className="w-10 h-10 rounded-xl bg-[#ffdbcf] text-[#a43700] flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#191c1e]">Secure Payment & Checkout</h3>
            <p className="text-xs text-[#515e64] font-['JetBrains_Mono']">
              MSRTC NextGen Gateway • 256-Bit SSL Encrypted
            </p>
          </div>
        </div>

        {/* Journey Quick Card */}
        <div className="p-3.5 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl mb-6 flex items-center justify-between text-xs font-['JetBrains_Mono']">
          <div>
            <span className="font-bold text-[#191c1e] block text-sm font-['Inter']">
              {trip.fromCity} ➔ {trip.toCity}
            </span>
            <span className="text-[#5a4138]">Seats: {selectedSeats.join(', ')} • {trip.departureTime}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#515e64] block">Amount Payable</span>
            <span className="text-lg font-black text-[#a43700]">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Passenger Information Inputs */}
        <div className="space-y-4 mb-6">
          <h4 className="font-bold text-xs font-['JetBrains_Mono'] text-[#5a4138] uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Primary Passenger Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Full Name</label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="e.g. Aniket Shinde"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Age</label>
              <input
                type="number"
                value={passengerAge}
                onChange={(e) => setPassengerAge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Gender</label>
              <select
                value={passengerGender}
                onChange={(e) => setPassengerGender(e.target.value as any)}
                className="w-full px-2 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Mobile Number (SMS Updates)</label>
              <input
                type="tel"
                value={passengerMobile}
                onChange={(e) => setPassengerMobile(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none font-['JetBrains_Mono']"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Email (E-Ticket PDF)</label>
              <input
                type="email"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs font-['JetBrains_Mono'] text-[#5a4138] uppercase tracking-wider">
            Select Payment Method
          </h4>

          <div className="grid grid-cols-4 gap-2 text-xs font-['JetBrains_Mono']">
            <button
              type="button"
              onClick={() => { setPaymentMethod('UPI'); setShowQrScan(false); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'UPI' ? 'border-[#00337c] bg-[#d9e2ff]/50 font-bold text-[#00337c]' : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#515e64]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI</span>
            </button>

            <button
              type="button"
              onClick={() => { setPaymentMethod('CARD'); setShowQrScan(false); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'CARD' ? 'border-[#00337c] bg-[#d9e2ff]/50 font-bold text-[#00337c]' : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#515e64]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => { setPaymentMethod('NETBANKING'); setShowQrScan(false); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'NETBANKING' ? 'border-[#00337c] bg-[#d9e2ff]/50 font-bold text-[#00337c]' : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#515e64]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>NetBank</span>
            </button>

            <button
              type="button"
              onClick={() => { setPaymentMethod('WALLET'); setShowQrScan(false); }}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                paymentMethod === 'WALLET' ? 'border-[#00337c] bg-[#d9e2ff]/50 font-bold text-[#00337c]' : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#515e64]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>ST Wallet</span>
            </button>
          </div>

          {/* Payment Method Details */}
          {paymentMethod === 'UPI' && (
            <div className="p-4 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#191c1e]">UPI One-Tap / Apps</span>
                <button
                  type="button"
                  onClick={() => setShowQrScan(!showQrScan)}
                  className="text-xs text-[#00337c] font-['JetBrains_Mono'] font-bold flex items-center gap-1 hover:underline"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQrScan ? 'Use UPI ID' : 'Scan QR Code'}</span>
                </button>
              </div>

              {!showQrScan ? (
                <div>
                  <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">
                    Enter Virtual Payment Address (VPA) / UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-white focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c] outline-none font-['JetBrains_Mono']"
                  />
                  <div className="flex gap-2 mt-2">
                    {['@oksbi', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => setUpiId(passengerName.toLowerCase().replace(/\s+/g, '') + suf)}
                        className="px-2 py-0.5 bg-white border border-[#e0e3e5] rounded text-[10px] text-[#515e64] hover:bg-[#f2f4f6]"
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-36 h-36 bg-white border-2 border-[#00337c] rounded-xl mx-auto flex items-center justify-center shadow-xs p-2">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQNNfyKwoz3Q-50iN6SzJb2ri0tf0C1Tko5ISahuHPqfG0vdydDsh-d4O0e9JC65lUnoydEvatO_ptfeM4yAyIYQ9d_ecXww9-skR-QJUlDjcLuGiM-DwDh8POIuU__QZiFuHnnRzUAKR2aZ8ogfPxnGp4mHV5_Zb_bp8-bOwURxNpHi3YPvtyo4BWn6XLlQoiWg-94kWTCHTyD6DFILAB_0W_eUpg2RhIDHEbTEqSXk8jl7wXa-zA"
                      alt="UPI Dynamic Payment QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#5a4138] mt-2 font-['JetBrains_Mono']">
                    Scan using GPay, PhonePe, Paytm, or BHIM app
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="p-4 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Card Number</label>
                <input
                  type="text"
                  defaultValue="4532 •••• •••• 8821"
                  className="w-full px-3 py-2 rounded-lg border border-[#e3bfb2] bg-white font-['JetBrains_Mono'] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">Expiry</label>
                  <input
                    type="text"
                    defaultValue="08/29"
                    className="w-full px-3 py-2 rounded-lg border border-[#e3bfb2] bg-white font-['JetBrains_Mono'] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#5a4138] block mb-1 font-['JetBrains_Mono']">CVV</label>
                  <input
                    type="password"
                    defaultValue="•••"
                    className="w-full px-3 py-2 rounded-lg border border-[#e3bfb2] bg-white font-['JetBrains_Mono'] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <div className="p-4 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl space-y-3 text-xs">
              <label className="text-[11px] text-[#5a4138] block font-['JetBrains_Mono']">Select Bank</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[#e3bfb2] bg-white outline-none">
                <option>Bank of Maharashtra</option>
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
              </select>
            </div>
          )}

          {paymentMethod === 'WALLET' && (
            <div className="p-4 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#191c1e]">Smart Transit Pass Balance:</span>
                <span className="font-bold text-[#00337c] font-['JetBrains_Mono'] text-sm">₹1,450.00</span>
              </div>
              <p className="text-[11px] text-[#515e64]">
                Amount will be deducted automatically from your verified commuter wallet.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 pt-4 border-t border-[#e0e3e5]">
          <button
            id="confirm-pay-now-btn"
            disabled={isProcessing}
            onClick={handlePayNow}
            className="w-full py-4 bg-[#a43700] hover:bg-[#cd4700] active:scale-95 text-white font-['JetBrains_Mono'] text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{totalAmount.toFixed(2)} & Generate E-Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
