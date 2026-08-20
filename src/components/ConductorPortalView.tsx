import React, { useState } from 'react';
import { Language, Booking, BusSeat } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  Users, 
  Coins, 
  RefreshCw, 
  Search, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ConductorPortalProps {
  language: Language;
  activeBookings: Booking[];
}

export const ConductorPortalView: React.FC<ConductorPortalProps> = ({
  language,
  activeBookings,
}) => {
  const t = getTranslation(language);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'VALID' | 'INVALID' | null;
    pnr?: string;
    seats?: string[];
    passengerName?: string;
    message?: string;
  }>({ status: null });

  // Manifest seat passenger list state
  const [manifestList, setManifestList] = useState([
    { seat: '1A', pnr: 'MSRTC-9823471', name: 'Aniket Shinde', gender: 'M/26', status: 'BOARDED', category: 'General' },
    { seat: '1B', pnr: 'MSRTC-8812903', name: 'Suresh Patil', gender: 'M/45', status: 'BOARDED', category: 'General' },
    { seat: '1C', pnr: 'MSRTC-7719201', name: 'Ramesh Kadam', gender: 'M/34', status: 'UNBOARDED', category: 'General' },
    { seat: '1D', pnr: 'MSRTC-6629104', name: 'Ganesh Deshmukh', gender: 'M/29', status: 'UNBOARDED', category: 'General' },
    { seat: '2A', pnr: 'MSRTC-9823471', name: 'Priya Shinde', gender: 'F/24', status: 'BOARDED', category: 'Mahila Samman (50%)' },
    { seat: '2B', pnr: 'MSRTC-5521908', name: 'Sunita More', gender: 'F/42', status: 'BOARDED', category: 'Mahila Samman (50%)' },
    { seat: '3A', pnr: 'MSRTC-4419082', name: 'Babanrao Joshi', gender: 'M/68', status: 'BOARDED', category: 'Senior (50%)' },
    { seat: '4A', pnr: 'VACANT', name: 'Spot Ticket Available', gender: '-', status: 'VACANT', category: 'Open' },
  ]);

  // Cash spot ticket issuing form
  const [spotFrom, setSpotFrom] = useState('Swargate, Pune');
  const [spotTo, setSpotTo] = useState('Dadar, Mumbai');
  const [spotFare, setSpotFare] = useState('550');
  const [spotSeat, setSpotSeat] = useState('4A');
  const [spotIssuedSuccess, setSpotIssuedSuccess] = useState(false);

  const handleSimulateScan = (isValid: boolean) => {
    setIsScanning(true);
    setScanResult({ status: null });

    setTimeout(() => {
      setIsScanning(false);
      if (isValid) {
        setScanResult({
          status: 'VALID',
          pnr: 'MSRTC-9823471',
          seats: ['W12', 'W13'],
          passengerName: 'Aniket Shinde & Priya Shinde',
          message: 'HMAC Authentication Verified. Valid MSRTC E-Ticket.',
        });
      } else {
        setScanResult({
          status: 'INVALID',
          message: 'Error: Ticket already boarded or QR signature invalid.',
        });
      }
    }, 1200);
  };

  const handleToggleBoardStatus = (seatNumber: string) => {
    setManifestList((prev) =>
      prev.map((item) => {
        if (item.seat === seatNumber) {
          if (item.status === 'UNBOARDED') return { ...item, status: 'BOARDED' };
          if (item.status === 'BOARDED') return { ...item, status: 'UNBOARDED' };
        }
        return item;
      })
    );
  };

  const handleIssueSpotTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setManifestList((prev) => [
      ...prev.filter((item) => item.seat !== spotSeat),
      { seat: spotSeat, pnr: `CASH-${Math.floor(1000 + Math.random() * 9000)}`, name: 'Spot Cash Passenger', gender: 'M', status: 'BOARDED', category: 'Spot Ticket' },
    ]);
    setSpotIssuedSuccess(true);
    setTimeout(() => setSpotIssuedSuccess(false), 3000);
  };

  return (
    <div id="conductor-portal-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      
      {/* Header */}
      <section className="bg-[#001945] text-white py-6 border-b border-[#00337c]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#a43700] text-white text-[11px] font-['JetBrains_Mono'] font-bold">
                ETIM DIGITAL TERMINAL
              </span>
              <span className="text-xs text-white/70 font-['JetBrains_Mono']">
                Conductor ID: C-44102 • Duty Route: Pune ➔ Mumbai
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              MSRTC Conductor Validation & Manifest
            </h1>
          </div>

          <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-xs">
            <div className="bg-[#00337c] px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-white/70 block text-[10px]">Bus Registration</span>
              <strong className="text-[#ffb59a]">MH 12 FC 4589</strong>
            </div>
            <div className="bg-[#00337c] px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-white/70 block text-[10px]">Total Boarded</span>
              <strong className="text-[#22c55e]">
                {manifestList.filter((m) => m.status === 'BOARDED').length} / {manifestList.length}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: QR Code Scanner */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow space-y-4">
              <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#a43700]" />
                <span>Live E-Ticket Camera Scanner</span>
              </h2>

              {/* Camera Viewfinder */}
              <div className="relative h-64 bg-[#191c1e] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center border-2 border-[#00337c]">
                
                {/* Viewfinder Target Reticle */}
                <div className="w-44 h-44 border-2 border-dashed border-[#ffb59a] rounded-xl flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#a43700]"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#a43700]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#a43700]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#a43700]"></div>

                  {isScanning ? (
                    <div className="w-full h-1 bg-[#22c55e] absolute top-1/2 animate-bounce shadow-lg"></div>
                  ) : (
                    <span className="text-white/60 text-xs font-['JetBrains_Mono']">
                      Align QR in square
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-[11px] text-white/80 font-['JetBrains_Mono']">
                    {isScanning ? 'Decoding cryptographic HMAC...' : 'Point at passenger mobile ticket'}
                  </span>
                </div>
              </div>

              {/* Scanner Actions Simulation */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan(true)}
                  className="py-2.5 bg-[#00337c] hover:bg-[#00429c] text-white rounded-xl text-xs font-['JetBrains_Mono'] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  <span>Scan Valid QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScan(false)}
                  className="py-2.5 bg-[#f2f4f6] hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-['JetBrains_Mono'] font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Scan Invalid QR</span>
                </button>
              </div>

              {/* Scan Result Feedback Card */}
              {scanResult.status === 'VALID' && (
                <div className="p-4 bg-[#dcfce7] border border-[#22c55e] rounded-xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#15803d] font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Ticket Verified Successfully!</span>
                  </div>
                  <div className="text-[#191c1e] font-['JetBrains_Mono'] space-y-1">
                    <p>PNR: <strong>{scanResult.pnr}</strong></p>
                    <p>Passenger: <strong>{scanResult.passengerName}</strong></p>
                    <p>Reserved Seats: <strong>{scanResult.seats?.join(', ')}</strong></p>
                  </div>
                  <button
                    onClick={() => {
                      setScanResult({ status: null });
                      alert('Passenger marked as Boarded in system!');
                    }}
                    className="w-full mt-2 py-1.5 bg-[#15803d] text-white font-['JetBrains_Mono'] font-bold rounded-lg"
                  >
                    Confirm Passenger Boarding
                  </button>
                </div>
              )}

              {scanResult.status === 'INVALID' && (
                <div className="p-4 bg-[#ffdad6] border border-[#ba1a1a] rounded-xl text-xs text-[#ba1a1a] space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm">Invalid or Duplicate QR</span>
                  </div>
                  <p>{scanResult.message}</p>
                </div>
              )}

            </div>

            {/* Spot Cash Ticketing Form */}
            <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow">
              <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-[#a43700]" />
                <span>Spot Cash Ticket Issuance</span>
              </h2>

              <form onSubmit={handleIssueSpotTicket} className="space-y-3 text-xs font-['JetBrains_Mono']">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#5a4138] block mb-1">From</label>
                    <input
                      type="text"
                      value={spotFrom}
                      onChange={(e) => setSpotFrom(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#e3bfb2] bg-[#f8f9fb]"
                    />
                  </div>
                  <div>
                    <label className="text-[#5a4138] block mb-1">To</label>
                    <input
                      type="text"
                      value={spotTo}
                      onChange={(e) => setSpotTo(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#e3bfb2] bg-[#f8f9fb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#5a4138] block mb-1">Fare (Cash)</label>
                    <input
                      type="number"
                      value={spotFare}
                      onChange={(e) => setSpotFare(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#e3bfb2] bg-[#f8f9fb]"
                    />
                  </div>
                  <div>
                    <label className="text-[#5a4138] block mb-1">Vacant Seat</label>
                    <select
                      value={spotSeat}
                      onChange={(e) => setSpotSeat(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#e3bfb2] bg-[#f8f9fb]"
                    >
                      <option value="4A">Seat 4A</option>
                      <option value="4B">Seat 4B</option>
                      <option value="5C">Seat 5C</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#a43700] hover:bg-[#cd4700] text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  Print Spot Cash Ticket (₹{spotFare})
                </button>

                {spotIssuedSuccess && (
                  <div className="p-2 bg-[#dcfce7] text-[#15803d] text-center rounded-lg">
                    Spot Ticket Issued for Seat {spotSeat}!
                  </div>
                )}
              </form>
            </div>

          </div>

          {/* Right Column: Passenger Manifest & Seat Boarding Status */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] ambient-shadow">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5] mb-4">
                <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00337c]" />
                  <span>Bus Passenger Manifest</span>
                </h2>
                <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">
                  Tap status pill to toggle
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-['JetBrains_Mono']">
                  <thead>
                    <tr className="bg-[#f2f4f6] text-[#5a4138] border-b border-[#e0e3e5]">
                      <th className="py-2.5 px-3">Seat</th>
                      <th className="py-2.5 px-3">Passenger</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e3e5]">
                    {manifestList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#f8f9fb]">
                        <td className="py-3 px-3 font-bold text-[#00337c]">
                          {item.seat}
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-[#191c1e] block font-['Inter']">{item.name}</strong>
                          <span className="text-[10px] text-[#515e64]">{item.gender} • {item.pnr}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-[#5a4138] bg-[#f2f4f6] px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleToggleBoardStatus(item.seat)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                              item.status === 'BOARDED'
                                ? 'bg-[#dcfce7] text-[#15803d] border border-[#22c55e]'
                                : item.status === 'UNBOARDED'
                                ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30'
                                : 'bg-[#e0e3e5] text-[#515e64]'
                            }`}
                          >
                            {item.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
