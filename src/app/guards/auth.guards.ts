import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.services';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getProfile().pipe(

    map(() => true),

    catchError(() => {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });

      return of(false);
    })

  );
};