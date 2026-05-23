// middleware/delay.ts — Simulates configurable API latency for async demo
import { Request, Response, NextFunction } from 'express';

/**
 * Query param: ?delay=2000  → waits 2 000 ms before continuing
 * Default when omitted: 0 ms
 * Maximum capped at 10 000 ms to prevent abuse
 */
export async function simulateDelay(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const raw = parseInt((req.query['delay'] as string) || '0', 10);
  const ms = Math.min(Math.max(isNaN(raw) ? 0 : raw, 0), 10_000);

  if (ms > 0) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
  next();
}
