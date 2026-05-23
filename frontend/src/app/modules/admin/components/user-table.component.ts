// modules/admin/components/user-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-user-table',
  template: `
    <div class="table-wrap" [class.table-wrap--loading]="loading">

      <!-- Skeleton -->
      <table *ngIf="loading">
        <thead>
          <tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let _ of [1,2,3,4,5]">
            <td colspan="6"><div class="skeleton" style="height:14px;width:100%;opacity:0.5"></div></td>
          </tr>
        </tbody>
      </table>

      <!-- Data table -->
      <table *ngIf="!loading">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users; let i = index"
            class="animate-fade-up" [ngClass]="'animate-delay-' + (i + 1)">

            <td>
              <div class="user-cell">
                <div class="mini-avatar" [class.mini-avatar--admin]="u.role === 'admin'">
                  {{ initials(u.name) }}
                </div>
                <div>
                  <div class="user-cell-name">{{ u.name }}</div>
                  <div class="user-cell-id text-mono">{{ u.userId }}</div>
                </div>
              </div>
            </td>

            <td>
              <span class="badge" [ngClass]="'badge--' + u.role">
                {{ u.role === 'admin' ? '★ Admin' : 'User' }}
              </span>
            </td>

            <td class="text-secondary" style="font-size:13px">{{ u.department }}</td>

            <td>
              <span class="badge" [ngClass]="u.isActive ? 'badge--active' : 'badge--archived'">
                <span class="dot"></span>
                {{ u.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td class="text-muted" style="font-size:12px; white-space:nowrap">
              {{ u.lastLogin ? (u.lastLogin | date:'MMM d, h:mm a') : 'Never' }}
            </td>

            <td>
              <div class="action-btns">
                <button class="btn btn--ghost btn--sm" (click)="toggle.emit(u.id)"
                  [title]="u.isActive ? 'Deactivate' : 'Activate'"
                  [disabled]="u.id === currentUserId">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path *ngIf="u.isActive" d="M2 7a5 5 0 0010 0M7 2v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                    <circle *ngIf="!u.isActive" cx="7" cy="7" r="5" stroke="var(--green)" stroke-width="1.4"/>
                    <path *ngIf="!u.isActive" d="M5 7l1.5 1.5L9 5.5" stroke="var(--green)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="btn btn--danger btn--sm" (click)="delete.emit(u.id)"
                  [disabled]="u.id === currentUserId"
                  title="Delete user">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5l.7-7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .user-cell { display: flex; align-items: center; gap: 10px; }

    .mini-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;

      &--admin { background: var(--purple-soft); color: var(--purple); }
    }

    .user-cell-name { font-size: 13.5px; font-weight: 500; }
    .user-cell-id   { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .action-btns { display: flex; gap: 6px; }
  `]
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Input() currentUserId = '';
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  }
}
