import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Estrutura visual compartilhada pelos modais da aplicação. */
@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section class="modal-shell">
      <header class="modal-header">
        <h2 class="modal-title">
          <mat-icon class="title-icon" aria-hidden="true">{{ icon }}</mat-icon>
          {{ title }}
        </h2>
        <button
          type="button"
          class="modal-close"
          [attr.aria-label]="closeLabel"
          (click)="close.emit()">
          &times;
        </button>
      </header>

      <div class="modal-body">
        <ng-content select="[modal-body]"></ng-content>
      </div>

      <footer class="modal-footer">
        <ng-content select="[modal-footer]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
    .modal-shell {
      display: flex; flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      max-height: 90vh;
      overflow: hidden;
    }
    .modal-body { 
      min-height: 0;
    }
    .modal-title .title-icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: transparent !important;
      color: #72e6ef;
      font-size: 26px;
      filter: drop-shadow(0 1px 4px rgba(0, 0, 0, .18));
    }
  `]
})
export class ModalShellComponent {
  @Input() title = '';
  @Input() icon = 'edit';
  @Input() closeLabel = 'Fechar modal';
  @Output() close = new EventEmitter<void>();
}
