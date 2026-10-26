import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TableHeader {
  id: string;
  text: string;
  type?: 'text' | 'date' | 'datetime' | 'currency' | 'badge' | 'boolean' | 'color' | 'actions';
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Tabela padrão do sistema.
 *
 * Uso:
 *   <app-table [datas]="clients" [headers]="headers" [loading]="loading"
 *              (actionEventTableComponent)="onAction($event)">
 *   </app-table>
 *
 * O evento emite `{ type: 'update' | 'delete' | 'view' | 'custom', data, key }`.
 */
@Component({
  standalone: true,
  selector: 'app-table',
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './table.ux.html',
  styleUrl: './table.ux.css'
})
export class TableComponent {

  @Input() datas: any[] = [];

  @Input() headers: TableHeader[] = [];

  @Input() loading = false;

  @Input() emptyMessage = 'Nenhum registro encontrado.';

  @Input() showView = false;

  @Input() actions: Array<{ key: string, icon: string, tooltip: string, cssClass?: string }> = [];

  @Output() actionEventTableComponent = new EventEmitter<{ type: string, data: any }>();

  /**
   * Emite a ação do usuário na linha.
   *
   * @param type ação ('update' | 'delete' | 'view' | chave customizada)
   * @param data linha
   */
  actionTableComponent(type: string, data: any) {
    this.actionEventTableComponent.emit({ type, data });
  }

  /**
   * Verifica se a coluna é de ações.
   */
  isActions(header: TableHeader): boolean {
    return header.id === 'actions';
  }

  /**
   * Retorna o valor formatado conforme o tipo da coluna.
   */
  cellValue(row: any, header: TableHeader): any {
    return row?.[header.id];
  }
}
