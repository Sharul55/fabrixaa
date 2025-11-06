import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeSocket } from './lib/socket-server.js';
import 'dotenv/config';

const dev = true; // Development mode
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // HTTP সার্ভার তৈরি করুন
  const httpServer = createServer(async (req, res) => {
    try {
      // CORS headers যোগ করুন
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
  httpServer.listen(port, hostname, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║        🚀 FabriXaa Development Server         ║
╠═══════════════════════════════════════════════╣
║ 🌐 API:        http://${hostname}:${port}              ║
║ 🔌 Socket.io:  ws://${hostname}:${port}            ║
║ 📱 Frontend:   http://${hostname}:${port}              ║
║ 🗄️  MongoDB:   ${process.env.MONGODB_URI?.split('@')[1] || 'Connecting...'} ║
╚═══════════════════════════════════════════════╝
    `);
  });

  // Error handling
  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} ইতিমধ্যে ব্যবহৃত। অন্য port চেষ্টা করুন:`);
      console.error(`   PORT=3001 npm run dev`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('\n⛔ SIGTERM পেয়েছি, সার্ভার বন্ধ করছি...');
    httpServer.close(() => {
      console.log('✓ সার্ভার বন্ধ হয়েছে');
      process.exit(0);
    });
  });
});
