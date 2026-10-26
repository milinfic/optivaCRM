import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Rodapé de paginação.
 */
@Component({
  standalone: true,
  selector: 'app-pagination',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="pagination">
      <span>Mostrando {{ firstItem }}–{{ lastItem }} de {{ total }} registro(s)</span>

      <div class="pagination-controls">
        <button mat-icon-button [disabled]="page <= 1 || loading" (click)="go(page - 1)">
          <mat-icon>chevron_left</mat-icon>
        </button>

        <span>Página {{ page }} de {{ totalPages }}</span>

        <button mat-icon-button [disabled]="page >= totalPages || loading" (click)="go(page + 1)">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      color: var(--ui-gray-600);
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class PaginationComponent {

  @Input() total = 0;
  @Input() page = 1;
  @Input() limit = 10;
  @Input() loading = false;
  @Input() visibleCount: number | null = null;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  get firstItem(): number {
    return this.displayedCount === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get lastItem(): number {
    return this.displayedCount === 0 ? 0 : this.firstItem + this.displayedCount - 1;
  }

  private get displayedCount(): number {
    return this.visibleCount ?? Math.min(this.limit, Math.max(0, this.total - (this.page - 1) * this.limit));
  }

  /**
   * Emite a nova página, se estiver no intervalo.
   */
  go(target: number) {
    if (target < 1 || target > this.totalPages) return;

    this.pageChange.emit(target);
  }
}
