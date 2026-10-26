import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BtnSecundaryComponent } from '../btn/btn-secundary/btn-secundary.ux';

/**
 * Diálogo de confirmação no padrão visual do sistema (header gradiente).
 */
@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, BtnSecundaryComponent],
  template: `
    <div class="modal-header">
      <h2 class="modal-title">
        <mat-icon class="title-icon">help_outline</mat-icon>
        {{ data.title || 'Confirmação' }}
      </h2>
      <button class="modal-close" (click)="close(false)">&times;</button>
    </div>

    <div class="modal-body">
      <div class="modal-card">
        <p class="confirm-message">{{ data.message }}</p>
      </div>
    </div>

    <div class="modal-footer">
      <app-btn-secundary type="button" title="Cancelar" (clicked)="close(false)"></app-btn-secundary>
      <button mat-raised-button class="btn-save" color="primary" (click)="close(true)">
        <mat-icon>check</mat-icon>
        Confirmar
      </button>
    </div>
  `,
  styles: [`
    .confirm-message {
      margin: 0;
      color: var(--ui-settings-gradient-start);
      font-size: 15px;
      line-height: 1.6;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
