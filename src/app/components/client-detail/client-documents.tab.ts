import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../services/client/client.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { UtilsService } from '../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

/**
 * Aba de documentos do cliente.
 *
 * O upload de arquivo ainda não está integrado a um storage: guarda o
 * caminho/nome informado. A troca para upload real é só no service.
 */
@Component({
  selector: 'app-client-documents',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    EmptyStateComponent
  ],
  template: `
    <div class="tab-body">

      <form [formGroup]="form" class="upload-form" (ngSubmit)="submit()">

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="type_documents_id">
            <mat-option [value]="null">--</mat-option>
            <mat-option *ngFor="let t of types" [value]="t.id">{{ t.document_type }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nome do arquivo *</mat-label>
          <input matInput formControlName="file_name">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Caminho / URL *</mat-label>
          <input matInput formControlName="file_path" placeholder="/uploads/arquivo.pdf">
        </mat-form-field>

        <button mat-raised-button class="btn-confirm upload-btn" type="submit" [disabled]="loading">
          <mat-icon>upload_file</mat-icon>
          Anexar
        </button>

      </form>

      <div class="table-scroll" *ngIf="documents.length; else empty">
      <table class="detail-table">
        <thead>
          <tr>
            <th>Arquivo</th>
            <th>Tipo</th>
            <th>Enviado em</th>
            <th>Por</th>
            <th class="actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let document of documents">
            <td>
              <a [href]="document.file_path" target="_blank" rel="noopener">{{ document.file_name }}</a>
            </td>
            <td>{{ document.type_name || '-' }}</td>
            <td>{{ document.uploaded_at | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>{{ document.created_by_name || '-' }}</td>
            <td>
              <div class="container-btn-groups">
                <button class="btn-delete" (click)="remove(document)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <ng-template #empty>
        <app-empty-state icon="description" title="Nenhum documento anexado."
          text="Anexe contratos, certidões e outros arquivos do cliente."></app-empty-state>
      </ng-template>

    </div>
  `,
  styles: [`
    .tab-body { padding: 20px 4px; }
    .upload-form { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
    .upload-form mat-form-field { flex: 1 1 200px; }
    .upload-btn { height: 56px; min-width: 140px; }
    .table-scroll { width: 100%; overflow-x: auto; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; }
    .detail-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .detail-table thead th { text-align: left; padding: 12px 16px; background: var(--ui-gray-50); color: var(--ui-gray-700); border-bottom: 1px solid var(--ui-gray-200); }
    .detail-table tbody td { padding: 12px 16px; border-bottom: 1px solid var(--ui-border-soft); }
    .detail-table a { color: var(--ui-info-bright); text-decoration: none; }
    .actions-column { width: 90px; text-align: center; }
    @media (max-width: 600px) {
      .tab-body { padding: 12px 0; }
      .upload-form { display: grid; grid-template-columns: minmax(0, 1fr); gap: 6px; margin-bottom: 14px; }
      .upload-form mat-form-field { width: 100%; min-width: 0; }
      .upload-btn { width: 100%; min-width: 0; height: 44px; }
      .detail-table { min-width: 560px; font-size: 12px; }
      .detail-table thead th, .detail-table tbody td { padding: 9px 10px; }
    }
  `]
})
export class ClientDocumentsTab implements OnInit {

  @Input() clientId!: number;

  documents: any[] = [];
  types: any[] = [];
  loading = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private lookupService: LookupService,
    private utils: UtilsService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      type_documents_id: [null],
      file_name: ['', Validators.required],
      file_path: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.lookupService.read('type-documents').subscribe({ next: d => this.types = d, error: () => { } });
    this.read();
  }

  read() {
    this.clientService.readDocuments(this.clientId).subscribe({
      next: (data) => this.documents = data,
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.clientService.createDocument(this.clientId, this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset({ type_documents_id: null, file_name: '', file_path: '' });
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 3000);
        this.read();
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  remove(document: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente excluir o documento "${document.file_name}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.clientService.deleteDocument(this.clientId, document.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.read();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
