import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Aba "Configurações" do formulário de cliente (padrão Optiva).
 */
@Component({
  selector: 'app-client-settings-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './settings.tab.html',
  styleUrl: '../client-form.css'
})
export class ClientSettingsTab {

  @Input() clientForm!: FormGroup;
}
