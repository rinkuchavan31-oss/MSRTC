import React, { useState, useRef, useEffect } from 'react';
import { Language, BusTrip } from '../types';
import { getTranslation } from '../locales/translations';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bus, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface STMitraVoiceAssistantProps {
  language: Language;
  onSearchRoute?: (from: string, to: string) => void;
  trips: BusTrip[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actionPayload?: {
    type: 'search_bus';
    from: string;
    to: string;
  };
  timestamp: string;
}

export const STMitraVoiceAssistant: React.FC<STMitraVoiceAssistantProps> = ({
  language,
  onSearchRoute,
  trips,
}) => {
  const t = getTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: language === 'mr' 
        ? 'नमस्कार! मी एसटी-मित्र (ST-Mitra). आज महाराष्ट्रात आपल्या प्रवासासाठी बस वेळापत्रक, तिकीट आरक्षण किंवा सवलतींची माहिती हवी असल्यास मला विचारा.' 
        : language === 'hi'
        ? 'नमस्ते! मैं एसटी-मित्र हूँ। महाराष्ट्र में अपनी बस यात्रा, समय-सारणी अथवा छूट योजनाओं से संबंधित कोई भी जानकारी के लिए पूछें।'
        : 'Namaskar! I am ST-Mitra, your AI travel assistant for Maharashtra State Road Transport Corporation. Ask me about bus schedules, ticket booking, or fare concessions.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Voice recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Intelligent transit answer generator
  const generateBotReply = async (userText: string): Promise<{ text: string; action?: any }> => {
    const lower = userText.toLowerCase();

    // Check if server endpoint is available
    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          return { text: data.reply, action: data.action };
        }
      }
    } catch {
      // fallback to built-in rule engine
    }

    // Rule-based Smart Answers for MSRTC
    if (lower.includes('pune') && lower.includes('mumbai')) {
      return {
        text: language === 'mr'
          ? 'पुणे ते मुंबई मार्गावर शिवनेरी वातानुकूलित (AC Volvo) बसेस दर १५ मिनिटांनी स्वारगेट व शिवाजीनगर येथून सुटतात. भाडे ₹५५० आहे आणि प्रवास वेळ साधारण ३ तास ४५ मिनिटे आहे.'
          : 'For Pune to Mumbai, Shivneri AC buses depart every 15 minutes from Swargate & Shivajinagar. Base fare is ₹550 and non-stop journey duration is ~3h 45m.',
        action: { type: 'search_bus', from: 'Swargate, Pune', to: 'Dadar, Mumbai' },
      };
    }

    if (lower.includes('mahila') || lower.includes('महिला') || lower.includes('women') || lower.includes('50%')) {
      return {
        text: language === 'mr'
          ? 'महाराष्ट्र शासनाच्या "महिला सन्मान योजने" अंतर्गत सर्व महिला प्रवाशांना साधी, निमआराम, शिवशाही व शिवनेरी या सर्व प्रकारच्या एसटी बसेसमध्ये तिकीट दरात ५०% सवलत दिली जाते.'
          : 'Under the Govt of Maharashtra "Mahila Samman Yojana", all female commuters receive a 50% fare concession across all MSRTC bus services including Shivneri and Shivshahi.',
      };
    }

    if (lower.includes('cancel') || lower.includes('रद्द') || lower.includes('refund')) {
      return {
        text: language === 'mr'
          ? 'तिकीट प्रस्थानाच्या २ तास आधी रद्द केल्यास १५% क्लार्क चार्जेस वगळता ८५% रक्कम थेट बँक खात्यात परतावा मिळते. प्रवासाच्या १ तास आत रद्द केल्यास ५०% परतावा मिळतो.'
          : 'Online tickets cancelled more than 2 hours before departure receive an 85% refund (15% standard clerkage charge). Within 1 hour, a 50% refund applies.',
      };
    }

    if (lower.includes('senior') || lower.includes('ज्येष्ठ') || lower.includes('elderly')) {
      return {
        text: language === 'mr'
          ? '६५ ते ७५ वर्षे वयोगटातील ज्येष्ठ नागरिकांना सर्व बसेसमध्ये ५०% सवलत मिळते, तर ७५ वर्षांवरील अमृत ज्येष्ठ नागरिकांना मोफत प्रवास सवलत लागू आहे (आधार कार्ड आवश्यक).'
          : 'Senior citizens aged 65-75 get 50% concession on all MSRTC buses. Amrut Senior Citizens (75+ years) travel 100% free with valid Aadhaar ID proof.',
      };
    }

    if (lower.includes('nashik') || lower.includes('aurangabad') || lower.includes('नाशिक')) {
      return {
        text: language === 'mr'
          ? 'नाशिक ते छत्रपती संभाजीनगर (औरंगाबाद) मार्गावर एशियाड निमआराम व लालपरी बसेस उपलब्ध आहेत. भाडे ₹२८० आहे.'
          : 'Between Nashik (CBS) and Aurangabad Central, Asiad Semi-Luxury and Lal Pari Express buses operate hourly. Fare is ₹280.',
        action: { type: 'search_bus', from: 'CBS, Nashik', to: 'Central, Aurangabad' },
      };
    }

    return {
      text: language === 'mr'
        ? `आपल्या "${userText}" प्रश्नावर एसटी नियंत्रण कक्षाशी संपर्क साधला आहे. अधिक मार्ग तपासण्यासाठी मुख्य पानावर शोधा किंवा १८०० २२ १२५० वर कॉल करा.`
        : `Regarding "${userText}", MSRTC services cover all 36 districts of Maharashtra. You can reserve seats via the search bar or call 1800 22 1250 for depot assistance.`,
    };
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await generateBotReply(textToSend);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        actionPayload: response.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      speakText(response.text);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Next Pune ➔ Mumbai Shivneri', query: 'When is the next Shivneri from Pune to Mumbai?' },
    { label: 'महिला सन्मान ५०% सवलत', query: 'महिला सन्मान योजनेची माहिती द्या' },
    { label: 'Senior Citizen Rules', query: 'What are senior citizen concession rules in MSRTC?' },
    { label: 'Ticket Refund Policy', query: 'What is the ticket cancellation and refund policy?' },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) on bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 font-['Inter']">
        {!isOpen ? (
          <button
            id="st-mitra-fab-btn"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-[#a43700] hover:bg-[#cd4700] active:scale-95 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-200 border-2 border-white"
            title="ST-Mitra Vernacular AI Travel Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-white text-[#a43700] flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black block leading-none font-['Inter']">
                एसटी-मित्र (ST-Mitra)
              </span>
              <span className="text-[10px] text-white/80 font-['JetBrains_Mono']">
                AI Voice Guide
              </span>
            </div>
            {/* Pulse Indicator */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#22c55e] rounded-full ring-2 ring-white animate-pulse"></span>
          </button>
        ) : null}
      </div>

      {/* Floating Chat & Voice Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#e0e3e5] flex flex-col overflow-hidden font-['Inter'] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#00337c] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#a43700] text-white flex items-center justify-center font-black text-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>{t.stMitraTitle}</span>
                  <span className="text-[10px] bg-[#001945] px-1.5 py-0.5 rounded text-[#ffb59a] font-['JetBrains_Mono']">
                    Marathi • Hindi • English
                  </span>
                </h3>
                <span className="text-[11px] text-white/70 font-['JetBrains_Mono']">
                  State Transit Intelligent Concierge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className="p-1.5 text-white/80 hover:text-white rounded hover:bg-[#00429c]"
                title={ttsEnabled ? 'Mute Speech' : 'Enable Voice'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded hover:bg-[#00429c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-[#f8f9fb]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#a43700] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-[#191c1e] border border-[#e0e3e5] rounded-bl-none ambient-shadow'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Action CTA inside message (e.g. search route) */}
                  {msg.actionPayload && msg.actionPayload.type === 'search_bus' && onSearchRoute && (
                    <button
                      onClick={() => {
                        onSearchRoute(msg.actionPayload!.from, msg.actionPayload!.to);
                        setIsOpen(false);
                      }}
                      className="mt-2 w-full py-1.5 px-2.5 bg-[#00337c] hover:bg-[#00429c] text-white rounded-lg font-['JetBrains_Mono'] text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Bus className="w-3 h-3" />
                      <span>Search {msg.actionPayload.from.split(',')[0]} ➔ {msg.actionPayload.to.split(',')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-[#515e64] mt-1 font-['JetBrains_Mono'] px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#515e64] font-['JetBrains_Mono'] p-2">
                <span className="w-2 h-2 rounded-full bg-[#a43700] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#a43700] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#a43700] animate-bounce [animation-delay:0.4s]"></span>
                <span>ST-Mitra is checking route database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-white border-t border-[#e0e3e5] flex gap-1.5 overflow-x-auto custom-scrollbar">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(item.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f2f4f6] hover:bg-[#ffdbcf] hover:text-[#a43700] text-[11px] text-[#191c1e] font-['JetBrains_Mono'] border border-[#e0e3e5] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3 bg-white border-t border-[#e0e3e5] flex items-center gap-2">
            {/* Mic Toggle */}
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#f2f4f6] hover:bg-[#ffdbcf] text-[#a43700]'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak Marathi/Hindi/English'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder={isListening ? 'Listening...' : t.speakQuery}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e3bfb2] bg-[#f8f9fb] text-[#191c1e] outline-none focus:ring-2 focus:ring-[#00337c]/20 focus:border-[#00337c]"
            />

            <button
              onClick={() => handleSendQuery()}
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-[#a43700] hover:bg-[#cd4700] disabled:bg-[#e0e3e5] text-white rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
