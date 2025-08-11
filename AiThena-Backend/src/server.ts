import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

if (!GEMINI_API_KEY) {
  // Fail fast on missing key
  // eslint-disable-next-line no-console
  console.error('Missing GEMINI_API_KEY in environment');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const ChatSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string(),
      }),
    )
    .optional(),
  systemInstruction: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  maxOutputTokens: z.number().int().positive().optional(),
});

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, systemInstruction, temperature, topP, maxOutputTokens } = ChatSchema.parse(req.body);

    // Normalize history: must start with a user turn
    const rawHistory = history || [];
    const firstUserIdx = rawHistory.findIndex((h) => h.role === 'user');
    const slicedHistory = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction,
        temperature,
        topP,
        maxOutputTokens,
        responseMimeType: 'text/plain',
      },
      history: slicedHistory.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text, candidates: response.candidates });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(400).json({ error: err?.message || 'Bad Request' });
  }
});

app.get('/api/assistant/chat/stream', async (req: Request, res: Response) => {
  // Example: /api/assistant/chat/stream?message=Hello
  const message = String(req.query.message || '');
  if (!message) {
    res.status(400).end('Missing message');
    return;
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const chat = ai.chats.create({ model: GEMINI_MODEL });
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
      const text = chunk.text || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write('event: done\n');
    res.write('data: {}\n\n');
    res.end();
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: err?.message || 'Stream error' })}\n\n`);
    res.end();
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, model: GEMINI_MODEL });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AiThena Backend listening on http://localhost:${PORT}`);
});


