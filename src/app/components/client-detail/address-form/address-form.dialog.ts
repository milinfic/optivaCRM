import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClientService } from '../../../services/client/client.services';
import { LookupService } from '../../../services/lookup/lookup.services';
import { UtilsService } from '../../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../../constants/messages';
import { BtnSecundaryComponent } from '../../../ux/btn/btn-secundary/btn-secundary.ux';
import { BtnPrimaryComponent } from '../../../ux/btn/btn-primary/btn-primary.ux';
import { ModalShellComponent } from '../../../ux/modal/shell/modal.shell.ux';
import { PanelComponent } from '../../../ux/panel/panel.ux';

/**
 * Diálogo de cadastro/edição de endereço (padrão Optiva).
 */
@Component({
  selector: 'app-address-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalShellComponent,
    PanelComponent,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    BtnSecundaryComponent,
    BtnPrimaryComponent
  ],
  templateUrl: './address-form.dialog.html'
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
