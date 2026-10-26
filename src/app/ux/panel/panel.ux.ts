import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-panel',
  imports: [CommonModule, MatIconModule],
  template: `
    <section class="panel-shell dashboard-panel">
      <div class="panel-head box-heading">
        <div class="panel-title-group">
          <span class="section-icon" *ngIf="icon"><mat-icon>{{ icon }}</mat-icon></span>
          <h2>{{ title }}</h2>
        </div>
        <span class="count-chip" *ngIf="badge">{{ badge }}</span>
        <ng-content select="[panelActions]"></ng-content>
      </div>

      <ng-content></ng-content>
    </section>
  `,
  styleUrl: './panel.ux.css'
})
export class PanelComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() badge = '';
  @Input() variant: 'default' | 'dashboard' = 'default';
}
