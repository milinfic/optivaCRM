import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { InteractionService } from '../../services/interaction/interaction.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { ClientService } from '../../services/client/client.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { BtnSecundaryComponent } from '../../ux/btn/btn-secundary/btn-secundary.ux';

/**
 * Diálogo de registro de interação (padrão Optiva).
 */
@Component({
  selector: 'app-interaction-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    BtnSecundaryComponent
  ],
  template: `
    <div class="modal-header">
      <h2 class="modal-title">
        <mat-icon class="title-icon">add_comment</mat-icon>
        Registrar interação
      </h2>
      <button class="modal-close" (click)="dialogRef.close(false)">&times;</button>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="modal-body">
        <div class="modal-card">

          <div class="form-row">
            <div class="field col-full">
              <label>Cliente *</label>
              <select class="field-control" formControlName="client_id">
                <option [ngValue]="null">--</option>
                <option *ngFor="let c of clients" [ngValue]="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="field col">
              <label>Tipo</label>
              <select class="field-control" formControlName="interaction_type_id">
                <option [ngValue]="null">--</option>
                <option *ngFor="let t of types" [ngValue]="t.id">{{ t.description }}</option>
              </select>
            </div>

            <div class="field col">
              <label>Data da interação</label>
              <input class="field-control" type="datetime-local" formControlName="interaction_date">
            </div>
          </div>

          <div class="form-row">
            <div class="field col-full">
              <label>Assunto *</label>
              <input class="field-control" formControlName="subject" placeholder="Resumo do contato">
            </div>
          </div>

          <div class="form-row">
            <div class="field col-full">
              <label>Descrição</label>
              <textarea class="field-control" rows="3" formControlName="description"
                        placeholder="Detalhes da interação..."></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="field col-full">
              <label>Próximo contato</label>
              <input class="field-control" type="datetime-local" formControlName="next_contact_date">
            </div>
          </div>

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
  `
})
export class InteractionFormDialog {

  form: FormGroup;
  types: any[] = [];
  clients: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private interactionService: InteractionService,
    private lookupService: LookupService,
    private clientService: ClientService,
    private utils: UtilsService,
    public dialogRef: MatDialogRef<InteractionFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId?: number }
  ) {
    this.form = this.fb.group({
      client_id: [data?.clientId ?? null, Validators.required],
      interaction_type_id: [null],
      interaction_date: [this.now()],
      subject: ['', Validators.required],
      description: [''],
      next_contact_date: ['']
    });

    this.lookupService.read('interaction-types').subscribe({ next: d => this.types = d, error: () => { } });

    this.clientService.read({ limit: 200 }).subscribe({
      next: (result) => this.clients = result.data,
      error: () => { }
    });
  }

  now(): string {
    const date = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.interactionService.create(this.form.value).subscribe({
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
