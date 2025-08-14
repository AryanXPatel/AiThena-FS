import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

// Configuration Constants
const PORT = process.env.PORT ? Number(process.env.PORT) : 4201;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Initialize Fastify with CORS
const app = Fastify({ logger: true });

app.register(cors, {
  origin: [FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Initialize Google AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Type Definitions
interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
  lastReviewed: string;
  reviewCount: number;
  easeFactor: number; // For spaced repetition
  interval: number; // Days until next review
  nextReview: string;
  createdAt: string;
  updatedAt: string;
}

interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  description?: string;
  cardCount: number;
  studiedCount: number;
  masteredCount: number;
  lastStudied: string;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  color: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID (simplified for now)
}

interface StudySession {
  id: string;
  deckId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  cardsReviewed: number;
  cardsCorrect: number;
  totalTime: number; // milliseconds
  sessionType: 'review' | 'learn' | 'cram';
  isCompleted: boolean;
}

interface StudyResponse {
  cardId: string;
  response: 'again' | 'hard' | 'good' | 'easy';
  responseTime: number; // milliseconds
  timestamp: string;
}

// Storage Management
async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, 'decks'), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, 'cards'), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, 'sessions'), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, 'public'), { recursive: true });
}

// Utility Functions
async function loadDecks(): Promise<FlashcardDeck[]> {
  try {
    const decksPath = path.join(DATA_DIR, 'decks', 'index.json');
    const data = await fs.readFile(decksPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveDecks(decks: FlashcardDeck[]): Promise<void> {
  const decksPath = path.join(DATA_DIR, 'decks', 'index.json');
  await fs.writeFile(decksPath, JSON.stringify(decks, null, 2));
}

async function loadCards(deckId: string): Promise<Flashcard[]> {
  try {
    const cardsPath = path.join(DATA_DIR, 'cards', `${deckId}.json`);
    const data = await fs.readFile(cardsPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCards(deckId: string, cards: Flashcard[]): Promise<void> {
  const cardsPath = path.join(DATA_DIR, 'cards', `${deckId}.json`);
  await fs.writeFile(cardsPath, JSON.stringify(cards, null, 2));
}

// Spaced Repetition Algorithm (SuperMemo SM-2)
function calculateNextReview(card: Flashcard, response: 'again' | 'hard' | 'good' | 'easy'): Partial<Flashcard> {
  let easeFactor = card.easeFactor;
  let interval = card.interval;
  let reviewCount = card.reviewCount + 1;

  switch (response) {
    case 'again':
      interval = 1;
      reviewCount = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case 'hard':
      interval = Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case 'good':
      if (reviewCount === 1) {
        interval = 1;
      } else if (reviewCount === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      break;
    case 'easy':
      if (reviewCount === 1) {
        interval = 4;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor = Math.min(2.5, easeFactor + 0.15);
      break;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor,
    interval,
    reviewCount,
    nextReview: nextReview.toISOString(),
    lastReviewed: new Date().toISOString(),
    mastered: response === 'easy' && reviewCount >= 3,
    updatedAt: new Date().toISOString()
  };
}

// AI Flashcard Generation
async function generateFlashcards(content: string, subject: string, count: number = 10): Promise<Partial<Flashcard>[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7
      }
    });

    const prompt = `Create ${count} flashcards for studying ${subject} based on the following content. 
Each flashcard should have a clear, concise question on the front and a comprehensive answer on the back.
Format your response as a JSON array where each object has "front" and "back" properties.

Content:
${content}

Requirements:
- Questions should test understanding, not just memorization
- Answers should be clear and educational
- Cover the most important concepts from the content
- Vary question types (definitions, applications, comparisons, etc.)
- Keep questions concise but specific

Response format:
[
  {"front": "Question here", "back": "Answer here"},
  {"front": "Question here", "back": "Answer here"}
]`;

    const result = await model.generateContent(prompt);
    
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const flashcards = JSON.parse(jsonMatch[0]);
    
    return flashcards.map((card: any) => ({
      front: card.front,
      back: card.back,
      difficulty: 'medium' as const,
      mastered: false,
      reviewCount: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
}

// API Endpoints

// Health Check
app.get('/health', async (_req, reply) => {
  return reply.send({ 
    ok: true, 
    service: 'FlashcardStudio Backend',
    timestamp: new Date().toISOString() 
  });
});

// Get all decks
app.get('/decks', async (_req, reply) => {
  try {
    await ensureStorage();
    const decks = await loadDecks();
    
    // Calculate real-time stats
    for (const deck of decks) {
      const cards = await loadCards(deck.id);
      deck.cardCount = cards.length;
      deck.masteredCount = cards.filter(c => c.mastered).length;
      deck.studiedCount = cards.filter(c => c.reviewCount > 0).length;
      deck.progress = deck.cardCount > 0 ? Math.round((deck.masteredCount / deck.cardCount) * 100) : 0;
    }

    return reply.send(decks);
  } catch (error) {
    console.error('Error loading decks:', error);
    return reply.code(500).send({ error: 'Failed to load decks' });
  }
});

// Get specific deck
app.get('/decks/:id', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const decks = await loadDecks();
    const deck = decks.find(d => d.id === id);
    
    if (!deck) {
      return reply.code(404).send({ error: 'Deck not found' });
    }

    // Update real-time stats
    const cards = await loadCards(deck.id);
    deck.cardCount = cards.length;
    deck.masteredCount = cards.filter(c => c.mastered).length;
    deck.studiedCount = cards.filter(c => c.reviewCount > 0).length;
    deck.progress = deck.cardCount > 0 ? Math.round((deck.masteredCount / deck.cardCount) * 100) : 0;

    return reply.send(deck);
  } catch (error) {
    console.error('Error loading deck:', error);
    return reply.code(500).send({ error: 'Failed to load deck' });
  }
});

// Create new deck
app.post('/decks', async (req, reply) => {
  try {
    const body = req.body as any;
    const { name, subject, description, color, tags } = body;

    if (!name || !subject) {
      return reply.code(400).send({ error: 'Name and subject are required' });
    }

    await ensureStorage();
    const decks = await loadDecks();
    
    const newDeck: FlashcardDeck = {
      id: uuidv4(),
      name,
      subject,
      description: description || '',
      cardCount: 0,
      studiedCount: 0,
      masteredCount: 0,
      lastStudied: '',
      difficulty: 'medium',
      progress: 0,
      color: color || 'bg-blue-500',
      isPublic: false,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1' // Simplified for now
    };

    decks.push(newDeck);
    await saveDecks(decks);
    
    // Initialize empty cards file
    await saveCards(newDeck.id, []);

    return reply.send(newDeck);
  } catch (error) {
    console.error('Error creating deck:', error);
    return reply.code(500).send({ error: 'Failed to create deck' });
  }
});

// Update deck
app.put('/decks/:id', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    
    const decks = await loadDecks();
    const deckIndex = decks.findIndex(d => d.id === id);
    
    if (deckIndex === -1) {
      return reply.code(404).send({ error: 'Deck not found' });
    }

    const updatedDeck = {
      ...decks[deckIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    decks[deckIndex] = updatedDeck;
    await saveDecks(decks);

    return reply.send(updatedDeck);
  } catch (error) {
    console.error('Error updating deck:', error);
    return reply.code(500).send({ error: 'Failed to update deck' });
  }
});

// Delete deck
app.delete('/decks/:id', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    
    const decks = await loadDecks();
    const filteredDecks = decks.filter(d => d.id !== id);
    
    if (filteredDecks.length === decks.length) {
      return reply.code(404).send({ error: 'Deck not found' });
    }

    await saveDecks(filteredDecks);
    
    // Delete associated cards file
    try {
      const cardsPath = path.join(DATA_DIR, 'cards', `${id}.json`);
      await fs.unlink(cardsPath);
    } catch {
      // Cards file might not exist, ignore error
    }

    return reply.send({ success: true });
  } catch (error) {
    console.error('Error deleting deck:', error);
    return reply.code(500).send({ error: 'Failed to delete deck' });
  }
});

// Get cards in a deck
app.get('/decks/:id/cards', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const cards = await loadCards(id);
    return reply.send(cards);
  } catch (error) {
    console.error('Error loading cards:', error);
    return reply.code(500).send({ error: 'Failed to load cards' });
  }
});

// Add card to deck
app.post('/decks/:id/cards', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const { front, back, difficulty } = body;

    if (!front || !back) {
      return reply.code(400).send({ error: 'Front and back are required' });
    }

    const cards = await loadCards(id);
    
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      difficulty: difficulty || 'medium',
      mastered: false,
      lastReviewed: '',
      reviewCount: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cards.push(newCard);
    await saveCards(id, cards);

    return reply.send(newCard);
  } catch (error) {
    console.error('Error adding card:', error);
    return reply.code(500).send({ error: 'Failed to add card' });
  }
});

