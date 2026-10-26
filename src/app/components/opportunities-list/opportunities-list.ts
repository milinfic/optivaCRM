import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { OpportunityService } from '../../services/opportunity/opportunity.services';
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

@Component({
  selector: 'app-opportunities-list',
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
  templateUrl: './opportunities-list.html',
  styleUrl: './opportunities-list.css'
})
export class OpportunitiesList implements OnInit {

  opportunities: any[] = [];
  filterFields: FilterField[] = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Título da oportunidade', defaultValue: '' },
    { name: 'opportunity_status_id', label: 'Status', type: 'select', defaultValue: null, options: [{ label: 'Todos', value: null }] },
    { name: 'opportunity_type_id', label: 'Tipo', type: 'select', defaultValue: null, options: [{ label: 'Todos', value: null }] }
  ];

  total = 0;
  page = 1;
  limit = 10;
  loading = false;

  filterValue: any = { search: '', opportunity_status_id: null, opportunity_type_id: null };

  headers: TableHeader[] = [
    { id: 'title', text: 'Título' },
    { id: 'client_name', text: 'Cliente' },
    { id: 'type_name', text: 'Tipo', width: '140px' },
    { id: 'status_name', text: 'Status', type: 'badge', width: '130px' },
    { id: 'estimated_value', text: 'Valor', type: 'currency', width: '140px', align: 'right' },
    { id: 'probability', text: 'Prob.', width: '80px', align: 'center' },
    { id: 'expected_close_date', text: 'Previsão', type: 'date', width: '120px' },
    { id: 'actions', text: 'Ações', width: '150px', align: 'center' }
  ];

  constructor(
    private opportunityService: OpportunityService,
    private lookupService: LookupService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lookupService.read('opportunity-statuses').subscribe({
      next: data => {
        this.updateFilterOptions('opportunity_status_id', data.map((item: any) => ({ label: item.status, value: item.id })));
      },
      error: () => { }
    });
    this.lookupService.read('opportunity-types').subscribe({
      next: data => {
        this.updateFilterOptions('opportunity_type_id', data.map((item: any) => ({ label: item.type, value: item.id })));
      },
      error: () => { }
    });

    this.read();
  }

  private updateFilterOptions(fieldName: string, options: FilterField['options']): void {
    this.filterFields = this.filterFields.map(field => field.name === fieldName
      ? { ...field, options: [{ label: 'Todos', value: null }, ...(options || [])] }
      : field);
  }

  read() {
    this.loading = true;

    this.opportunityService.read({ ...this.filterValue, page: this.page, limit: this.limit }).subscribe({
      next: (result) => {
        this.opportunities = result.data;
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
    this.router.navigate(['/opportunities/new']);
  }

  onAction(event: { type: string, data: any }) {
    const { type, data } = event;

    if (type === 'update') this.router.navigate(['/opportunities', data.id, 'edit']);
    if (type === 'view') this.router.navigate(['/opportunities', data.id]);
    if (type === 'delete') this.remove(data);
  }

  remove(opportunity: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir a oportunidade "${opportunity.title}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.opportunityService.delete(opportunity.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
