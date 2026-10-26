import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { firstValueFrom, from, Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.services';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInFlight$: Observable<unknown> | null = null;
  private endingSession = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(() => {
        if (this.isLoginRequest(request)) {
          this.endingSession = false;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (this.isSessionError(error)) {
          if (error.status === 401 && !this.isAuthEndpoint(request)) {
            return this.refreshAndRetry(request, next, error);
          }
          this.expireSession(error);
        }
        return throwError(() => error);
      })
    );
  }

  private refreshAndRetry(
    request: HttpRequest<any>, next: HttpHandler, originalError: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.refreshWithBrowserLock().pipe(
        finalize(() => { this.refreshInFlight$ = null; }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.refreshInFlight$.pipe(
      switchMap(() => next.handle(request)),
      catchError((error: HttpErrorResponse) => {
        if (this.isSessionError(error)) this.expireSession(error);
        return throwError(() => error || originalError);
      })
    );
  }

  private refreshWithBrowserLock(): Observable<unknown> {
    const lockManager = typeof navigator !== 'undefined' ? (navigator as any).locks : undefined;
    if (!lockManager?.request) return this.authService.refresh();

    // Coordena abas diferentes que compartilham os mesmos cookies do navegador.
    return from(lockManager.request(
      'optiva-auth-refresh',
      () => firstValueFrom(this.authService.refresh())
    ));
  }

  private isSessionError(error: HttpErrorResponse): boolean {
    return error.status === 0 || error.status === 401 || error.status === 403 || error.status >= 500;
  }

  private isAuthEndpoint(request: HttpRequest<any>): boolean {
    return /\/auth\/(login|refresh|logout|register)(?:\/|$)/.test(new URL(request.url).pathname);
  }

  private isLoginRequest(request: HttpRequest<any>): boolean {
    return /\/auth\/login(?:\/|$)/.test(new URL(request.url).pathname);
  }

  private expireSession(error: HttpErrorResponse): void {
    if (this.endingSession) return;
    this.endingSession = true;

    // O endpoint de logout revoga a sessão no backend e apaga os cookies HttpOnly.
    this.authService.logout().subscribe({ error: () => undefined });
    if (this.router.url !== '/login') {
      this.router.navigate(['/login'], { queryParams: { reason: error.status === 401 || error.status === 403 ? 'auth' : 'server' } });
    }
  }
}
