import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

/**
 * Aba "Comercial" do formulário de cliente (padrão Optiva).
 */
@Component({
  selector: 'app-client-commercial-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './commercial.tab.html',
  styleUrl: '../client-form.css'
})
export class ClientCommercialTab {

  @Input() clientForm!: FormGroup;
}
