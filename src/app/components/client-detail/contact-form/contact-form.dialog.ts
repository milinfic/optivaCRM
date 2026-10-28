import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClientService } from '../../../services/client/client.services';
import { LookupService } from '../../../services/lookup/lookup.services';
import { UtilsService } from '../../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../../constants/messages';
import { ModalShellComponent } from '../../../ux/modal/shell/modal.shell.ux';
import { BtnPrimaryComponent } from '../../../ux/btn/btn-primary/btn-primary.ux';
import { BtnSecundaryComponent } from '../../../ux/btn/btn-secundary/btn-secundary.ux';
import { PanelComponent } from '../../../ux/panel/panel.ux';

/**
 * Diálogo de cadastro/edição de contato (padrão Optiva).
 */
@Component({
  selector: 'app-contact-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ModalShellComponent,
    BtnPrimaryComponent,
    BtnSecundaryComponent,
    PanelComponent
  ],
  templateUrl: './contact-form.dialog.html'
})
export class ContactFormDialog {

  form: FormGroup;
  contactTypes: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private lookupService: LookupService,
    private utils: UtilsService,
    public dialogRef: MatDialogRef<ContactFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      clientId: number;
      contact: any;
      title: string;
      icon: string;
    }
  ) {
    const contact = data.contact;

    this.form = this.fb.group({
      name: [contact?.name ?? '', Validators.required],
      position: [contact?.position ?? ''],
      department: [contact?.department ?? ''],
      channels: this.fb.array([])
    });

    (contact?.channels ?? []).forEach((channel: any) => this.addChannel(channel));

    if (!contact?.channels?.length) this.addChannel();

    this.lookupService.read('contact-types').subscribe({
      next: (d) => this.contactTypes = d,
      error: () => { }
    });
  }

  get isEdit(): boolean {
    return Boolean(this.data.contact?.id);
  }

  get channels(): FormArray {
    return this.form.get('channels') as FormArray;
  }

  addChannel(channel: any = null) {
    this.channels.push(this.fb.group({
      contact_type_id: [channel?.contact_type_id ?? null],
      value: [channel?.value ?? '']
    }));
  }

  removeChannel(index: number) {
    this.channels.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    const payload = this.form.value;

    const request$ = this.isEdit
      ? this.clientService.updateContact(this.data.clientId, this.data.contact.id, payload)
      : this.clientService.createContact(this.data.clientId, payload);

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
