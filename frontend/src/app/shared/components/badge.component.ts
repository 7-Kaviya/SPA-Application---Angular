import { Component, Input } from '@angular/core';
@Component({
  standalone: false,
  selector: 'app-badge',
  template: `
    <span class="badge" [ngClass]="'badge--' + variant">
      <span class="dot" *ngIf="showDot"></span>
      {{ label }}
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant = 'active';
  @Input() label = '';
  @Input() showDot = false;
}