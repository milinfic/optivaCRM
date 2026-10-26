import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../services/user/user.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { BtnSecundaryComponent } from '../../ux/btn/btn-secundary/btn-secundary.ux';

/**
 * Diálogo de cadastro/edição de usuário (padrão Optiva).
 */
@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BtnSecundaryComponent
  ],
  template: `
    <div class="modal-header">
      <h2 class="modal-title">
        <mat-icon class="title-icon">person_add</mat-icon>
        {{ isEdit ? 'Editar usuário' : 'Novo usuário' }}
      </h2>
      <button class="modal-close" (click)="dialogRef.close(false)">&times;</button>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="modal-body">
        <div class="modal-card">

          <div class="field">
            <label>Nome *</label>
            <input class="field-control" formControlName="name" placeholder="Nome completo">
          </div>

          <div class="field">
            <label>E-mail *</label>
            <input class="field-control" formControlName="email" placeholder="usuario@empresa.com">
          </div>

          <div class="field" *ngIf="!isEdit">
            <label>Senha *</label>
            <input class="field-control" type="password" formControlName="password" placeholder="Mínimo 4 caracteres">
          </div>

          <p class="hint" *ngIf="isEdit">A senha não é alterada por esta tela.</p>

        </div>
      </div>

      <div class="modal-footer">
        <app-btn-secundary type="button" title="Cancelar" (clicked)="dialogRef.close(false)"></app-btn-secundary>
        <button type="submit" class="btn-save" [disabled]="loading">
          <mat-icon>check</mat-icon>
          Salvar
        </button>
      </div>
    </form>
  `,
  styles: [`
    .hint {
      color: var(--ui-gray-500);
      font-size: 12px;
      margin: 4px 0 0;
    }
  `]
})
export class UserFormDialog {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private utils: UtilsService,
    public dialogRef: MatDialogRef<UserFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {
    const user = data?.user;

    this.form = this.fb.group({
      name: [user?.name ?? '', Validators.required],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      password: ['']
    });

    if (!user) {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  get isEdit(): boolean {
    return Boolean(this.data?.user?.id);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const value = this.form.value;

    const request$ = this.isEdit
      ? this.userService.update(this.data.user.id, { name: value.name, email: value.email })
      : this.userService.register(value);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 3000);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }
}
