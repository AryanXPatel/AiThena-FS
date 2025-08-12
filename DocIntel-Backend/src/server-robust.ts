import 'dotenv/config';
import Fastify from 'fastify';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4101;

// Create Fastify instance with proper error handling
const app = Fastify({ 
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  disableRequestLogging: false,
  trustProxy: true
});

// Register CORS plugin (install compatible version)
app.register(import('@fastify/cors'), {
  origin: true,
  credentials: true
});

// Add error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(500).send({ 
    error: 'Internal Server Error', 
    message: error.message,
    statusCode: 500 
  });
});

// Add request/response hooks for debugging
app.addHook('onRequest', async (request, reply) => {
  request.log.info({ method: request.method, url: request.url }, 'incoming request');
});

app.addHook('onResponse', async (request, reply) => {
  request.log.info({ 
    method: request.method, 
    url: request.url, 
    statusCode: reply.statusCode,
    responseTime: reply.getResponseTime()
  }, 'request completed');
});

// Routes
app.get('/health', async (request, reply) => {
  return { 
    ok: true, 
    status: 'DocIntel Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

app.get('/documents', async (request, reply) => {
  return [
    { 
      id: '1', 
      name: 'test.pdf', 
      status: 'processed',
      uploadDate: new Date().toISOString(),
      size: '1.2 MB'
    }
  ];
});

// Graceful shutdown
const gracefulShutdown = () => {
  app.log.info('Starting graceful shutdown...');
  app.close(() => {
    app.log.info('Server closed successfully');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
const start = async () => {
  try {
    const address = await app.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    
    app.log.info(`✅ DocIntel Backend successfully started`);
    app.log.info(`🌐 Server listening at ${address}`);
    app.log.info(`🔍 Health check: ${address}/health`);
    app.log.info(`📄 Documents API: ${address}/documents`);
    
  } catch (err) {
    app.log.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
