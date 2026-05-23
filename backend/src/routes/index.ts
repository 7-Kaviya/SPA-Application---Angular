// routes/index.ts — API route definitions
import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { getRecords } from '../controllers/records.controller';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, toggleUserStatus } from '../controllers/users.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { simulateDelay } from '../middleware/delay';

const router = Router();

// ── Auth ───────────────────────────────────────────────────────────────────────
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

// ── Records (authenticated) ────────────────────────────────────────────────────
router.get('/records', authenticate, simulateDelay, getRecords);

// ── Admin: User Management ─────────────────────────────────────────────────────
router.get('/admin/users', authenticate, requireAdmin, simulateDelay, getAllUsers);
router.get('/admin/users/:id', authenticate, requireAdmin, getUserById);
router.post('/admin/users', authenticate, requireAdmin, createUser);
router.patch('/admin/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/admin/users/:id', authenticate, requireAdmin, deleteUser);
router.patch('/admin/users/:id/toggle', authenticate, requireAdmin, toggleUserStatus);

// ── Health ─────────────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

export default router;
