import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loading-skeleton',
  template: `
    <div class="skeleton-wrap">
      <div *ngFor="let row of rows"
        class="skeleton"
        [style.height]="height"
        [style.width]="row"
        [style.marginBottom]="'10px'">
      </div>
    </div>
  `,
  styles: [`.skeleton-wrap { padding: 8px 0; }`]
})
export class LoadingSkeletonComponent {
  @Input() count = 5;
  @Input() height = '18px';

  get rows(): string[] {
    const widths = ['100%', '85%', '92%', '78%', '95%', '88%', '70%', '96%', '82%', '90%'];
    return Array.from({ length: this.count }, (_, i) => widths[i % widths.length]);
  }
}