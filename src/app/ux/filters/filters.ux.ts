import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BtnPrimaryComponent } from '../btn/btn-primary/btn-primary.ux';

export interface FilterOption {
  label: string;
  value: string | number | boolean | null;
}

/** Describes one text-entry or selection control rendered by app-filters. */
export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  defaultValue?: string | number | boolean | null;
  options?: FilterOption[];
}

/** Shared filter form: renders configured controls and emits their values. */
@Component({
  standalone: true,
  selector: 'app-filters',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, BtnPrimaryComponent],
  templateUrl: './filters.ux.html',
})
export class FiltersComponent implements OnChanges, OnInit {
  @Input() fields: FilterField[] = [];
  @Input() loading = false;

  @Output() valueChange = new EventEmitter<Record<string, unknown>>();
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  readonly form = new FormGroup<Record<string, FormControl<unknown>>>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['fields']) return;

    for (const field of this.fields) {
      if (!this.form.contains(field.name)) {
        this.form.addControl(field.name, new FormControl(this.defaultValue(field), { nonNullable: true }));
      }
    }
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => this.valueChange.emit(value as Record<string, unknown>));
  }

  controlId(field: FilterField): string {
    return `filter-${field.name}`;
  }

  clearFilters(): void {
    const values = Object.fromEntries(this.fields.map(field => [field.name, this.defaultValue(field)]));
    this.form.reset(values);
    this.valueChange.emit(values);
    this.clear.emit();
  }

  private defaultValue(field: FilterField): string | number | boolean | null {
    if (field.defaultValue !== undefined) return field.defaultValue;
    return field.type === 'select' ? null : '';
  }
}
