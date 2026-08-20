import React from 'react';
import { ScreenView, Language } from '../types';
import { getTranslation } from '../locales/translations';
import { Shield, BookOpen, Lock, ArrowLeft } from 'lucide-react';

interface StaticPagesProps {
  page: 'about_us' | 'terms' | 'privacy';
  onBack: () => void;
  language: Language;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onBack, language }) => {
  const t = getTranslation(language);

  return (
    <div className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      <section className="bg-[#00337c] text-white py-8 border-b border-[#001945]">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded hover:bg-[#00429c]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">
              {page === 'about_us' ? t.aboutUs : page === 'terms' ? t.termsConditions : t.privacyPolicy}
            </h1>
            <p className="text-xs text-white/70 font-['JetBrains_Mono'] mt-0.5">
              Maharashtra State Road Transport Corporation
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e0e3e5] ambient-shadow space-y-4 text-xs text-[#5a4138] leading-relaxed">
          {page === 'about_us' && (
            <>
              <h2 className="text-lg font-bold text-[#191c1e]">Serving Maharashtra Since 1948</h2>
              <p>
                The Maharashtra State Road Transport Corporation (MSRTC) is one of the largest public bus transport corporations in the world, operating over 16,000 buses connecting every town, tehsil, and village across Maharashtra.
              </p>
              <p>
                Under the NextGen initiative, MSRTC has modernized passenger services with paperless digital QR ticketing, high-speed Shivneri AC electric buses, live fleet GPS tracking, and AI-enabled vernacular voice assistance (ST-Mitra).
              </p>
            </>
          )}

          {page === 'terms' && (
            <>
              <h2 className="text-lg font-bold text-[#191c1e]">Terms and Conditions of Travel</h2>
              <p>1. <strong>Ticket Validity:</strong> Digital tickets with dynamic HMAC QR signatures are valid only for the specified bus, departure time, and seat allocation.</p>
              <p>2. <strong>Identity Proof:</strong> Passengers travelling under government concession categories (Mahila Samman, Senior Citizen, Student) must present government-issued ID upon request.</p>
              <p>3. <strong>Cancellation & Refund:</strong> Cancellations made 2+ hours before departure qualify for an 85% refund.</p>
            </>
          )}

          {page === 'privacy' && (
            <>
              <h2 className="text-lg font-bold text-[#191c1e]">Privacy Policy & Data Security</h2>
              <p>
                MSRTC NextGen is committed to safeguarding commuter privacy. Passenger phone numbers, email addresses, and journey histories are encrypted using 256-bit AES protocols and are never shared with unauthorized third parties.
              </p>
              <p>
                Live GPS telemetry is used strictly for fleet dispatching, schedule ETA prediction, and emergency SOS safety coordination with Maharashtra Police (112).
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
