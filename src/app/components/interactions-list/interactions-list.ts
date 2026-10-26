import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InteractionService } from '../../services/interaction/interaction.services';
import { ClientService } from '../../services/client/client.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { FilterField, FiltersComponent } from '../../ux/filters/filters.ux';
import { PaginationComponent } from '../../ux/pagination/pagination.ux';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';
import { InteractionFormDialog } from './interaction-form.dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageTitleComponent } from '../../ux/page-title/page-title.ux';
import { BtnPrimaryComponent } from '../../ux/btn/btn-primary/btn-primary.ux';

/**
 * Listagem de interações (histórico geral).
 */
@Component({
  selector: 'app-interactions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    CardComponent,
    FiltersComponent,
    PaginationComponent,
    EmptyStateComponent,
    PageTitleComponent,
    BtnPrimaryComponent
  ],
  templateUrl: './interactions-list.html',
  styleUrl: './interactions-list.css'
})
export class InteractionsList implements OnInit {

  interactions: any[] = [];
  filterFields: FilterField[] = [
    { name: 'client_id', label: 'Cliente', type: 'select', defaultValue: null, options: [{ label: 'Todos', value: null }] }
  ];

  total = 0;
  page = 1;
  limit = 15;
  loading = false;

  filterValue: any = { client_id: null };

  constructor(
    private interactionService: InteractionService,
    private clientService: ClientService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientService.read({ limit: 200 }).subscribe({
      next: result => {
        this.filterFields = this.filterFields.map(field => field.name === 'client_id'
          ? { ...field, options: [
            { label: 'Todos', value: null },
            ...result.data.map((client: any) => ({ label: client.name, value: client.id }))
          ] }
          : field);
      },
      error: () => { }
    });
    this.read();
  }

  read() {
    this.loading = true;

    this.interactionService.read({ ...this.filterValue, page: this.page, limit: this.limit }).subscribe({
      next: (result) => {
        this.interactions = result.data;
        this.total = result.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  onFilterChange(value: Record<string, unknown>): void {
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
    const ref = this.dialog.open(InteractionFormDialog, { width: '70vw', data: {} });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  openClient(item: any) {
    this.router.navigate(['/clients', item.client_id]);
  }

  formatDate(value: any): string {
    if (!value) return '-';

    return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }
}
