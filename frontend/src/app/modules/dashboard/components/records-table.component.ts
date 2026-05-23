// modules/dashboard/components/records-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NexusRecord, RecordsResponse } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-records-table',
  template: `
    <div class="records-section">
      <!-- Header + Filters -->
      <div class="records-header">
        <div>
          <h2 class="section-title">Records</h2>
          <p class="section-subtitle" *ngIf="!loading">
            {{ data?.total || 0 }} visible
            <span *ngIf="(data?.hiddenCount || 0) > 0" class="hidden-hint">
              · {{ data?.hiddenCount }} confidential records hidden
            </span>
          </p>
        </div>

        <div class="filter-controls">
          <!-- Search -->
          <div class="search-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input class="input search-input"
              [ngModel]="searchTerm"
              (ngModelChange)="onSearch($event)"
              placeholder="Search records…"/>
          </div>

          <!-- Status filter -->
          <select class="select filter-select" [(ngModel)]="statusFilter" (ngModelChange)="onFilter()">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>

          <!-- Priority filter -->
          <select class="select filter-select" [(ngModel)]="priorityFilter" (ngModelChange)="onFilter()">
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <!-- Refresh with delay demo -->
          <button class="btn btn--secondary btn--sm" (click)="onRefresh()" [disabled]="loading">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" [class.spin]="loading">
              <path d="M13 2v4H9M1 12V8h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.5 8A6 6 0 0113 6M13.5 6a6 6 0 01-11.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Async loading bar -->
      <div class="async-bar" *ngIf="loading"></div>

      <!-- Table -->
      <div class="table-wrap" [class.table-wrap--loading]="loading">

        <!-- Skeleton rows while loading -->
        <table *ngIf="loading">
          <thead>
            <tr>
              <th>Title</th><th>Category</th><th>Status</th><th>Priority</th>
              <th>Access</th><th>Value</th><th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let _ of skeletonRows">
              <td colspan="7">
                <div class="skeleton" style="height:14px; width:100%; opacity:0.5"></div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Actual data -->
        <table *ngIf="!loading && records.length > 0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Access</th>
              <th>Value</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rec of records; let i = index"
              class="record-row animate-fade-up"
              [ngClass]="'animate-delay-' + (i + 1)">
              <td>
                <div class="record-title">{{ rec.title }}</div>
                <div class="record-tags">
                  <span class="tag" *ngFor="let t of rec.tags.slice(0,2)">#{{ t }}</span>
                </div>
              </td>
              <td class="text-secondary" style="font-size:13px">{{ rec.category }}</td>
              <td>
                <span class="badge" [ngClass]="'badge--' + rec.status">
                  <span class="dot"></span>{{ rec.status }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge--' + rec.priority">{{ rec.priority }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge--' + rec.accessLevel">{{ rec.accessLevel }}</span>
              </td>
              <td class="text-mono" style="font-size:13px">
                {{ rec.value | currency:'USD':'symbol':'1.0-0' }}
              </td>
              <td class="text-muted" style="font-size:12px; white-space:nowrap">
                {{ rec.updatedAt | date:'MMM d, y' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="!loading && records.length === 0">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="8" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
            <path d="M14 20h12M14 26h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
          </svg>
          <p>No records match your filters</p>
          <button class="btn btn--ghost btn--sm" (click)="clearFilters()">Clear filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .records-section {}

    .records-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .section-title  { font-size: 16px; font-weight: 600; }
    .section-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 3px; }
    .hidden-hint    { color: var(--rose); }

    .filter-controls {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
    }
    .search-icon {
      position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted); pointer-events: none;
    }
    .search-input {
      padding-left: 32px !important;
      width: 200px;
    }

    .filter-select { width: 140px; }

    .table-wrap--loading { opacity: 0.6; pointer-events: none; }

    .record-row { opacity: 0; }

    .record-title { font-size: 13.5px; font-weight: 500; margin-bottom: 4px; }
    .record-tags  { display: flex; gap: 4px; flex-wrap: wrap; }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 12px;
      padding: 60px 24px;
      color: var(--text-muted);
      font-size: 14px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
  `]
})
export class RecordsTableComponent implements OnInit, OnDestroy {
  @Input() records: NexusRecord[] = [];
  @Input() data: RecordsResponse | null = null;
  @Input() loading = false;
  @Output() filterChange = new EventEmitter<{ status: string; priority: string; search: string }>();
  @Output() refresh = new EventEmitter<void>();

  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  skeletonRows = Array(7);

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.onFilter());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.search$.next(value);
  }

  onFilter(): void {
    this.filterChange.emit({
      status: this.statusFilter,
      priority: this.priorityFilter,
      search: this.searchTerm,
    });
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.onFilter();
  }
}
