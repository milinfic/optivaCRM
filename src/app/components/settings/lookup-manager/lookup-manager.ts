import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LookupService } from '../../../services/lookup/lookup.services';
import { UtilsService } from '../../../services/utils/utils.service';
import { EmptyStateComponent } from '../../../ux/empty-state/empty-state.ux';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../../constants/messages';

/**
 * CRUD genérico de uma tabela de apoio (nome + lista + adicionar + excluir).
 */
@Component({
  selector: 'app-lookup-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    EmptyStateComponent
  ],
  template: `
    <div class="lookup-manager">

      <div class="add-row">
        <div class="field grow">
          <label [attr.for]="'new-lookup-value-' + resource">Novo registro</label>
          <input [id]="'new-lookup-value-' + resource" class="field-control"
                 [(ngModel)]="newValue"
                 (keyup.enter)="add()"
                 [placeholder]="placeholder">
        </div>

        <button mat-raised-button class="btn-confirm add-btn" [disabled]="loading" (click)="add()">
          <mat-icon>add</mat-icon>
          Adicionar
        </button>
      </div>

      <ul class="item-list">
        <li *ngFor="let item of items">
          <span class="item-label">{{ item[labelField] }}</span>

          <button mat-icon-button class="btn-delete" (click)="remove(item)">
            <mat-icon>delete</mat-icon>
          </button>
        </li>
      </ul>

      <app-empty-state *ngIf="items.length === 0"
        icon="list" title="Nenhum registro cadastrado."
        text="Adicione o primeiro registro acima."></app-empty-state>

    </div>
  `,
  styles: [`
    .add-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: end; min-width: 0; }
    .add-row .grow { min-width: 0; }
    .add-row .field label { display: block; margin: 0 0 6px; color: var(--ui-text-muted); font-size: 10px; font-weight: 700; letter-spacing: .35px; text-transform: uppercase; }
    .add-row .field-control { display: block; box-sizing: border-box; width: 100%; min-width: 0; min-height: 44px; padding: 10px 12px; border: 1px solid var(--ui-border); border-radius: 8px; background: var(--ui-bg-subtle); color: var(--ui-text-secondary); font: inherit; font-size: 12px; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
    .add-row .field-control:focus { outline: none; border-color: var(--ui-primary); background: var(--ui-white); box-shadow: 0 0 0 3px var(--ui-focus-shadow); }
    .add-row .add-btn { box-sizing: border-box; width: auto; min-width: 112px; height: 44px !important; padding: 0 14px; border-radius: 7px !important; background: var(--ui-gray-800) !important; color: var(--ui-white) !important; box-shadow: none !important; font-size: 11px; white-space: nowrap; }
    .add-row .add-btn:hover { background: var(--ui-gray-900) !important; }
    .item-list { list-style: none; margin: 16px 0 0; padding: 0; }
    .item-list li { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--ui-border-soft); font-size: 14px; }
    .item-list li:hover { background: var(--ui-gray-50); }
    .item-label { font-weight: 500; color: var(--ui-gray-900); }
  `]
})
export class LookupManagerComponent implements OnInit {

  @Input() resource!: string;
  @Input() labelField = 'name';
  @Input() placeholder = 'Digite o nome';

  items: any[] = [];
  newValue = '';
  loading = false;

  constructor(private lookupService: LookupService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.read();
  }

  read() {
    this.lookupService.read(this.resource).subscribe({
      next: (data) => this.items = data,
      error: () => this.items = []
    });
  }

  add() {
    const value = (this.newValue || '').trim();

    if (!value) return;

    this.loading = true;

    this.lookupService.create(this.resource, { [this.labelField]: value }).subscribe({
      next: () => {
        this.newValue = '';
        this.loading = false;
        this.read();
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 2500);
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  remove(item: any) {
    this.lookupService.delete(this.resource, item.id).subscribe({
      next: () => this.read(),
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }
}
