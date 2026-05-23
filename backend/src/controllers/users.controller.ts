// controllers/users.controller.ts — Admin-only user management
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { usersDb } from '../data/store';
import { CreateUserRequest, UpdateUserRequest } from '../models';

export function getAllUsers(_req: AuthRequest, res: Response): void {
  const safe = usersDb.map(({ password: _, ...u }) => u);
  res.json({ success: true, data: safe, total: safe.length, timestamp: new Date().toISOString() });
}

export function getUserById(req: AuthRequest, res: Response): void {
  const user = usersDb.find(u => u.id === req.params['id']);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }
  const { password: _, ...safe } = user;
  res.json({ success: true, data: safe, timestamp: new Date().toISOString() });
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  const body = req.body as CreateUserRequest;

  if (!body.userId || !body.password || !body.name || !body.email || !body.role) {
    res.status(400).json({ success: false, error: 'Missing required fields: userId, password, name, email, role', timestamp: new Date().toISOString() });
    return;
  }

  if (usersDb.find(u => u.userId === body.userId)) {
    res.status(409).json({ success: false, error: `User ID "${body.userId}" already exists`, timestamp: new Date().toISOString() });
    return;
  }

  const hashed = await bcrypt.hash(body.password, 10);
  const newUser = {
    id: uuidv4(),
    userId: body.userId,
    password: hashed,
    name: body.name,
    email: body.email,
    role: body.role,
    department: body.department || 'Unassigned',
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  usersDb.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json({ success: true, data: safe, message: 'User created successfully', timestamp: new Date().toISOString() });
}

export function updateUser(req: AuthRequest, res: Response): void {
  const idx = usersDb.findIndex(u => u.id === req.params['id']);
  if (idx === -1) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }

  const updates = req.body as UpdateUserRequest;
  const user = usersDb[idx];

  if (updates.name)       user.name = updates.name;
  if (updates.email)      user.email = updates.email;
  if (updates.role)       user.role = updates.role;
  if (updates.department) user.department = updates.department;
  if (typeof updates.isActive === 'boolean') user.isActive = updates.isActive;

  const { password: _, ...safe } = user;
  res.json({ success: true, data: safe, message: 'User updated', timestamp: new Date().toISOString() });
}

export function deleteUser(req: AuthRequest, res: Response): void {
  const idx = usersDb.findIndex(u => u.id === req.params['id']);
  if (idx === -1) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }

  // Prevent self-deletion
  if (usersDb[idx].id === req.user?.id) {
    res.status(400).json({ success: false, error: 'Cannot delete your own account', timestamp: new Date().toISOString() });
    return;
  }

  usersDb.splice(idx, 1);
  res.json({ success: true, message: 'User deleted', timestamp: new Date().toISOString() });
}

export function toggleUserStatus(req: AuthRequest, res: Response): void {
  const user = usersDb.find(u => u.id === req.params['id']);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }

  if (user.id === req.user?.id) {
    res.status(400).json({ success: false, error: 'Cannot toggle your own status', timestamp: new Date().toISOString() });
    return;
  }

  user.isActive = !user.isActive;
  const { password: _, ...safe } = user;
  res.json({ success: true, data: safe, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, timestamp: new Date().toISOString() });
}
