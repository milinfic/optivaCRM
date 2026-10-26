import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  link: string;
  label: string;
  icon: string;
}

/**
 * Barra lateral de navegação (menu vertical branco).
 *
 * "Relatórios" funciona como um grupo/submenu: clicar nele apenas marca como
 * ativo; a aba em si (conteúdo) será preenchida depois.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  mainItems: MenuItem[] = [
    { link: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { link: '/clients/list', label: 'Clientes', icon: 'groups' },
    { link: '/opportunities/list', label: 'Oportunidades', icon: 'trending_up' },
    { link: '/interactions', label: 'Interações', icon: 'forum' },
    { link: '/reports', label: 'Relatórios', icon: 'bar_chart' }
  ];

  bottomItems: MenuItem[] = [
    { link: '/settings', label: 'Configurações', icon: 'settings' }
  ];

  constructor(private router: Router) { }

  isActive(link: string): boolean {
    return this.router.url.startsWith(link);
  }
}
