import { inject } from '@angular/core'; import { CanActivateFn, Router } from '@angular/router';
export const languageGuard: CanActivateFn = (route) => {
  const locale = route.paramMap.get('lang');
  if (locale === 'ar' || locale === 'en') return true;
  return inject(Router).createUrlTree(['/ar']);
};
