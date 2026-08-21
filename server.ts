import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Error initializing Gemini client:', e);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ST-Mitra AI Assistant endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { query, language } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const client = getGeminiClient();
      if (!client) {
        // Return null to let frontend fallback to built-in rule engine
        return res.json({ reply: null });
      }

      const systemPrompt = `You are "ST-Mitra" (एसटी-मित्र), the helpful, knowledgeable, and polite AI travel assistant for MSRTC (Maharashtra State Road Transport Corporation).
You assist commuters with MSRTC bus routes, Shivneri, Shivshahi, Asiad, and Lal Pari schedules, Mahila Samman (50% female concession), Senior Citizen concessions, Amrut Jyeshtha Nagrik (75+ free travel), refund and cancellation policies, and live GPS tracking across Maharashtra.
Language requested: ${language || 'en'}.
Keep your reply friendly, accurate, concise (2-3 sentences), and in the requested language (Marathi if 'mr', Hindi if 'hi', English otherwise).`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nCommuter query: ${query}` }] },
        ],
      });

      const replyText = response.text?.trim() || '';
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini API query error:', err);
      return res.json({ reply: null });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MSRTC NextGen Server running on http://localhost:${PORT}`);
  });
}

startServer();
