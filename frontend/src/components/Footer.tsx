import React from 'react';
import { Language, ScreenView } from '../types';
import { getTranslation } from '../locales/translations';
import { Phone, Mail, Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (screen: ScreenView) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = getTranslation(language);

  return (
    <footer id="main-footer" className="bg-[#001945] text-white border-t border-[#00337c] font-['Inter']">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#a43700] text-white flex items-center justify-center font-black text-sm">
                ST
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{t.brandName}</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Maharashtra State Road Transport Corporation — connecting over 15,000 villages with dependable, smart transit.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/80 font-['JetBrains_Mono']">
              <Phone className="w-3.5 h-3.5 text-[#ffb59a]" />
              <span>Toll Free: 1800 22 1250</span>
            </div>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffb59a] uppercase tracking-wider mb-3">
              {t.corporate}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => onNavigate('about_us')} className="hover:text-white transition-colors">
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('help_center')} className="hover:text-white transition-colors">
                  {t.regionalOffices}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('conductor_login')} className="text-[#ffb59a] hover:underline font-bold flex items-center gap-1">
                  <span>Conductor Terminal v2.4 (Mobile Sign-In)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('staff_auth')} className="text-white/90 hover:underline font-medium flex items-center gap-1">
                  <span>MSRTC Staff Portal (Web Auth)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <span className="text-white/50">MahaTrans Fleet Statistics</span>
              </li>
              <li>
                <span className="text-white/50">Tender Notices & E-Procurement</span>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffb59a] uppercase tracking-wider mb-3">
              {t.legal}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  {t.termsConditions}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <span className="text-white/50">Refund & Cancellation Rules</span>
              </li>
              <li>
                <span className="text-white/50">Mahila Samman Guidelines</span>
              </li>
            </ul>
          </div>

          {/* 24x7 Control & Support */}
          <div>
            <h4 className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffb59a] uppercase tracking-wider mb-3">
              {t.support}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => onNavigate('help_center')} className="hover:text-white transition-colors">
                  {t.contactHelpline}
                </button>
              </li>
              <li>
                <span className="text-white/50">Depot Emergency Desk</span>
              </li>
              <li>
                <span className="text-white/50">Passholder Grievances</span>
              </li>
              <li className="pt-2">
                <span className="inline-block bg-[#00429c] text-white px-2.5 py-1 rounded text-[10px] font-['JetBrains_Mono'] font-bold">
                  24x7 Central Monitoring Cell
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-['JetBrains_Mono']">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4">
            <span>Powered by Smart ST Infrastructure</span>
            <span>•</span>
            <span>Version 4.2.0 NextGen</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
