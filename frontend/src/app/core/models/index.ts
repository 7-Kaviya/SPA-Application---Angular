// core/models/index.ts — Shared interfaces mirroring the API contracts

export type UserRole = 'admin' | 'general_user';
export type RecordStatus = 'active' | 'pending' | 'closed' | 'archived';
export type RecordPriority = 'low' | 'medium' | 'high' | 'critical';
export type AccessLevel = 'public' | 'restricted' | 'confidential';

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface NexusRecord {
  id: string;
  title: string;
  category: string;
  status: RecordStatus;
  priority: RecordPriority;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  tags: string[];
  description: string;
  accessLevel: AccessLevel;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  delay?: number;
}

export interface RecordsResponse {
  records: NexusRecord[];
  total: number;
  accessLevel: UserRole;
  hiddenCount: number;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface CreateUserRequest {
  userId: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface LoadingState {
  records: boolean;
  users: boolean;
  profile: boolean;
}
