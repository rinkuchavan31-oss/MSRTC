import React, { useState } from 'react';
import { StaffRole, Language } from '../types';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  Phone, 
  CheckCircle2, 
  KeyRound, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  Bus,
  Check,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  X
} from 'lucide-react';

interface StaffPortalAuthViewProps {
  language: Language;
  onLoginSuccess: (role: StaffRole, staffInfo: { name: string; employeeId: string; depot: string }) => void;
  onBackToHome: () => void;
}

export const StaffPortalAuthView: React.FC<StaffPortalAuthViewProps> = ({
  language,
  onLoginSuccess,
  onBackToHome,
}) => {
  // Tabs & Mode State
  const [activeRole, setActiveRole] = useState<StaffRole>('admin');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [authType, setAuthType] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sign Up / Access Request State
  const [regEmpId, setRegEmpId] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regDepot, setRegDepot] = useState('Swargate, Pune');
  const [regMobile, setRegMobile] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Depot Options
  const DEPOTS = [
    { id: 'pune-swargate', name: 'Swargate, Pune (पुणे स्वारगेट)', code: 'SWG-01' },
    { id: 'pune-shivajinagar', name: 'Shivajinagar, Pune (शिवाजीनगर)', code: 'SVN-02' },
    { id: 'mumbai-dadar', name: 'Dadar Central, Mumbai (दादर)', code: 'DDR-01' },
    { id: 'mumbai-borivali', name: 'Borivali Sukurwadi, Mumbai (बोरिवली)', code: 'BVI-02' },
    { id: 'mumbai-thane', name: 'Thane Central, CBS (ठाणे)', code: 'THN-01' },
    { id: 'nashik-cbs', name: 'Nashik CBS (नाशिक मध्यवर्ती)', code: 'NSK-01' },
    { id: 'aurangabad-cbs', name: 'Chhatrapati Sambhajinagar (औरंगाबाद)', code: 'CSN-01' },
    { id: 'kolhapur-cbs', name: 'Kolhapur Central Bus Stand (कोल्हापूर)', code: 'KLP-01' },
    { id: 'solapur-cbs', name: 'Solapur Central Depot (सोलापूर)', code: 'SLP-01' },
    { id: 'nagpur-cbs', name: 'Nagpur Ganeshpeth Central (नागपूर)', code: 'NGP-01' },
    { id: 'ratnagiri-cbs', name: 'Ratnagiri Depot (रत्नागिरी)', code: 'RTG-01' },
  ];

  // Role Metadata config
  const ROLE_CONFIG: Record<StaffRole, {
    label: string;
    marathiLabel: string;
    badgeText: string;
    clearance: string;
    demoEmpId: string;
    demoName: string;
    demoDepot: string;
    icon: string;
    tagline: string;
  }> = {
    admin: {
      label: 'Admin Portal',
      marathiLabel: 'आगार प्रशासक',
      badgeText: 'Depot Fleet Manager',
      clearance: 'Security Clearance Level 4: Fleet Scheduling, Surge Tariffs & Roster Ops',
      demoEmpId: 'ADM-SWG-9042',
      demoName: 'Rajesh Deshmukh (Fleet Controller)',
      demoDepot: 'Swargate, Pune',
      icon: '🛡️',
      tagline: 'Manage fleet load factors, dynamic holiday tariffs, and depot scheduling.',
    },
    conductor: {
      label: 'Conductor',
      marathiLabel: 'वाहक (कंडक्टर)',
      badgeText: 'Electronic Ticket Machine (ETIM)',
      clearance: 'Security Clearance Level 2: Passenger Manifest, Cryptographic QR Scan & Spot Issuance',
      demoEmpId: 'CND-DDR-4418',
      demoName: 'Sunil Patil (ETIM Badge #4418)',
      demoDepot: 'Dadar Central, Mumbai',
      icon: '📱',
      tagline: 'Validate e-tickets offline, manage live passenger manifest, and issue cash tickets.',
    },
    driver: {
      label: 'Driver',
      marathiLabel: 'चालक (ड्रायव्हर)',
      badgeText: 'Fleet Operations & Telemetry',
      clearance: 'Security Clearance Level 1: Route Waypoints, Speed Telemetry & Pre-trip Fitness',
      demoEmpId: 'DRV-NSK-8821',
      demoName: 'Santosh Kadam (Heavy Passenger Vehicle #8821)',
      demoDepot: 'Nashik CBS',
      icon: '🚌',
      tagline: 'Access digital trip sheet, real-time expressway waypoints, and speed governor alerts.',
    },
  };

  // Quick Demo Auto-fill
  const handleQuickDemoFill = (role: StaffRole) => {
    setActiveRole(role);
    setAuthMode('signin');
    setEmployeeId(ROLE_CONFIG[role].demoEmpId);
    setPassword('msrtc@2026');
    setErrorMsg('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!employeeId.trim()) {
      setErrorMsg('Please enter your Employee ID or Badge Number.');
      return;
    }

    if (authType === 'password' && !password.trim()) {
      setErrorMsg('Please enter your portal password.');
      return;
    }

    if (authType === 'otp' && (!otpSent || !otpCode.trim())) {
      setErrorMsg('Please request and enter the 6-digit OTP sent to your registered mobile.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const activeMeta = ROLE_CONFIG[activeRole];
      onLoginSuccess(activeRole, {
        name: activeMeta.demoName,
        employeeId: employeeId || activeMeta.demoEmpId,
        depot: activeMeta.demoDepot,
      });
    }, 700);
  };

  // Handle Request Access / Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regEmpId.trim() || !regFullName.trim() || !regMobile.trim()) {
      setErrorMsg('Please complete all required onboarding fields.');
      return;
    }

    if (regMobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for OTP verification.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const generatedId = `REQ-MSRTC-${Math.floor(100000 + Math.random() * 900000)}`;
      setRequestId(generatedId);
      setRequestSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F4F6F9] relative flex items-center justify-center p-4 sm:p-6 md:p-10 font-['Inter'] selection:bg-[#ffb59a] selection:text-[#a43700] overflow-hidden">
      
      {/* Background Transit Watermark & Line Art */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
          <pattern id="transit-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0B2B67" strokeWidth="1" />
            <circle cx="80" cy="0" r="3" fill="#A03800" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#transit-grid)" />
          {/* Subtle bus silhouette outline */}
          <path d="M100,500 C150,450 300,450 350,500 L850,500 C900,500 950,550 950,650 L950,750 L100,750 Z" fill="none" stroke="#0B2B67" strokeWidth="4" />
        </svg>
      </div>

      {/* Main Dual-Column Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ================= LEFT COLUMN: HERO BRANDING SECTION ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B2B67] via-[#092353] to-[#04112c] text-white rounded-2xl p-7 sm:p-9 shadow-2xl flex flex-col justify-between relative overflow-hidden border border-[#1b3d80]/50">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#A03800]/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#194bb5]/30 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#A03800] text-white flex items-center justify-center font-black text-2xl shadow-lg border border-white/20">
                ST
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  MSRTC NextGen
                </h1>
                <p className="text-[11px] text-white/70 font-medium tracking-wide uppercase font-['JetBrains_Mono']">
                  महाराष्ट्र राज्य मार्ग परिवहन महामंडळ
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-[#ffb59a] font-medium backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ffb59a] animate-pulse"></span>
              <span>Staff & Fleet Operations Portal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
              Powering Maharashtra's Transit Ops
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              Unified digital operations console for Depot Controllers, Onboard Conductors, and Highway Drivers across 250+ depots.
            </p>
          </div>

          {/* Vector Illustration of Modern Shivneri Bus */}
          <div className="relative z-10 my-6 py-4 px-2 flex flex-col items-center">
            <div className="w-full max-w-[340px] bg-gradient-to-b from-white/10 to-white/5 rounded-2xl p-4 border border-white/15 backdrop-blur-md shadow-inner">
              
              {/* Bus Vector Art */}
              <svg viewBox="0 0 380 180" className="w-full h-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Road Line */}
                <line x1="10" y1="165" x2="370" y2="165" stroke="#ffb59a" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                
                {/* Aerodynamic Bus Body */}
                <path d="M40,140 L340,140 C355,140 365,130 365,115 L360,70 C358,48 340,35 315,35 L90,35 C60,35 45,55 40,80 L35,120 C35,132 38,140 40,140 Z" fill="#0B2B67" stroke="#3b6ac4" strokeWidth="3" />
                
                {/* Shivneri Premium Red Accent Swoosh */}
                <path d="M40,105 Q180,125 363,85 L361,100 Q180,138 40,120 Z" fill="#A03800" />
                <path d="M40,122 Q180,140 358,110 L355,116 Q180,146 40,128 Z" fill="#ffb59a" opacity="0.8" />
                
                {/* Windshield & Panoramic Windows */}
                <path d="M60,45 L110,45 L105,85 L50,85 C52,65 55,50 60,45 Z" fill="#71a5de" opacity="0.85" />
                <rect x="120" y="45" width="45" height="40" rx="4" fill="#a4c8f0" opacity="0.85" />
                <rect x="175" y="45" width="45" height="40" rx="4" fill="#a4c8f0" opacity="0.85" />
                <rect x="230" y="45" width="45" height="40" rx="4" fill="#a4c8f0" opacity="0.85" />
                <rect x="285" y="45" width="55" height="40" rx="4" fill="#a4c8f0" opacity="0.85" />

                {/* Digital LED Display */}
                <rect x="120" y="38" width="160" height="6" rx="2" fill="#04112c" />
                <rect x="125" y="39.5" width="150" height="3" fill="#ffb59a" opacity="0.9" />
                <text x="145" y="42" fill="#000" fontSize="3.5" fontWeight="bold" fontFamily="monospace">PUNE ➔ MUMBAI SHIVNERI</text>

                {/* LED Headlights */}
                <path d="M38,100 L35,115 L46,115 Z" fill="#fff" />
                <circle cx="38" cy="110" r="4" fill="#ffea79" />
                {/* Tail lights */}
                <rect x="360" y="95" width="4" height="20" rx="2" fill="#ff3b30" />

                {/* Front & Rear Wheels */}
                <circle cx="95" cy="142" r="22" fill="#091428" stroke="#3b6ac4" strokeWidth="2" />
                <circle cx="95" cy="142" r="14" fill="#20293a" />
                <circle cx="95" cy="142" r="6" fill="#A03800" />

                <circle cx="300" cy="142" r="22" fill="#091428" stroke="#3b6ac4" strokeWidth="2" />
                <circle cx="300" cy="142" r="14" fill="#20293a" />
                <circle cx="300" cy="142" r="6" fill="#A03800" />

                {/* MSRTC Crest Emblem on Bus Body */}
                <circle cx="78" cy="100" r="6" fill="#fff" opacity="0.9" />
                <text x="74.5" y="102.5" fill="#A03800" fontSize="7" fontWeight="900" fontFamily="sans-serif">ST</text>
              </svg>

              {/* Fleet status tag */}
              <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-white/90 pt-1 border-t border-white/10 mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>ETIM Telemetry: Active</span>
                </span>
                <span className="text-[#ffb59a] font-bold">MH-12-FC-4589</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Trust Badges */}
          <div className="relative z-10 pt-4 border-t border-white/15 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#ffb59a] shrink-0" />
              <span>Govt. of Maharashtra Transport Dept · ISO 27001 Secure</span>
            </div>
            
            {/* Quick Demo Credentials Pill Bar */}
            <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#ffb59a] font-['JetBrains_Mono'] mb-1.5 flex items-center justify-between">
                <span>Quick Auto-Fill Test Logins:</span>
                <Sparkles className="w-3 h-3 text-[#ffb59a]" />
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium transition-colors text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('conductor')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium transition-colors text-center"
                >
                  Conductor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('driver')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium transition-colors text-center"
                >
                  Driver
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: AUTHENTICATION CARD ================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-6 sm:p-8 flex flex-col justify-between relative">
          
          <div>
            {/* 1. Segmented Role Switcher Tab Control */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-[#5a4138] uppercase tracking-wider font-['JetBrains_Mono'] mb-2 flex items-center justify-between">
                <span>Select Operational Role</span>
                <span className="text-[#0B2B67] font-semibold">Step 1 of 2</span>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4F6F9] rounded-xl border border-[#e2e8f0]">
                {(['admin', 'conductor', 'driver'] as StaffRole[]).map((role) => {
                  const isSelected = activeRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setActiveRole(role);
                        setErrorMsg('');
                        // If empty, auto-populate placeholder hint
                        if (authMode === 'signin' && !employeeId) {
                          setEmployeeId(ROLE_CONFIG[role].demoEmpId);
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-[#0B2B67] text-white shadow-md' 
                          : 'text-[#515e64] hover:text-[#0B2B67] hover:bg-white/60'
                      }`}
                    >
                      <span className="text-sm">{ROLE_CONFIG[role].icon}</span>
                      <span className="truncate">{ROLE_CONFIG[role].label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Sub-Toggle: Sign In vs Request Access / Register */}
            <div className="flex border-b border-[#e2e8f0] mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`pb-3 px-4 text-sm font-bold transition-all relative ${
                  authMode === 'signin'
                    ? 'text-[#A03800] border-b-2 border-[#A03800]'
                    : 'text-[#515e64] hover:text-[#191c1e]'
                }`}
              >
                Staff Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                  setRequestSubmitted(false);
                }}
                className={`pb-3 px-4 text-sm font-bold transition-all relative ${
                  authMode === 'signup'
                    ? 'text-[#A03800] border-b-2 border-[#A03800]'
                    : 'text-[#515e64] hover:text-[#191c1e]'
                }`}
              >
                Request Access / Register
              </button>
            </div>

            {/* 3. Role Selection Indicator Banner */}
            <div className="mb-5 p-3 rounded-xl bg-[#F4F6F9] border border-[#e2e8f0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0B2B67] text-white flex items-center justify-center text-base shrink-0 mt-0.5">
                {ROLE_CONFIG[activeRole].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0B2B67] uppercase tracking-wide font-['JetBrains_Mono']">
                    {ROLE_CONFIG[activeRole].badgeText}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e2e8f0] text-[#515e64] font-medium">
                    {ROLE_CONFIG[activeRole].marathiLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#515e64] mt-0.5 leading-snug">
                  {ROLE_CONFIG[activeRole].clearance}
                </p>
                {activeRole === 'conductor' && (
                  <div className="mt-2 pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                    <span className="text-[11px] text-[#A03800] font-semibold">
                      Looking for the high-touch ETIM mobile view?
                    </span>
                    <button
                      type="button"
                      onClick={() => onLoginSuccess('conductor', { name: 'Conductor #4418', employeeId: 'CND-4418', depot: 'Swargate, Pune' })}
                      className="text-xs font-bold text-[#0B2B67] hover:underline"
                    >
                      Open Mobile Terminal →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Notification Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ================= MODE A: SIGN IN ================= */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Field 1: Employee ID / Badge Number */}
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] mb-1.5 font-['JetBrains_Mono'] uppercase tracking-wider">
                    Employee ID / Badge Number <span className="text-[#A03800]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="staff-emp-id-input"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                      placeholder={ROLE_CONFIG[activeRole].demoEmpId}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c2c7ce] rounded-xl text-sm font-['JetBrains_Mono'] text-[#191c1e] placeholder-[#8f9bb3] focus:outline-none focus:ring-2 focus:ring-[#0B2B67] focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#515e64] mt-1">
                    Format: ADM-XXX-XXXX or 6-digit Department Badge Number
                  </p>
                </div>

                {/* Auth Mode Toggle: Password vs OTP */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#191c1e]">Authentication Method</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setAuthType('password'); setErrorMsg(''); }}
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        authType === 'password' ? 'bg-[#0B2B67] text-white' : 'text-[#515e64] hover:bg-[#F4F6F9]'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthType('otp'); setErrorMsg(''); }}
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        authType === 'otp' ? 'bg-[#0B2B67] text-white' : 'text-[#515e64] hover:bg-[#F4F6F9]'
                      }`}
                    >
                      Mobile OTP
                    </button>
                  </div>
                </div>

                {/* Field 2: Password Mode */}
                {authType === 'password' && (
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] mb-1.5 font-['JetBrains_Mono'] uppercase tracking-wider">
                      Portal Password <span className="text-[#A03800]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="staff-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#c2c7ce] rounded-xl text-sm text-[#191c1e] placeholder-[#8f9bb3] focus:outline-none focus:ring-2 focus:ring-[#0B2B67] focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#515e64] hover:text-[#191c1e]"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Field 2: Mobile OTP Mode */}
                {authType === 'otp' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#191c1e] mb-1.5 font-['JetBrains_Mono'] uppercase tracking-wider">
                      6-Digit Security OTP <span className="text-[#A03800]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-otp-input"
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder={otpSent ? 'Enter 6-digit OTP (e.g. 582910)' : 'Request OTP first'}
                          disabled={!otpSent}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c2c7ce] rounded-xl text-sm font-['JetBrains_Mono'] tracking-widest text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0B2B67]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!employeeId) {
                            setErrorMsg('Please enter your Employee ID first to receive OTP.');
                            return;
                          }
                          setOtpSent(true);
                          setOtpCode('582910'); // Auto-fill mock OTP for quick demo
                          setErrorMsg('');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-[#0B2B67] hover:bg-[#071c45] text-white text-xs font-bold font-['JetBrains_Mono'] shrink-0 transition-colors"
                      >
                        {otpSent ? 'Resend (58s)' : 'Get OTP'}
                      </button>
                    </div>
                    {otpSent && (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        OTP sent to registered mobile ending with **34. Demo auto-filled: 582910
                      </p>
                    )}
                  </div>
                )}

                {/* Checkbox: Remember this device & Forgot link */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0B2B67] focus:ring-[#0B2B67] border-[#c2c7ce]"
                    />
                    <span className="text-xs text-[#515e64]">Remember this device (30 days)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#0B2B67] hover:text-[#A03800] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Action Button: Rust Orange Full Width */}
                <button
                  id="staff-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#A03800] hover:bg-[#852e00] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to {ROLE_CONFIG[activeRole].label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Helper Support Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="text-xs text-[#515e64] hover:text-[#A03800] font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#A03800]" />
                    <span>Need Help? Contact Fleet Admin Support</span>
                  </button>
                </div>

              </form>
            )}

            {/* ================= MODE B: REQUEST ACCESS / ONBOARDING ================= */}
            {authMode === 'signup' && (
              <>
                {!requestSubmitted ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    
                    {/* Field 1: Employee ID / Depot Registration ID */}
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1 font-['JetBrains_Mono'] uppercase tracking-wider">
                        Employee ID / Depot Registration ID <span className="text-[#A03800]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-reg-empid"
                          type="text"
                          value={regEmpId}
                          onChange={(e) => setRegEmpId(e.target.value.toUpperCase())}
                          placeholder="e.g. MSRTC-2026-9941"
                          required
                          className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c7ce] rounded-xl text-sm font-['JetBrains_Mono'] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0B2B67]"
                        />
                      </div>
                    </div>

                    {/* Field 2: Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1 font-['JetBrains_Mono'] uppercase tracking-wider">
                        Full Name (As per Service Record) <span className="text-[#A03800]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-reg-name"
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Sanjay Govind Deshmukh"
                          required
                          className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c7ce] rounded-xl text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0B2B67]"
                        />
                      </div>
                    </div>

                    {/* Field 3: Assigned Bus Depot Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1 font-['JetBrains_Mono'] uppercase tracking-wider">
                        Assigned Bus Depot <span className="text-[#A03800]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <select
                          id="staff-reg-depot"
                          value={regDepot}
                          onChange={(e) => setRegDepot(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c7ce] rounded-xl text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0B2B67]"
                        >
                          {DEPOTS.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name} ({d.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Field 4: Mobile Number (For OTP Verification) */}
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1 font-['JetBrains_Mono'] uppercase tracking-wider">
                        Registered Mobile Number <span className="text-[#A03800]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#515e64]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-reg-mobile"
                          type="tel"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="+91 98XXX XXXXX"
                          required
                          className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c7ce] rounded-xl text-sm font-['JetBrains_Mono'] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0B2B67]"
                        />
                      </div>
                      <p className="text-[11px] text-[#515e64] mt-1">
                        Depot supervisor approval code will be sent via SMS.
                      </p>
                    </div>

                    {/* Submit Access Request Button */}
                    <button
                      id="staff-request-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-3 py-3 px-4 rounded-xl bg-[#A03800] hover:bg-[#852e00] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Routing to Depot Supervisor...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Access Request</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </form>
                ) : (
                  /* Success Feedback Card after Access Request */
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-emerald-900">
                      Access Request Submitted!
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Your access application for <strong>{ROLE_CONFIG[activeRole].label}</strong> at <strong>{regDepot}</strong> has been routed to the Depot Manager.
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-['JetBrains_Mono'] text-emerald-900">
                      <div className="text-[10px] text-[#515e64] uppercase">Tracking Reference Ticket</div>
                      <div className="text-sm font-bold text-[#0B2B67] mt-0.5">{requestId}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setEmployeeId(regEmpId);
                        setRequestSubmitted(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#0B2B67] text-white text-xs font-bold hover:bg-[#071c45] transition-colors"
                    >
                      Proceed to Sign In
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Bottom Card Footer */}
          <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#515e64]">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-[#0B2B67] hover:underline font-medium flex items-center gap-1"
            >
              ← Back to Passenger Booking
            </button>
            <span className="font-['JetBrains_Mono'] text-[11px]">v3.4.2 · Secure SSL</span>
          </div>

        </div>

      </div>

      {/* ================= FORGOT CREDENTIALS MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#A03800]" />
                <h3 className="font-bold text-base text-[#191c1e]">Recover Staff Credentials</h3>
              </div>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                className="text-[#515e64] hover:text-[#191c1e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!forgotSent ? (
              <div className="space-y-3.5">
                <p className="text-xs text-[#515e64] leading-relaxed">
                  Enter your registered Employee Badge Number or Mobile Number. We will send a secure password reset PIN via SMS.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] mb-1 font-['JetBrains_Mono']">
                    Employee ID or Mobile
                  </label>
                  <input
                    type="text"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="e.g. ADM-SWG-9042 or 9822012345"
                    className="w-full px-3.5 py-2 border border-[#c2c7ce] rounded-xl text-sm font-['JetBrains_Mono'] focus:ring-2 focus:ring-[#0B2B67]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2.5 rounded-xl bg-[#A03800] text-white text-xs font-bold hover:bg-[#852e00] transition-colors"
                >
                  Send Recovery Link / OTP
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#191c1e]">Reset Link Dispatched</h4>
                <p className="text-xs text-[#515e64]">
                  If the Employee ID is linked to active MSRTC records, an OTP with reset instructions has been sent to the registered terminal mobile.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="px-4 py-2 bg-[#0B2B67] text-white rounded-lg text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FLEET SUPPORT MODAL ================= */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0B2B67]" />
                <h3 className="font-bold text-base text-[#191c1e]">Central Fleet Operations Support</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-[#515e64] hover:text-[#191c1e]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#515e64]">
              <p>For urgent terminal provisioning, locked ETIM machines, or depot credential re-assignments:</p>
              
              <div className="p-3 bg-[#F4F6F9] rounded-xl border border-[#e2e8f0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#191c1e]">24x7 IT Fleet Desk:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0B2B67]">1800 22 1250 (Ext 4)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#191c1e]">Central Control Room:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0B2B67]">022-2307 1524</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#191c1e]">Staff IT Portal Email:</span>
                  <span className="font-['JetBrains_Mono'] text-[#A03800]">fleetops@msrtc.gov.in</span>
                </div>
              </div>

              <p className="text-[11px] text-[#515e64]">
                Depot managers can also reset conductor ETIM PINs directly from the Depot Master console.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#0B2B67] text-white text-xs font-bold hover:bg-[#071c45]"
            >
              Close Support Desk
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
