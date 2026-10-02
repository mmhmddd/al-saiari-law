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
  errorMessage(error: unknown, fallback = 'error.generic'): string {
    const response = error && typeof error === 'object' ? error as { status?: number; error?: { message?: string; errors?: { field?: string; message?: string }[] } } : {};
    const status = response.status;
    if (status === 0) return this.locale() === 'ar' ? 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مجدداً.' : 'Could not connect to the server. Check your internet connection and try again.';
    if (status === 413) return this.locale() === 'ar' ? 'حجم الملف كبير جداً. اختر ملفاً أصغر ثم أعد المحاولة.' : 'The file is too large. Choose a smaller file and try again.';
    if (status === 429) return this.locale() === 'ar' ? 'تم إرسال طلبات كثيرة خلال وقت قصير. انتظر قليلاً ثم أعد المحاولة.' : 'Too many attempts. Wait a moment and try again.';
    if (status !== undefined && status >= 500) return this.locale() === 'ar' ? 'حدث خطأ في الخادم. لم يكتمل الطلب؛ حاول لاحقاً أو تواصل مع الدعم.' : 'The server encountered an error. Your request was not completed; try again later or contact support.';
    const details = response.error?.errors?.filter((item) => item?.message).map((item) => item.field ? `${item.field}: ${item.message}` : item.message) || [];
    if (details.length) return `${response.error?.message ? `${this.backendMessage(response.error.message, fallback)} — ` : ''}${details.join(' · ')}`;
    if (response.error?.message) return this.backendMessage(response.error.message, fallback);
    if (status === 401) return this.locale() === 'ar' ? 'انتهت صلاحية تسجيل الدخول. سجّل الدخول مجدداً.' : 'Your session may have expired. Sign in again.';
    if (status === 403) return this.locale() === 'ar' ? 'ليس لديك صلاحية لتنفيذ هذا الإجراء.' : 'You do not have permission to complete this action.';
    if (status === 404) return this.locale() === 'ar' ? 'لم يتم العثور على المطلوب. حدّث الصفحة وحاول مجدداً.' : 'The requested item was not found. Refresh the page and try again.';
    if (status === 409) return this.locale() === 'ar' ? 'تعارضت البيانات مع سجل موجود. راجع القيم وحاول مجدداً.' : 'This conflicts with an existing record. Review the values and try again.';
    if (status === 400) return this.locale() === 'ar' ? 'راجع البيانات المدخلة وتأكد من صحتها ثم أعد الإرسال.' : 'Review the entered information, correct any issues, and submit again.';
    return this.t(fallback);
  }
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
