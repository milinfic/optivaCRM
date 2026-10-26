import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../services/client/client.services';
import { InteractionService } from '../../services/interaction/interaction.services';
import { OpportunityService } from '../../services/opportunity/opportunity.services';
import { UtilsService } from '../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';
import { InteractionFormDialog } from '../interactions-list/interaction-form.dialog';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';
import { BtnPrimaryComponent } from '../../ux/btn/btn-primary/btn-primary.ux';

/**
 * Aba de histórico do cliente: oportunidades e interações.
 */
@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatDialogModule,
    EmptyStateComponent, BtnPrimaryComponent],
  template: `
  <!--<div class="summary-grid summary-grid-3">-->
    <div class="tab-body">

      <!-- Oportunidades -->
      <div class="section-head">
        <h4>Oportunidades</h4>
        
        <app-btn-primary 
        title="Novo"
        icon="add"
        (clicked)="newOpportunity()"/>
      </div>

      <div class="timeline">
        <div class="timeline-item" *ngFor="let item of opportunities">
          <div class="timeline-dot"></div>

          <div class="timeline-content">
            <div class="timeline-title">
              <a (click)="openOpportunity(item)">{{ item.title }}</a>
              <span class="badge">{{ item.status_name || '-' }}</span>
            </div>

            <div class="timeline-meta">
              {{ formatCurrency(item.estimated_value) }} · {{ item.probability }}% ·
              previsão {{ item.expected_close_date | date:'dd/MM/yyyy' }}
            </div>
          </div>
        </div>

        <app-empty-state *ngIf="opportunities.length === 0"
          icon="trending_up" title="Nenhuma oportunidade para este cliente."></app-empty-state>
      </div>

      <!-- Interações -->
      <div class="section-head">
        <h4>Interações</h4>
        
        <app-btn-primary 
        title="Novo"
        icon="add"
        (clicked)="newInteraction()"/>
      </div>

      <div class="timeline">
        <div class="timeline-item" *ngFor="let item of interactions">
          <div class="timeline-dot" [style.background]="item.type_color || 'var(--ui-gray-400)'"></div>

          <div class="timeline-content">
            <div class="timeline-title">
              <span>{{ item.subject }}</span>
              <span class="badge-outline">{{ item.type_description || 'Interação' }}</span>
            </div>

            <div class="timeline-meta">
              {{ item.interaction_date | date:'dd/MM/yyyy HH:mm' }}
              <span *ngIf="item.user_name"> · {{ item.user_name }}</span>
              <span *ngIf="item.next_contact_date"> · próximo contato {{ item.next_contact_date | date:'dd/MM/yyyy' }}</span>
            </div>

            <p class="timeline-text" *ngIf="item.description">{{ item.description }}</p>
          </div>

          <button mat-icon-button class="btn-delete" (click)="removeInteraction(item)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>

        <app-empty-state *ngIf="interactions.length === 0"
          icon="chat" title="Nenhuma interação registrada."></app-empty-state>
      </div>

    </div>
  `,
  styles: [`
    .tab-body { padding: 20px 4px; }
    .section-head { display: flex; justify-content: space-between; align-items: center; margin: 8px 0 12px; }
    .section-head h4 { margin: 0; font-size: 15px; color: var(--ui-gray-900); }
    .timeline { margin-bottom: 24px; }
    .timeline-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px dashed var(--ui-border-soft); align-items: flex-start; }
    .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ui-primary-bright); margin-top: 6px; flex: 0 0 auto; }
    .timeline-content { flex: 1; }
    .timeline-title { display: flex; align-items: center; gap: 8px; font-weight: 500; color: var(--ui-gray-900); }
    .timeline-title a { color: var(--ui-info-bright); cursor: pointer; text-decoration: none; }
    .timeline-meta { color: var(--ui-gray-500); font-size: 12px; margin-top: 2px; }
    .timeline-text { color: var(--ui-gray-700); font-size: 13px; margin: 6px 0 0; }
    .badge { background: var(--ui-info-bg); color: var(--ui-primary-dark); border-radius: 10px; padding: 2px 8px; font-size: 11px; }
    .badge-outline { border: 1px solid var(--ui-gray-200); color: var(--ui-gray-500); border-radius: 10px; padding: 1px 8px; font-size: 11px; }
    @media (max-width: 600px) {
      .tab-body { padding: 12px 0; }
      .section-head { gap: 8px; }
      .section-head h4 { font-size: 14px; }
      .section-head button { flex: 0 0 auto; }
      .timeline-item { gap: 8px; }
      .timeline-content { min-width: 0; }
      .timeline-title { align-items: flex-start; flex-wrap: wrap; overflow-wrap: anywhere; }
      .timeline-meta, .timeline-text { overflow-wrap: anywhere; }
    }
  `]
})
export class ClientHistoryTab implements OnInit {

  @Input() clientId!: number;

  opportunities: any[] = [];
  interactions: any[] = [];

  constructor(
    private clientService: ClientService,
    private interactionService: InteractionService,
    private opportunityService: OpportunityService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.read();
  }

  read() {
    this.opportunityService.read({ client_id: this.clientId, limit: 50 }).subscribe({
      next: (result) => this.opportunities = result.data,
      error: () => { }
    });

    this.interactionService.read({ client_id: this.clientId, limit: 50 }).subscribe({
      next: (result) => this.interactions = result.data,
      error: () => { }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  }

  openOpportunity(item: any) {
    this.router.navigate(['/opportunities', item.id]);
  }

  newOpportunity() {
    this.router.navigate(['/opportunities/new'], { queryParams: { client_id: this.clientId } });
  }

  newInteraction() {
    const ref = this.dialog.open(InteractionFormDialog, {
      width: '70vw',
      panelClass: 'client-detail-dialog',
      data: { clientId: this.clientId }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.read();
    });
  }

  removeInteraction(item: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir a interação "${item.subject}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.interactionService.delete(item.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
