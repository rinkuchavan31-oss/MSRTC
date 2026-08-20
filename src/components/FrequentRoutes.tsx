import React from 'react';
import { Language, BusTrip } from '../types';
import { getTranslation } from '../locales/translations';
import { ArrowRight, MoveRight } from 'lucide-react';

interface FrequentRoutesProps {
  onSelectRoute: (trip: BusTrip) => void;
  onViewAll: () => void;
  language: Language;
  trips: BusTrip[];
}

export const FrequentRoutes: React.FC<FrequentRoutesProps> = ({
  onSelectRoute,
  onViewAll,
  language,
  trips,
}) => {
  const t = getTranslation(language);

  // Take the first 2 or 4 trips for the cards
  const routeCards = [
    {
      trip: trips[0], // Pune -> Mumbai Shivneri
      badgeText: 'Shivneri',
      badgeBg: 'bg-[#00337c]',
      badgeColor: 'text-white',
      nextTime: 'Next: 10:30 AM',
      from: 'Pune',
      to: 'Mumbai',
      fare: '₹550',
    },
    {
      trip: trips[4] || trips[1], // Nashik -> Aurangabad
      badgeText: 'Lal Pari',
      badgeBg: 'bg-[#ba1a1a]',
      badgeColor: 'text-white',
      nextTime: 'Next: 11:15 AM',
      from: 'Nashik',
      to: 'Aurangabad',
      fare: '₹280',
    },
    {
      trip: trips[5] || trips[2], // Kolhapur -> Pune
      badgeText: 'Shivshahi',
      badgeBg: 'bg-[#2b5bb5]',
      badgeColor: 'text-white',
      nextTime: 'Next: 06:00 AM',
      from: 'Kolhapur',
      to: 'Pune',
      fare: '₹420',
    },
    {
      trip: trips[6] || trips[3], // Nagpur -> Amravati
      badgeText: 'Express',
      badgeBg: 'bg-[#a43700]',
      badgeColor: 'text-white',
      nextTime: 'Next: 07:30 AM',
      from: 'Nagpur',
      to: 'Amravati',
      fare: '₹210',
    },
  ];

  return (
    <div id="frequent-routes-section" className="font-['Inter']">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#191c1e] tracking-tight">
          {t.frequentRoutes}
        </h2>
        <button
          onClick={onViewAll}
          className="text-[#a43700] hover:text-[#cd4700] font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1 transition-colors group"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {routeCards.slice(0, 2).map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRoute(item.trip)}
            className="bg-white rounded-xl p-5 border border-[#e3bfb2] ambient-shadow hover:ambient-shadow-active transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`${item.badgeBg} ${item.badgeColor} px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-semibold`}>
                {item.badgeText}
              </span>
              <span className="text-[#5a4138] font-['JetBrains_Mono'] text-xs">
                {item.nextTime}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-[#191c1e] group-hover:text-[#a43700] transition-colors">
                {item.from}
              </div>
              <MoveRight className="w-5 h-5 text-[#8f7066]/60 group-hover:translate-x-1 group-hover:text-[#a43700] transition-all" />
              <div className="text-lg font-bold text-[#191c1e] group-hover:text-[#a43700] transition-colors">
                {item.to}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
              <div className="text-[#a43700] font-bold text-xl font-['Inter']">
                {item.fare}
              </div>
              <button 
                type="button"
                className="text-[#00337c] font-['JetBrains_Mono'] text-xs font-semibold hover:underline"
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
