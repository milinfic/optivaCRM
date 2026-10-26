import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/** Cabeçalho reutilizável de página com ícone, título e descrição. */
@Component({
  standalone: true,
  selector: 'app-page-title',
  imports: [CommonModule, MatIconModule],
  template: `
    <header class="page-title">
     <!-- <span class="title-icon">🤝</span> -->
      <span class="title-icon"><mat-icon>{{ icon }}</mat-icon></span>
      <div class="title-copy">
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>
    </header>
  `,
  styleUrl: './page-title.ux.css'
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
}
