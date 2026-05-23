import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import routes from './routes';

const app = express();
const PORT = process.env['PORT'] || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting — 100 requests per minute per IP
app.use('/api', rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     NEXUS Platform API  v1.0.0      ║
  ║     Running on port ${PORT}             ║
  ║                                      ║
  ║  Demo credentials:                   ║
  ║  Admin:  admin01 / Admin123         ║
  ║  User:   user01  / User123          ║
  ╚══════════════════════════════════════╝
  `);
});

export default app;