// Update card
app.put('/cards/:id', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const { deckId } = body;

    if (!deckId) {
      return reply.code(400).send({ error: 'Deck ID is required' });
    }

    const cards = await loadCards(deckId);
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return reply.code(404).send({ error: 'Card not found' });
    }

    const updatedCard = {
      ...cards[cardIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    cards[cardIndex] = updatedCard;
    await saveCards(deckId, cards);

    return reply.send(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return reply.code(500).send({ error: 'Failed to update card' });
  }
});

// Delete card
app.delete('/cards/:id', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const { deckId } = req.query as { deckId: string };

    if (!deckId) {
      return reply.code(400).send({ error: 'Deck ID is required' });
    }

    const cards = await loadCards(deckId);
    const filteredCards = cards.filter(c => c.id !== id);
    
    if (filteredCards.length === cards.length) {
      return reply.code(404).send({ error: 'Card not found' });
    }

    await saveCards(deckId, filteredCards);

    return reply.send({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return reply.code(500).send({ error: 'Failed to delete card' });
  }
});

// Start study session
app.post('/study/session', async (req, reply) => {
  try {
    const body = req.body as any;
    const { deckId, sessionType } = body;

    if (!deckId) {
      return reply.code(400).send({ error: 'Deck ID is required' });
    }

    const cards = await loadCards(deckId);
    
    // Filter cards based on session type
    let studyCards: Flashcard[] = [];
    const now = new Date();

    switch (sessionType) {
      case 'review':
        studyCards = cards.filter(card => 
          new Date(card.nextReview) <= now && !card.mastered
        );
        break;
      case 'learn':
        studyCards = cards.filter(card => card.reviewCount === 0);
        break;
      case 'cram':
        studyCards = cards.slice(); // All cards
        break;
      default:
        studyCards = cards.filter(card => 
          new Date(card.nextReview) <= now || card.reviewCount === 0
        );
    }

    // Shuffle cards
    for (let i = studyCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [studyCards[i], studyCards[j]] = [studyCards[j], studyCards[i]];
    }

    const session: StudySession = {
      id: uuidv4(),
      deckId,
      userId: 'user_1', // Simplified
      startedAt: new Date().toISOString(),
      cardsReviewed: 0,
      cardsCorrect: 0,
      totalTime: 0,
      sessionType: sessionType || 'review',
      isCompleted: false
    };

    return reply.send({
      session,
      cards: studyCards.slice(0, 20) // Limit to 20 cards per session
    });
  } catch (error) {
    console.error('Error starting study session:', error);
    return reply.code(500).send({ error: 'Failed to start study session' });
  }
});

