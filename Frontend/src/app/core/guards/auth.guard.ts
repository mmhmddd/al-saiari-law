import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService); const router = inject(Router); const storage = inject(StorageService);
  const locale = route.parent?.paramMap.get('lang') === 'en' ? 'en' : 'ar';
  if (!storage.get('token')) return router.createUrlTree([`/${locale}/login`]);
  return auth.refresh().pipe(map(() => true), catchError(() => of(router.createUrlTree([`/${locale}/login`]))));
};
