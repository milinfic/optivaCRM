import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Aba "Marketing" do formulário de cliente (padrão Optiva).
 */
@Component({
  selector: 'app-client-marketing-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './marketing.tab.html',
  styleUrl: '../client-form.css'
})
export class ClientMarketingTab {

  @Input() clientForm!: FormGroup;
}
