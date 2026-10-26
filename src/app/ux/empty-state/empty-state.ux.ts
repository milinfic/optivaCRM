import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Estado vazio de listas e abas.
 */
@Component({
  standalone: true,
  selector: 'app-empty-state',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <p class="empty-title">{{ title }}</p>
      <p class="empty-text" *ngIf="text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--ui-gray-400);
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
    }

    .empty-title {
      font-size: 15px;
      font-weight: 500;
      margin: 0;
      color: var(--ui-gray-500);
    }

    .empty-text {
      font-size: 13px;
      margin: 4px 0 0;
    }
  `]
})
export class EmptyStateComponent {

  @Input() icon = 'inbox';
  @Input() title = 'Nenhum registro encontrado.';
  @Input() text = '';
}
