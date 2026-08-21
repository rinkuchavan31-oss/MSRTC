import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { ArrowLeftRight, Search, MapPin, Calendar as CalendarIcon, Bus } from 'lucide-react';

interface SearchWidgetProps {
  fromLocation: string;
  toLocation: string;
  travelDate: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onSearch: () => void;
  language: Language;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  fromLocation,
  toLocation,
  travelDate,
  onFromChange,
  onToChange,
  onDateChange,
  onSearch,
  language,
}) => {
  const t = getTranslation(language);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const handleSwap = () => {
    const temp = fromLocation;
    onFromChange(toLocation);
    onToChange(temp);
  };

  const filteredFromLocations = POPULAR_LOCATIONS.filter(item => 
    item.alias.toLowerCase().includes(fromLocation.toLowerCase()) ||
    item.city.toLowerCase().includes(fromLocation.toLowerCase()) ||
    item.marathiCity.includes(fromLocation) ||
    item.marathiDepot.includes(fromLocation)
  );

  const filteredToLocations = POPULAR_LOCATIONS.filter(item => 
    item.alias.toLowerCase().includes(toLocation.toLowerCase()) ||
    item.city.toLowerCase().includes(toLocation.toLowerCase()) ||
    item.marathiCity.includes(toLocation) ||
    item.marathiDepot.includes(toLocation)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div id="search-widget-container" className="bg-white rounded-2xl p-6 md:p-8 ambient-shadow-active max-w-4xl mx-auto border border-[#e0e3e5] relative font-['Inter']">
      {/* Bus Type Badge (Decorative / Tab indicator) */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#00337c] text-white px-4 py-1 rounded-full font-['JetBrains_Mono'] text-xs font-semibold shadow-md flex items-center gap-2">
        <Bus className="w-3.5 h-3.5 text-[#ffb59a]" />
        <span>{t.bookAJourney}</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
        {/* From Field */}
        <div ref={fromRef} className="md:col-span-4 relative flex flex-col">
          <label 
            htmlFor="from-station" 
            className="font-['JetBrains_Mono'] text-xs text-[#5a4138] mb-1.5 text-left font-medium"
          >
            {t.from}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#5a4138]" />
            <input
              id="from-station"
              type="text"
              value={fromLocation}
              onChange={(e) => { onFromChange(e.target.value); setShowFromSuggestions(true); }}
              onFocus={() => setShowFromSuggestions(true)}
              placeholder="e.g. Swargate, Pune"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-[#e3bfb2] focus:border-[#00337c] focus:ring-2 focus:ring-[#00337c]/20 bg-[#f8f9fb] text-[#191c1e] text-sm font-normal outline-none transition-all"
              autoComplete="off"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showFromSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto custom-scrollbar p-1">
              <div className="text-[10px] text-[#515e64] px-2.5 py-1 font-['JetBrains_Mono'] uppercase tracking-wider font-semibold">
                Maharashtra Depots & Stops
              </div>
              {filteredFromLocations.slice(0, 7).map((loc, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onFromChange(loc.alias);
                    setShowFromSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#f2f4f6] rounded-lg flex items-center justify-between text-[#191c1e]"
                >
                  <span className="font-medium">{loc.alias}</span>
                  <span className="text-[11px] text-[#515e64]">{loc.marathiDepot}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Icon Button */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center pt-6">
          <button
            id="swap-route-btn"
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            className="p-2.5 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] active:scale-95 transition-all text-[#a43700] shadow-sm border border-[#e3bfb2]"
            title="Swap Origin and Destination"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Field */}
        <div ref={toRef} className="md:col-span-4 relative flex flex-col">
          <label 
            htmlFor="to-station" 
            className="font-['JetBrains_Mono'] text-xs text-[#5a4138] mb-1.5 text-left font-medium"
          >
            {t.to}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#5a4138]" />
            <input
              id="to-station"
              type="text"
              value={toLocation}
              onChange={(e) => { onToChange(e.target.value); setShowToSuggestions(true); }}
              onFocus={() => setShowToSuggestions(true)}
              placeholder="e.g. Dadar, Mumbai"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-[#e3bfb2] focus:border-[#00337c] focus:ring-2 focus:ring-[#00337c]/20 bg-[#f8f9fb] text-[#191c1e] text-sm font-normal outline-none transition-all"
              autoComplete="off"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showToSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto custom-scrollbar p-1">
              <div className="text-[10px] text-[#515e64] px-2.5 py-1 font-['JetBrains_Mono'] uppercase tracking-wider font-semibold">
                Maharashtra Depots & Stops
              </div>
              {filteredToLocations.slice(0, 7).map((loc, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onToChange(loc.alias);
                    setShowToSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#f2f4f6] rounded-lg flex items-center justify-between text-[#191c1e]"
                >
                  <span className="font-medium">{loc.alias}</span>
                  <span className="text-[11px] text-[#515e64]">{loc.marathiDepot}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Field */}
        <div className="md:col-span-3 relative flex flex-col">
          <label 
            htmlFor="journey-date" 
            className="font-['JetBrains_Mono'] text-xs text-[#5a4138] mb-1.5 text-left font-medium"
          >
            {t.date}
          </label>
          <div className="relative">
            <CalendarIcon className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#5a4138]" />
            <input
              id="journey-date"
              type="date"
              value={travelDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-[#e3bfb2] focus:border-[#00337c] focus:ring-2 focus:ring-[#00337c]/20 bg-[#f8f9fb] text-[#191c1e] text-sm font-normal outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Search CTA Button */}
        <div className="md:col-span-12 flex justify-center mt-3">
          <button
            id="search-buses-submit-btn"
            type="submit"
            className="bg-[#a43700] hover:bg-[#cd4700] text-white font-['Inter'] font-semibold text-base px-10 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 w-full md:w-auto"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{t.searchBuses}</span>
          </button>
        </div>
      </form>

      {/* Quick Route Pills */}
      <div className="mt-5 pt-4 border-t border-[#f2f4f6] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#5a4138] font-medium font-['JetBrains_Mono'] text-[11px]">Popular:</span>
        <button
          type="button"
          onClick={() => { onFromChange('Swargate, Pune'); onToChange('Dadar, Mumbai'); }}
          className="px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#ffdbcf] hover:text-[#a43700] text-[#191c1e] transition-colors"
        >
          Pune ➔ Mumbai (Shivneri)
        </button>
        <button
          type="button"
          onClick={() => { onFromChange('CBS, Nashik'); onToChange('Central, Aurangabad'); }}
          className="px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#ffdbcf] hover:text-[#a43700] text-[#191c1e] transition-colors"
        >
          Nashik ➔ Aurangabad (Asiad)
        </button>
        <button
          type="button"
          onClick={() => { onFromChange('CBS Stand, Kolhapur'); onToChange('Swargate, Pune'); }}
          className="px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#ffdbcf] hover:text-[#a43700] text-[#191c1e] transition-colors"
        >
          Kolhapur ➔ Pune (Shivshahi)
        </button>
      </div>
    </div>
  );
};
