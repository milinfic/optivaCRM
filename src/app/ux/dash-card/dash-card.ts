import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
declare var echarts: any;

@Component({
  standalone: true,
  selector: 'app-dash-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  styleUrls: ['./dash-card.css'],
  template: `
    <div class="revenue-card" [ngClass]="'metric-' + matIcon">
      <div class="card-content">
        <div class="card-info">
          <span class="title">{{ title }}</span>
          <h2 class="value">{{ formattedValue }}</h2>
          <span class="metric-info" [ngClass]="smallInfoClass">
            <mat-icon class="metric-info-icon">{{ smallInfoIcon }}</mat-icon>
            {{ smallInfo }}
          </span>
        </div>
        <div class="card-icon-box" [ngClass]="matIcon">
          <mat-icon>{{ iconName }}</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class DashCardComponent {

  @Input() title: string = "";
  @Input() value: number = 0;
  @Input() smallInfo: string = "";
  @Input() smallInfoClass: string = "";
  @Input() matIcon: string = "";

  formattedValue: string = "";

  get smallInfoIcon(): string {
    if (this.matIcon === 'trending_up') return 'track_changes';
    if (this.matIcon === 'calendar_month') return 'calendar_month';
    return 'north_east';
  }

  get iconName(): string {
    return this.matIcon === 'database' ? 'storage' : this.matIcon;
  }

  constructor(
  ) { }

    ngOnChanges() {
      this.formattedValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(this.value);
    }
  }
