import { Request, Response, Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const router = Router();
const DATA_DIR = path.resolve(process.cwd(), 'data/flashcards');

// Initialize Google AI (will use the same instance as main server)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

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

// Validation Schemas
const CreateDeckSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const CreateCardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

const StudyResponseSchema = z.object({
  cardId: z.string(),
  deckId: z.string(),
  response: z.enum(['again', 'hard', 'good', 'easy']),
  responseTime: z.number().optional(),
});

const GenerateCardsSchema = z.object({
  content: z.string().min(1),
  subject: z.string().min(1),
  count: z.number().int().min(1).max(50).optional(),
  deckId: z.string().optional(),
});

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

// Routes

// Get all decks
router.get('/decks', async (req: Request, res: Response) => {
  try {
    const decks = await loadDecks();
    
    // Calculate real-time stats
    for (const deck of decks) {
      const cards = await loadCards(deck.id);
      deck.cardCount = cards.length;
      deck.masteredCount = cards.filter(c => c.mastered).length;
      deck.studiedCount = cards.filter(c => c.reviewCount > 0).length;
      deck.progress = deck.cardCount > 0 ? Math.round((deck.masteredCount / deck.cardCount) * 100) : 0;
    }

    res.json(decks);
  } catch (error) {
    console.error('Error loading decks:', error);
    res.status(500).json({ error: 'Failed to load decks' });
  }
});

// Get specific deck
router.get('/decks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const decks = await loadDecks();
    const deck = decks.find(d => d.id === id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Update real-time stats
    const cards = await loadCards(deck.id);
    deck.cardCount = cards.length;
    deck.masteredCount = cards.filter(c => c.mastered).length;
    deck.studiedCount = cards.filter(c => c.reviewCount > 0).length;
    deck.progress = deck.cardCount > 0 ? Math.round((deck.masteredCount / deck.cardCount) * 100) : 0;

    res.json(deck);
  } catch (error) {
    console.error('Error loading deck:', error);
    res.status(500).json({ error: 'Failed to load deck' });
  }
});

// Create new deck
router.post('/decks', async (req: Request, res: Response) => {
  try {
    const { name, subject, description, color, tags } = CreateDeckSchema.parse(req.body);

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

    res.json(newDeck);
  } catch (error) {
    console.error('Error creating deck:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// Update deck
router.put('/decks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decks = await loadDecks();
    const deckIndex = decks.findIndex(d => d.id === id);
    
    if (deckIndex === -1) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const updatedDeck = {
      ...decks[deckIndex],
      ...req.body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    decks[deckIndex] = updatedDeck;
    await saveDecks(decks);

    res.json(updatedDeck);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

// Delete deck
router.delete('/decks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decks = await loadDecks();
    const filteredDecks = decks.filter(d => d.id !== id);
    
    if (filteredDecks.length === decks.length) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    await saveDecks(filteredDecks);
    
    // Delete associated cards file
    try {
      const cardsPath = path.join(DATA_DIR, 'cards', `${id}.json`);
      await fs.unlink(cardsPath);
    } catch {
      // Cards file might not exist, ignore error
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// Get cards in a deck
router.get('/decks/:id/cards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cards = await loadCards(id);
    res.json(cards);
  } catch (error) {
    console.error('Error loading cards:', error);
    res.status(500).json({ error: 'Failed to load cards' });
  }
});

// Add card to deck
router.post('/decks/:id/cards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { front, back, difficulty } = CreateCardSchema.parse(req.body);

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

    res.json(newCard);
  } catch (error) {
    console.error('Error adding card:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to add card' });
  }
});

// Update card
router.put('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deckId } = req.body;

    if (!deckId) {
      return res.status(400).json({ error: 'Deck ID is required' });
    }

    const cards = await loadCards(deckId);
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const updatedCard = {
      ...cards[cardIndex],
      ...req.body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    cards[cardIndex] = updatedCard;
    await saveCards(deckId, cards);

    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Delete card
router.delete('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deckId } = req.query as { deckId: string };

    if (!deckId) {
      return res.status(400).json({ error: 'Deck ID is required' });
    }

    const cards = await loadCards(deckId);
    const filteredCards = cards.filter(c => c.id !== id);
    
    if (filteredCards.length === cards.length) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await saveCards(deckId, filteredCards);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Start study session
router.post('/study/session', async (req: Request, res: Response) => {
  try {
    const { deckId, sessionType = 'review' } = req.body;

    if (!deckId) {
      return res.status(400).json({ error: 'Deck ID is required' });
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

    res.json({
      session,
      cards: studyCards.slice(0, 20) // Limit to 20 cards per session
    });
  } catch (error) {
    console.error('Error starting study session:', error);
    res.status(500).json({ error: 'Failed to start study session' });
  }
});

// Submit study response
router.post('/study/response', async (req: Request, res: Response) => {
  try {
    const { cardId, deckId, response, responseTime } = StudyResponseSchema.parse(req.body);

    const cards = await loadCards(deckId);
    const cardIndex = cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
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

    res.json({
      success: true,
      card: cards[cardIndex],
      nextReview: updates.nextReview
    });
  } catch (error) {
    console.error('Error submitting study response:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Generate flashcards with AI
router.post('/generate/cards', async (req: Request, res: Response) => {
  try {
    const { content, subject, count, deckId } = GenerateCardsSchema.parse(req.body);

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
      
      res.json({ cards: newCards, addedToDeck: deckId });
    } else {
      res.json({ cards: generatedCards });
    }
  } catch (error) {
    console.error('Error generating cards:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to generate cards' });
  }
});

// Get public decks
router.get('/public/decks', async (req: Request, res: Response) => {
  try {
    const decks = await loadDecks();
    const publicDecks = decks.filter(deck => deck.isPublic);
    
    res.json(publicDecks);
  } catch (error) {
    console.error('Error loading public decks:', error);
    res.status(500).json({ error: 'Failed to load public decks' });
  }
});

// Make deck public
router.post('/decks/:id/publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decks = await loadDecks();
    const deckIndex = decks.findIndex(d => d.id === id);
    
    if (deckIndex === -1) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    decks[deckIndex].isPublic = true;
    decks[deckIndex].updatedAt = new Date().toISOString();
    
    await saveDecks(decks);

    res.json({ success: true, deck: decks[deckIndex] });
  } catch (error) {
    console.error('Error publishing deck:', error);
    res.status(500).json({ error: 'Failed to publish deck' });
  }
});

// Clone public deck
router.post('/decks/:id/clone', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decks = await loadDecks();
    const originalDeck = decks.find(d => d.id === id && d.isPublic);
    
    if (!originalDeck) {
      return res.status(404).json({ error: 'Public deck not found' });
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

    res.json({ deck: clonedDeck, cardCount: clonedCards.length });
  } catch (error) {
    console.error('Error cloning deck:', error);
    res.status(500).json({ error: 'Failed to clone deck' });
  }
});

export default router;


