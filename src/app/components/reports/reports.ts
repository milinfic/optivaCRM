import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from '../../ux/card/card.ux';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';

/**
 * Tela de Relatórios.
 *
 * Por enquanto é uma aba/placeholder: a ideia é que cada relatório seja
 * preenchido conforme o submenu clicado no topo.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, CardComponent, EmptyStateComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  constructor(private router: Router) { }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
