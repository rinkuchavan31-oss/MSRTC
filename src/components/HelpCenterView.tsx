import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';
import { Phone, Mail, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, MapPin } from 'lucide-react';

interface HelpCenterViewProps {
  language: Language;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({ language }) => {
  const t = getTranslation(language);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 50% Mahila Samman Scheme work?',
      qMr: 'महिला सन्मान योजनेचा लाभ कसा मिळवावा?',
      a: 'All women passengers are entitled to a flat 50% concession on basic fare across all ordinary, semi-luxury, Shivshahi, and Shivneri AC buses operated by MSRTC within Maharashtra state boundaries.',
      aMr: 'महाराष्ट्र शासनाच्या निर्णयानुसार राज्यातील सर्व महिला प्रवाशांना साध्या बसेसपासून ते शिवनेरी वातानुकूलित बसेसपर्यंत सर्व प्रकारच्या एसटी प्रवासात ५०% तिकीट सवलत आपोआप लागू होते.',
    },
    {
      q: 'Can I show my Digital QR E-Ticket offline?',
      qMr: 'इंटरनेट नसल्यास ऑफलाइन तिकीट दाखवता येईल का?',
      a: 'Yes! MSRTC NextGen stores your cryptographically signed QR boarding pass locally on your device with an animated anti-tamper watermark ticker, valid for conductor offline ETIM scanning.',
      aMr: 'होय! एसटी नेक्स्ट-जन आपले डिजिटल क्यूआर तिकीट ऑफलाइन सुरक्षित साठवून ठेवते, जे वाहकाच्या ईटीआयएम मशीनवर इंटरनेट नसतानाही स्कॅन होते.',
    },
    {
      q: 'What is the refund rule for cancellation?',
      qMr: 'तिकीट रद्द करण्याचे नियम व परतावा किती मिळतो?',
      a: 'Cancellations before 2 hours of departure receive 85% refund. Between 2 hours and 1 hour before departure receive 50% refund. No refunds are permitted within 1 hour of scheduled departure.',
      aMr: 'गाडी सुटण्यापूर्वी २ तासांपर्यंत ८५% रक्कम परतावा मिळते. १ ते २ तासांच्या दरम्यान ५०% परतावा मिळतो.',
    },
    {
      q: 'How do I track my bus with live GPS?',
      qMr: 'माझ्या बसचे लाईव्ह लोकेशन कसे ट्रॅक करावे?',
      a: 'Open your Active E-Ticket screen to view real-time fleet GPS coordinates, speedometer, remaining distance, and ETA along the Maharashtra Highway network.',
      aMr: 'आपल्या तिकीट पृष्ठावर जाऊन आपण थेट नकाशावर बसचा वेग, उर्वरित अंतर व पोहोचण्याची अंदाजे वेळ पाहू शकता.',
    },
  ];

  return (
    <div id="help-center-page" className="w-full bg-[#f8f9fb] min-h-screen font-['Inter'] pb-16">
      {/* Header */}
      <section className="bg-[#00337c] text-white py-8 border-b border-[#001945]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-[#ffb59a]" />
            <span>{t.helpCenter}</span>
          </h1>
          <p className="text-xs text-white/70 font-['JetBrains_Mono'] mt-1">
            24x7 Commuter Support, Concession Schemes & Grievance Redressal
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Helplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] ambient-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#ffdbcf] text-[#a43700] flex items-center justify-center font-bold mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#191c1e] mb-1">Toll Free 24x7 Helpline</h3>
            <p className="text-xl font-black text-[#a43700] font-['JetBrains_Mono'] mb-2">1800 22 1250</p>
            <p className="text-xs text-[#515e64]">Round the clock passenger queries & assistance</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] ambient-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#d9e2ff] text-[#00337c] flex items-center justify-center font-bold mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#191c1e] mb-1">Police Emergency Desk</h3>
            <p className="text-xl font-black text-[#ba1a1a] font-['JetBrains_Mono'] mb-2">112 / 100</p>
            <p className="text-xs text-[#515e64]">Direct highway safety & SOS command center</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] ambient-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] text-[#5a4138] flex items-center justify-center font-bold mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#191c1e] mb-1">Email Grievance Cell</h3>
            <p className="text-sm font-bold text-[#00337c] font-['JetBrains_Mono'] mb-2">support@msrtc.gov.in</p>
            <p className="text-xs text-[#515e64]">Official grievance redressal portal</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e0e3e5] ambient-shadow">
          <h2 className="text-xl font-bold text-[#191c1e] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#e0e3e5] rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-[#191c1e] hover:bg-[#f8f9fb] flex items-center justify-between transition-colors"
                >
                  <span>{language === 'mr' ? faq.qMr : faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-[#a43700]" /> : <ChevronDown className="w-4 h-4 text-[#515e64]" />}
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 bg-[#f8f9fb] text-xs text-[#5a4138] leading-relaxed border-t border-[#e0e3e5]">
                    {language === 'mr' ? faq.aMr : faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
