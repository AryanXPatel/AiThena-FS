import 'dotenv/config';
import Fastify from 'fastify';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4101;

const app = Fastify({ 
  logger: true,
  disableRequestLogging: false
});

// Add CORS support manually
app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (request.method === 'OPTIONS') {
    reply.send();
    return;
  }
});

app.get('/health', async (_req, reply) => {
  console.log('Health check requested');
  reply.send({ ok: true, status: 'DocIntel Backend is running', timestamp: new Date().toISOString() });
});

app.get('/documents', async (_req, reply) => {
  console.log('Documents requested');
  // Mock response for now
  reply.send([
    { id: '1', name: 'test.pdf', status: 'processed' }
  ]);
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  console.error('Server error:', error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`✅ DocIntel Backend successfully started on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
