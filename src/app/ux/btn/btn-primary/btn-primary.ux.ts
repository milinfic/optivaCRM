import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Botão primário reutilizável do sistema.
 *
 * Como utilizar:
 *
 * 1. Importe BtnPrimaryComponent no componente da tela:
 *    imports: [BtnPrimaryComponent]
 *
 * 2. Utilize no HTML:
 *
 *    <app-btn-primary
 *      title="Novo contato"
 *      icon="person_add"
 *      (clicked)="openForm()"
 *    />
 *
 * Inputs:
 *   - title: Texto exibido no botão.
 *   - icon: Nome do ícone do Angular Material (opcional).
 *   - type: Tipo do botão ('button', 'submit' ou 'reset'). Padrão: 'button'.
 *   - disabled: Define se o botão está desabilitado. Padrão: false.
 *
 * Output:
 *   - clicked: Emite o evento de clique (MouseEvent), permitindo
 *     executar um método da tela que utiliza o componente.
 *
 * É possível utilizar vários botões na mesma tela, cada um com
 * seu próprio texto, ícone e evento de clique.
 */
@Component({
  standalone: true,
  selector: 'app-btn-primary',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <button mat-raised-button [type]="type" [disabled]="disabled" (click)="clicked.emit($event)">
      <span class="button-content">
        @if (icon) { <mat-icon>{{ icon }}</mat-icon> }
        <span>{{ title }}</span>
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styleUrl: './btn-primary.ux.css'
})
export class BtnPrimaryComponent {

  @Input() title = 'Botão';
  @Input() icon = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
}
