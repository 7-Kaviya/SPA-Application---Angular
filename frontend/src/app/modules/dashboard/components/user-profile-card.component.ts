// modules/dashboard/components/user-profile-card.component.ts
import { Component, Input } from '@angular/core';
import { User } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-user-profile-card',
  template: `
    <div class="profile-card animate-fade-up">
      <div class="profile-header">
        <div class="avatar-wrap">
          <div class="avatar">{{ initials }}</div>
          <span class="status-dot" [class.status-dot--admin]="user?.role === 'admin'"></span>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">{{ user?.name }}</h2>
          <p class="profile-email">{{ user?.email }}</p>
        </div>
      </div>

      <div class="profile-badges">
        <span class="badge" [ngClass]="'badge--' + user?.role">
          {{ user?.role === 'admin' ? '★ Administrator' : '● General User' }}
        </span>
        <span class="badge badge--active" *ngIf="user?.isActive">Active</span>
      </div>

      <div class="profile-meta">
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <path d="M1 6h12" stroke="currentColor" stroke-width="1.3"/>
            <path d="M5 1v2M9 1v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <span>Joined {{ user?.createdAt | date:'MMM d, yyyy' }}</span>
        </div>
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
            <path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Last seen {{ user?.lastLogin | date:'MMM d, h:mm a' }}</span>
        </div>
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <path d="M4 7h6M4 9.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <span>{{ user?.department }}</span>
        </div>
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L3 4v4c0 2.5 2 4.5 4 5 2-0.5 4-2.5 4-5V4L7 1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          </svg>
          <span>{{ user?.userId }}</span>
        </div>
      </div>

      <!-- Access level indicator -->
      <div class="access-level">
        <p class="access-label">Data Access Level</p>
        <div class="access-bar-wrap">
          <div class="access-bar">
            <div class="access-bar-fill" [class.access-bar-fill--admin]="user?.role === 'admin'"></div>
          </div>
          <span class="access-text" *ngIf="user?.role === 'admin'">Full access — all records visible</span>
          <span class="access-text" *ngIf="user?.role !== 'admin'">Restricted — confidential records hidden</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      opacity: 0;
    }

    .profile-header {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 16px;
    }

    .avatar-wrap { position: relative; flex-shrink: 0; }

    .avatar {
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--purple));
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: #fff;
      letter-spacing: -0.02em;
    }

    .status-dot {
      position: absolute; bottom: 2px; right: 2px;
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--green);
      border: 2px solid var(--bg-secondary);

      &--admin { background: var(--purple); }
    }

    .profile-name  { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; }
    .profile-email { font-size: 13px; color: var(--text-muted); margin-top: 3px; }

    .profile-badges {
      display: flex; gap: 8px; flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .profile-meta {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-bottom: 18px;
    }

    .meta-item {
      display: flex; align-items: center; gap: 7px;
      font-size: 12.5px; color: var(--text-secondary);
      svg { color: var(--text-muted); flex-shrink: 0; }
    }

    .access-level {
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .access-label {
      font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--text-muted);
      margin-bottom: 8px;
    }

    .access-bar-wrap { display: flex; flex-direction: column; gap: 6px; }

    .access-bar {
      height: 4px; background: var(--bg-elevated);
      border-radius: 2px; overflow: hidden;
    }

    .access-bar-fill {
      height: 100%; border-radius: 2px;
      background: var(--accent);
      width: 60%;
      transition: width 0.6s ease;

      &--admin { width: 100%; background: linear-gradient(90deg, var(--accent), var(--purple)); }
    }

    .access-text { font-size: 12px; color: var(--text-secondary); }
  `]
})
export class UserProfileCardComponent {
  @Input() user: User | null = null;

  get initials(): string {
    return this.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
  }
}
