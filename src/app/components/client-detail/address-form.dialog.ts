import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClientService } from '../../services/client/client.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { BtnSecundaryComponent } from '../../ux/btn/btn-secundary/btn-secundary.ux';

/**
 * Diálogo de cadastro/edição de endereço (padrão Optiva).
 */
@Component({
  selector: 'app-address-form-dialog',
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
        <mat-icon class="title-icon">place</mat-icon>
        {{ isEdit ? 'Editar endereço' : 'Novo endereço' }}
      </h2>
      <button class="modal-close" (click)="dialogRef.close(false)">&times;</button>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="modal-body">
        <div class="modal-card">

          <h6 class="section-title">
            <mat-icon class="section-icon">map</mat-icon>
            Logradouro
          </h6>

          <div class="form-row">
            <div class="field col-2">
              <label>Logradouro *</label>
              <input class="field-control" formControlName="street" placeholder="Rua, avenida...">
            </div>

            <div class="field col">
              <label>Número</label>
              <input class="field-control" formControlName="number" placeholder="Nº">
            </div>
          </div>

          <div class="form-row">
            <div class="field col">
              <label>Complemento</label>
              <input class="field-control" formControlName="complement" placeholder="Sala, andar...">
            </div>

            <div class="field col">
              <label>Bairro</label>
              <input class="field-control" formControlName="district">
            </div>

            <div class="field col">
              <label>CEP</label>
              <input class="field-control" formControlName="zip_code" placeholder="00000-000">
            </div>
          </div>

          <div class="form-row">
            <div class="field col">
              <label>Tipo</label>
              <select class="field-control" formControlName="address_type_id">
                <option [ngValue]="null">--</option>
                <option *ngFor="let t of addressTypes" [ngValue]="t.id">{{ t.type }}</option>
              </select>
            </div>

            <div class="field col-2">
              <label>Referência</label>
              <input class="field-control" formControlName="reference" placeholder="Ponto de referência">
            </div>
          </div>

          <div class="field" style="margin-bottom:0;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" formControlName="is_default" style="width:16px;height:16px;">
              Endereço padrão
            </label>
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
export class AddressFormDialog {

  form: FormGroup;
  addressTypes: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private lookupService: LookupService,
    private utils: UtilsService,
    public dialogRef: MatDialogRef<AddressFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId: number, address: any }
  ) {
    const address = data.address;

    this.form = this.fb.group({
      street: [address?.street ?? '', Validators.required],
      number: [address?.number ?? ''],
      complement: [address?.complement ?? ''],
      district: [address?.district ?? ''],
      zip_code: [address?.zip_code ?? ''],
      address_type_id: [address?.address_type_id ?? null],
      reference: [address?.reference ?? ''],
      is_default: [address?.is_default === 1]
    });

    this.lookupService.read('address-types').subscribe({
      next: (d) => this.addressTypes = d,
      error: () => { }
    });
  }

  get isEdit(): boolean {
    return Boolean(this.data.address?.id);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const request$ = this.isEdit
      ? this.clientService.updateAddress(this.data.clientId, this.data.address.id, this.form.value)
      : this.clientService.createAddress(this.data.clientId, this.form.value);

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
