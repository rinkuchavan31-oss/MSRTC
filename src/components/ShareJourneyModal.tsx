import React, { useState } from 'react';
import { Booking } from '../types';
import { X, Copy, Check, MessageSquare, Share2 } from 'lucide-react';

interface ShareJourneyModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ShareJourneyModal: React.FC<ShareJourneyModalProps> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://msrtc.gov.in/track?pnr=${booking.pnr}&token=live_gps_${booking.bookingRef}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🚌 Tracking my MSRTC journey from ${booking.trip.fromCity} to ${booking.trip.toCity} on Shivneri bus (${booking.trip.busNumber}). Seats: ${booking.selectedSeats.join(', ')}. Track my live bus location here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Inter']">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#f2f4f6] text-[#515e64]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#d9e2ff] text-[#00337c] flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#191c1e]">Share Live Journey</h3>
            <p className="text-xs text-[#515e64] font-['JetBrains_Mono']">
              Allow family to monitor real-time ETA & stops
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-[#f8f9fb] rounded-xl border border-[#e0e3e5] mb-5 text-xs font-['JetBrains_Mono'] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#515e64]">Route:</span>
            <strong className="text-[#191c1e]">{booking.trip.fromCity} ➔ {booking.trip.toCity}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#515e64]">Live Bus:</span>
            <strong className="text-[#a43700]">{booking.trip.busNumber}</strong>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-['JetBrains_Mono'] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e3bfb2] bg-[#f8f9fb] text-[#515e64] font-['JetBrains_Mono'] outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-[#00337c] hover:bg-[#00429c] text-white rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
