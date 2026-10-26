import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-btn-back',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button type="button" [attr.aria-label]="ariaLabel" (click)="clicked.emit()">
      <mat-icon>arrow_back</mat-icon>
    </button>
  `,
  styleUrl: './btn-back.ux.css'
})
export class BtnBackComponent {
  @Input() ariaLabel = 'Voltar';
  @Output() clicked = new EventEmitter<void>();
}
