// data/store.ts — In-memory data store (swap with MongoDB/DynamoDB adapter)
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, Record } from '../models';

// ─── Seed Users ────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 10;

function hashSync(pw: string): string {
  return bcrypt.hashSync(pw, SALT_ROUNDS);
}

export const usersDb: User[] = [
  {
    id: uuidv4(),
    userId: 'admin01',
    password: hashSync('Admin123'),
    name: 'Kaviya',
    email: 'kaviya.v@nexus.io',
    role: 'admin',
    department: 'Platform Engineering',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2025-05-22T14:32:10Z',
    isActive: true,
  },
  {
    id: uuidv4(),
    userId: 'user01',
    password: hashSync('User123'),
    name: 'Felix',
    email: 'felix.lee@nexus.io',
    role: 'general_user',
    department: 'Analytics',
    createdAt: '2024-02-10T09:00:00Z',
    lastLogin: '2025-05-21T11:15:00Z',
    isActive: true,
  },
  {
    id: uuidv4(),
    userId: 'user02',
    password: hashSync('User123'),
    name: 'Joshua',
    email: 'joshua.hong@nexus.io',
    role: 'general_user',
    department: 'Operations',
    createdAt: '2024-03-05T10:30:00Z',
    lastLogin: '2025-05-20T16:45:00Z',
    isActive: true,
  },
  {
    id: uuidv4(),
    userId: 'user03',
    password: hashSync('User123'),
    name: 'Vernon',
    email: 'vernon.chwe@nexus.io',
    role: 'general_user',
    department: 'Finance',
    createdAt: '2024-04-01T08:45:00Z',
    lastLogin: '2025-05-19T09:00:00Z',
    isActive: false,
  },
  {
    id: uuidv4(),
    userId: 'admin02',
    password: hashSync('Admin123'),
    name: 'Layana',
    email: 'layana.jeon@nexus.io',
    role: 'admin',
    department: 'Infrastructure',
    createdAt: '2024-01-20T07:30:00Z',
    lastLogin: '2025-05-22T08:00:00Z',
    isActive: true,
  },
];

