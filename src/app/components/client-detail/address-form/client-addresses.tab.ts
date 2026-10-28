import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../../services/client/client.services';
import { UtilsService } from '../../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../../ux/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../ux/empty-state/empty-state.ux';
import { AddressFormDialog } from './address-form.dialog';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../../constants/messages';
import { BtnPrimaryComponent } from '../../../ux/btn/btn-primary/btn-primary.ux';

/**
 * Aba de endereços do cliente.
 */
@Component({
  selector: 'app-client-addresses',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatDialogModule, 
    EmptyStateComponent, BtnPrimaryComponent],
  template: `
    <div class="tab-body">

      <div class="tab-toolbar">
        <app-btn-primary 
        title="Novo endereço"
        icon="add_location"
        (clicked)="openForm()"/>
      </div>

      <div class="table-scroll" *ngIf="addresses.length; else empty">
      <table class="detail-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Logradouro</th>
            <th>Número</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>CEP</th>
            <th>Padrão</th>
            <th class="actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let address of addresses">
            <td>{{ address.address_type || '-' }}</td>
            <td>{{ address.street }}</td>
            <td>{{ address.number || '-' }}</td>
            <td>{{ address.district || '-' }}</td>
            <td>{{ address.city ? address.city + '/' + address.state : '-' }}</td>
            <td>{{ address.zip_code || '-' }}</td>
            <td>
              <span class="badge" [class.badge-on]="address.is_default === 1" [class.badge-off]="address.is_default !== 1">
                {{ address.is_default === 1 ? 'Sim' : 'Não' }}
              </span>
            </td>
            <td>
              <div class="container-btn-groups">
                <button class="btn-edit" (click)="openForm(address)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button class="btn-delete" (click)="remove(address)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <ng-template #empty>
        <app-empty-state icon="place" title="Nenhum endereço cadastrado."
          text="Cadastre o primeiro endereço deste cliente."></app-empty-state>
      </ng-template>

    </div>
  `,
  styles: [`
    .tab-body { padding: 20px 4px; }
    .tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .table-scroll { width: 100%; overflow-x: auto; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; }
    .detail-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .detail-table thead th { text-align: left; padding: 12px 16px; background: var(--ui-gray-50); color: var(--ui-gray-700); border-bottom: 1px solid var(--ui-gray-200); }
    .detail-table tbody td { padding: 12px 16px; border-bottom: 1px solid var(--ui-border-soft); }
    .actions-column { width: 120px; text-align: center; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; }
    .badge-on { background: var(--ui-success-soft); color: var(--ui-success-dark); }
    .badge-off { background: var(--ui-gray-100); color: var(--ui-gray-500); }
    @media (max-width: 600px) {
      .tab-body { padding: 12px 0; }
      .tab-toolbar { margin-bottom: 10px; }
      .detail-table { min-width: 720px; font-size: 12px; }
      .detail-table thead th, .detail-table tbody td { padding: 9px 10px; }
    }
  `]
})
export class ClientAddressesTab implements OnInit {

  @Input() clientId!: number;

  addresses: any[] = [];

  constructor(
    private clientService: ClientService,
    private utils: UtilsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.read();
  }

  read() {
    this.clientService.readAddresses(this.clientId).subscribe({
      next: (data) => this.addresses = data,
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  /**
   * Abre o formulário (novo ou edição).
   */
  openForm(address: any = null) {
    const ref = this.dialog.open(AddressFormDialog, {
      width: '90vw',
      maxWidth: '90vw',
      height: '100vh',
      maxHeight: '100vh',

      panelClass: 'client-detail-dialog',
      data: { 
        clientId: this.clientId,
        address
      }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  remove(address: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir este endereço?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.clientService.deleteAddress(this.clientId, address.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
