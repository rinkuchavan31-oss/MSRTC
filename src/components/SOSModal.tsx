import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle } from 'lucide-react';

interface SOSModalProps {
  onClose: () => void;
  pnr: string;
  busNumber: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({ onClose, pnr, busNumber }) => {
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !isDispatched) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isDispatched) {
      setIsDispatched(true);
    }
  }, [countdown, isDispatched]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-['Inter']">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ffdad6] relative animate-in fade-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#f2f4f6] text-[#515e64]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDispatched ? (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 animate-ping">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-black text-[#ba1a1a] mb-1">
              Emergency SOS Alert
            </h3>
            <p className="text-xs text-[#5a4138] mb-6">
              Broadcasting GPS coordinates to Maharashtra Police (112) and MSRTC Central Command in:
            </p>

            <div className="text-5xl font-black text-[#ba1a1a] font-['JetBrains_Mono'] mb-6">
              0{countdown}
            </div>

            <p className="text-[11px] text-[#515e64] font-['JetBrains_Mono'] mb-6">
              Bus: {busNumber} • PNR: {pnr}
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#e0e3e5] hover:bg-[#d8dadc] text-[#191c1e] font-['JetBrains_Mono'] text-xs font-bold rounded-xl"
            >
              Cancel SOS (False Alarm)
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-[#15803d] mb-1">
              Emergency Alert Dispatched!
            </h3>
            <p className="text-xs text-[#5a4138] mb-4">
              Depot Controller and Highway Police have received your live location on the Mumbai-Pune Expressway.
            </p>

            <div className="p-3 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl text-left text-xs font-['JetBrains_Mono'] space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-[#515e64]">Police Helpline:</span>
                <strong className="text-[#ba1a1a]">112 / 100</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#515e64]">MSRTC 24x7 Control:</span>
                <strong className="text-[#00337c]">1800 22 1250</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#00337c] text-white font-['JetBrains_Mono'] text-xs font-bold rounded-xl"
            >
              Return to Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
