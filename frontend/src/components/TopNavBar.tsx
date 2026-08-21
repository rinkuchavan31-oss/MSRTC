import React, { useState } from 'react';
import { Language, ScreenView, UserRole } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Bell, 
  UserCircle, 
  Globe, 
  Check, 
  LogOut, 
  ShieldCheck, 
  QrCode, 
  LayoutDashboard,
  Ticket,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface TopNavBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
  unreadNotificationsCount: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentScreen,
  onNavigate,
  language,
  onLanguageChange,
  userRole,
  onRoleChange,
  isLoggedIn,
  onToggleLogin,
  unreadNotificationsCount,
}) => {
  const t = getTranslation(language);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifications = [
    { id: '1', title: 'Platform Update: Swargate Platform 3', text: 'Shivneri bus MH 12 FC 4589 has arrived at Platform 3 for boarding.', time: '2m ago', unread: true },
    { id: '2', title: 'Monsoon Alert: Konkan Ghats', text: 'Rainfall speeds restricted on Poladpur ghat. Check updated ETA.', time: '1h ago', unread: false },
    { id: '3', title: 'Mahila Samman Yojana 50% Active', text: '50% discount automatically applied to all female passengers in Maharashtra.', time: '1d ago', unread: false },
  ];

  return (
    <>
      <header id="top-nav-bar" className="bg-[#00337c] text-white shadow-md sticky top-0 z-50 w-full transition-all">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-3.5 max-w-[1200px] mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button 
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#a43700] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-[#cd4700] transition-colors">
                ST
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white leading-tight font-['Inter']">
                  {t.brandName}
                </span>
                <span className="text-[10px] text-white/70 font-medium tracking-wide uppercase font-['JetBrains_Mono'] hidden sm:inline">
                  Govt. of Maharashtra Transit
                </span>
              </div>
            </button>

            {/* Role indicator badge */}
            <div className="relative ml-2">
              <button
                id="role-switcher-btn"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="hidden lg:flex items-center gap-1.5 bg-[#001945]/80 hover:bg-[#00429c] text-white/90 text-xs px-2.5 py-1 rounded-full border border-white/20 transition-all"
                title="Switch persona / role"
              >
                <span className="w-2 h-2 rounded-full bg-[#ffb59a] animate-pulse"></span>
                <span className="capitalize font-medium">
                  {userRole === 'passenger' ? 'Passenger View' : userRole === 'conductor' ? 'Conductor Mode' : userRole === 'driver' ? 'Driver Telemetry' : 'Depot Admin'}
                </span>
              </button>

              {showRoleMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-[#191c1e] rounded-xl shadow-xl border border-[#e0e3e5] p-2 z-50 font-['Inter']">
                  <div className="text-[11px] font-bold text-[#5a4138] px-3 py-1 uppercase tracking-wider font-['JetBrains_Mono'] flex items-center justify-between">
                    <span>Switch App Role</span>
                    <span className="text-[#a43700] text-[10px]">Staff Portal</span>
                  </div>
                  <button
                    onClick={() => { onRoleChange('passenger'); setShowRoleMenu(false); onNavigate('home'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] ${userRole === 'passenger' ? 'bg-[#ffdbcf] text-[#a43700] font-semibold' : ''}`}
                  >
                    <span>Passenger (Default PWA)</span>
                    {userRole === 'passenger' && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setShowRoleMenu(false); onNavigate('staff_auth'); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] text-[#0B2B67] font-semibold"
                  >
                    <span>Staff Portal (Login / Register)</span>
                    <ShieldCheck className="w-4 h-4 text-[#a43700]" />
                  </button>
                  <button
                    onClick={() => { setShowRoleMenu(false); onNavigate('conductor_login'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] ${currentScreen === 'conductor_login' ? 'bg-[#ffdbcf] text-[#a43700] font-semibold' : 'text-[#0B2B67]'}`}
                  >
                    <span>📱 Conductor Terminal Sign-In</span>
                    <QrCode className="w-4 h-4 text-[#a43700]" />
                  </button>
                  <button
                    onClick={() => { onRoleChange('conductor'); setShowRoleMenu(false); onNavigate('conductor_portal'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] ${userRole === 'conductor' && currentScreen !== 'conductor_login' ? 'bg-[#ffdbcf] text-[#a43700] font-semibold' : ''}`}
                  >
                    <span>Bus Conductor Scanner (Active)</span>
                    {userRole === 'conductor' && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { onRoleChange('admin'); setShowRoleMenu(false); onNavigate('admin_portal'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] ${userRole === 'admin' ? 'bg-[#ffdbcf] text-[#a43700] font-semibold' : ''}`}
                  >
                    <span>Depot Admin Console</span>
                    {userRole === 'admin' && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { onRoleChange('driver'); setShowRoleMenu(false); onNavigate('driver_portal'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[#f2f4f6] ${userRole === 'driver' ? 'bg-[#ffdbcf] text-[#a43700] font-semibold' : ''}`}
                  >
                    <span>Driver Telemetry & Log</span>
                    {userRole === 'driver' && <Check className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5">
            <button
              id="nav-my-bookings-btn"
              onClick={() => onNavigate('my_bookings')}
              className={`font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-2.5 rounded transition-all ${
                currentScreen === 'my_bookings' || currentScreen === 'ticket_journey'
                  ? 'bg-[#00429c] text-white font-bold border-b-2 border-[#ffb59a]'
                  : 'text-white/80 hover:bg-[#00429c]/60 hover:text-white'
              }`}
            >
              {t.myBookings}
            </button>

            <button
              id="nav-help-center-btn"
              onClick={() => onNavigate('help_center')}
              className={`font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-2.5 rounded transition-all ${
                currentScreen === 'help_center'
                  ? 'bg-[#00429c] text-white font-bold border-b-2 border-[#ffb59a]'
                  : 'text-white/80 hover:bg-[#00429c]/60 hover:text-white'
              }`}
            >
              {t.helpCenter}
            </button>

            <button
              id="nav-staff-portal-btn"
              onClick={() => onNavigate('staff_auth')}
              className={`font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-2.5 rounded transition-all flex items-center gap-1.5 ${
                currentScreen === 'staff_auth'
                  ? 'bg-[#A03800] text-white font-bold'
                  : 'text-white/90 bg-[#001945]/70 hover:bg-[#00429c] border border-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffb59a]" />
              <span>Staff Portal</span>
            </button>

            {userRole === 'conductor' && (
              <button
                onClick={() => onNavigate('conductor_portal')}
                className="font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-3 rounded bg-[#a43700] text-white flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                {t.conductorPortal}
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => onNavigate('admin_portal')}
                className="font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-3 rounded bg-[#a43700] text-white flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {t.adminPortal}
              </button>
            )}

            {userRole === 'driver' && (
              <button
                onClick={() => onNavigate('driver_portal')}
                className="font-medium text-xs font-['JetBrains_Mono'] py-1.5 px-3 rounded bg-[#a43700] text-white flex items-center gap-1.5"
              >
                <span>Driver Telemetry</span>
              </button>
            )}
          </nav>

          {/* Actions: Language, Notification, Profile, Login */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-white/85 font-medium text-xs font-['JetBrains_Mono'] hover:text-white py-1.5 px-2 rounded hover:bg-[#00429c] transition-colors"
                title="Change language / भाषा बदला"
              >
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <span className="hidden sm:inline">
                  {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
                </span>
                <span className="sm:hidden uppercase">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-[#191c1e] rounded-xl shadow-xl border border-[#e0e3e5] py-1.5 z-50 font-['Inter']">
                  <div className="text-[10px] font-bold text-[#5a4138] px-3 py-1 uppercase tracking-wider font-['JetBrains_Mono']">
                    Select Language
                  </div>
                  <button
                    onClick={() => { onLanguageChange('mr'); setShowLangMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#f2f4f6] ${language === 'mr' ? 'text-[#a43700] font-bold bg-[#ffdbcf]/50' : ''}`}
                  >
                    <span>मराठी (Marathi)</span>
                    {language === 'mr' && <Check className="w-4 h-4 text-[#a43700]" />}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('en'); setShowLangMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#f2f4f6] ${language === 'en' ? 'text-[#a43700] font-bold bg-[#ffdbcf]/50' : ''}`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check className="w-4 h-4 text-[#a43700]" />}
                  </button>
                  <button
                    onClick={() => { onLanguageChange('hi'); setShowLangMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#f2f4f6] ${language === 'hi' ? 'text-[#a43700] font-bold bg-[#ffdbcf]/50' : ''}`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <Check className="w-4 h-4 text-[#a43700]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotificationModal(!showNotificationModal)}
                aria-label="Notifications"
                className="p-2 text-white hover:bg-[#00429c] rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#cd4700] rounded-full ring-2 ring-[#00337c] animate-ping"></span>
                )}
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#a43700] rounded-full"></span>
                )}
              </button>

              {showNotificationModal && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#191c1e] rounded-xl shadow-2xl border border-[#e0e3e5] p-4 z-50 font-['Inter']">
                  <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-2 mb-3">
                    <h4 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#a43700]" /> Transit Alerts & Notifications
                    </h4>
                    <span className="text-[11px] text-[#515e64] font-['JetBrains_Mono']">Live Feed</span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                    {notifications.map((item) => (
                      <div key={item.id} className={`p-2.5 rounded-lg border text-xs ${item.unread ? 'bg-[#ffdbcf]/30 border-[#ffb59a]' : 'bg-[#f8f9fb] border-[#e0e3e5]'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#191c1e]">{item.title}</span>
                          <span className="text-[10px] text-[#515e64] font-['JetBrains_Mono']">{item.time}</span>
                        </div>
                        <p className="text-[#5a4138] leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowNotificationModal(false)}
                    className="w-full mt-3 py-1.5 text-xs text-[#00337c] font-semibold hover:bg-[#f2f4f6] rounded text-center"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / Modal */}
            <div className="relative">
              <button
                id="profile-account-btn"
                onClick={() => setShowProfileModal(!showProfileModal)}
                aria-label="Account profile"
                className="p-2 text-white hover:bg-[#00429c] rounded-full transition-colors"
              >
                <UserCircle className="w-5 h-5" />
              </button>

              {showProfileModal && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-[#191c1e] rounded-xl shadow-xl border border-[#e0e3e5] p-4 z-50 font-['Inter']">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#e0e3e5]">
                    <div className="w-10 h-10 rounded-full bg-[#d9e2ff] text-[#00337c] flex items-center justify-center font-bold text-sm">
                      {isLoggedIn ? 'AS' : 'G'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#191c1e]">
                        {isLoggedIn ? 'Aniket Shinde' : 'Guest Commuter'}
                      </p>
                      <p className="text-[11px] text-[#515e64]">
                        {isLoggedIn ? '+91 98220 12345' : 'Maharashtra State Transit'}
                      </p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => { onNavigate('my_bookings'); setShowProfileModal(false); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-[#f2f4f6] text-[#191c1e]"
                    >
                      <Ticket className="w-4 h-4 text-[#00337c]" />
                      <span>{t.myBookings}</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('staff_auth'); setShowProfileModal(false); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-[#ffdbcf]/40 text-[#A03800] font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#A03800]" />
                      <span>Staff Portal (Sign In / Request)</span>
                    </button>
                    <button
                      onClick={() => { onNavigate('help_center'); setShowProfileModal(false); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-[#f2f4f6] text-[#191c1e]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#00337c]" />
                      <span>{t.helpCenter}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#e0e3e5]">
                    <button
                      onClick={() => { onToggleLogin(); setShowProfileModal(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e]"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#a43700]" />
                      <span>{isLoggedIn ? t.logout : t.login}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login / Auth Button */}
            <button
              id="header-login-btn"
              onClick={onToggleLogin}
              className="bg-[#a43700] hover:bg-[#cd4700] active:scale-95 text-white px-5 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              {isLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aniket</span>
                </>
              ) : (
                <span>{t.login}</span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white md:hidden hover:bg-[#00429c] rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001945] border-t border-[#00429c] px-4 py-4 space-y-3 font-['Inter']">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
              <button
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                className={`py-2 px-3 text-xs font-semibold rounded text-left ${currentScreen === 'home' ? 'bg-[#00429c] text-white' : 'text-white/80'}`}
              >
                🏠 {t.bookAJourney}
              </button>
              <button
                onClick={() => { onNavigate('my_bookings'); setMobileMenuOpen(false); }}
                className={`py-2 px-3 text-xs font-semibold rounded text-left ${currentScreen === 'my_bookings' ? 'bg-[#00429c] text-white' : 'text-white/80'}`}
              >
                🎫 {t.myBookings}
              </button>
              <button
                onClick={() => { onNavigate('help_center'); setMobileMenuOpen(false); }}
                className={`py-2 px-3 text-xs font-semibold rounded text-left ${currentScreen === 'help_center' ? 'bg-[#00429c] text-white' : 'text-white/80'}`}
              >
                ❓ {t.helpCenter}
              </button>
              <button
                onClick={() => { onNavigate('conductor_login'); setMobileMenuOpen(false); }}
                className="py-2 px-3 text-xs font-semibold rounded text-left bg-[#A03800] text-white col-span-2 flex items-center justify-between"
              >
                <span>📱 Conductor Terminal Sign-In</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">v2.4</span>
              </button>
              <button
                onClick={() => { onNavigate('conductor_portal'); onRoleChange('conductor'); setMobileMenuOpen(false); }}
                className="py-2 px-3 text-xs font-semibold rounded text-left text-white/80"
              >
                🎫 Conductor Manifest
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-white/70 pt-1">
              <span>Language:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => { onLanguageChange('mr'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1 rounded text-xs ${language === 'mr' ? 'bg-[#a43700] text-white' : 'text-white/80'}`}
                >
                  मराठी
                </button>
                <button 
                  onClick={() => { onLanguageChange('en'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1 rounded text-xs ${language === 'en' ? 'bg-[#a43700] text-white' : 'text-white/80'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { onLanguageChange('hi'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1 rounded text-xs ${language === 'hi' ? 'bg-[#a43700] text-white' : 'text-white/80'}`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
