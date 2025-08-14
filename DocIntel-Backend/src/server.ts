import 'dotenv/config';
import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { CharacterTextSplitter } from 'langchain/text_splitter';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4101;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || 'aithena_docs';
const STORAGE_DIR = process.env.STORAGE_DIR || path.resolve(process.cwd(), 'data');
const TOP_K = Number(process.env.TOP_K || '5');

const app = Fastify({ logger: true });

// Register CORS
app.register(cors, {
  origin: ['http://localhost:3000'], // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register multipart with better configuration
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
    fields: 10,
    parts: 10
  },
  throwFileSizeLimit: false,
  attachFieldsToBody: false
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const qdrant = new QdrantClient({ url: QDRANT_URL });

type DocMeta = { id: string; name: string; pages: number };
type Chunk = { id: string; docId: string; pageStart: number; pageEnd: number; text: string; vector?: number[] };

// Chat session types
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentIds?: string[];
  citations?: Array<{ docId: string; chunkId: number }>;
};

type ChatSession = {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  targetDocuments?: string[]; // null means all documents
};

// In-memory chat session storage (in production, use Redis or database)
const chatSessions = new Map<string, ChatSession>();

async function ensureStorage() {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.mkdir(path.join(STORAGE_DIR, 'raw'), { recursive: true });
  await fs.mkdir(path.join(STORAGE_DIR, 'clean'), { recursive: true });
}

async function generateDocumentName(textContent: string): Promise<string> {
  try {
    // Take first 1000 characters to avoid excessive token usage
    const snippet = textContent.substring(0, 1000);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',  // Use flash for this quick task
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.3
      }
    });
    
    const prompt = `Based on this document snippet, generate a concise, descriptive filename (2-6 words max, no extension):

"${snippet}"

Filename:`;
    
    const result = await model.generateContent(prompt);
    const generatedName = result.response.text().trim().replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
    
    console.log('Generated smart name:', generatedName);
    
    // Fallback if generation fails or is too short
    if (generatedName.length < 3) {
      console.log('Generated name too short, using fallback');
      return 'Document';
    }
    
    return generatedName.substring(0, 50); // Limit length
  } catch (error) {
    console.error('Error generating document name:', error);
    return 'Document';
  }
}

async function extractPdfText(buffer: Buffer): Promise<{ perPage: string[] }>
{
  try {
    const parsed = await pdfParse(buffer);
    // pdf-parse returns full text; we approximate per-page by splitting on \f
    const perPage = (parsed.text || '').split('\f');
    return { perPage };
  } catch (error) {
    console.error('PDF parsing error:', error);
    // If pdf-parse fails, return empty pages - we'll handle OCR later
    return { perPage: [''] };
  }
}

function looksGarbled(text: string): boolean {
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const ratio = letters / Math.max(1, text.length);
  return ratio < 0.2 || text.trim().length < 20;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  // Minimal local embedding using Xenova/transformers:
  // Lazy import to avoid cold start cost
  const { pipeline } = await import('@xenova/transformers');
  const embedder: any = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
  const results: number[][] = [];
  for (const t of texts) {
    const out = await embedder(t, { pooling: 'mean', normalize: true });
    const vec = Array.from(out.data as Float32Array);
    results.push(vec);
  }
  return results;
}

