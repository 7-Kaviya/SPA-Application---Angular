// modules/dashboard/components/stats-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-stats-card',
  template: `
    <div class="stat-card animate-fade-up" [ngClass]="'animate-delay-' + delay">
      <div class="stat-top">
        <div class="stat-icon" [ngClass]="'stat-icon--' + color">
          <ng-content></ng-content>
        </div>
        <span class="stat-trend" [ngClass]="trend > 0 ? 'trend--up' : 'trend--down'" *ngIf="trend !== 0">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </span>
      </div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      transition: all var(--transition);
      opacity: 0;

      &:hover {
        border-color: var(--border-strong);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }
    }

    .stat-top {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;

      &--blue   { background: var(--accent-soft); color: var(--accent); }
      &--green  { background: var(--green-soft);  color: var(--green); }
      &--amber  { background: var(--amber-soft);  color: var(--amber); }
      &--rose   { background: var(--rose-soft);   color: var(--rose); }
      &--purple { background: var(--purple-soft); color: var(--purple); }
    }

    .stat-trend {
      font-size: 12px; font-weight: 600;
      padding: 2px 8px; border-radius: 100px;

      &.trend--up   { background: var(--green-soft); color: var(--green); }
      &.trend--down { background: var(--rose-soft);  color: var(--rose); }
    }

    .stat-value {
      font-size: 26px; font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 13px; color: var(--text-muted);
      margin-top: 6px; font-weight: 500;
    }
  `]
})
export class StatsCardComponent {
  @Input() value = '';
  @Input() label = '';
  @Input() color = 'blue';
  @Input() trend = 0;
  @Input() delay = 1;
}
