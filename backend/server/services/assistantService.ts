import { ENV } from '../config/env';
import { logger } from '../config/logger';
import { SEED_TRIPS } from '../config/database';

type Language = 'en' | 'mr' | 'hi';

interface AssistantResult {
  reply: string;
  action?: {
    type: 'search_bus';
    from: string;
    to: string;
  };
}

// ─── Gemini AI Engine ─────────────────────────────────────────────────────────

async function queryGemini(userText: string, language: Language): Promise<string | null> {
  if (!ENV.GEMINI_API_KEY) return null;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

    const langName = language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English';
    const systemPrompt = `You are "ST-Mitra" (एसटी-मित्र), the helpful and knowledgeable AI travel assistant for MSRTC (Maharashtra State Road Transport Corporation).
You assist commuters with: Shivneri, Shivshahi, Asiad, Parivartan, and Lal Pari bus schedules across Maharashtra; Mahila Samman 50% female concession; Senior Citizen 50%; Amrut Jyeshtha Nagrik (75+ free travel); Student 30% concession; booking, refund, and cancellation policies.
Respond in ${langName}. Keep reply friendly, accurate, and concise (2-3 sentences).`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nCommuter query: ${userText}` }] }],
    });

    return response.text?.trim() || null;
  } catch (err) {
    logger.warn('Gemini API call failed, using fallback rule engine.', err);
    return null;
  }
}

// ─── Fallback Rule Engine ─────────────────────────────────────────────────────

function ruleBasedReply(userText: string, language: Language): AssistantResult {
  const q = userText.toLowerCase();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  if (q.includes('pune') && q.includes('mumbai')) {
    return {
      reply: isMr
        ? 'पुणे ते मुंबई: शिवनेरी वातानुकूलित बस (₹५५०) दर १५ मिनिटांनी स्वारगेट येथून सुटते. प्रवास वेळ साधारण ३ तास ४५ मिनिटे आहे.'
        : isHi
        ? 'पुणे से मुंबई: शिवनेरी AC बस (₹५५०) हर १५ मिनट पर स्वारगेट से चलती है। यात्रा समय लगभग ३ घंटे ४५ मिनट है।'
        : 'Pune to Mumbai: Shivneri AC buses (₹550) depart every 15 minutes from Swargate. Non-stop journey takes ~3h 45m.',
      action: { type: 'search_bus', from: 'Swargate, Pune', to: 'Dadar, Mumbai' },
    };
  }

  if (q.includes('mahila') || q.includes('women') || q.includes('female') || q.includes('concession')) {
    return {
      reply: isMr
        ? 'महिला सन्मान योजना अंतर्गत, महिला प्रवाशांना MSRTC च्या सर्व बसमध्ये ५०% सवलत मिळते. आरक्षण करताना "Mahila Samman" निवडा.'
        : isHi
        ? 'महिला सम्मान योजना के तहत, महिला यात्रियों को MSRTC बसों में ५०% छूट मिलती है। बुकिंग करते समय "Mahila Samman" चुनें।'
        : 'Under the Mahila Samman Yojana, female passengers receive a 50% concession on all MSRTC buses. Select "Mahila Samman" concession during booking.',
    };
  }

  if (q.includes('senior') || q.includes('old age') || q.includes('ज्येष्ठ') || q.includes('वरिष्ठ')) {
    return {
      reply: isMr
        ? 'ज्येष्ठ नागरिक (६५-७४ वर्षे) यांना ५०% सवलत आहे. ७५ वर्षांपेक्षा जास्त वयाच्या नागरिकांना अमृत ज्येष्ठ नागरिक योजने अंतर्गत मोफत प्रवास मिळतो.'
        : 'Senior citizens (65-74 yrs) receive a 50% fare concession. Citizens aged 75+ travel free under the Amrut Jyeshtha Nagrik Yojana.',
    };
  }

  if (q.includes('cancel') || q.includes('refund') || q.includes('रद्द')) {
    return {
      reply: isMr
        ? 'बस निघण्यापूर्वी आपण बुकिंग रद्द करू शकता. "My Bookings" विभागात जाऊन तिकीट रद्द करा. परतावा प्रक्रिया ५-७ कार्यदिवसांत होते.'
        : 'You can cancel your booking before the bus departure time. Go to "My Bookings" and cancel your ticket. Refunds are processed within 5-7 working days.',
    };
  }

  if (q.includes('nashik') || q.includes('nagpur') || q.includes('kolhapur') || q.includes('aurangabad')) {
    const trips = SEED_TRIPS.filter((t) => {
      const q2 = userText.toLowerCase();
      return t.fromCity.toLowerCase().includes(q2) || t.toCity.toLowerCase().includes(q2);
    });
    return {
      reply: isMr
        ? 'या मार्गावर MSRTC बस उपलब्ध आहेत. कृपया बस शोध वापरून आपला प्रवास निवडा.'
        : `MSRTC operates buses on this route. Please use the search feature to find available trips. ${trips.length > 0 ? `${trips.length} trip(s) currently scheduled.` : ''}`,
    };
  }

  if (q.includes('shivneri') || q.includes('शिवनेरी')) {
    return {
      reply: isMr
        ? 'शिवनेरी हे MSRTC चे प्रीमियम वातानुकूलित बस आहे. पुणे-मुंबई मार्गावर हे ₹५५० मध्ये Non-stop सेवा देते.'
        : 'Shivneri is MSRTC\'s premium AC Volvo bus service. It operates non-stop on the Pune-Mumbai route at ₹550 and takes ~3h 45m.',
    };
  }

  // Default
  return {
    reply: isMr
      ? 'मी एसटी-मित्र आहे. तुमच्या MSRTC बस प्रवासाबद्दल, तिकीट, सवलत किंवा वेळापत्रकाबद्दल कोणताही प्रश्न विचारा.'
      : isHi
      ? 'मैं एसटी-मित्र हूँ। MSRTC बस यात्रा, टिकट, छूट, या समय-सारणी के बारे में कोई भी प्रश्न पूछें।'
      : 'I am ST-Mitra. Ask me about MSRTC bus schedules, ticket booking, fare concessions, or travel advisories across Maharashtra.',
  };
}

// ─── Main Assistant Service ───────────────────────────────────────────────────

export const assistantService = {
  async chat(query: string, language: Language): Promise<AssistantResult> {
    if (!query?.trim()) {
      return { reply: ruleBasedReply('', language).reply };
    }

    const geminiReply = await queryGemini(query, language);
    if (geminiReply) {
      return { reply: geminiReply };
    }

    return ruleBasedReply(query, language);
  },
};