// Submit study response
app.post('/study/response', async (req, reply) => {
  try {
    const body = req.body as any;
    const { cardId, deckId, response, responseTime } = body;

    if (!cardId || !deckId || !response) {
      return reply.code(400).send({ error: 'Card ID, deck ID, and response are required' });
    }

    const cards = await loadCards(deckId);
    const cardIndex = cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return reply.code(404).send({ error: 'Card not found' });
    }

    // Calculate next review using spaced repetition
    const updates = calculateNextReview(cards[cardIndex], response);
    cards[cardIndex] = { ...cards[cardIndex], ...updates };

    await saveCards(deckId, cards);

    // Update deck last studied time
    const decks = await loadDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex !== -1) {
      decks[deckIndex].lastStudied = new Date().toISOString();
      await saveDecks(decks);
    }

    return reply.send({
      success: true,
      card: cards[cardIndex],
      nextReview: updates.nextReview
    });
  } catch (error) {
    console.error('Error submitting study response:', error);
    return reply.code(500).send({ error: 'Failed to submit response' });
  }
});

// Generate flashcards with AI
app.post('/generate/cards', async (req, reply) => {
  try {
    const body = req.body as any;
    const { content, subject, count, deckId } = body;

    if (!content || !subject) {
      return reply.code(400).send({ error: 'Content and subject are required' });
    }

    const generatedCards = await generateFlashcards(content, subject, count || 10);
    
    if (deckId) {
      // Add cards to existing deck
      const cards = await loadCards(deckId);
      const newCards = generatedCards.map(card => ({
        ...card,
        id: uuidv4(),
        lastReviewed: '',
      } as Flashcard));
      
      cards.push(...newCards);
      await saveCards(deckId, cards);
      
      return reply.send({ cards: newCards, addedToDeck: deckId });
    }

    return reply.send({ cards: generatedCards });
  } catch (error) {
    console.error('Error generating cards:', error);
    return reply.code(500).send({ error: 'Failed to generate cards' });
  }
});

