import React, { useState } from 'react';
import { Language } from '../types';
import { 
  ArrowRight, 
  KeyRound, 
  Smartphone, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Bus, 
  QrCode, 
  X, 
  Wifi, 
  WifiOff, 
  Battery, 
  Sparkles,
  AlertCircle,
  Hash,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface ConductorMobileSignInProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onDutyStart: (conductorDetails: {
    badgeId: string;
    routeId: string;
    busNumber: string;
    origin: string;
    destination: string;
  }) => void;
  onEmergencyOfflineIssue: () => void;
  onBack?: () => void;
}

export const ConductorMobileSignIn: React.FC<ConductorMobileSignInProps> = ({
  language,
  onLanguageChange,
  onDutyStart,
  onEmergencyOfflineIssue,
  onBack,
}) => {
  // Conductor Inputs
  const [badgeId, setBadgeId] = useState('');
  const [authMethod, setAuthMethod] = useState<'pin' | 'otp'>('pin');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRouteKey, setSelectedRouteKey] = useState('route-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Pre-configured bus/route roster options for conductors
  const ASSIGNED_BUS_ROUTES = [
    {
      id: 'route-1',
      busNumber: 'MH-12-FC-4589',
      busType: 'Shivneri AC Volvo',
      origin: 'Swargate, Pune',
      destination: 'Dadar, Mumbai',
      departureTime: '08:00 AM',
      tripCode: 'PUN-MUM-EXP-0800',
    },
    {
      id: 'route-2',
      busNumber: 'MH-14-BT-9021',
      busType: 'Shivshahi Seater AC',
      origin: 'Shivajinagar, Pune',
      destination: 'Nashik CBS',
      departureTime: '08:30 AM',
      tripCode: 'PUN-NSK-SSH-0830',
    },
    {
      id: 'route-3',
      busNumber: 'MH-20-EQ-7714',
      busType: 'Parivartan 2x2 Express',
      origin: 'Pune Swargate',
      destination: 'Kolhapur Central',
      departureTime: '09:15 AM',
      tripCode: 'PUN-KLP-PAR-0915',
    },
    {
      id: 'route-4',
      busNumber: 'MH-04-G-3319',
      busType: 'Shivneri AC Multi-Axle',
      origin: 'Borivali, Mumbai',
      destination: 'Swargate, Pune',
      departureTime: '09:00 AM',
      tripCode: 'BVI-PUN-EXP-0900',
    },
  ];

  // Translations / Text Dictionary for English & Marathi
  const isMr = language === 'mr';
  const t = {
    terminalBadge: isMr ? 'वाहक टर्मिनल v२.४' : 'Conductor Terminal v2.4',
    title: isMr ? 'वाहक लॉगिन (Duty Shift)' : 'Conductor Login',
    subtitle: isMr ? 'आपले ड्युटी तपशील आणि बॅज क्रमांक प्रविष्ट करा' : 'Enter your duty credentials',
    badgeLabel: isMr ? 'कंडक्टर बॅज क्रमांक (Badge ID)' : 'Conductor Badge ID',
    badgePlaceholder: isMr ? 'उदा. 4418 किंवा CND-4418' : 'e.g. 4418 or CND-4418',
    pinLabel: isMr ? '४-अंकी ड्युटी पिन (Quick 4-Digit PIN)' : 'Quick 4-Digit PIN',
    otpLabel: isMr ? '६-अंकी मोबाईल OTP (6-Digit OTP)' : '6-Digit Mobile OTP',
    usePin: isMr ? '४-अंकी पिन' : '4-Digit PIN',
    useOtp: isMr ? 'मोबाईल OTP' : 'Mobile OTP',
    getOtp: isMr ? 'OTP पाठवा' : 'Get OTP',
    routeLabel: isMr ? 'आजची बस / मार्ग निवडा (Bus & Route ID)' : "Select Today's Bus / Route ID",
    startDuty: isMr ? 'ड्युटी शिफ्ट सुरू करा' : 'Start Duty Shift',
    offlineTickets: isMr ? 'ऑफलाईन आपत्कालीन तिकिटे काढा' : 'Issue Emergency Offline Tickets',
    depotHelpline: isMr ? 'आगार हेल्पलाईन' : 'Depot Helpline',
    autoFillDemo: isMr ? 'चाचणी ड्युटी भरा' : 'Auto-Fill Test Duty',
    stationCode: isMr ? 'आगार कोड' : 'Depot Code',
    activeETIM: isMr ? 'ETIM मशीन जोडलेली आहे' : 'ETIM Scanner Active',
    deviceEncrypted: isMr ? 'ऑफलाईन कॅशिंग सुरक्षित (AES-256)' : 'Offline ETIM Sync Ready (AES-256)',
  };

  const handleQuickDemo = () => {
    setBadgeId('4418');
    setPin('9042');
    setSelectedRouteKey('route-1');
    setErrorMessage('');
  };

  const handleStartShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!badgeId.trim()) {
      setErrorMessage(isMr ? 'कृपया कंडक्टर बॅज नंबर प्रविष्ट करा.' : 'Please enter your Conductor Badge ID.');
      return;
    }

    if (authMethod === 'pin' && pin.trim().length < 4) {
      setErrorMessage(isMr ? 'कृपया ४-अंकी सिक्युरिटी पिन टाका.' : 'Please enter your 4-digit security PIN.');
      return;
    }

    if (authMethod === 'otp' && otp.trim().length < 6) {
      setErrorMessage(isMr ? 'कृपया ६-अंकी OTP टाका.' : 'Please enter the 6-digit verification OTP.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const selected = ASSIGNED_BUS_ROUTES.find(r => r.id === selectedRouteKey) || ASSIGNED_BUS_ROUTES[0];
      onDutyStart({
        badgeId: badgeId.trim(),
        routeId: selected.tripCode,
        busNumber: selected.busNumber,
        origin: selected.origin,
        destination: selected.destination,
      });
    }, 600);
  };

  const selectedRouteObj = ASSIGNED_BUS_ROUTES.find(r => r.id === selectedRouteKey) || ASSIGNED_BUS_ROUTES[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F4F6F9] flex flex-col justify-between p-3 sm:p-6 md:p-8 font-['Inter'] selection:bg-[#ffb59a] selection:text-[#A03800]">
      
      {/* High-Visibility Header Bar */}
      <div className="w-full max-w-xl mx-auto mb-4">
        <div className="bg-[#0B2B67] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#1b3d80] flex items-center justify-between gap-3">
          
          {/* Logo & Terminal Version Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#A03800] text-white flex items-center justify-center font-black text-xl shadow-md border border-white/20 shrink-0">
              ST
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                  MSRTC NextGen
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[#ffb59a] font-['JetBrains_Mono'] text-[10px] font-bold border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t.terminalBadge}
                </span>
              </div>
              <p className="text-[11px] text-white/75 font-['JetBrains_Mono'] mt-0.5">
                {isMr ? 'इलेक्ट्रॉनिक तिकीट इश्यू मशीन (ETIM)' : 'Electronic Ticket Issuing System'}
              </p>
            </div>
          </div>

          {/* Top-Right: Language Selector Pills (English | Marathi) */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/15 shrink-0">
            <button
              id="lang-toggle-en"
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                language === 'en'
                  ? 'bg-[#A03800] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              id="lang-toggle-mr"
              type="button"
              onClick={() => onLanguageChange('mr')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                language === 'mr'
                  ? 'bg-[#A03800] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

        </div>
      </div>

      {/* Terminal Hardware Status / Outdoor Visibility Bar */}
      <div className="w-full max-w-xl mx-auto mb-3 px-2 flex items-center justify-between text-[11px] text-[#515e64] font-['JetBrains_Mono']">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
            <span>{isOnline ? 'Online (4G Live)' : 'Offline Local Mode'}</span>
          </button>
          <span className="flex items-center gap-1 text-[#0B2B67] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Battery className="w-3.5 h-3.5 text-[#0B2B67]" />
            <span>94%</span>
          </span>
        </div>

        <button 
          type="button"
          onClick={handleQuickDemo}
          className="text-[#A03800] hover:underline font-bold flex items-center gap-1 bg-[#ffdbcf]/50 px-2 py-0.5 rounded border border-[#ffb59a]"
        >
          <Sparkles className="w-3 h-3 text-[#A03800]" />
          <span>{t.autoFillDemo}</span>
        </button>
      </div>

      {/* MAIN CONTAINER: High-Contrast White Card with 48px+ Tap Targets */}
      <main className="w-full max-w-xl mx-auto flex-1">
        <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-7 shadow-xl border border-[#e2e8f0]">
          
          {/* Card Header */}
          <div className="border-b border-[#e2e8f0] pb-4 mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2B67] tracking-tight">
                {t.title}
              </h2>
              <p className="text-xs text-[#515e64] mt-1 font-medium">
                {t.subtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0B2B67] text-white flex items-center justify-center font-bold shrink-0">
              <QrCode className="w-5 h-5 text-[#ffb59a]" />
            </div>
          </div>

          {/* Validation Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleStartShiftSubmit} className="space-y-4">
            
            {/* Input Field 1: Conductor Badge ID (Numeric Keypad Focused) */}
            <div>
              <label className="block text-xs font-black text-[#0B2B67] uppercase font-['JetBrains_Mono'] tracking-wider mb-1.5">
                {t.badgeLabel} <span className="text-[#A03800]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2B67]">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  id="conductor-badge-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder={t.badgePlaceholder}
                  required
                  className="w-full min-h-[52px] pl-11 pr-4 py-3 bg-[#F4F6F9] border-2 border-[#c2c7ce] focus:border-[#0B2B67] rounded-xl text-base sm:text-lg font-bold font-['JetBrains_Mono'] text-[#191c1e] placeholder-[#8f9bb3] focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-[#515e64] mt-1 font-['JetBrains_Mono']">
                {isMr ? 'उदा. स्वारगेट आगार बॅज क्र. ४४१८' : 'Keypad optimized: Enter your 4 to 6 digit MSRTC badge'}
              </p>
            </div>

            {/* Auth Method Switcher (PIN vs OTP) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#0B2B67] uppercase font-['JetBrains_Mono']">
                  {authMethod === 'pin' ? t.pinLabel : t.otpLabel} <span className="text-[#A03800]">*</span>
                </span>
                <div className="flex items-center gap-1 bg-[#F4F6F9] p-0.5 rounded-lg border border-[#c2c7ce]">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('pin'); setErrorMessage(''); }}
                    className={`min-h-[34px] px-3 rounded text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                      authMethod === 'pin'
                        ? 'bg-[#0B2B67] text-white shadow'
                        : 'text-[#515e64] hover:text-[#0B2B67]'
                    }`}
                  >
                    {t.usePin}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('otp'); setErrorMessage(''); }}
                    className={`min-h-[34px] px-3 rounded text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                      authMethod === 'otp'
                        ? 'bg-[#0B2B67] text-white shadow'
                        : 'text-[#515e64] hover:text-[#0B2B67]'
                    }`}
                  >
                    {t.useOtp}
                  </button>
                </div>
              </div>

              {/* Input Field 2A: Quick 4-Digit PIN */}
              {authMethod === 'pin' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2B67]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    id="conductor-pin-input"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    required
                    className="w-full min-h-[52px] pl-11 pr-4 py-3 bg-[#F4F6F9] border-2 border-[#c2c7ce] focus:border-[#0B2B67] rounded-xl text-xl sm:text-2xl font-black font-['JetBrains_Mono'] tracking-[0.3em] text-[#191c1e] placeholder-[#8f9bb3] focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Input Field 2B: 6-Digit Mobile OTP */}
              {authMethod === 'otp' && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B2B67]">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <input
                      id="conductor-otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder={otpSent ? '582910' : '------'}
                      disabled={!otpSent}
                      className="w-full min-h-[52px] pl-11 pr-3 py-3 bg-[#F4F6F9] border-2 border-[#c2c7ce] focus:border-[#0B2B67] rounded-xl text-base font-bold font-['JetBrains_Mono'] tracking-widest text-[#191c1e] focus:outline-none focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      setOtp('582910'); // Auto-fill mock OTP for fast conductor field entry
                    }}
                    className="min-h-[52px] px-4 rounded-xl bg-[#0B2B67] text-white font-bold text-xs font-['JetBrains_Mono'] shrink-0 hover:bg-[#071c45] active:scale-95 transition-all flex items-center justify-center"
                  >
                    {otpSent ? (isMr ? 'पुन्हा पाठवा (54s)' : 'Resend (54s)') : t.getOtp}
                  </button>
                </div>
              )}
            </div>

            {/* Secondary Dropdown: Select Today's Bus / Route ID */}
            <div>
              <label className="block text-xs font-black text-[#0B2B67] uppercase font-['JetBrains_Mono'] tracking-wider mb-1.5">
                {t.routeLabel} <span className="text-[#A03800]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A03800]">
                  <Bus className="w-5 h-5" />
                </div>
                <select
                  id="conductor-route-select"
                  value={selectedRouteKey}
                  onChange={(e) => setSelectedRouteKey(e.target.value)}
                  className="w-full min-h-[52px] pl-11 pr-8 py-3 bg-[#F4F6F9] border-2 border-[#c2c7ce] focus:border-[#0B2B67] rounded-xl text-xs sm:text-sm font-bold text-[#191c1e] focus:outline-none focus:bg-white transition-all cursor-pointer"
                >
                  {ASSIGNED_BUS_ROUTES.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.busNumber} | {route.origin} ➔ {route.destination} ({route.departureTime} - {route.busType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Preview Card of Selected Route */}
              <div className="mt-2.5 p-3 rounded-xl bg-[#F4F6F9] border border-[#e2e8f0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-[#0B2B67]">{selectedRouteObj.busType}</span>
                </div>
                <div className="text-[11px] font-['JetBrains_Mono'] text-[#A03800] font-bold">
                  Trip ID: {selectedRouteObj.tripCode}
                </div>
              </div>
            </div>

            {/* Action Button: Large Rust Orange Button "Start Duty Shift" */}
            <button
              id="conductor-start-duty-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[54px] mt-3 py-3 px-6 rounded-xl bg-[#A03800] hover:bg-[#852e00] active:scale-[0.98] text-white font-extrabold text-base tracking-wide shadow-lg border-2 border-[#852e00] transition-all flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{isMr ? 'ड्युटी सुरू होत आहे...' : 'Initializing Shift & Syncing Manifest...'}</span>
                </>
              ) : (
                <>
                  <span>{t.startDuty}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          {/* Hardware Security Tag */}
          <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#515e64]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.deviceEncrypted}</span>
            </div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-[#0B2B67] hover:underline font-bold"
              >
                {isMr ? '← मुख्य मेनू' : '← Back'}
              </button>
            )}
          </div>

        </div>
      </main>

      {/* QUICK ACTION / EMERGENCY FOOTER (48px+ Tap Targets) */}
      <footer className="w-full max-w-xl mx-auto mt-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Quick Action 1: Issue Emergency Offline Tickets */}
          <button
            id="conductor-offline-ticket-btn"
            type="button"
            onClick={onEmergencyOfflineIssue}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-[#0B2B67] font-bold text-xs sm:text-sm border-2 border-[#0B2B67] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <FileText className="w-4 h-4 text-[#A03800] shrink-0" />
            <span className="truncate">{t.offlineTickets}</span>
          </button>

          {/* Quick Action 2: Depot Helpline Quick Call Button */}
          <button
            id="conductor-depot-helpline-btn"
            type="button"
            onClick={() => setShowHelplineModal(true)}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-[#0B2B67] hover:bg-[#071c45] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <PhoneCall className="w-4 h-4 text-[#ffb59a] shrink-0" />
            <span className="truncate">{t.depotHelpline} (1800 22 1250)</span>
          </button>

        </div>
      </footer>

      {/* DEPOT HELPLINE MODAL */}
      {showHelplineModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] font-['Inter']">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-[#A03800]" />
                <h3 className="font-bold text-base text-[#0B2B67]">
                  {isMr ? 'आगार नियंत्रण कक्ष हेल्पलाईन' : 'Depot Operations Control Room'}
                </h3>
              </div>
              <button 
                onClick={() => setShowHelplineModal(false)}
                className="text-[#515e64] hover:text-[#191c1e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#515e64]">
              <p className="font-medium text-[#191c1e]">
                {isMr 
                  ? 'आपत्कालीन मदत, ईटीआयएम मशीन तांत्रिक बिघाड किंवा रोख रक्कम नोंदणीसाठी थेट संपर्क करा:' 
                  : 'For ETIM paper roll replenishment, offline sync errors, or emergency passenger transfers:'}
              </p>

              <div className="p-3 bg-[#F4F6F9] rounded-xl border border-[#e2e8f0] space-y-2 font-['JetBrains_Mono']">
                <div className="flex items-center justify-between">
                  <span className="text-[#191c1e] font-semibold">{isMr ? 'स्वारगेट आगार मास्टर:' : 'Swargate Depot Master:'}</span>
                  <a href="tel:02024440401" className="font-bold text-[#A03800] hover:underline">020-2444 0401</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#191c1e] font-semibold">{isMr ? 'मध्यवर्ती कंट्रोल रूम:' : 'Central Traffic Control:'}</span>
                  <a href="tel:02223071524" className="font-bold text-[#0B2B67] hover:underline">022-2307 1524</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#191c1e] font-semibold">{isMr ? 'ईटीआयएम सपोर्ट टोल-फ्री:' : 'ETIM Helpdesk (Toll Free):'}</span>
                  <a href="tel:1800221250" className="font-bold text-emerald-700 hover:underline">1800 22 1250</a>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                {isMr 
                  ? 'टीप: नेटवर्क नसतानाही ईटीआयएम मशीन ऑफलाईन मोडमध्ये ३०० तिकिटांपर्यंत सुरक्षित डेटा सेव्ह करू शकते.'
                  : 'Notice: If connectivity drops on ghat sections, ETIM local cache retains up to 300 offline ticket scans safely.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelplineModal(false)}
              className="w-full mt-4 min-h-[44px] rounded-xl bg-[#0B2B67] text-white text-xs font-bold hover:bg-[#071c45]"
            >
              {isMr ? 'बंद करा' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
