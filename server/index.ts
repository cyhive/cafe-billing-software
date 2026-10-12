import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { connectDb, seedIfEmpty } from './db';
import { createApiRouter } from './api';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isProduction = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3001;

async function start() {
  await connectDb();
  await seedIfEmpty();

  const app = express();
  const httpServer = createServer(app);
  app.use('/api', createApiRouter());

  if (isProduction) {
    // Serve the built React app (run `npm run build` first)
    const dist = path.join(root, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    // Serve the React app through Vite with hot reload
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root,
      appType: 'spa',
      server: { middlewareMode: true, ws: { server: httpServer } },
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`NU Cafe POS running at http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
