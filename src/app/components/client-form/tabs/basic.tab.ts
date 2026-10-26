import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Aba "Dados principais" do formulário de cliente (padrão Optiva).
 */
@Component({
  selector: 'app-client-basic-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './basic.tab.html',
  styleUrl: '../client-form.css'
})
export class ClientBasicTab {

  @Input() clientForm!: FormGroup;

  @Input() segments: any[] = [];

  @Input() groups: any[] = [];

  @Input() clientTypes: any[] = [];
}