// ─── Seed Records ──────────────────────────────────────────────────────────────
export const recordsDb: Record[] = [
  {
    id: uuidv4(),
    title: 'Q2 Revenue Analytics Pipeline',
    category: 'Analytics',
    status: 'active',
    priority: 'high',
    ownerId: usersDb[1].id,
    ownerName: usersDb[1].name,
    createdAt: '2025-04-01T09:00:00Z',
    updatedAt: '2025-05-20T14:00:00Z',
    value: 142500,
    tags: ['revenue', 'pipeline', 'Q2'],
    description: 'End-to-end analytics pipeline for Q2 revenue tracking across all business units.',
    accessLevel: 'restricted',
  },
  {
    id: uuidv4(),
    title: 'Infrastructure Cost Optimisation',
    category: 'Operations',
    status: 'pending',
    priority: 'critical',
    ownerId: usersDb[2].id,
    ownerName: usersDb[2].name,
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-05-18T11:30:00Z',
    value: 87000,
    tags: ['cloud', 'cost', 'infrastructure'],
    description: 'Cloud cost reduction initiative targeting 30% savings across AWS and GCP workloads.',
    accessLevel: 'confidential',
  },
  {
    id: uuidv4(),
    title: 'Vendor Contract Renewals FY2025',
    category: 'Finance',
    status: 'active',
    priority: 'medium',
    ownerId: usersDb[3].id,
    ownerName: usersDb[3].name,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-05-10T09:00:00Z',
    value: 320000,
    tags: ['vendor', 'contracts', 'FY2025'],
    description: 'Annual vendor contract renewal process for all third-party software and services.',
    accessLevel: 'public',
  },
  {
    id: uuidv4(),
    title: 'Platform Security Audit',
    category: 'Security',
    status: 'active',
    priority: 'critical',
    ownerId: usersDb[0].id,
    ownerName: usersDb[0].name,
    createdAt: '2025-05-01T07:00:00Z',
    updatedAt: '2025-05-22T16:00:00Z',
    value: 55000,
    tags: ['security', 'audit', 'compliance'],
    description: 'Comprehensive security audit covering OWASP top 10, access controls, and encryption at rest.',
    accessLevel: 'confidential',
  },
  {
    id: uuidv4(),
    title: 'Customer Onboarding Automation',
    category: 'Product',
    status: 'active',
    priority: 'high',
    ownerId: usersDb[1].id,
    ownerName: usersDb[1].name,
    createdAt: '2025-02-20T11:00:00Z',
    updatedAt: '2025-05-15T13:00:00Z',
    value: 98000,
    tags: ['onboarding', 'automation', 'product'],
    description: 'Automated customer onboarding flow reducing time-to-value from 14 days to 2 days.',
    accessLevel: 'restricted',
  },
  {
    id: uuidv4(),
    title: 'Data Residency Compliance (EU)',
    category: 'Compliance',
    status: 'pending',
    priority: 'high',
    ownerId: usersDb[4].id,
    ownerName: usersDb[4].name,
    createdAt: '2025-03-01T09:30:00Z',
    updatedAt: '2025-05-12T10:00:00Z',
    value: 62000,
    tags: ['GDPR', 'data-residency', 'EU'],
    description: 'GDPR data residency implementation ensuring all EU customer data stays within EU regions.',
    accessLevel: 'restricted',
  },
  {
    id: uuidv4(),
    title: 'Mobile App Redesign Sprint',
    category: 'Product',
    status: 'closed',
    priority: 'medium',
    ownerId: usersDb[1].id,
    ownerName: usersDb[1].name,
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-04-30T17:00:00Z',
    value: 210000,
    tags: ['mobile', 'UX', 'redesign'],
    description: 'Complete redesign of mobile application improving NPS from 32 to 67.',
    accessLevel: 'public',
  },
  {
    id: uuidv4(),
    title: 'Disaster Recovery Plan 2025',
    category: 'Operations',
    status: 'active',
    priority: 'critical',
    ownerId: usersDb[4].id,
    ownerName: usersDb[4].name,
    createdAt: '2025-04-15T08:00:00Z',
    updatedAt: '2025-05-20T15:30:00Z',
    value: 44000,
    tags: ['DR', 'backup', 'RTO'],
    description: 'Updated disaster recovery plan with RTO of 4 hours and RPO of 1 hour.',
    accessLevel: 'confidential',
  },
  {
    id: uuidv4(),
    title: 'API Rate Limiting Strategy',
    category: 'Engineering',
    status: 'archived',
    priority: 'low',
    ownerId: usersDb[0].id,
    ownerName: usersDb[0].name,
    createdAt: '2024-11-10T10:00:00Z',
    updatedAt: '2025-02-28T12:00:00Z',
    value: 18000,
    tags: ['API', 'rate-limit', 'engineering'],
    description: 'Design document and implementation for API rate limiting using token bucket algorithm.',
    accessLevel: 'public',
  },
  {
    id: uuidv4(),
    title: 'Quarterly OKR Review Dashboard',
    category: 'Analytics',
    status: 'active',
    priority: 'medium',
    ownerId: usersDb[2].id,
    ownerName: usersDb[2].name,
    createdAt: '2025-04-01T08:30:00Z',
    updatedAt: '2025-05-22T09:00:00Z',
    value: 32000,
    tags: ['OKR', 'dashboard', 'reporting'],
    description: 'Real-time OKR tracking dashboard visible to all leadership, updated from Jira and Salesforce.',
    accessLevel: 'restricted',
  },
];

// ─── Helper accessors ──────────────────────────────────────────────────────────
export function findUserByUserId(userId: string): User | undefined {
  return usersDb.find(u => u.userId === userId);
}

export function findUserById(id: string): User | undefined {
  return usersDb.find(u => u.id === id);
}

export function getRecordsForUser(userId: string, role: string): Record[] {
  if (role === 'admin') return recordsDb;
  // General users see public + restricted records (not confidential) + their own
  const user = findUserById(userId);
  return recordsDb.filter(r =>
    r.accessLevel !== 'confidential' || (user && r.ownerId === user.id)
  );
}
