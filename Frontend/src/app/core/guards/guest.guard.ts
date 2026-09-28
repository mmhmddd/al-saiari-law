import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
export const guestGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService); const router = inject(Router); const storage = inject(StorageService);
  const locale = route.parent?.paramMap.get('lang') === 'en' ? 'en' : 'ar';
  if (!storage.get('token')) return true;
  return auth.refresh().pipe(map((user) => router.createUrlTree([`/${locale}/${user.role === 'admin' ? 'admin/dashboard' : ''}`])), catchError(() => of(true)));
};