app.post('/upload', async (req, reply) => {
  try {
    console.log('[upload] Starting file upload...');
    await ensureStorage();
    
    // Use the single file approach instead of parts iterator
    const data = await req.file();
    
    if (!data) {
      console.log('[upload] No file found in request');
      return reply.code(400).send({ error: 'No file provided' });
    }
    
    console.log(`[upload] Processing file: ${data.filename}, mimetype: ${data.mimetype}`);
    
    // Accept both application/pdf and other common PDF mimetypes
    if (!data.mimetype?.includes('pdf') && !data.filename?.toLowerCase().endsWith('.pdf')) {
      console.log(`[upload] Invalid file type: ${data.mimetype}, filename: ${data.filename}`);
      return reply.code(400).send({ error: 'Only PDF files are supported' });
    }
    
    const id = `${Date.now()}`;
    console.log(`[upload] Processing file with ID: ${id}`);
    
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    const buffer = await data.toBuffer();
    
    console.log(`[upload] File size: ${buffer.length} bytes`);
    await fs.writeFile(rawPath, buffer);

    const { perPage } = await extractPdfText(buffer);
    const needOcr: number[] = [];
    perPage.forEach((p, idx) => {
      if (looksGarbled(p)) needOcr.push(idx + 1);
    });

    // TODO: OCR specific pages via tesseract.js if needed (omitted for brevity)
    // In this minimal version, we keep pdf-parse output; you can extend OCR later.

    const md = perPage
      .map((p, i) => `\n\n<!-- page:${i + 1} -->\n\n${p.trim()}`)
      .join('\n');
    
    console.log(`[upload] Extracted text: ${md.length} characters`);
    
    // Generate smart document name based on content
    const smartName = await generateDocumentName(md);
    console.log(`[upload] Generated name: ${smartName}`);
    
    const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
    await fs.writeFile(cleanPath, md, 'utf8');

    const splitter = new CharacterTextSplitter({ 
      chunkSize: 700, // Further reduced to ensure no oversized chunks
      chunkOverlap: 80, // Reduced overlap proportionally
      separator: '\n\n', // Use paragraph breaks as primary separator
      keepSeparator: false
    });
    const chunks = await splitter.splitText(md);
    
    // Filter out empty chunks and enforce strict max size
    const validChunks = chunks
      .filter(chunk => chunk.trim().length > 0)
      .map(chunk => {
        if (chunk.length > 750) {
          // Find a good break point (sentence or paragraph)
          const breakPoint = chunk.lastIndexOf('.', 750) || chunk.lastIndexOf('\n', 750) || 750;
          return chunk.substring(0, breakPoint).trim() + '...';
        }
        return chunk;
      });
    
    console.log(`[upload] Created ${validChunks.length} chunks (max size: ${Math.max(...validChunks.map(c => c.length))})`);
    const vectors = await embedTexts(validChunks);

    // Ensure collection exists
    try {
      await qdrant.getCollection(QDRANT_COLLECTION);
      console.log(`[upload] Using existing collection: ${QDRANT_COLLECTION}`);
    } catch {
      console.log(`[upload] Creating new collection: ${QDRANT_COLLECTION}`);
      await qdrant.createCollection(QDRANT_COLLECTION, {
        vectors: { size: vectors[0]?.length || 384, distance: 'Cosine' },
      } as any);
    }

    console.log(`[upload] Upserting ${validChunks.length} vectors to Qdrant...`);
    await qdrant.upsert(QDRANT_COLLECTION, {
      points: validChunks.map((text, i) => ({
        id: Number(`${id}${i.toString().padStart(3, '0')}`), // Better ID format
        vector: vectors[i],
        payload: { docId: id, chunkId: i, text, documentName: smartName },
      })),
    });

    console.log(`[upload] Successfully uploaded document: ${id}`);
    return reply.send({ id, name: smartName });
  } catch (error) {
    console.error('[upload] Upload error:', error);
    return reply.code(500).send({ error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/documents', async (_req, reply) => {
  await ensureStorage();
  const files = await fs.readdir(path.join(STORAGE_DIR, 'clean')).catch(() => []);
  const docs = files.filter((f) => f.endsWith('.md')).map((f) => ({ id: path.basename(f, '.md') }));
  reply.send(docs);
});

app.get('/documents/:id/chunks', async (req, reply) => {
  const id = (req.params as any).id as string;
  const file = path.join(STORAGE_DIR, 'clean', `${id}.md`);
  const md = await fs.readFile(file, 'utf8').catch(() => '');
  const splitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
  const chunks = await splitter.splitText(md);
  reply.send({ id, chunks });
});

// Enhanced chat endpoint with session support
app.post('/chat', async (req, reply) => {
  try {
    const body = (req.body || {}) as any;
    const query = String(body.query || '');
    const sessionId = String(body.sessionId || `session_${Date.now()}`);
    const targetDocuments = body.targetDocuments || null; // null = all documents, array = specific docs
    
    if (!query) return reply.code(400).send({ error: 'Missing query' });

    console.log(`[chat] Processing query in session ${sessionId}: "${query}"`);
    console.log(`[chat] Target documents:`, targetDocuments || 'all');

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.error('[chat] GEMINI_API_KEY not configured');
      return reply.code(500).send({ error: 'AI service not configured' });
    }

    // Get or create chat session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        targetDocuments
      };
      chatSessions.set(sessionId, session);
      console.log(`[chat] Created new session: ${sessionId}`);
    } else {
      session.updatedAt = new Date();
      if (targetDocuments) {
        session.targetDocuments = targetDocuments;
      }
      console.log(`[chat] Using existing session: ${sessionId} (${session.messages.length} messages)`);
    }

    // Generate embeddings for the query
    console.log('[chat] Generating embeddings...');
    const [queryVec] = await embedTexts([query]);
    console.log(`[chat] Generated embedding with ${queryVec.length} dimensions`);

    // Search for relevant documents with optional filtering
    console.log('[chat] Searching in Qdrant...');
    let filter = undefined;
    if (session.targetDocuments && session.targetDocuments.length > 0) {
      filter = {
        should: session.targetDocuments.map(docId => ({ key: 'docId', match: { value: docId } }))
      };
    }

    const search = await qdrant.search(QDRANT_COLLECTION, {
      vector: queryVec,
      limit: TOP_K,
      filter,
      with_payload: true,
    } as any);

    console.log(`[chat] Found ${search.length} relevant chunks`);
    
    if (search.length === 0) {
      const noResultsMsg = session.targetDocuments && session.targetDocuments.length > 0 
        ? `I couldn't find relevant information in the selected document(s) for your query.`
        : `I couldn't find any relevant information in the uploaded documents for your query.`;
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: noResultsMsg,
        timestamp: new Date(),
        citations: []
      };
      
      session.messages.push(
        {
          id: `msg_${Date.now() - 1}`,
          role: 'user',
          content: query,
          timestamp: new Date(),
          documentIds: session.targetDocuments || []
        },
        assistantMessage
      );
      
      return reply.send({ 
        sessionId,
        answer: noResultsMsg,
        citations: [],
        chatHistory: session.messages.slice(-10), // Return last 10 messages
        usage: {}
      });
    }

    const contexts = (search || []).map((r: any) => r.payload?.text).filter(Boolean) as string[];
    const documentIds = [...new Set((search || []).map((r: any) => r.payload?.docId).filter(Boolean))];
    console.log(`[chat] Using ${contexts.length} contexts from ${documentIds.length} documents`);

    // Build conversation history for context
    const conversationHistory = session.messages.slice(-6) // Last 6 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const hasHistory = session.messages.length > 0;
    const contextualPrompt = hasHistory 
      ? `You are a helpful document analysis assistant engaged in an ongoing conversation. Use the conversation history and provided context to give relevant, contextual responses.

Conversation History:
${conversationHistory}

Current Context from Documents:
${contexts.map((c, i) => `[#${i + 1}] ${c}`).join('\n\n')}

Current Question: ${query}

Provide a detailed, conversational response that acknowledges the conversation history and answers the current question using the document context. Cite sources using [#index] format.

Answer:`
      : `You are a helpful document analysis assistant. Provide comprehensive, detailed answers strictly from the provided context.

Context:
${contexts.map((c, i) => `[#${i + 1}] ${c}`).join('\n\n')}

Question: ${query}

Provide a detailed, thorough answer with explanations, examples, and analysis where appropriate. Cite sources using [#index] format.

Answer:`;

    // Use Gemini 2.5 Flash for compatibility
    console.log('[chat] Initializing Gemini 2.5 Flash...');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are a comprehensive document analysis assistant engaged in ongoing conversations. Provide detailed, contextual responses and cite sources accurately.',
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
    
    // For Gemini 2.5, use chat session
    console.log('[chat] Starting chat session...');
    const chat = model.startChat({});
    
    const result = await chat.sendMessage(contextualPrompt);
    
    // Extract text with fallback
    console.log('[chat] Extracting response text...');
    let answer: string;
    try {
      answer = result.response.text();
      console.log('[chat] Successfully extracted text using response.text()');
    } catch (error) {
      console.log('[chat] response.text() failed, trying fallback...');
      const candidates = result.response.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
        answer = candidates[0].content.parts.map(part => part.text).join('');
        console.log('[chat] Successfully extracted text using candidates.parts fallback');
      } else {
        console.error('[chat] No response text available in any format');
        throw new Error('No response text available');
      }
    }

    // Check for empty response
    if (!answer || answer.trim().length === 0) {
      answer = "I apologize, but I wasn't able to generate a response. Please try rephrasing your question.";
    }

    const citations = (search || []).map((r: any, idx: number) => ({
      docId: r.payload?.docId,
      chunkId: r.payload?.chunkId,
    }));

    // Save messages to session
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
      documentIds: documentIds
    };

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
      documentIds: documentIds,
      citations
    };

    session.messages.push(userMessage, assistantMessage);

    console.log(`[chat] Completed successfully with ${answer.length} characters`);
    reply.send({ 
      sessionId,
      answer, 
      citations, 
      chatHistory: session.messages.slice(-10), // Return last 10 messages
      documentIds: documentIds,
      usage: {} 
    });
    
  } catch (error) {
    console.error('[chat] Error processing query:', error);
    reply.code(500).send({ 
      error: 'Failed to process query',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Keep the old /ask endpoint for backward compatibility
app.post('/ask', async (req, reply) => {
  // Redirect to new chat endpoint
  const body = req.body as any;
  const updatedBody = { ...body, sessionId: `legacy_${Date.now()}` };
  return app.inject({
    method: 'POST',
    url: '/chat',
    payload: updatedBody,
    headers: req.headers as any
  }).then(response => {
    const data = JSON.parse(response.payload);
    // Return in old format for compatibility
    reply.send({
      answer: data.answer,
      citations: data.citations,
      usage: data.usage || {}
    });
  });
});

// Delete a document
app.delete('/documents/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  
  try {
    console.log(`[delete] Deleting document: ${id}`);
    
    // Delete from Qdrant with better error handling
    try {
      await qdrant.delete(QDRANT_COLLECTION, {
        filter: {
          must: [{ key: 'docId', match: { value: id } }]
        }
      });
      console.log(`[delete] Removed vectors from Qdrant for doc: ${id}`);
    } catch (qdrantError) {
      console.log(`[delete] Qdrant delete failed (collection might not exist): ${qdrantError instanceof Error ? qdrantError.message : 'Unknown error'}`);
      // Continue with file deletion even if Qdrant fails
    }

    // Delete files from storage
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
    
    let filesDeleted = 0;
    
    try {
      await fs.unlink(rawPath);
      filesDeleted++;
      console.log(`[delete] Deleted raw file: ${rawPath}`);
    } catch (e) {
      console.log(`[delete] Raw file not found or already deleted: ${rawPath}`);
    }
    
    try {
      await fs.unlink(cleanPath);
      filesDeleted++;
      console.log(`[delete] Deleted clean file: ${cleanPath}`);
    } catch (e) {
      console.log(`[delete] Clean file not found or already deleted: ${cleanPath}`);
    }

    console.log(`[delete] Successfully deleted document ${id} (${filesDeleted} files removed)`);
    reply.send({ success: true, message: 'Document deleted successfully', filesDeleted });
  } catch (error) {
    console.error('[delete] Unexpected error:', error);
    reply.status(500).send({ error: 'Failed to delete document', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get document metadata
app.get('/documents/:id/metadata', async (req, reply) => {
  const { id } = req.params as { id: string };
  
  try {
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
    
    // Try to get smart name from Qdrant with better error handling
    let smartName = `Document-${id}.pdf`;
    try {
      // Check if collection exists first
      await qdrant.getCollection(QDRANT_COLLECTION);
      
      // Use scroll instead of search to avoid vector issues
      const scrollResult = await qdrant.scroll(QDRANT_COLLECTION, {
        filter: { must: [{ key: 'docId', match: { value: id } }] },
        limit: 1,
        with_payload: true,
        with_vector: false
      });
      
      if (scrollResult.points.length > 0 && scrollResult.points[0].payload?.documentName) {
        smartName = `${scrollResult.points[0].payload.documentName}.pdf`;
      }
    } catch (e) {
      // Fallback to generic name - don't log as error since this is expected after collection reset
      console.log(`[metadata] Using fallback name for doc ${id} (Qdrant unavailable)`);
    }
    
    let metadata: any = {
      id,
      name: smartName,
      status: 'unknown',
      uploadDate: new Date().toISOString().split('T')[0],
      size: 'Unknown',
      type: 'pdf'
    };

    // Try to get file stats
    try {
      const stats = await fs.stat(rawPath);
      metadata.uploadDate = stats.birthtime.toISOString().split('T')[0];
      metadata.size = `${(stats.size / (1024 * 1024)).toFixed(1)} MB`;
      metadata.status = 'uploaded';
    } catch (e) {
      // File doesn't exist
    }

    // Check if processed
    try {
      await fs.access(cleanPath);
      metadata.status = 'processed';
      
      // Try to read processed markdown for page count
      try {
        const cleanData = await fs.readFile(cleanPath, 'utf-8');
        const pageMatches = cleanData.match(/<!-- page:\d+ -->/g);
        metadata.pages = pageMatches ? pageMatches.length : 1;
        metadata.summary = `Document with ${metadata.pages} page(s)`;
      } catch (e) {
        metadata.pages = 1;
        metadata.summary = 'Document with 1 page(s)';
      }
    } catch (e) {
      // Not processed yet
      if (metadata.status === 'uploaded') {
        metadata.status = 'processing';
      }
    }

    reply.send(metadata);
  } catch (error) {
    console.error('Metadata error:', error);
    reply.status(500).send({ error: 'Failed to get document metadata' });
  }
});

// Download/export document
app.get('/documents/:id/download', async (req, reply) => {
  const { id } = req.params as { id: string };
  
  try {
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    
    // Check if file exists
    await fs.access(rawPath);
    
    // Set headers for file download
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename="Document-${id}.pdf"`);
    
    // Send file
    const fileBuffer = await fs.readFile(rawPath);
    reply.send(fileBuffer);
  } catch (error) {
    console.error('Download error:', error);
    reply.status(404).send({ error: 'Document not found' });
  }
});

// Chat session management endpoints
app.get('/chat/sessions', async (_req, reply) => {
  const sessions = Array.from(chatSessions.values()).map(session => ({
    id: session.id,
    messageCount: session.messages.length,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    targetDocuments: session.targetDocuments,
    lastMessage: session.messages[session.messages.length - 1]?.content.substring(0, 100) || null
  }));
  reply.send({ sessions });
});

app.get('/chat/sessions/:sessionId', async (req, reply) => {
  const { sessionId } = req.params as { sessionId: string };
  const session = chatSessions.get(sessionId);
  
  if (!session) {
    return reply.code(404).send({ error: 'Session not found' });
  }
  
  reply.send({
    sessionId,
    messages: session.messages,
    targetDocuments: session.targetDocuments,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt
  });
});

app.delete('/chat/sessions/:sessionId', async (req, reply) => {
  const { sessionId } = req.params as { sessionId: string };
  const deleted = chatSessions.delete(sessionId);
  
  if (!deleted) {
    return reply.code(404).send({ error: 'Session not found' });
  }
  
  reply.send({ success: true, message: 'Session deleted' });
});

app.post('/chat/sessions/:sessionId/target', async (req, reply) => {
  const { sessionId } = req.params as { sessionId: string };
  const { targetDocuments } = req.body as { targetDocuments: string[] | null };
  
  const session = chatSessions.get(sessionId);
  if (!session) {
    return reply.code(404).send({ error: 'Session not found' });
  }
  
  session.targetDocuments = targetDocuments || undefined;
  session.updatedAt = new Date();
  
  reply.send({ 
    success: true, 
    sessionId,
    targetDocuments: session.targetDocuments,
    message: targetDocuments 
      ? `Now targeting ${targetDocuments.length} specific document(s)`
      : 'Now targeting all documents'
  });
});

// Test upload endpoint
app.post('/test-upload', async (req, reply) => {
  try {
    console.log('[test-upload] Headers:', req.headers);
    console.log('[test-upload] Content-Type:', req.headers['content-type']);
    
    const data = await req.file();
    console.log('[test-upload] File data:', data ? 'present' : 'missing');
    
    if (data) {
      console.log('[test-upload] Filename:', data.filename);
      console.log('[test-upload] Mimetype:', data.mimetype);
      console.log('[test-upload] Encoding:', data.encoding);
    }
    
    reply.send({ success: true, hasFile: !!data });
  } catch (error) {
    console.error('[test-upload] Error:', error);
    reply.code(500).send({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/health', async (_req, reply) => {
  reply.send({ ok: true });
});

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`DocIntel Backend listening on http://localhost:${PORT}`);
});


