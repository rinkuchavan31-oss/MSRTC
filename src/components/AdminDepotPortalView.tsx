import React, { useState } from 'react';
import { Language, BusTrip } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Bus, 
  Sliders, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle,
  Users,
  Percent
} from 'lucide-react';

interface AdminDepotPortalProps {
  language: Language;
  trips: BusTrip[];
}

export const AdminDepotPortalView: React.FC<AdminDepotPortalProps> = ({ language, trips }) => {
  const t = getTranslation(language);

  // Dynamic Tariff Surcharge Slider (±10% to ±20%)
  const [surchargePercent, setSurchargePercent] = useState(0);
  const [surchargeSaved, setSurchargeSaved] = useState(false);

  const handleSaveSurcharge = () => {
    setSurchargeSaved(true);
    setTimeout(() => setSurchargeSaved(false), 2500);
  };

  return (
    <div id="admin-portal-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      
      {/* Admin Header */}
      <section className="bg-[#001945] text-white py-6 border-b border-[#00337c]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#a43700] text-white text-[11px] font-['JetBrains_Mono'] font-bold">
                DIVISION: PUNE SWARGATE CENTRAL
              </span>
              <span className="text-xs text-white/70 font-['JetBrains_Mono']">
                Depot Controller: S. Deshmukh
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              MSRTC Depot Fleet & Tariff Administration
            </h1>
          </div>

          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span className="text-white/80">Live Telemetry Gateway Active</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-['JetBrains_Mono']">
          <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] ambient-shadow">
            <span className="text-xs text-[#515e64] block mb-1">Active Fleet on Road</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#00337c]">148 Buses</span>
              <span className="text-xs text-[#15803d] font-bold">96% On-Time</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] ambient-shadow">
            <span className="text-xs text-[#515e64] block mb-1">Average Load Factor</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#a43700]">84.2%</span>
              <span className="text-xs text-[#15803d] font-bold">+5.4% MoM</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] ambient-shadow">
            <span className="text-xs text-[#515e64] block mb-1">Today's Digital GMV</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#191c1e]">₹8,42,150</span>
              <span className="text-xs text-[#00337c] font-bold">UPI 78%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] ambient-shadow">
            <span className="text-xs text-[#515e64] block mb-1">Mahila Samman Subsidy</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#db2777]">₹3,20,400</span>
              <span className="text-xs text-[#5a4138]">Claimed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Dynamic Tariff & Surcharge Controller */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#a43700]" />
                <span>Dynamic Surcharge & Tariff Manager</span>
              </h2>
              <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">FR-ADM-02</span>
            </div>

            <p className="text-xs text-[#5a4138] leading-relaxed">
              Depot Admins may adjust seasonal peak/monsoon tariff surcharge (between -10% discount and +20% peak demand) for express routes during holidays and festival periods.
            </p>

            <div className="p-4 bg-[#f8f9fb] rounded-xl border border-[#e0e3e5] space-y-4">
              <div className="flex justify-between items-center text-xs font-['JetBrains_Mono']">
                <span className="text-[#5a4138]">Selected Dynamic Adjustment:</span>
                <strong className={`text-sm ${surchargePercent > 0 ? 'text-[#a43700]' : surchargePercent < 0 ? 'text-[#15803d]' : 'text-[#00337c]'}`}>
                  {surchargePercent > 0 ? `+${surchargePercent}% (Peak Surcharge)` : surchargePercent < 0 ? `${surchargePercent}% (Off-Peak Discount)` : '0% (Standard Base Fare)'}
                </strong>
              </div>

              <input
                type="range"
                min="-10"
                max="20"
                step="5"
                value={surchargePercent}
                onChange={(e) => setSurchargePercent(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer accent-[#a43700]"
              />

              <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#515e64]">
                <span>-10% Discount</span>
                <span>0% Standard</span>
                <span>+10% Holiday</span>
                <span>+20% Max Peak</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveSurcharge}
                className="w-full py-3 bg-[#00337c] hover:bg-[#00429c] text-white font-['JetBrains_Mono'] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Publish Updated Tariff to Reservation Engine</span>
              </button>

              {surchargeSaved && (
                <div className="mt-2 p-2.5 bg-[#dcfce7] border border-[#22c55e] text-[#15803d] text-center text-xs font-['JetBrains_Mono'] rounded-lg">
                  Tariff adjustment of {surchargePercent}% broadcasted to all booking channels!
                </div>
              )}
            </div>
          </div>

          {/* Real-time Depot Fleet Schedules */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow">
            <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2 mb-4 pb-3 border-b border-[#e0e3e5]">
              <Bus className="w-5 h-5 text-[#00337c]" />
              <span>Depot Departure Manifest & Load Factor</span>
            </h2>

            <div className="space-y-3">
              {trips.slice(0, 4).map((trip) => (
                <div key={trip.id} className="p-3.5 bg-[#f8f9fb] border border-[#e0e3e5] rounded-xl flex items-center justify-between text-xs font-['JetBrains_Mono']">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#191c1e] font-['Inter']">{trip.fromCity} ➔ {trip.toCity}</strong>
                      <span className="text-[10px] bg-[#d9e2ff] text-[#00337c] px-1.5 py-0.5 rounded font-bold">
                        {trip.busNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5a4138]">Departs: {trip.departureTime} • {trip.serviceName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#515e64] block">Available Seats</span>
                    <strong className="text-[#a43700] text-sm">{trip.availableSeatsCount} / {trip.totalSeats}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
