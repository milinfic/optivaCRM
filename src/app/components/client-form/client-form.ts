import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { ClientService } from '../../services/client/client.services';
import { LookupService } from '../../services/lookup/lookup.services';
import { UtilsService } from '../../services/utils/utils.service';
import { MESSAGE_SUCCESS_CREATE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { CardComponent } from '../../ux/card/card.ux';
import { PageHeaderComponent } from '../../ux/page-header/page-header.ux';
import { BtnSecundaryComponent } from '../../ux/btn/btn-secundary/btn-secundary.ux';

import { ClientBasicTab } from './tabs/basic.tab';
import { ClientCommercialTab } from './tabs/commercial.tab';
import { ClientFinancialTab } from './tabs/financial.tab';
import { ClientSettingsTab } from './tabs/settings.tab';
import { ClientMarketingTab } from './tabs/marketing.tab';
import { ModalShellComponent } from '../../ux/modal/shell/modal.shell.ux';
import { BtnPrimaryComponent } from '../../ux/btn/btn-primary/btn-primary.ux';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    CardComponent,
    PageHeaderComponent,
    ClientBasicTab,
    ClientCommercialTab,
    ClientFinancialTab,
    ClientSettingsTab,
    ClientMarketingTab,
    ModalShellComponent,
    BtnSecundaryComponent,
    BtnPrimaryComponent
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm implements OnInit {

  clientForm: FormGroup;

  clientId: number | null = null;
  loading = false;

  segments: any[] = [];
  groups: any[] = [];
  clientTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private lookupService: LookupService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<ClientForm> | null,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { clientId?: number } | null
    
  ) {
    this.clientForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required]],
      trade_name: [''],
      cpf_cnpj: [''],
      rg_ie: [''],
      im: [''],
      birth_foundation_date: [null],
      active: [true],
      client_segment_id: [null],
      client_group_id: [null],
      client_type_ids: [[]],

      commercial: this.fb.group({
        seller_id: [null],
        supervisor_id: [null],
        market_segment: [''],
        sales_channel: [''],
        credit_limit: [0],
        max_discount: [0]
      }),

      financial: this.fb.group({
        preferred_payment_method: [''],
        bank_name: [''],
        agency: [''],
        account_number: [''],
        pix_key: [''],
        due_day: [null],
        financial_blocked: [false],
        block_reason: ['']
      }),

      settings: this.fb.group({
        blocked: [false],
        block_reason: [''],
        allow_partial_invoice: [false],
        allow_sale_without_stock: [false],
        require_purchase_order: [false],
        require_special_approval: [false]
      }),

      marketing: this.fb.group({
        lead_source: [''],
        campaign: [''],
        email_marketing: [false],
        whatsapp_marketing: [false],
        sms_marketing: [false],
        lgpd_consent: [false]
      })
    });
  }

  ngOnInit(): void {
    const id = this.data?.clientId?.toString() ?? this.route.snapshot.paramMap.get('id');

    this.clientId = id ? Number(id) : null;

    this.loadLookups();

    if (this.clientId) this.readById();
  }

  get isEdit(): boolean {
    return this.clientId !== null;
  }

  get commercialForm(): FormGroup {
    return this.clientForm.get('commercial') as FormGroup;
  }

  get financialForm(): FormGroup {
    return this.clientForm.get('financial') as FormGroup;
  }

  get settingsForm(): FormGroup {
    return this.clientForm.get('settings') as FormGroup;
  }

  get marketingForm(): FormGroup {
    return this.clientForm.get('marketing') as FormGroup;
  }

  loadLookups() {
    this.lookupService.read('client-segments').subscribe({ next: d => this.segments = d, error: () => { } });
    this.lookupService.read('client-groups').subscribe({ next: d => this.groups = d, error: () => { } });
    this.lookupService.read('client-types').subscribe({ next: d => this.clientTypes = d, error: () => { } });
  }

  readById() {
    this.loading = true;

    this.clientService.readById(this.clientId!).subscribe({
      next: (client) => {
        this.clientForm.patchValue({
          code: client.code,
          name: client.name,
          trade_name: client.trade_name,
          cpf_cnpj: client.cpf_cnpj,
          rg_ie: client.rg_ie,
          im: client.im,
          birth_foundation_date: client.birth_foundation_date ? client.birth_foundation_date.slice(0, 10) : null,
          active: client.active,
          client_segment_id: client.client_segment_id,
          client_group_id: client.client_group_id,
          client_type_ids: client.client_type_ids ?? []
        });

        if (client.commercial) this.clientForm.get('commercial')?.patchValue(client.commercial);
        if (client.financial) this.clientForm.get('financial')?.patchValue(client.financial);
        if (client.settings) this.clientForm.get('settings')?.patchValue(client.settings);
        if (client.marketing) this.clientForm.get('marketing')?.patchValue(client.marketing);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.utils.showAutoCloseMessage('Preencha os campos obrigatórios.', 'red', 4000);
      return;
    }

    const value = this.clientForm.value;

    this.loading = true;

    const request$ = this.isEdit
      ? this.clientService.update(this.clientId!, value)
      : this.clientService.create(value);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_CREATE, 'green', 3000);
        if (this.dialogRef) this.dialogRef.close(true);
        else this.router.navigate(['/clients/list']);
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC);
      }
    });
  }

  cancel() {
    if (this.dialogRef) this.dialogRef.close(false);
    else this.router.navigate(['/clients/list']);
  }
}
