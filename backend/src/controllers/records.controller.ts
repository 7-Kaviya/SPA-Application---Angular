// controllers/records.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getRecordsForUser } from '../data/store';

export function getRecords(req: AuthRequest, res: Response): void {
  const user = req.user!;
  const delay = parseInt((req.query['delay'] as string) || '0', 10);

  const records = getRecordsForUser(user.id, user.role);

  // Apply optional filters
  const { status, priority, category, search } = req.query as Record<string, string>;
  let filtered = records;

  if (status)   filtered = filtered.filter(r => r.status === status);
  if (priority) filtered = filtered.filter(r => r.priority === priority);
  if (category) filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
  if (search)   filtered = filtered.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  res.json({
    success: true,
    data: {
      records: filtered,
      total: filtered.length,
      accessLevel: user.role,
      hiddenCount: user.role === 'general_user'
        ? getRecordsForUser('', 'admin').length - filtered.length
        : 0,
    },
    delay,
    timestamp: new Date().toISOString(),
  });
}
