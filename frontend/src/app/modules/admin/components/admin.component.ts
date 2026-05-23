// modules/admin/components/admin.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User, CreateUserRequest } from '../../../core/models';
import { CreateUserModalComponent } from './create-user-modal.component';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-admin',
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <div class="async-bar" *ngIf="loading" style="position:fixed;top:60px;left:0;right:0;z-index:40"></div>

      <div class="content-area">

        <!-- Page header -->
        <div class="page-header animate-fade-up">
          <div>
            <div class="breadcrumb">
              <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
              <span class="breadcrumb-sep">/</span>
              <span>User Management</span>
            </div>
            <h1 class="page-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="var(--purple)" stroke-width="1.5" stroke-linejoin="round" fill="var(--purple-soft)"/>
              </svg>
              User Management
            </h1>
            <p class="page-subtitle" *ngIf="!loading">
              {{ users.length }} users · {{ activeCount }} active · {{ adminCount }} admins
            </p>
          </div>

          <div class="header-actions">
            <!-- Delay control -->
            <div class="inline-delay">
              <span class="text-muted" style="font-size:12px">API delay</span>
              <input type="range" class="delay-slider" [(ngModel)]="delay" min="0" max="4000" step="200"/>
              <span class="delay-val text-mono">{{ delay }}ms</span>
            </div>
            <button class="btn btn--primary" (click)="showModal = true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              New User
            </button>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid-4 mb-24">
          <app-stats-card [value]="users.length.toString()" label="Total Users"   color="blue"   [delay]="1">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7" cy="5.5" r="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M1 16c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13 8v5M15.5 10.5h-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </app-stats-card>

          <app-stats-card [value]="activeCount.toString()" label="Active"  color="green"  [delay]="2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </app-stats-card>

          <app-stats-card [value]="adminCount.toString()" label="Admins"   color="purple" [delay]="3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L11.5 6.5L17 7.3L13 11.2L14 16L9 13.5L4 16L5 11.2L1 7.3L6.5 6.5L9 1Z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </app-stats-card>

          <app-stats-card [value]="inactiveCount.toString()" label="Inactive" color="amber"  [delay]="4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 9h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </app-stats-card>
        </div>

        <!-- Toast notification -->
        <div class="toast" [class.toast--show]="toastMsg" [class.toast--error]="toastType === 'error'">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M5 7.5l2 2 3.5-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ toastMsg }}
        </div>

        <!-- Users table -->
        <div class="card card--elevated animate-fade-up animate-delay-2" style="opacity:0;padding:0;overflow:hidden">
          <div class="table-card-header">
            <div class="card-title">All Users</div>
            <button class="btn btn--ghost btn--sm" (click)="loadUsers()" [disabled]="loading">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" [class.spin]="loading">
                <path d="M13 2v4H9M1 12V8h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.5 8A6 6 0 0113 6M13.5 6a6 6 0 01-11.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Refresh
            </button>
          </div>

          <app-user-table
            [users]="users"
            [loading]="loading"
            [currentUserId]="currentUserId"
            (toggle)="onToggle($event)"
            (delete)="onDelete($event)">
          </app-user-table>
        </div>

      </div>
    </div>

    <!-- Create User Modal -->
    <app-create-user-modal
      #modalRef
      *ngIf="showModal"
      (close)="showModal = false"
      (created)="onCreateUser($event)">
    </app-create-user-modal>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 28px; opacity: 0; gap: 16px;
    }

    .breadcrumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--text-muted); margin-bottom: 8px;
    }
    .breadcrumb-link { color: var(--accent); text-decoration: none; &:hover { text-decoration: underline; } }
    .breadcrumb-sep  { color: var(--text-muted); }

    .page-title {
      font-size: 26px; font-weight: 700; letter-spacing: -0.04em;
      display: flex; align-items: center; gap: 10px;
    }
    .page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 5px; }

    .header-actions { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }

    .inline-delay {
      display: flex; align-items: center; gap: 8px;
    }
    .delay-slider {
      width: 100px; appearance: none;
      height: 4px; border-radius: 2px; background: var(--bg-elevated);
      outline: none; cursor: pointer;
      &::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); cursor: pointer; }
    }
    .delay-val { font-size: 12px; color: var(--accent); min-width: 44px; }

    .table-card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      .card-title { font-size: 14px; font-weight: 600; }
    }

    .toast {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--bg-surface); border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      padding: 12px 18px; font-size: 13px;
      display: flex; align-items: center; gap: 8px;
      box-shadow: var(--shadow-md);
      transform: translateY(80px); opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 200;
      color: var(--green);
      border-color: rgba(52,211,153,0.25);

      &--show  { transform: translateY(0); opacity: 1; }
      &--error { color: var(--rose); border-color: rgba(251,113,133,0.25); }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('modalRef') modalRef?: CreateUserModalComponent;

  users: User[] = [];
  loading = true;
  showModal = false;
  delay = environment.apiDelay;
  toastMsg = '';
  toastType: 'success' | 'error' = 'success';
  private destroy$ = new Subject<void>();

  constructor(private auth: AuthService, private userSvc: UserService) {}

  ngOnInit(): void { this.loadUsers(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  get currentUserId(): string { return this.auth.getCurrentUser()?.id || ''; }
  get activeCount():   number { return this.users.filter(u => u.isActive).length; }
  get adminCount():    number { return this.users.filter(u => u.role === 'admin').length; }
  get inactiveCount(): number { return this.users.filter(u => !u.isActive).length; }

  loadUsers(): void {
    this.loading = true;
    this.userSvc.getAllUsers(this.delay).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe(res => {
      if (res.success && res.data) this.users = res.data;
    });
  }

  onToggle(id: string): void {
    this.userSvc.toggleStatus(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        if (res.success && res.data) {
          const idx = this.users.findIndex(u => u.id === id);
          if (idx > -1) this.users[idx] = res.data;
          this.showToast(`User ${res.data.isActive ? 'activated' : 'deactivated'}`);
        }
      },
      error: () => this.showToast('Failed to update user', 'error'),
    });
  }

  onDelete(id: string): void {
    if (!confirm('Permanently delete this user?')) return;
    this.userSvc.deleteUser(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.showToast('User deleted');
      },
      error: () => this.showToast('Delete failed', 'error'),
    });
  }

  onCreateUser(payload: CreateUserRequest): void {
    if (this.modalRef) this.modalRef.submitting = true;
    this.userSvc.createUser(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.users = [...this.users, res.data];
          this.showModal = false;
          this.showToast('User created successfully');
        }
      },
      error: err => {
        this.modalRef?.setError(err.error?.error || 'Creation failed');
      },
    });
  }

  private showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMsg = msg;
    this.toastType = type;
    setTimeout(() => this.toastMsg = '', 3500);
  }
}
