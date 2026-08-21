import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Bus, 
  Gauge, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  PhoneCall, 
  ShieldCheck, 
  Navigation, 
  CheckSquare, 
  Square,
  Coffee,
  AlertCircle
} from 'lucide-react';

interface DriverPortalViewProps {
  language: Language;
  staffName?: string;
  badgeNumber?: string;
  depot?: string;
}

export const DriverPortalView: React.FC<DriverPortalViewProps> = ({
  language,
  staffName = 'Santosh Kadam (Heavy Passenger Vehicle)',
  badgeNumber = 'DRV-NSK-8821',
  depot = 'Swargate, Pune',
}) => {
  // Speed & vehicle status simulation
  const [currentSpeed, setCurrentSpeed] = useState(72);
  const speedLimit = 80;
  const isSpeeding = currentSpeed > speedLimit;

  // Pre-trip inspection checklist
  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Tire Pressure & Tread Depth (All 6 wheels)', checked: true },
    { id: '2', title: 'Speed Governor 80 km/h Calibration & Seal', checked: true },
    { id: '3', title: 'Dual Air Brakes & Emergency Retarder Check', checked: true },
    { id: '4', title: 'First Aid Kit & ABC Dry Powder Extinguisher', checked: true },
    { id: '5', title: 'Headlights, Fog Lamps & Hazard Blinkers', checked: true },
    { id: '6', title: 'ETIM GPS Transmitter Power Linked', checked: false },
  ]);

  // Waypoints for active duty
  const [waypoints, setWaypoints] = useState([
    { stop: 'Swargate Depot Platform 3', time: '07:30 AM', status: 'DEPARTED', delay: 'On Time' },
    { stop: 'Shivajinagar Station Bay 2', time: '07:55 AM', status: 'DEPARTED', delay: '+2 min' },
    { stop: 'Urse Expressway Toll Plaza', time: '08:40 AM', status: 'PASSED', delay: 'On Time' },
    { stop: 'Khalapur Rest Plaza (Mandatory Break)', time: '09:30 AM', status: 'NEXT', delay: 'On Time' },
    { stop: 'Vashi Highway Interchange', time: '10:35 AM', status: 'PENDING', delay: 'Est. 10:35' },
    { stop: 'Dadar Asiad Terminus', time: '11:15 AM', status: 'PENDING', delay: 'Est. 11:15' },
  ]);

  const [restTimerMinutes, setRestTimerMinutes] = useState(25);
  const [sosTriggered, setSosTriggered] = useState(false);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const allChecksComplete = checklist.every(c => c.checked);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 font-['Inter'] space-y-6">
      
      {/* Top Driver Duty Banner */}
      <div className="bg-[#0B2B67] text-white rounded-2xl p-6 shadow-xl border border-[#1b3d80] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#A03800] text-white flex items-center justify-center font-black text-2xl shadow-md border border-white/20">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-['JetBrains_Mono'] border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE ON DUTY
              </span>
              <span className="text-xs text-white/70 font-['JetBrains_Mono']">{badgeNumber}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {staffName}
            </h1>
            <p className="text-xs text-white/80 font-['JetBrains_Mono']">
              Bus: MH 12 FC 4589 · Shivneri AC Volvo (2x2) · Assigned: {depot}
            </p>
          </div>
        </div>

        {/* Action / SOS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSosTriggered(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Highway Breakdown SOS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry + Waypoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Telemetry & Speedometer */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Speedometer Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0B2B67]">
                <Gauge className="w-5 h-5 text-[#A03800]" />
                <span>Expressway Speed Governor Telemetry</span>
              </div>
              <span className="text-xs font-['JetBrains_Mono'] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GPS LOCK: 3D FIX
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-5xl sm:text-6xl font-black font-['JetBrains_Mono'] tracking-tight text-[#0B2B67]">
                {currentSpeed}
                <span className="text-lg font-bold text-[#515e64] ml-1">KM/H</span>
              </div>

              {/* Speed Meter Bar */}
              <div className="w-full bg-slate-100 rounded-full h-4 mt-4 overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    currentSpeed > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentSpeed / 100) * 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-[#515e64] font-['JetBrains_Mono'] mt-1">
                <span>0 km/h</span>
                <span className="text-[#A03800] font-bold">Limit: 80 km/h (Bhor Ghat: 50 km/h)</span>
                <span>100 km/h</span>
              </div>

              {/* Test speed simulator buttons */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#e2e8f0]">
                <span className="text-xs text-[#515e64]">Simulate Speed:</span>
                <button
                  onClick={() => setCurrentSpeed(65)}
                  className="px-2.5 py-1 text-xs bg-[#F4F6F9] hover:bg-[#e2e8f0] rounded font-['JetBrains_Mono']"
                >
                  65 km/h
                </button>
                <button
                  onClick={() => setCurrentSpeed(78)}
                  className="px-2.5 py-1 text-xs bg-[#F4F6F9] hover:bg-[#e2e8f0] rounded font-['JetBrains_Mono'] font-bold text-amber-700"
                >
                  78 km/h
                </button>
                <button
                  onClick={() => setCurrentSpeed(45)}
                  className="px-2.5 py-1 text-xs bg-[#F4F6F9] hover:bg-[#e2e8f0] rounded font-['JetBrains_Mono']"
                >
                  45 km/h (Ghat)
                </button>
              </div>
            </div>

            {/* Telemetry quick metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#e2e8f0] text-center">
              <div className="p-2 bg-[#F4F6F9] rounded-xl">
                <div className="text-[10px] uppercase text-[#515e64] font-['JetBrains_Mono']">Diesel Level</div>
                <div className="text-sm font-bold text-[#0B2B67] flex items-center justify-center gap-1 mt-0.5">
                  <Fuel className="w-3.5 h-3.5 text-[#A03800]" /> 84% (210L)
                </div>
              </div>
              <div className="p-2 bg-[#F4F6F9] rounded-xl">
                <div className="text-[10px] uppercase text-[#515e64] font-['JetBrains_Mono']">Engine Temp</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">88°C Optimal</div>
              </div>
              <div className="p-2 bg-[#F4F6F9] rounded-xl">
                <div className="text-[10px] uppercase text-[#515e64] font-['JetBrains_Mono']">Odometer</div>
                <div className="text-sm font-bold text-[#0B2B67] font-['JetBrains_Mono'] mt-0.5">142,890 KM</div>
              </div>
            </div>
          </div>

          {/* Mandatory Rest / Fatigue Advisory Card */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Coffee className="w-4 h-4 text-amber-700" />
              <span>Driver Fatigue & Rest Enforcement</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Continuous drive time: <strong>1h 45m</strong>. Mandatory 30-minute rest window is scheduled at <strong>Khalapur Food Mall Plaza (KM 88)</strong>.
            </p>
            <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-lg border border-amber-200 text-xs">
              <span className="font-semibold text-amber-900">Rest Timer Remaining:</span>
              <span className="font-['JetBrains_Mono'] font-bold text-amber-700 text-sm">
                {restTimerMinutes} mins until break
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Route Waypoints & Pre-Trip Inspection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Trip Waypoints Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0B2B67]">
                <Navigation className="w-5 h-5 text-[#A03800]" />
                <span>Expressway Duty Waypoints: Pune ➔ Mumbai</span>
              </div>
              <span className="text-xs font-['JetBrains_Mono'] text-[#515e64]">
                Schedule #SHIV-EX-0730
              </span>
            </div>

            <div className="space-y-4">
              {waypoints.map((wp, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < waypoints.length - 1 && (
                    <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-[#e2e8f0] -mb-2"></div>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    wp.status === 'DEPARTED' ? 'bg-emerald-600 text-white' :
                    wp.status === 'PASSED' ? 'bg-emerald-600 text-white' :
                    wp.status === 'NEXT' ? 'bg-[#A03800] text-white animate-pulse ring-4 ring-[#A03800]/20' :
                    'bg-[#F4F6F9] text-[#515e64] border border-[#c2c7ce]'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-[#F4F6F9] border border-[#e2e8f0] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#191c1e]">{wp.stop}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#515e64] font-['JetBrains_Mono'] mt-0.5">
                        <Clock className="w-3 h-3 text-[#A03800]" />
                        <span>Scheduled: {wp.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-['JetBrains_Mono'] ${
                        wp.status === 'DEPARTED' ? 'bg-emerald-100 text-emerald-800' :
                        wp.status === 'NEXT' ? 'bg-[#A03800] text-white' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {wp.status}
                      </span>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        {wp.delay}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Trip Vehicle Fitness Checklist */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0B2B67]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Pre-Trip Vehicle Safety Checklist (RTO Form 22)</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${allChecksComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {checklist.filter(c => c.checked).length} / {checklist.length} Verified
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    item.checked ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-white border-[#e2e8f0] text-[#191c1e] hover:bg-[#F4F6F9]'
                  }`}
                >
                  <span className="font-medium">{item.title}</span>
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#515e64] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Roadside Emergency SOS Modal */}
      {sosTriggered && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-red-600">
              Highway Fleet Emergency Dispatched
            </h3>
            <p className="text-xs text-[#515e64] leading-relaxed">
              Expressway Patrol Team, MSRTC Mobile Workshop Van, and Swargate Depot Control Room have received your live GPS coordinates (Lat 18.7523, Lng 73.4011).
            </p>
            <div className="p-3 bg-[#F4F6F9] rounded-xl border text-xs font-['JetBrains_Mono'] text-left space-y-1">
              <div><strong>Depot Dispatch Desk:</strong> 020-2444 0401</div>
              <div><strong>Highway Expressway Patrol:</strong> 98224 99000</div>
            </div>
            <button
              onClick={() => setSosTriggered(false)}
              className="w-full py-2.5 rounded-xl bg-[#0B2B67] text-white text-xs font-bold hover:bg-[#071c45]"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
