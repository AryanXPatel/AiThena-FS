import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import flashcardRoutes from './flashcard-routes.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
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

    const rawHistory = history || [];
    const firstUserIdx = rawHistory.findIndex((h) => h.role === 'user');
    const slicedHistory = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

    // Configure generation settings
    const generationConfig: any = {};
    if (temperature !== undefined) generationConfig.temperature = temperature;
    if (topP !== undefined) generationConfig.topP = topP;
    if (maxOutputTokens !== undefined) generationConfig.maxOutputTokens = maxOutputTokens;

    console.log('[assistant/chat] incoming', {
      messageSnippet: message.slice(0, 120),
      historyTurns: slicedHistory.length,
      generationConfig,
      model: GEMINI_MODEL,
      hasSystemInstruction: Boolean(systemInstruction),
    });

    // Initialize model
    const modelConfig: any = { model: GEMINI_MODEL };
    if (systemInstruction) {
      modelConfig.systemInstruction = systemInstruction;
    }

    const model = genAI.getGenerativeModel(modelConfig);

    // For Gemini 2.5 models, configure thinking
    const config: any = {
      generationConfig,
    };

    // Add thinking configuration for 2.5 models
    if (GEMINI_MODEL.includes('2.5')) {
      config.thinkingConfig = {
        thinkingBudget: 0, // Set to 0 for lower latency, or remove for default thinking
      };
    }

    const chat = model.startChat({
      history: slicedHistory.map((h) => ({ 
        role: h.role, 
        parts: [{ text: h.text }] 
      })),
    });

    const t0 = Date.now();
    
    // Send message with config
    const result = await chat.sendMessage(message, config);
    
    const t1 = Date.now();

    const response = result.response;
    let text = '';
    
    try {
      text = response.text();
    } catch (error) {
      console.error('Error extracting text:', error);
      // Fallback text extraction
      const candidates = response.candidates || [];
      if (candidates.length > 0 && candidates[0].content?.parts) {
        text = candidates[0].content.parts
          .map((part: any) => part.text || '')
          .join('')
          .trim();
      }
    }

    console.log('[assistant/chat] response', {
      elapsedMs: t1 - t0,
      model: GEMINI_MODEL,
      textPreview: text ? text.slice(0, 200) : '',
      candidateCount: response.candidates?.length || 0,
    });

    if (!text || !text.trim()) {
      const blockedMsg = response.promptFeedback?.blockReason
        ? `The request was blocked by safety filters (${response.promptFeedback.blockReason}). Please rephrase.`
        : 'I could not generate a response right now. Please try again in a moment.';
      res.json({ text: blockedMsg, model: GEMINI_MODEL });
      return;
    }

    res.json({ text, model: GEMINI_MODEL });
  } catch (err: any) {
    console.error('[assistant/chat] error', { 
      message: err?.message, 
      stack: err?.stack,
      error: err 
    });
    res.status(400).json({ error: err?.message || 'Bad Request' });
  }
});

// Updated streaming endpoint with thinking config
app.get('/api/assistant/chat/stream', async (req: Request, res: Response) => {
  const message = String(req.query.message || '');
  if (!message) {
    res.status(400).end('Missing message');
    return;
  }
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const chat = model.startChat();
    
    const config: any = {};
    if (GEMINI_MODEL.includes('2.5')) {
      config.thinkingConfig = {
        thinkingBudget: 0, // For faster streaming
      };
    }
    
    const stream = await chat.sendMessageStream(message, config);
    
    for await (const chunk of stream.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    
    res.write('event: done\n');
    res.write('data: {}\n\n');
    res.end();
  } catch (err: any) {
    console.error('[assistant/chat/stream] error', { message: err?.message });
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: err?.message || 'Stream error' })}\n\n`);
    res.end();
  }
});

// Mount flashcard routes
app.use('/api/flashcards', flashcardRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true, model: GEMINI_MODEL });
});

app.listen(PORT, () => {
  console.log(`AiThena Backend listening on http://localhost:${PORT} (model=${GEMINI_MODEL})`);
  console.log(`✅ AI Assistant: /api/assistant/*`);
  console.log(`🎯 FlashcardStudio: /api/flashcards/*`);
});