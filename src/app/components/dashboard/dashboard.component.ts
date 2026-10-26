import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../services/dashboard/dashboard.services';
import { UtilsService } from '../../services/utils/utils.service';
import { DashCardComponent } from '../../ux/dash-card/dash-card';
import { PanelComponent } from '../../ux/panel/panel.ux';
// import { PageTitleComponent } from '../../ux/page-title/page-title.ux';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DashCardComponent,
    PanelComponent,
    // PageTitleComponent
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class Dashboard implements OnInit {

  summary: any = null;
  loading = true;
  today = new Date();
  todayLabel = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(this.today);

  constructor(private dashboardService: DashboardService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.dashboardService.summary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.utils.handleApiError(err, 'Não foi possível carregar o dashboard.');
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  }
}
