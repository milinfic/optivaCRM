import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.services';
import { ThemeService } from '../../services/theme/theme.service';
import type { ThemeName } from '../../services/theme/theme.service';

/**
 * Barra superior fina: logo à esquerda, notificações + usuário à direita.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {

  menuItems = [
    { link: '/dashboard', label: 'Dashboard', icon: 'home' },
    { link: '/clients/list', label: 'Clientes', icon: 'groups' },
    { link: '/opportunities/list', label: 'Oportunidades', icon: 'trending_up' },
    { link: '/interactions', label: 'Interações', icon: 'forum' },
    { link: '/settings', label: 'Configurações', icon: 'settings' }
  ];

  userName = 'Admin';
  userEmail = '';
  initials = 'AD';
  hasNotifications = true;

  get themeLabel(): string {
    const labels: Record<ThemeName, string> = {
      light: 'Padr\u00e3o',
      white: 'Branco',
      dark: 'Escuro VS Code',
      blue: 'Azul'
    };

    return labels[this.themeService.theme];
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userEmail = profile?.email ?? '';

        if (this.userEmail) {
          this.initials = this.initialsFromEmail(this.userEmail);
          const prefix = this.userEmail.split('@')[0];

          this.userName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        }
      },
      error: () => { }
    });
  }

  initialsFromEmail(email: string): string {
    const prefix = email.split('@')[0] || 'A';

    return prefix.slice(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }
}
