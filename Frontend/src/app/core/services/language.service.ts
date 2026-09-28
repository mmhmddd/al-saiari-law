import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StorageService } from './storage.service';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { SeoService } from './seo.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private readonly seo = inject(SeoService);
  readonly locale = signal<Locale>('ar');
  readonly direction = computed(() => this.locale() === 'ar' ? 'rtl' : 'ltr');

  constructor() {
    // The service can be created after the initial NavigationEnd, when a
    // deep-linked /en route is already active. Read that route immediately.
    this.applyRouteLanguage(this.router.url);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.applyRouteLanguage(event.urlAfterRedirects));
  }

  t(key: string): string { return TRANSLATIONS[key]?.[this.locale()] ?? key; }
  backendMessage(message: string | undefined, fallback = 'error.generic'): string {
    if (!message) return this.t(fallback);
    const key: Record<string, string> = {
      'Invalid email or password.': 'error.invalidCredentials',
      'This account has been deactivated. Please contact the administrator.': 'error.accountInactive',
      'Password must be at least 8 characters': 'error.passwordLength',
      'New password must be at least 8 characters': 'error.passwordLength',
      'Password must contain at least one number': 'error.passwordNumber',
      'New password must contain at least one number': 'error.passwordNumber',
      'An account with this email already exists.': 'error.emailExists',
      'Current password is incorrect.': 'error.currentPassword',
      'Password reset token is invalid or has expired.': 'error.resetExpired',
      'If an account exists with this email, a password reset link has been sent.': 'auth.resetSent',
      'Password has been reset successfully. You can now log in.': 'auth.resetDone',
    };
    return this.t(key[message] || fallback);
  }
  setLocale(locale: Locale): void {
    if (this.locale() === locale) return;
    const currentUrl = this.router.url;
    const pathAndFragment = currentUrl.split('?')[0];
    const path = pathAndFragment.split('/').filter(Boolean);
    if (path[0] === 'ar' || path[0] === 'en') path[0] = locale;
    else path.unshift(locale);
    const targetUrl = `/${path.join('/')}${currentUrl.slice(pathAndFragment.length)}`;
    // Update labels and text direction immediately; NavigationEnd confirms
    // the same locale after the route has completed.
    this.applyRouteLanguage(targetUrl);
    void this.router.navigateByUrl(targetUrl);
  }
  private applyRouteLanguage(url: string): void {
    const first = url.split(/[/?#]/).filter(Boolean)[0];
    const locale: Locale = first === 'en' ? 'en' : 'ar';
    this.locale.set(locale);
    this.storage.set('language', locale);
    this.document.documentElement.lang = locale;
    this.document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    this.seo.setLanguage(locale, url.split('?')[0]);
  }
}
