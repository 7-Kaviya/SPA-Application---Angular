// controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByUserId, usersDb } from '../data/store';
import { generateToken } from '../middleware/auth';
import { LoginRequest, ApiResponse } from '../models';

export async function login(req: Request, res: Response): Promise<void> {
  const { userId, password, role } = req.body as LoginRequest;

  if (!userId || !password || !role) {
    const body: ApiResponse = { success: false, error: 'userId, password, and role are required', timestamp: new Date().toISOString() };
    res.status(400).json(body);
    return;
  }

  const user = findUserByUserId(userId);

  if (!user) {
    const body: ApiResponse = { success: false, error: 'Invalid credentials', timestamp: new Date().toISOString() };
    res.status(401).json(body);
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const body: ApiResponse = { success: false, error: 'Invalid credentials', timestamp: new Date().toISOString() };
    res.status(401).json(body);
    return;
  }

  // Role validation — must match DB role
  if (user.role !== role) {
    const body: ApiResponse = { success: false, error: `Role mismatch: account is registered as "${user.role}"`, timestamp: new Date().toISOString() };
    res.status(403).json(body);
    return;
  }

  if (!user.isActive) {
    const body: ApiResponse = { success: false, error: 'Account is deactivated. Contact your administrator.', timestamp: new Date().toISOString() };
    res.status(403).json(body);
    return;
  }

  // Update last login (in-memory)
  user.lastLogin = new Date().toISOString();

  const token = generateToken({ userId: user.userId, id: user.id, role: user.role, name: user.name });

  const body: ApiResponse = {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        lastLogin: user.lastLogin,
      }
    },
    message: `Welcome back, ${user.name}`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(body);
}

export function getMe(req: Request & { user?: any }, res: Response): void {
  const user = usersDb.find(u => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found', timestamp: new Date().toISOString() });
    return;
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, data: safeUser, timestamp: new Date().toISOString() });
}
