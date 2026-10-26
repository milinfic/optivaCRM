import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Linha de detalhe (rótulo + valor) usada nos painéis de visualização.
 */
@Component({
  standalone: true,
  selector: 'app-detail-row',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="detail-row">
      <span class="detail-label">
        <mat-icon *ngIf="icon" class="detail-icon">{{ icon }}</mat-icon>
        {{ label }}
      </span>
      <span class="detail-value">{{ value ?? '-' }}</span>
    </div>
  `,
  styles: [`
    .detail-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
      border-bottom: 1px dashed var(--ui-border-soft);
      font-size: 14px;
    }

    .detail-label {
      color: var(--ui-gray-500);
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .detail-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .detail-value {
      color: var(--ui-gray-900);
      font-weight: 500;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
    }
  `]
})
export class DetailRowComponent {

  @Input() label = '';
  @Input() value: any = '';
  @Input() icon = '';
}
