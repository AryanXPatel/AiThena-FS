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

// Register multipart
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const qdrant = new QdrantClient({ url: QDRANT_URL });

type DocMeta = { id: string; name: string; pages: number };
type Chunk = { id: string; docId: string; pageStart: number; pageEnd: number; text: string; vector?: number[] };

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
    
    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
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
  await ensureStorage();
  const parts = await req.parts();
  let uploaded: { id: string } | null = null;
  for await (const part of parts) {
    if (part.type === 'file') {
      const id = `${Date.now()}`;
      const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
      const bufs: Buffer[] = [];
      for await (const chunk of part.file) bufs.push(chunk as Buffer);
      const buffer = Buffer.concat(bufs);
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
      
      // Generate smart document name based on content
      const smartName = await generateDocumentName(md);
      
      const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
      await fs.writeFile(cleanPath, md, 'utf8');

      const splitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
      const chunks = await splitter.splitText(md);
      const vectors = await embedTexts(chunks);

      // Ensure collection exists
      try {
        await qdrant.getCollection(QDRANT_COLLECTION);
      } catch {
        await qdrant.createCollection(QDRANT_COLLECTION, {
          vectors: { size: vectors[0]?.length || 384, distance: 'Cosine' },
        } as any);
      }

      await qdrant.upsert(QDRANT_COLLECTION, {
        points: chunks.map((text, i) => ({
          id: Number(`${id}${i}`),
          vector: vectors[i],
          payload: { docId: id, chunkId: i, text, documentName: smartName },
        })),
      });

      uploaded = { id, name: smartName };
    }
  }

  return reply.send(uploaded || { error: 'No file' });
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

app.post('/ask', async (req, reply) => {
  const body = (req.body || {}) as any;
  const query = String(body.query || '');
  const docId = body.docId ? String(body.docId) : undefined;
  const hard = Boolean(body.hard);
  if (!query) return reply.code(400).send({ error: 'Missing query' });

  const [queryVec] = await embedTexts([query]);
  const search = await qdrant.search(QDRANT_COLLECTION, {
    vector: queryVec,
    limit: TOP_K,
    filter: docId ? { must: [{ key: 'docId', match: { value: docId } }] } : undefined,
    with_payload: true,
  } as any);

  const contexts = (search || []).map((r: any) => r.payload?.text).filter(Boolean) as string[];
  const prompt = `You are a helpful document analysis assistant. Provide comprehensive, detailed answers strictly from the provided context.

Context:\n\n${contexts.map((c, i) => `[#${i + 1}] ${c}`).join('\n\n')}\n\nQuestion: ${query}\n\nProvide a detailed, thorough answer with explanations, examples, and analysis where appropriate. Cite sources using [#index] format.

Answer:`;

  // Always use Gemini 2.5 Pro for comprehensive responses
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-pro',
    systemInstruction: 'You are a comprehensive document analysis assistant. Provide detailed, thorough answers with proper analysis and cite sources by [#index].',
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
      topP: 0.8,
      topK: 40
    }
  });
  const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
  const answer = result.response.text();

  const citations = (search || []).map((r: any, idx: number) => ({
    docId: r.payload?.docId,
    chunkId: r.payload?.chunkId,
  }));

  reply.send({ answer, citations, usage: {} });
});

// Delete a document
app.delete('/documents/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  
  try {
    // Delete from Qdrant
    await qdrant.delete(QDRANT_COLLECTION, {
      filter: {
        must: [{ key: 'docId', match: { value: id } }]
      }
    });

    // Delete files from storage
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
    
    try {
      await fs.unlink(rawPath);
    } catch (e) {
      // File might not exist, that's ok
    }
    
    try {
      await fs.unlink(cleanPath);
    } catch (e) {
      // File might not exist, that's ok
    }

    reply.send({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    app.log.error('Delete error:', error);
    reply.status(500).send({ error: 'Failed to delete document' });
  }
});

// Get document metadata
app.get('/documents/:id/metadata', async (req, reply) => {
  const { id } = req.params as { id: string };
  
  try {
    const rawPath = path.join(STORAGE_DIR, 'raw', `${id}.pdf`);
    const cleanPath = path.join(STORAGE_DIR, 'clean', `${id}.md`);
    
    // Try to get smart name from Qdrant
    let smartName = `Document-${id}.pdf`;
    try {
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
      // Fallback to generic name
      console.log('Error getting smart name from Qdrant:', e);
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
    app.log.error('Metadata error:', error);
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
    app.log.error('Download error:', error);
    reply.status(404).send({ error: 'Document not found' });
  }
});

app.get('/health', async (_req, reply) => {
  reply.send({ ok: true });
});

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`DocIntel Backend listening on http://localhost:${PORT}`);
});


