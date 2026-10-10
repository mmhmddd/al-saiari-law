import { inject } from '@angular/core'; import { CanActivateFn, Router } from '@angular/router';
import { SeoService } from '../services/seo.service';
export const languageGuard: CanActivateFn = (route, state) => {
  const locale = route.paramMap.get('lang');
  if (locale === 'ar' || locale === 'en') {
    inject(SeoService).setLanguage(locale, state.url);
    return true;
  }
  return inject(Router).createUrlTree(['/ar']);
};
