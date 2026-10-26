import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type ThemeName = 'dark' | 'light' | 'blue' | 'white';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'optiva-theme-v3';
  private currentTheme: ThemeName = this.readTheme();

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  get theme(): ThemeName {
    return this.currentTheme;
  }

  constructor(private router: Router) {
    this.applyForCurrentRoute();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.applyForCurrentRoute());
  }

  toggle(): void {
    this.setTheme(this.isDark ? 'light' : 'dark');
  }

  setTheme(theme: ThemeName): void {
    this.currentTheme = theme;
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch {
      // The selected theme still applies for this page load when storage is unavailable.
    }
    this.applyForCurrentRoute();
  }

  private readTheme(): ThemeName {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      return savedTheme === 'dark' || savedTheme === 'blue' || savedTheme === 'white' || savedTheme === 'light'
        ? savedTheme
        : 'light';
    } catch {
      return 'light';
    }
  }

  /** Apply the default look on login while keeping the saved preference intact. */
  private applyForCurrentRoute(): void {
    const routerPath = this.router.url.split(/[?#]/, 1)[0];
    const initialPath = typeof window === 'undefined' ? '' : window.location.pathname;
    const path = (this.router.navigated ? routerPath : initialPath).replace(/\/+$/, '');
    const isLoginRoute = path.endsWith('/login');

    this.apply(isLoginRoute ? 'light' : this.currentTheme);
  }

  private apply(theme: ThemeName): void {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.classList.toggle('theme-blue', theme === 'blue');
    document.documentElement.classList.toggle('theme-white', theme === 'white');

    for (const themeName of ['dark', 'blue', 'white'] as const) {
      const stylesheetId = `${themeName}-theme-stylesheet`;
      let stylesheet = document.getElementById(stylesheetId) as HTMLLinkElement | null;

      if (theme === themeName) {
        if (!stylesheet) {
          stylesheet = document.createElement('link');
          stylesheet.id = stylesheetId;
          stylesheet.rel = 'stylesheet';
          stylesheet.href = new URL(`themes/${themeName}-theme.css`, document.baseURI).href;
          document.head.appendChild(stylesheet);
        }
      } else {
        stylesheet?.remove();
      }
    }
  }
}
