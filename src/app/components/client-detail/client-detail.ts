import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { ClientService } from '../../services/client/client.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { DetailRowComponent } from '../../ux/detail-row/detail-row.ux';
import { PanelComponent } from '../../ux/panel/panel.ux';

import { ClientAddressesTab } from './address-form/client-addresses.tab';
import { ClientContactsTab } from './contact-form/client-contacts.tab';
import { ClientDocumentsTab } from './client-documents.tab';
import { ClientHistoryTab } from './client-history.tab';

import { ClientForm } from '../client-form/client-form';

// Interface
import { DetailItem } from '../../../interfaces/app-detail-row.interface';
import { PageHeaderComponent } from '../../ux/page-header/page-header.ux';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

/**
 * Detalhe do cliente: resumo + abas (contatos, endereços, documentos, histórico).
 */
@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    CardComponent,
    DetailRowComponent,
    PanelComponent,
    ClientAddressesTab,
    ClientContactsTab,
    ClientDocumentsTab,
    ClientHistoryTab,
    PageHeaderComponent
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css'
})
export class ClientDetail implements OnInit {

  clientId!: number;
  client: any = null;
  loading = false;

  generalData: DetailItem[] = [
    { key: 'code', label: "Código", value: "client.code", icon: "tag" },
    { key: 'name', label: "Razão social", value: "client.name", icon: "business" },
    { key: 'trade_name', label: "Nome fantasia", value: "client.trade_name", icon: "store" },
    { key: 'cpf_cnpj', label: "CNPJ / CPF", value: "client.cpf_cnpj", icon: "badge" },
    { key: 'rg_ie', label: "RG / IE", value: "client.rg_ie", icon: "badge" },
    { key: 'im', label: "IM", value: "client.im", icon: "badge" },
    { key: 'birth_foundation_date', label: "Fundação", value: "formatDate(client.birth_foundation_date)", icon: "event" },
    { key: 'active', label: "Situação", value: "client.active ? 'Ativo' : 'Inativo'", icon: "toggle_on" }
  ];

  commercialData: DetailItem[] = [
    { key: 'segment_name', label: 'Segmento', value: undefined, icon: 'category' },
    { key: 'group_name', label: 'Grupo', value: undefined, icon: 'groups' },
    { key: 'commercial.sales_channel', label: 'Canal de venda', value: undefined, icon: 'route' },
    { key: 'commercial.credit_limit', label: 'Limite de crédito', value: undefined, icon: 'account_balance_wallet' },
    { key: 'commercial.max_discount', label: 'Desconto máx.', value: undefined, icon: 'percent' }
  ];

  financialData: DetailItem[] = [
    { key: 'financial.preferred_payment_method', label: 'Forma de pagamento', value: undefined, icon: 'payments' },
    { key: 'financial.bank_name', label: 'Banco', value: undefined, icon: 'account_balance' },
    { key: 'financial.agency', label: 'Agência', value: undefined, icon: 'account_balance' },
    { key: 'financial.account_number', label: 'Conta', value: undefined, icon: 'credit_card' },
    { key: 'financial.pix_key', label: 'Chave PIX', value: undefined, icon: 'qr_code_2' },
    { key: 'financial.due_day', label: 'Dia de vencimento', value: undefined, icon: 'event' },
    { key: 'financial.financial_blocked', label: 'Bloqueio financeiro', value: undefined, icon: 'lock' }
  ];

  constructor(
    private clientService: ClientService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<ClientDetail> | null,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { clientId?: number } | null
    
  ) { }

  ngOnInit(): void {
    const id = this.data?.clientId?.toString() ?? this.route.snapshot.paramMap.get('id');
    this.clientId = Number(id);

    this.read();
  }

  read() {
    this.loading = true;

    this.clientService.readById(this.clientId).subscribe({
      next: (client) => {
        this.client = client;
        
        this.populateDetailData(this.generalData, client);
        this.populateDetailData(this.commercialData, client);
        this.populateDetailData(this.financialData, client);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  private populateDetailData(items: DetailItem[], source: any): void {
    for (const item of items) {
      let value = item.key.split('.').reduce((current, key) => current?.[key], source);

      if (item.key === 'birth_foundation_date') value = this.formatDate(value);
      if (item.key === 'active') value = value == null ? '-' : value ? 'Ativo' : 'Inativo';
      if (item.key === 'financial.financial_blocked') value = value == null ? '-' : value ? 'Sim' : 'Não';

      item.value = value ?? '-';
    }
  }

  edit() {
    if (window.matchMedia('(max-width: 700px)').matches) {
      this.router.navigate(['/clients', this.clientId, 'edit']);
      return;
    }

    const ref = this.dialog.open(ClientForm, {
      width: '90vw',
      maxWidth: '90vw',
      height: '90vh',
      maxHeight: '90vh',
      panelClass: 'client-form-dialog',
      data: { clientId: this.clientId }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  back() {
    if (this.dialogRef) this.dialogRef.close(false);
    else this.router.navigate(['/clients/list']);
  }

  formatDate(value: any): string {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('pt-BR');
  }
}
