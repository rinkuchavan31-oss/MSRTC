import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';
import { MONSOON_UPDATES } from '../data/mockData';
import { CloudRain, Info, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MonsoonAdvisoryProps {
  language: Language;
}

export const MonsoonAdvisory: React.FC<MonsoonAdvisoryProps> = ({ language }) => {
  const t = getTranslation(language);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);

  return (
    <>
      <div id="monsoon-advisory-banner" className="bg-[#fce7f3]/50 border border-[#db2777]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-['Inter']">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#fce7f3] text-[#db2777] rounded-lg">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#191c1e] flex items-center gap-1.5">
              <span>{t.monsoonAdvisoryTitle}</span>
              <span className="w-2 h-2 rounded-full bg-[#db2777] animate-ping"></span>
            </h3>
            <p className="text-xs text-[#5a4138]">
              {language === 'mr' ? t.monsoonAdvisoryText : t.monsoonAdvisoryText}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUpdatesModal(true)}
          className="bg-white hover:bg-[#f8f9fb] text-[#db2777] border border-[#db2777]/40 px-3.5 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold whitespace-nowrap shadow-sm transition-colors"
        >
          {t.checkUpdates}
        </button>
      </div>

      {showUpdatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-['Inter']">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowUpdatesModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#f2f4f6] text-[#515e64]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">Maharashtra Monsoon Live Status</h3>
                <p className="text-xs text-[#515e64] font-['JetBrains_Mono']">Disaster Management & Control Room Feed</p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar my-4">
              {MONSOON_UPDATES.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-[#e0e3e5] bg-[#f8f9fb]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#191c1e]">{item.route}</span>
                    <span className={`text-[10px] font-['JetBrains_Mono'] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      item.severity === 'high' ? 'bg-[#ffdad6] text-[#ba1a1a]' : item.severity === 'medium' ? 'bg-[#ffdbcf] text-[#a43700]' : 'bg-[#d9e2ff] text-[#00337c]'
                    }`}>
                      {item.severity === 'high' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a4138] leading-relaxed">
                    {language === 'mr' ? item.detailsMr : item.details}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e0e3e5] flex justify-between items-center text-xs">
              <span className="text-[#515e64] font-['JetBrains_Mono']">Helpline: 1800 22 1250</span>
              <button
                onClick={() => setShowUpdatesModal(false)}
                className="px-4 py-2 bg-[#00337c] text-white rounded-lg font-['JetBrains_Mono'] font-bold hover:bg-[#00429c]"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