// Get public decks
app.get('/public/decks', async (_req, reply) => {
  try {
    const decks = await loadDecks();
    const publicDecks = decks.filter(deck => deck.isPublic);
    
    return reply.send(publicDecks);
  } catch (error) {
    console.error('Error loading public decks:', error);
    return reply.code(500).send({ error: 'Failed to load public decks' });
  }
});

// Make deck public
app.post('/decks/:id/publish', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    
    const decks = await loadDecks();
    const deckIndex = decks.findIndex(d => d.id === id);
    
    if (deckIndex === -1) {
      return reply.code(404).send({ error: 'Deck not found' });
    }

    decks[deckIndex].isPublic = true;
    decks[deckIndex].updatedAt = new Date().toISOString();
    
    await saveDecks(decks);

    return reply.send({ success: true, deck: decks[deckIndex] });
  } catch (error) {
    console.error('Error publishing deck:', error);
    return reply.code(500).send({ error: 'Failed to publish deck' });
  }
});

// Clone public deck
app.post('/decks/:id/clone', async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    
    const decks = await loadDecks();
    const originalDeck = decks.find(d => d.id === id && d.isPublic);
    
    if (!originalDeck) {
      return reply.code(404).send({ error: 'Public deck not found' });
    }

    const originalCards = await loadCards(id);
    
    // Create cloned deck
    const clonedDeck: FlashcardDeck = {
      ...originalDeck,
      id: uuidv4(),
      name: `${originalDeck.name} (Copy)`,
      isPublic: false,
      cardCount: 0,
      studiedCount: 0,
      masteredCount: 0,
      progress: 0,
      lastStudied: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1' // Current user
    };

    // Clone cards with reset progress
    const clonedCards: Flashcard[] = originalCards.map(card => ({
      ...card,
      id: uuidv4(),
      mastered: false,
      lastReviewed: '',
      reviewCount: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    decks.push(clonedDeck);
    await saveDecks(decks);
    await saveCards(clonedDeck.id, clonedCards);

    return reply.send({ deck: clonedDeck, cardCount: clonedCards.length });
  } catch (error) {
    console.error('Error cloning deck:', error);
    return reply.code(500).send({ error: 'Failed to clone deck' });
  }
});

// Start Server
async function start() {
  try {
    await ensureStorage();
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🎯 FlashcardStudio Backend running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
