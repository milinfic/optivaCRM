import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../../services/client/client.services';
import { UtilsService } from '../../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../../ux/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../ux/empty-state/empty-state.ux';
import { ContactFormDialog } from './contact-form.dialog';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../../constants/messages';
import { BtnPrimaryComponent } from '../../../ux/btn/btn-primary/btn-primary.ux';

/**
 * Aba de contatos do cliente (com canais).
 */
@Component({
  selector: 'app-client-contacts',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatDialogModule,
    EmptyStateComponent, BtnPrimaryComponent],
  template: `
    <div class="tab-body">
      <div class="tab-toolbar">
        <app-btn-primary 
        title="Novo contato"
        icon="person_add"
        (clicked)="openForm()"/>
      </div>

      <div class="contact-card" *ngFor="let contact of contacts">
        <div class="contact-head">
          <div>
            <strong>{{ contact.name }}</strong>
            <span class="contact-role" *ngIf="contact.position || contact.department">
              — {{ contact.position }}{{ contact.department ? ' / ' + contact.department : '' }}
            </span>
          </div>

          <div class="container-btn-groups">
            <button class="btn-edit" (click)="openForm(contact)">
              <mat-icon>edit</mat-icon>
            </button>
            <button class="btn-delete" (click)="remove(contact)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <div class="channels" *ngIf="contact.channels?.length; else noChannels">
          <span class="channel" *ngFor="let channel of contact.channels">
            <mat-icon class="channel-icon">{{ iconFor(channel.type_code) }}</mat-icon>
            {{ channel.value }}
            <span class="primary-tag" *ngIf="channel.is_primary">principal</span>
          </span>
        </div>

        <ng-template #noChannels>
          <span class="no-channels">Nenhum canal cadastrado.</span>
        </ng-template>
      </div>

      <app-empty-state *ngIf="contacts.length === 0"
        icon="contacts" title="Nenhum contato cadastrado."
        text="Cadastre as pessoas de contato deste cliente."></app-empty-state>

    </div>
  `,
  styles: [`
    .tab-body { padding: 20px 4px; }
    .tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .contact-card { border: 1px solid var(--ui-border-soft); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
    .contact-head { display: flex; justify-content: space-between; align-items: center; }
    .contact-role { color: var(--ui-gray-500); font-size: 13px; margin-left: 6px; }
    .channels { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; font-size: 13px; color: var(--ui-gray-700); }
    .channel { display: flex; align-items: center; gap: 4px; }
    .channel-icon { font-size: 16px; width: 16px; height: 16px; color: var(--ui-gray-500); }
    .primary-tag { background: var(--ui-info-bg); color: var(--ui-primary-dark); border-radius: 8px; padding: 1px 6px; font-size: 11px; }
    .no-channels { color: var(--ui-gray-400); font-size: 13px; }
    @media (max-width: 600px) {
      .tab-body { padding: 12px 0; }
      .tab-toolbar { margin-bottom: 10px; }
      .contact-card { padding: 12px; }
      .contact-head { align-items: flex-start; gap: 8px; }
      .contact-head > div:first-child { min-width: 0; overflow-wrap: anywhere; }
      .contact-role { display: block; margin: 3px 0 0; }
      .container-btn-groups { flex: 0 0 auto; }
      .channels { gap: 8px 12px; }
      .channel { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
    }
  `]
})
export class ClientContactsTab implements OnInit {

  @Input() clientId!: number;

  contacts: any[] = [];

  constructor(
    private clientService: ClientService,
    private utils: UtilsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.read();
  }

  read() {
    this.clientService.readContacts(this.clientId).subscribe({
      next: (data) => this.contacts = data,
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  openForm(contact: any = null) {
    const ref = this.dialog.open(ContactFormDialog, {
      width: '90vw',
      maxWidth: '90vw',
      height: '100vh',
      maxHeight: '100vh',

      panelClass: 'client-detail-dialog',
      data: {
        clientId: this.clientId,
        contact,
        title: contact ? 'Editar contato' : 'Novo contato',
        icon: 'person_add'
      }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  remove(contact: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir o contato "${contact.name}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.clientService.deleteContact(this.clientId, contact.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }

  /**
   * Ícone do canal conforme o tipo.
   */
  iconFor(typeCode: string): string {
    const map: Record<string, string> = {
      EMAIL: 'email',
      PHONE: 'call',
      WHATSAPP: 'chat',
      CELL: 'smartphone',
      SITE: 'language'
    };

    return map[typeCode] ?? 'link';
  }
}
