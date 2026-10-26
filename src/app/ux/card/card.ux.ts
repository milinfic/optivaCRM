import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card branco padrão (container das telas).
 *
 * Agora flutua sobre o fundo var(--ui-bg-page) do main-content, com borda e sombra
 * suaves, como no dashboard de referência.
 */
@Component({
  standalone: true,
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div class="modal-container">
      <div class="modal-card">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 100%;
      box-sizing: border-box;
    }

    .modal-card {
      background: var(--ui-header-bg);
      border: 1px solid var(--ui-border);
      border-radius: 10px;
      margin: 0 0 14px;
      padding: 0;
      box-shadow: 0 2px 6px var(--ui-shadow-card);
      overflow: hidden;
      width: 100%;
    }
  `]
})
export class CardComponent {

  @Input() title = '';
}
