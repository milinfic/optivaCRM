import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Aba "Financeiro" do formulário de cliente (padrão Optiva).
 */
@Component({
  selector: 'app-client-financial-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './financial.tab.html',
  styleUrl: '../client-form.css'
})
export class ClientFinancialTab {

  @Input() clientForm!: FormGroup;
}
