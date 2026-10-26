import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UserService } from '../../services/user/user.services';
import { UtilsService } from '../../services/utils/utils.service';
import { ConfirmDialogComponent } from '../../ux/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../ux/empty-state/empty-state.ux';
import { CardComponent } from '../../ux/card/card.ux';
import { MESSAGE_SUCCESS_DELETE, MESSAGE_ERROR_GENERIC } from '../../constants/messages';

import { LookupManagerComponent } from './lookup-manager/lookup-manager';
import { UserFormDialog } from './user-form.dialog';
import { PageTitleComponent } from '../../ux/page-title/page-title.ux';

/**
 * Configurações: tabelas de apoio + usuários.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    CardComponent,
    EmptyStateComponent,
    LookupManagerComponent,
    PageTitleComponent
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {

  users: any[] = [];

  constructor(
    private userService: UserService,
    private utils: UtilsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.readUsers();
  }

  readUsers() {
    this.userService.read().subscribe({
      next: (data) => this.users = data,
      error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
    });
  }

  openUser(user: any = null) {
    const ref = this.dialog.open(UserFormDialog, { width: '70vw', data: { user } });

    ref.afterClosed().subscribe((saved) => {
      if (saved) this.readUsers();
    });
  }

  removeUser(user: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Deseja realmente desativar o usuário "${user.name}"?` }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.userService.delete(user.id).subscribe({
        next: () => {
          this.utils.showAutoCloseMessage(MESSAGE_SUCCESS_DELETE, 'green', 3000);
          this.readUsers();
        },
        error: (err) => this.utils.handleApiError(err, MESSAGE_ERROR_GENERIC)
      });
    });
  }
}
