// models/index.ts — Core data models for the Nexus Platform

export type UserRole = 'admin' | 'general_user';

export interface User {
  id: string;
  userId: string;       // login username
  password: string;     // hashed
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  avatar?: string;
}

export interface Record {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  tags: string[];
  description: string;
  accessLevel: 'public' | 'restricted' | 'confidential';
}

export interface AuthPayload {
  userId: string;
  id: string;
  role: UserRole;
  name: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  delay?: number;
}

export interface CreateUserRequest {
  userId: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  isActive?: boolean;
}
