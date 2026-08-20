import React, { useState, useMemo } from 'react';
import { Language, BusTrip, FilterState } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  ArrowLeftRight, 
  Search, 
  Calendar, 
  User, 
  Star, 
  Filter, 
  RotateCcw, 
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface SearchResultsViewProps {
  fromLocation: string;
  toLocation: string;
  travelDate: string;
  passengerCount: number;
  trips: BusTrip[];
  onSelectTrip: (trip: BusTrip) => void;
  onModifySearch: () => void;
  language: Language;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  fromLocation,
  toLocation,
  travelDate,
  passengerCount,
  trips,
  onSelectTrip,
  onModifySearch,
  language,
}) => {
  const t = getTranslation(language);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    busServices: {
      shivneri: true,
      shivshahi: true,
      parivartan: true,
      asiad: true,
    },
    departureWindows: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    },
    sortBy: 'earliest',
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Reset Filters
  const handleClearAll = () => {
    setFilters({
      busServices: {
        shivneri: true,
        shivshahi: true,
        parivartan: true,
        asiad: true,
      },
      departureWindows: {
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
      },
      sortBy: 'earliest',
    });
  };

  // Filtered & Sorted Trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Service filter
      const type = trip.serviceType.toLowerCase();
      if (type.includes('shivneri') && !filters.busServices.shivneri) return false;
      if (type.includes('shivshahi') && !filters.busServices.shivshahi) return false;
      if (type.includes('parivartan') && !filters.busServices.parivartan) return false;
      if (type.includes('asiad') && !filters.busServices.asiad) return false;

      // Departure window filter
      const hour = parseInt(trip.departureTime.split(':')[0], 10);
      const isAnyWindowActive = 
        filters.departureWindows.morning || 
        filters.departureWindows.afternoon || 
        filters.departureWindows.evening || 
        filters.departureWindows.night;

      if (isAnyWindowActive) {
        let match = false;
        if (filters.departureWindows.morning && hour >= 6 && hour < 12) match = true;
        if (filters.departureWindows.afternoon && hour >= 12 && hour < 18) match = true;
        if (filters.departureWindows.evening && hour >= 18 && hour <= 23) match = true;
        if (filters.departureWindows.night && hour >= 0 && hour < 6) match = true;
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'cheapest') {
        return a.baseFare - b.baseFare;
      }
      if (filters.sortBy === 'fastest') {
        return a.stopsCount - b.stopsCount;
      }
      // default: earliest
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [trips, filters]);

  // Format date readable
  const formattedDate = useMemo(() => {
    if (!travelDate) return 'Today';
    try {
      const d = new Date(travelDate);
      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch {
      return travelDate;
    }
  }, [travelDate]);

  return (
    <div id="search-results-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter']">
      {/* 1. Context Navigation / Search Summary Strip (Sticky) */}
      <section id="search-context-strip" className="bg-[#00337c] text-white border-b border-[#001945] sticky top-[60px] z-40 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-['JetBrains_Mono']">
            {/* Origin -> Destination */}
            <div className="flex items-center gap-2 bg-[#001945] px-3 py-1.5 rounded-lg border border-white/10">
              <span className="font-semibold text-white">
                {fromLocation || 'Pune Swargate'}
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#ffb59a]" />
              <span className="font-semibold text-white">
                {toLocation || 'Mumbai Dadar'}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-white/80 bg-[#001945]/60 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-white/70" />
              <span>{formattedDate}</span>
            </div>

            {/* Passenger Count */}
            <div className="flex items-center gap-1.5 text-white/80 bg-[#001945]/60 px-3 py-1.5 rounded-lg">
              <User className="w-3.5 h-3.5 text-white/70" />
              <span>{passengerCount} {passengerCount > 1 ? t.passengers : t.passenger}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 bg-[#a43700] text-white text-xs font-['JetBrains_Mono'] font-bold px-3 py-1.5 rounded-lg"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t.filters}</span>
            </button>

            {/* Modify Search CTA */}
            <button
              id="modify-search-btn"
              onClick={onModifySearch}
              className="bg-[#a43700] hover:bg-[#cd4700] active:scale-95 text-white text-xs font-['JetBrains_Mono'] font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{t.modifySearch}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid: Filters Sidebar + Results Feed */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filters (Desktop & Mobile Drawer) */}
          <aside className={`lg:col-span-4 ${mobileFilterOpen ? 'block fixed inset-0 z-50 bg-black/50 p-4 lg:p-0 lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 border border-[#e0e3e5] ambient-shadow space-y-6 max-h-[90vh] overflow-y-auto lg:max-h-none">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-4">
                <h3 className="font-bold text-base text-[#191c1e] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#a43700]" />
                  <span>{t.filters}</span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    id="clear-filters-btn"
                    onClick={handleClearAll}
                    className="text-[#a43700] hover:underline text-xs font-['JetBrains_Mono'] font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.clearAll}</span>
                  </button>
                  {mobileFilterOpen && (
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="lg:hidden text-xs font-bold text-[#00337c] px-2 py-1 bg-[#f2f4f6] rounded"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>

              {/* Service Type Filter */}
              <div>
                <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#5a4138] uppercase tracking-wider mb-3">
                  {t.busService}
                </h4>
                <div className="space-y-2.5 text-sm">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-[#191c1e]">
                      <input
                        type="checkbox"
                        checked={filters.busServices.shivneri}
                        onChange={(e) => setFilters({
                          ...filters,
                          busServices: { ...filters.busServices, shivneri: e.target.checked }
                        })}
                        className="rounded border-[#8f7066] text-[#00337c] focus:ring-[#00337c] w-4 h-4"
                      />
                      <span>Shivneri AC</span>
                    </span>
                    <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">42</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-[#191c1e]">
                      <input
                        type="checkbox"
                        checked={filters.busServices.shivshahi}
                        onChange={(e) => setFilters({
                          ...filters,
                          busServices: { ...filters.busServices, shivshahi: e.target.checked }
                        })}
                        className="rounded border-[#8f7066] text-[#00337c] focus:ring-[#00337c] w-4 h-4"
                      />
                      <span>Shivshahi</span>
                    </span>
                    <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">28</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-[#191c1e]">
                      <input
                        type="checkbox"
                        checked={filters.busServices.parivartan}
                        onChange={(e) => setFilters({
                          ...filters,
                          busServices: { ...filters.busServices, parivartan: e.target.checked }
                        })}
                        className="rounded border-[#8f7066] text-[#00337c] focus:ring-[#00337c] w-4 h-4"
                      />
                      <span>Parivartan (Lal Pari)</span>
                    </span>
                    <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">15</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-[#191c1e]">
                      <input
                        type="checkbox"
                        checked={filters.busServices.asiad}
                        onChange={(e) => setFilters({
                          ...filters,
                          busServices: { ...filters.busServices, asiad: e.target.checked }
                        })}
                        className="rounded border-[#8f7066] text-[#00337c] focus:ring-[#00337c] w-4 h-4"
                      />
                      <span>Asiad Semi-Luxury</span>
                    </span>
                    <span className="text-xs text-[#515e64] font-['JetBrains_Mono']">18</span>
                  </label>
                </div>
              </div>

              {/* Departure Time Slots */}
              <div className="pt-4 border-t border-[#e0e3e5]">
                <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#5a4138] uppercase tracking-wider mb-3">
                  {t.departureTime}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilters({
                      ...filters,
                      departureWindows: { ...filters.departureWindows, morning: !filters.departureWindows.morning }
                    })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      filters.departureWindows.morning 
                        ? 'border-[#00337c] bg-[#d9e2ff]/50 text-[#00337c] font-bold' 
                        : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#191c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Sun className="w-3.5 h-3.5 text-[#a43700]" />
                      <span className="text-[10px] text-[#515e64]">6-12</span>
                    </div>
                    <span className="font-medium">{t.morning}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilters({
                      ...filters,
                      departureWindows: { ...filters.departureWindows, afternoon: !filters.departureWindows.afternoon }
                    })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      filters.departureWindows.afternoon 
                        ? 'border-[#00337c] bg-[#d9e2ff]/50 text-[#00337c] font-bold' 
                        : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#191c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Sun className="w-3.5 h-3.5 text-[#cd4700]" />
                      <span className="text-[10px] text-[#515e64]">12-18</span>
                    </div>
                    <span className="font-medium">{t.afternoon}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilters({
                      ...filters,
                      departureWindows: { ...filters.departureWindows, evening: !filters.departureWindows.evening }
                    })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      filters.departureWindows.evening 
                        ? 'border-[#00337c] bg-[#d9e2ff]/50 text-[#00337c] font-bold' 
                        : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#191c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Sunset className="w-3.5 h-3.5 text-[#2b5bb5]" />
                      <span className="text-[10px] text-[#515e64]">18-24</span>
                    </div>
                    <span className="font-medium">{t.evening}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilters({
                      ...filters,
                      departureWindows: { ...filters.departureWindows, night: !filters.departureWindows.night }
                    })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      filters.departureWindows.night 
                        ? 'border-[#00337c] bg-[#d9e2ff]/50 text-[#00337c] font-bold' 
                        : 'border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#191c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Moon className="w-3.5 h-3.5 text-[#001945]" />
                      <span className="text-[10px] text-[#515e64]">0-6</span>
                    </div>
                    <span className="font-medium">{t.night}</span>
                  </button>
                </div>
              </div>

              {/* Quick info note */}
              <div className="p-3 bg-[#f2f4f6] rounded-lg text-[11px] text-[#5a4138] leading-relaxed">
                ℹ️ <strong>Mahila Samman Yojana</strong> 50% concession will be applied during seat selection.
              </div>

            </div>
          </aside>

          {/* Right Main Feed */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Header: Found count + Sorting Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e0e3e5]">
              <div className="text-sm text-[#5a4138]">
                {t.showing} <span className="font-bold text-[#191c1e]">{filteredTrips.length} {t.busesFound}</span>
              </div>

              {/* Sorting Pills */}
              <div className="flex items-center gap-1.5 bg-[#eceef0] p-1 rounded-lg self-start sm:self-auto">
                <button
                  id="sort-earliest-btn"
                  onClick={() => setFilters({ ...filters, sortBy: 'earliest' })}
                  className={`px-3 py-1.5 rounded-md text-xs font-['JetBrains_Mono'] transition-all ${
                    filters.sortBy === 'earliest'
                      ? 'bg-white text-[#00337c] font-bold shadow-xs'
                      : 'text-[#515e64] hover:text-[#191c1e]'
                  }`}
                >
                  {t.earliest}
                </button>
                <button
                  id="sort-cheapest-btn"
                  onClick={() => setFilters({ ...filters, sortBy: 'cheapest' })}
                  className={`px-3 py-1.5 rounded-md text-xs font-['JetBrains_Mono'] transition-all ${
                    filters.sortBy === 'cheapest'
                      ? 'bg-white text-[#00337c] font-bold shadow-xs'
                      : 'text-[#515e64] hover:text-[#191c1e]'
                  }`}
                >
                  {t.cheapest}
                </button>
                <button
                  id="sort-fastest-btn"
                  onClick={() => setFilters({ ...filters, sortBy: 'fastest' })}
                  className={`px-3 py-1.5 rounded-md text-xs font-['JetBrains_Mono'] transition-all ${
                    filters.sortBy === 'fastest'
                      ? 'bg-white text-[#00337c] font-bold shadow-xs'
                      : 'text-[#515e64] hover:text-[#191c1e]'
                  }`}
                >
                  {t.fastest}
                </button>
              </div>
            </div>

            {/* List of Bus Cards */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-[#e0e3e5]">
                <Clock className="w-10 h-10 text-[#515e64] mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#191c1e] mb-1">No buses matched your filters</h4>
                <p className="text-xs text-[#5a4138] mb-4">Try clearing filters or selecting another date</p>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-[#00337c] text-white rounded-lg text-xs font-['JetBrains_Mono'] font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrips.slice(0, visibleCount).map((trip) => {
                  const isShivneri = trip.serviceType === 'SHIVNERI' || trip.serviceType === 'E_SHIVNERI';
                  const isShivshahi = trip.serviceType === 'SHIVSHAHI';

                  return (
                    <article
                      key={trip.id}
                      className="bg-white rounded-xl p-6 border border-[#e0e3e5] ambient-shadow hover:ambient-shadow-active transition-all"
                    >
                      {/* Top Row: Service Badge, Route Code, Rating */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1.5 ${
                              isShivneri
                                ? 'bg-[#00337c] text-white'
                                : isShivshahi
                                ? 'bg-[#2b5bb5] text-white'
                                : 'bg-[#ba1a1a] text-white'
                            }`}
                          >
                            {trip.isAc ? (
                              <span className="material-symbols-outlined text-sm">ac_unit</span>
                            ) : (
                              <span className="material-symbols-outlined text-sm">directions_bus</span>
                            )}
                            <span>{language === 'mr' ? trip.serviceNameMr : trip.serviceName}</span>
                          </span>

                          <span className="text-xs text-[#5a4138] font-['JetBrains_Mono']">
                            {trip.routeCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-['JetBrains_Mono']">
                          <div className="flex items-center text-[#a43700] font-bold">
                            <Star className="w-3.5 h-3.5 fill-[#a43700] text-[#a43700] mr-0.5" />
                            <span>{trip.rating}</span>
                          </div>
                          <span className="text-[#515e64]">({trip.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      {/* Middle Row: Timeline Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6">
                        {/* Departure */}
                        <div className="md:col-span-4">
                          <div className="text-2xl font-bold text-[#191c1e] font-['Inter']">
                            {trip.departureTime}
                          </div>
                          <div className="text-xs font-bold text-[#00337c] uppercase tracking-wider font-['JetBrains_Mono']">
                            {trip.fromDepot}, {trip.fromCity}
                          </div>
                        </div>

                        {/* Duration Line */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center">
                          <span className="text-[11px] text-[#5a4138] font-['JetBrains_Mono'] mb-1">
                            {trip.duration}
                          </span>
                          <div className="w-full flex items-center">
                            <div className="h-0.5 w-full bg-[#8f7066]/30"></div>
                            <div className="w-2 h-2 rounded-full bg-[#a43700]"></div>
                            <div className="h-0.5 w-full bg-[#8f7066]/30"></div>
                          </div>
                          <span className="text-[10px] text-[#515e64] mt-1 font-['JetBrains_Mono']">
                            {language === 'mr' ? trip.stopsDescriptionMr : trip.stopsDescription}
                          </span>
                        </div>

                        {/* Arrival */}
                        <div className="md:col-span-4 md:text-right">
                          <div className="text-2xl font-bold text-[#191c1e] font-['Inter']">
                            {trip.arrivalTime}
                          </div>
                          <div className="text-xs font-bold text-[#00337c] uppercase tracking-wider font-['JetBrains_Mono']">
                            {trip.toDepot}, {trip.toCity}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Price, Availability, CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e0e3e5]">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-2xl font-black text-[#a43700] font-['Inter']">
                              ₹{trip.baseFare}
                            </span>
                            <span className="text-[11px] text-[#515e64] block font-['JetBrains_Mono']">
                              per seat
                            </span>
                          </div>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-['JetBrains_Mono'] font-bold ${
                              trip.statusBadgeColor === 'teal'
                                ? 'bg-[#d9e2ff] text-[#00337c]'
                                : trip.statusBadgeColor === 'orange'
                                ? 'bg-[#ffdbcf] text-[#a43700]'
                                : trip.statusBadgeColor === 'red'
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#e0e3e5] text-[#191c1e]'
                            }`}
                          >
                            {trip.statusBadge}
                          </span>
                        </div>

                        <button
                          id={`book-trip-${trip.id}-btn`}
                          onClick={() => onSelectTrip(trip)}
                          className="bg-[#00337c] hover:bg-[#00429c] active:scale-95 text-white font-['JetBrains_Mono'] text-xs font-bold px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2"
                        >
                          <span>{t.bookNow}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Load More Buses */}
            {filteredTrips.length > visibleCount && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="bg-white hover:bg-[#f2f4f6] text-[#00337c] border border-[#00337c]/30 font-['JetBrains_Mono'] text-xs font-bold px-6 py-3 rounded-lg transition-all shadow-xs"
                >
                  {t.loadMoreBuses}
                </button>
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
};
