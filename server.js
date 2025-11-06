import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeSocket } from './lib/socket-server.js';
import 'dotenv/config';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // cPanel এ এভাবে
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // HTTP সার্ভার তৈরি করুন
  const httpServer = createServer(async (req, res) => {
    try {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Error:', req.url, err.message);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Socket.io initialize করুন
  const io = initializeSocket(httpServer);
  console.log('✅ Socket.io initialized');

  // সার্ভার listen করুন
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`✓ FabriXaa Production Server চলছে port ${port} এ`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    console.log(`✓ MongoDB: ${process.env.MONGODB_URI?.split('@')[1] || 'Connected'}`);
  });

  // Error handling
  httpServer.on('error', (err) => {
    console.error('❌ Server error:', err);
    if (err.code !== 'ERR_SOCKET_BAD_PORT') {
      process.exit(1);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⛔ Shutting down gracefully...');
    httpServer.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\n⛔ Interrupt signal received');
    httpServer.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  });
});
