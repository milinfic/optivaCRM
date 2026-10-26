import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { OpportunityService } from '../../services/opportunity/opportunity.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { PageHeaderComponent } from '../../ux/page-header/page-header.ux';
import { DetailRowComponent } from '../../ux/detail-row/detail-row.ux';
import { PanelComponent } from '../../ux/panel/panel.ux';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';

/**
 * Detalhe da oportunidade: dados, comentários, histórico de status.
 */
@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CardComponent,
    PageHeaderComponent,
    DetailRowComponent,
    PanelComponent,
    EmptyStateComponent
  ],
  templateUrl: './opportunity-detail.html',
  styleUrl: './opportunity-detail.css'
})
export class OpportunityDetail implements OnInit {

  opportunityId!: number;
  opportunity: any = null;

  comments: any[] = [];
  history: any[] = [];

  statuses: any[] = [];

  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private lookupService: LookupService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      detail: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.opportunityId = Number(this.route.snapshot.paramMap.get('id'));

    this.lookupService.read('opportunity-statuses').subscribe({ next: d => this.statuses = d, error: () => { } });

    this.read();
  }

  read() {
    this.opportunityService.readById(this.opportunityId).subscribe({
      next: (item) => this.opportunity = item,
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });

    this.opportunityService.comments(this.opportunityId).subscribe({
      next: (data) => this.comments = data,
      error: () => { }
    });

    this.opportunityService.statusHistory(this.opportunityId).subscribe({
      next: (data) => this.history = data,
      error: () => { }
    });
  }

  /**
   * Altera o status da oportunidade.
   */
  changeStatus(statusId: any) {
    if (!statusId) return;

    this.opportunityService.update(this.opportunityId, { opportunity_status_id: Number(statusId) }).subscribe({
      next: () => {
        this.utils.showAutoCloseMessage('Status atualizado.', 'green', 2500);
        this.read();
      },
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  addComment() {
    if (this.commentForm.invalid) return;

    this.opportunityService.addComment(this.opportunityId, this.commentForm.value.detail).subscribe({
      next: () => {
        this.commentForm.reset({ detail: '' });
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 2500);
        this.read();
      },
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  edit() {
    this.router.navigate(['/opportunities', this.opportunityId, 'edit']);
  }

  back() {
    this.router.navigate(['/opportunities/list']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  }

  formatDate(value: any): string {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('pt-BR');
  }
}
