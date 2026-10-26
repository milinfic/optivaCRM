import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { OpportunityService } from '../../services/opportunity/opportunity.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { ClientService } from '../../services/client/client.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { PageHeaderComponent } from '../../ux/page-header/page-header.ux';
import { BtnSecundaryComponent } from '../../ux/btn/btn-secundary/btn-secundary.ux';

/**
 * Formulário de oportunidade (novo e edição) no padrão Optiva.
 */
@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    CardComponent,
    PageHeaderComponent,
    BtnSecundaryComponent
  ],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.css'
})
export class OpportunityForm implements OnInit {

  form: FormGroup;

  opportunityId: number | null = null;
  loading = false;

  clients: any[] = [];
  types: any[] = [];
  statuses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private lookupService: LookupService,
    private clientService: ClientService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      client_id: [null, Validators.required],
      opportunity_type_id: [null],
      opportunity_status_id: [null],
      title: ['', Validators.required],
      description: [''],
      estimated_value: [0],
      probability: [0],
      expected_close_date: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const clientId = this.route.snapshot.queryParamMap.get('client_id');

    this.opportunityId = id ? Number(id) : null;

    this.loadLookups();

    if (clientId) this.form.patchValue({ client_id: Number(clientId) });

    if (this.opportunityId) this.readById();
  }

  get isEdit(): boolean {
    return this.opportunityId !== null;
  }

  loadLookups() {
    this.lookupService.read('opportunity-types').subscribe({ next: d => this.types = d, error: () => { } });
    this.lookupService.read('opportunity-statuses').subscribe({ next: d => this.statuses = d, error: () => { } });
    this.clientService.read({ limit: 200 }).subscribe({ next: r => this.clients = r.data, error: () => { } });
  }

  readById() {
    this.loading = true;

    this.opportunityService.readById(this.opportunityId!).subscribe({
      next: (item) => {
        this.form.patchValue({
          ...item,
          expected_close_date: item.expected_close_date ? item.expected_close_date.slice(0, 10) : null
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.utils.showAutoCloseMessage('Preencha os campos obrigatórios.', 'red', 4000);
      return;
    }

    const value = this.form.value;

    this.loading = true;

    const request$ = this.isEdit
      ? this.opportunityService.update(this.opportunityId!, value)
      : this.opportunityService.create(value);

    request$.subscribe({
      next: (result) => {
        this.loading = false;
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 3000);
        this.router.navigate(['/opportunities', result.id]);
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  cancel() {
    this.router.navigate(['/opportunities/list']);
  }
}
