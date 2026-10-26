import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnPrimaryComponent } from '../btn/btn-primary/btn-primary.ux';
import { BtnBackComponent } from '../btn/btn-back/btn-back.ux';
import { PageTitleComponent } from '../page-title/page-title.ux';

/**
 * Cabeçalho de página: título, ícone, botão de ação e botão voltar.
 */
@Component({
  standalone: true,
  selector: 'app-page-header',
  imports: [CommonModule, BtnPrimaryComponent, BtnBackComponent, PageTitleComponent],
  template: `
  <header class="page-title  clients-page">
      <app-btn-back *ngIf="showBack" (clicked)="back.emit()"></app-btn-back>

      <app-page-title [title]="title" [subtitle]="subtitle" [icon]="icon"></app-page-title>

      <div class="header-actions">
        <ng-content></ng-content>
        
        <app-btn-primary 
          *ngIf="actionLabel"
          [title]="actionLabel"
          [icon]="actionIcon"
          (clicked)="action.emit()">
        </app-btn-primary>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    app-page-title { flex: 1 1 auto; min-width: 0; }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .page-header {
        display: grid;
        grid-template-columns: 36px minmax(0, 1fr);
        align-items: start;
        gap: 4px;
      }

      app-btn-back { grid-column: 1; grid-row: 1; margin: 2px 0 0; }
      app-page-title { grid-column: 2; grid-row: 1; width: 100%; }
      .header-actions { grid-column: 2; grid-row: 2; width: fit-content; margin: 2px 0 0; }
    }
  `]
})
export class PageHeaderComponent {

  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';

  @Input() actionLabel = '';
  @Input() actionIcon = 'add';

  @Input() showBack = false;

  @Output() action = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}
