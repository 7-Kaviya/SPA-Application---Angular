// modules/dashboard/components/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subject, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RecordsService } from '../../../core/services/records.service';
import { User, NexusRecord, RecordsResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>

      <!-- Async loading indicator (header bar) -->
      <div class="async-bar" *ngIf="loadingRecords || loadingProfile" style="position:fixed;top:60px;left:0;right:0;z-index:40"></div>

      <div class="content-area">

        <!-- Welcome header -->
        <div class="page-header animate-fade-up">
          <div>
            <h1 class="page-title">
              Good {{ greeting }}, {{ firstName }}
              <span *ngIf="isAdmin" class="admin-crown">★</span>
            </h1>
            <p class="page-subtitle">
              {{ today | date:"EEEE, MMMM d, y" }}
              <span class="async-status" *ngIf="loadingRecords">
                <span class="async-dot"></span>
                Loading records with {{ delay }}ms async delay…
              </span>
            </p>
          </div>

          <div class="header-actions" *ngIf="isAdmin">
            <a routerLink="/admin" class="btn btn--secondary btn--sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L9 5.3L13.6 6L10.3 9.2L11 13.9L7 11.7L3 13.9L3.7 9.2L0.4 6L5 5.3L7 1Z"
                  stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              </svg>
              Manage Users
            </a>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid-4 mb-24">
          <app-stats-card
            [value]="statsLoading ? '—' : totalRecords.toString()"
            label="Total Records"
            color="blue"
            [trend]="12"
            [delay]="1">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 9h8M5 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </app-stats-card>

          <app-stats-card
            [value]="statsLoading ? '—' : activeCount.toString()"
            label="Active"
            color="green"
            [trend]="5"
            [delay]="2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="9" cy="9" r="3" fill="currentColor" opacity="0.6"/>
            </svg>
          </app-stats-card>

          <app-stats-card
            [value]="statsLoading ? '—' : pendingCount.toString()"
            label="Pending"
            color="amber"
            [trend]="-3"
            [delay]="3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M9 5v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </app-stats-card>

          <app-stats-card
            [value]="statsLoading ? '—' : criticalCount.toString()"
            label="Critical Priority"
            color="rose"
            [trend]="-8"
            [delay]="4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 15H2L9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M9 7v3M9 12.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </app-stats-card>
        </div>

        <!-- Main content: profile + records -->
        <div class="main-grid">

          <!-- Left: User Profile Card -->
          <div class="sidebar">
            <div *ngIf="loadingProfile">
              <div class="card" style="opacity:1">
                <div class="skeleton" style="height:52px;width:52px;border-radius:50%;margin-bottom:12px"></div>
                <div class="skeleton" style="height:18px;width:60%;margin-bottom:8px"></div>
                <div class="skeleton" style="height:14px;width:80%;margin-bottom:8px"></div>
                <div class="skeleton" style="height:14px;width:50%"></div>
              </div>
            </div>

            <app-user-profile-card *ngIf="!loadingProfile" [user]="user"></app-user-profile-card>

            <!-- Access level notice (general user) -->
            <div class="access-notice animate-fade-up animate-delay-2" *ngIf="!isAdmin && recordsData">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <p>You have access to <strong>{{ recordsData.total }}</strong> of
                {{ recordsData.total + recordsData.hiddenCount }} records.
                {{ recordsData.hiddenCount }} confidential records are hidden.
              </p>
            </div>

            <!-- Async delay control (demo feature) -->
            <div class="delay-control animate-fade-up animate-delay-3">
              <p class="delay-label">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M6.5 4v2.5L8.5 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                API Delay Demo
              </p>
              <div class="delay-slider-row">
                <input type="range" class="delay-slider"
                  [ngModel]="delay" (ngModelChange)="delay = $event"
                  min="0" max="5000" step="200"/>
                <span class="delay-value">{{ delay }}ms</span>
              </div>
              <button class="btn btn--secondary btn--sm w-full mt-8" (click)="loadRecords()">
                Fetch with delay
              </button>
            </div>
          </div>

          <!-- Right: Records Table -->
          <div class="records-area">
            <app-records-table
              [records]="records"
              [data]="recordsData"
              [loading]="loadingRecords"
              (filterChange)="onFilterChange($event)"
              (refresh)="loadRecords()">
            </app-records-table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 28px; opacity: 0;
    }

    .page-title {
      font-size: 26px; font-weight: 700; letter-spacing: -0.04em;
      display: flex; align-items: center; gap: 10px;
    }

    .admin-crown { font-size: 20px; color: var(--amber); }

    .page-subtitle {
      font-size: 14px; color: var(--text-muted);
      margin-top: 5px; display: flex; align-items: center; gap: 10px;
    }

    .async-status {
      display: flex; align-items: center; gap: 6px;
      color: var(--accent); font-size: 13px;
    }

    .async-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--accent);
      animation: pulse 1s ease-in-out infinite;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 24px;
      align-items: start;
    }

    .sidebar { display: flex; flex-direction: column; gap: 16px; }

    .access-notice {
      background: var(--accent-soft);
      border: 1px solid var(--accent-mid);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex; gap: 10px;
      font-size: 13px; color: var(--text-secondary);
      opacity: 0;
      svg { color: var(--accent); flex-shrink: 0; margin-top: 1px; }
      strong { color: var(--text-primary); }
    }

    .delay-control {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
      opacity: 0;
    }

    .delay-label {
      font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
      color: var(--text-muted); text-transform: uppercase;
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 12px;
    }

    .delay-slider-row {
      display: flex; align-items: center; gap: 10px;
    }

    .delay-slider {
      flex: 1; appearance: none;
      height: 4px; border-radius: 2px;
      background: var(--bg-elevated);
      outline: none; cursor: pointer;

      &::-webkit-slider-thumb {
        appearance: none; width: 14px; height: 14px;
        border-radius: 50%; background: var(--accent);
        cursor: pointer; transition: transform var(--transition);
        &:hover { transform: scale(1.2); }
      }
    }

    .delay-value {
      font-family: var(--font-mono); font-size: 12px;
      color: var(--accent); min-width: 48px; text-align: right;
    }

    @media (max-width: 1024px) {
      .main-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  records: NexusRecord[] = [];
  recordsData: RecordsResponse | null = null;
  loadingProfile = true;
  loadingRecords = true;
  statsLoading = true;
  delay = environment.apiDelay;

  private activeFilters: Record<string, string> = {};
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private recordsSvc: RecordsService,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();

    // Async parallel load — profile + records simultaneously
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isAdmin(): boolean { return this.auth.isAdmin(); }
  get firstName(): string { return this.user?.name?.split(' ')[0] || ''; }
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }
  get today(): Date { return new Date(); }

  get totalRecords():   number { return this.records.length; }
  get activeCount():    number { return this.records.filter(r => r.status === 'active').length; }
  get pendingCount():   number { return this.records.filter(r => r.status === 'pending').length; }
  get criticalCount():  number { return this.records.filter(r => r.priority === 'critical').length; }

  loadAll(): void {
    this.loadingProfile = true;
    this.loadingRecords = true;
    this.statsLoading   = true;

    // Parallel: profile refresh + records
    forkJoin({
      profile: this.auth.refreshProfile(),
      records: this.recordsSvc.getRecords({ delay: this.delay }),
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loadingProfile = false;
        this.loadingRecords = false;
        this.statsLoading   = false;
      })
    ).subscribe({
      next: ({ profile, records }) => {
        this.user = profile.data || this.user;
        if (records.success && records.data) {
          this.records     = records.data.records;
          this.recordsData = records.data;
        }
      },
    });
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.recordsSvc.getRecords({ ...this.activeFilters, delay: this.delay })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingRecords = false)
      )
      .subscribe(res => {
        if (res.success && res.data) {
          this.records     = res.data.records;
          this.recordsData = res.data;
          this.statsLoading = false;
        }
      });
  }

  onFilterChange(filters: { status: string; priority: string; search: string }): void {
    this.activeFilters = filters;
    this.loadRecords();
  }
}
