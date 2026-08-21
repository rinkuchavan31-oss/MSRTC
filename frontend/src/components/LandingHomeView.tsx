import React from 'react';
import { Language, BusTrip, Booking } from '../types';
import { getTranslation } from '../locales/translations';
import { SearchWidget } from './SearchWidget';
import { FrequentRoutes } from './FrequentRoutes';
import { RecentBookingsCard } from './RecentBookingsCard';
import { MonsoonAdvisory } from './MonsoonAdvisory';

interface LandingHomeViewProps {
  language: Language;
  fromLocation: string;
  toLocation: string;
  travelDate: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onSearch: () => void;
  onSelectTrip: (trip: BusTrip) => void;
  onViewAllRoutes: () => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
  trips: BusTrip[];
}

export const LandingHomeView: React.FC<LandingHomeViewProps> = ({
  language,
  fromLocation,
  toLocation,
  travelDate,
  onFromChange,
  onToChange,
  onDateChange,
  onSearch,
  onSelectTrip,
  onViewAllRoutes,
  isLoggedIn,
  onToggleLogin,
  bookings,
  onViewBooking,
  trips,
}) => {
  const t = getTranslation(language);

  return (
    <div id="landing-home-page" className="w-full font-['Inter']">
      
      {/* 1. Hero Section with Background Image */}
      <section className="relative w-full min-h-[460px] md:min-h-[500px] flex flex-col justify-between py-12 md:py-16 px-4 md:px-8 bg-cover bg-center overflow-hidden">
        
        {/* Background Bus Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDS4cg762_iimaoCwsa0f7pQpqRFFHtJZjYWwgfBB4z3z0SqiHUMPKZYykP3bRyU6jtZPb5p8by8foCpoJrygi-eRiHbLSgduzPEFK_bgcObsmauYHxCNoKBm1QHipqHA5egnv2flRegIchJIIQwdGgXOX70-X0bjNTmIRs_q00TTx08YVEcCmgqWZVeS1Kxt0VZXzswr4iGdg8_nTmgcXJxMWRaCOT7ZXC4u4fjqsERnn3dFH8PHBl')`,
          }}
        >
          {/* Subtle dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#001945]/85 via-[#001945]/60 to-[#001945]/90"></div>
        </div>

        {/* Hero Title and Subhead */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full text-center space-y-4 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#a43700] text-white px-3.5 py-1 rounded-full text-xs font-['JetBrains_Mono'] font-bold shadow-md animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>NEXTGEN MSRTC TRANSIT NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto font-['Inter']">
            {t.tagline}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.subTagline}
          </p>
        </div>

        {/* Search Widget Container */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full mt-4">
          <SearchWidget
            fromLocation={fromLocation}
            toLocation={toLocation}
            travelDate={travelDate}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onDateChange={onDateChange}
            onSearch={onSearch}
            language={language}
          />
        </div>
      </section>

      {/* 2. Main Bento Grid Section: Frequent Routes + Recent Bookings + Monsoon Advisory */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12">
        
        {/* Bento Row: Frequent Routes (Left 7 cols) + Recent Bookings (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Frequent Routes */}
          <div className="lg:col-span-7">
            <FrequentRoutes
              onSelectRoute={onSelectTrip}
              onViewAll={onViewAllRoutes}
              language={language}
              trips={trips}
            />
          </div>

          {/* Recent Bookings / History */}
          <div className="lg:col-span-5">
            <RecentBookingsCard
              isLoggedIn={isLoggedIn}
              onLogin={onToggleLogin}
              bookings={bookings}
              onViewBooking={onViewBooking}
              language={language}
            />
          </div>

        </div>

        {/* Informational Banner: Monsoon Advisory */}
        <div>
          <MonsoonAdvisory language={language} />
        </div>

      </section>

    </div>
  );
};
