import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../services/client/client.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { UtilsService } from '../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { FilterField, FiltersComponent } from '../../ux/filters/filters.ux';
import { PaginationComponent } from '../../ux/pagination/pagination.ux';
import { TableComponent, TableHeader } from '../../ux/table/table.ux';
import { PageTitleComponent } from '../../ux/page-title/page-title.ux';
import { BtnPrimaryComponent } from '../../ux/btn/btn-primary/btn-primary.ux';
import { ClientForm } from '../client-form/client-form';
import { ClientDetail } from '../client-detail/client-detail';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    CardComponent,
    FiltersComponent,
    PaginationComponent,
    TableComponent,
    PageTitleComponent,
    BtnPrimaryComponent
  ],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css'
})
export class ClientsList implements OnInit {

  clients: any[] = [];
  filterFields: FilterField[] = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nome, código ou CNPJ', defaultValue: '' },
    { name: 'client_segment_id', label: 'Segmento', type: 'select', defaultValue: null, options: [{ label: 'Todos', value: null }] },
    { name: 'client_group_id', label: 'Grupo', type: 'select', defaultValue: null, options: [{ label: 'Todos', value: null }] },
    {
      name: 'active', label: 'Situação', type: 'select', defaultValue: '', options: [
        { label: 'Todos', value: '' },
        { label: 'Ativos', value: 'true' },
        { label: 'Inativos', value: 'false' }
      ]
    }
  ];

  total = 0;
  page = 1;
  limit = 10;
  loading = false;

  filterValue: any = { search: '', client_segment_id: null, client_group_id: null, active: '' };

  headers: TableHeader[] = [
    { id: 'code', text: 'Código', width: '110px' },
    { id: 'name', text: 'Nome' },
    { id: 'cpf_cnpj', text: 'CNPJ/CPF', width: '170px' },
    { id: 'segment_name', text: 'Segmento', width: '150px' },
    { id: 'group_name', text: 'Grupo', width: '130px' },
    { id: 'active', text: 'Ativo', type: 'boolean', width: '90px', align: 'center' },
    { id: 'actions', text: 'Ações', width: '150px', align: 'center' }
  ];

  constructor(
    private clientService: ClientService,
    private lookupService: LookupService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLookups();
    this.read();
  }

  loadLookups() {
    this.lookupService.read('client-segments').subscribe({
      next: data => {
        this.updateFilterOptions('client_segment_id', data.map((item: any) => ({ label: item.name, value: item.id })));
      },
      error: () => { }
    });
    this.lookupService.read('client-groups').subscribe({
      next: data => {
        this.updateFilterOptions('client_group_id', data.map((item: any) => ({ label: item.name, value: item.id })));
      },
      error: () => { }
    });
  }

  private updateFilterOptions(fieldName: string, options: FilterField['options']): void {
    this.filterFields = this.filterFields.map(field => field.name === fieldName
      ? { ...field, options: [{ label: 'Todos', value: null }, ...(options || [])] }
      : field);
  }

  read() {
    this.loading = true;

    this.clientService.read({ ...this.filterValue, page: this.page, limit: this.limit }).subscribe({
      next: (result) => {
        this.clients = result.data;
        this.total = result.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  onFilterChange(value: any) {
    this.filterValue = value;
  }

  applyFilter() {
    this.page = 1;
    this.read();
  }

  clearFilter() {
    this.page = 1;
    this.read();
  }

  changePage(page: number) {
    this.page = page;
    this.read();
  }

  create() {
    this.openForm();
  }

  openForm(clientId: number | null = null) {
    if (window.matchMedia('(max-width: 700px)').matches) {
      const commands = clientId === null
        ? ['/clients/new']
        : ['/clients', clientId, 'edit'];
      this.router.navigate(commands);
      return;
    }

    const ref = this.dialog.open(ClientForm, {
      width: '90vw',
      maxWidth: '90vw',
      height: '90vh',
      maxHeight: '90vh',
      panelClass: 'client-form-dialog',
      data: { clientId }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  openDetails(clientId: number) {
    if (window.matchMedia('(max-width: 700px)').matches) {
      this.router.navigate(['/clients', clientId]);
      return;
    }

    this.dialog.open(ClientDetail, {
      width: '90vw',
      maxWidth: '90vw',
      height: '90vh',
      maxHeight: '90vh',
      panelClass: 'client-detail-dialog',
      data: { clientId }
    });
  }

  /**
   * Trata as ações emitidas pela tabela.
   */
  onAction(event: { type: string, data: any }) {
    const { type, data } = event;

    if (type === 'update') this.openForm(data.id);
    if (type === 'view') this.openDetails(data.id);
    if (type === 'delete') this.remove(data);
  }

  remove(client: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir o cliente "${client.name}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.clientService.delete(client.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
