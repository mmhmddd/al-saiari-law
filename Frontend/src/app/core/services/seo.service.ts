import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Locale } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private canonical?: HTMLLinkElement;
  setLanguage(locale: Locale, route: string): void {
    this.doc.documentElement.lang = locale;
    this.doc.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    const isPrivate = /\/(admin|login|register|forgot-password|reset-password)(\/|$)/.test(route);
    this.title.setTitle(locale === 'ar' ? 'مكتب السياري للمحاماة' : 'Al Saiari Law Firm');
    this.meta.updateTag({ name: 'description', content: locale === 'ar' ? 'مكتب السياري للمحاماة والاستشارات القانونية.' : 'Al Saiari Law Firm provides trusted legal counsel and representation.' });
    this.meta.updateTag({ name: 'robots', content: isPrivate ? 'noindex, nofollow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:locale', content: locale === 'ar' ? 'ar_EG' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: locale === 'ar' ? 'مكتب السياري للمحاماة' : 'Al Saiari Law Firm' });
    const canonicalUrl = new URL(route || `/${locale}`, environment.publicSiteUrl).toString();
    if (!this.canonical) {
      this.canonical = this.doc.createElement('link');
      this.canonical.rel = 'canonical';
      this.doc.head.appendChild(this.canonical);
    }
    this.canonical.href = canonicalUrl;
    this.setAlternate('ar', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/ar'));
    this.setAlternate('en', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/en'));
  }
  private setAlternate(locale: Locale, href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(`link[hreflang="${locale}"]`);
    if (!link) { link = this.doc.createElement('link'); link.rel = 'alternate'; link.hreflang = locale; this.doc.head.appendChild(link); }
    link.href = href;
  }
}
