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
  private structuredData?: HTMLScriptElement;

  setPageMetadata(title: string, description: string, route: string, structuredData?: Record<string, unknown>): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    const canonicalUrl = new URL(route, environment.publicSiteUrl).toString();
    if (!this.canonical) {
      this.canonical = this.doc.createElement('link');
      this.canonical.rel = 'canonical';
      this.doc.head.appendChild(this.canonical);
    }
    this.canonical.href = canonicalUrl;
    this.setAlternate('ar', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/ar'));
    this.setAlternate('en', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/en'));
    if (structuredData) {
      if (!this.structuredData) {
        this.structuredData = this.doc.createElement('script');
        this.structuredData.type = 'application/ld+json';
        this.doc.head.appendChild(this.structuredData);
      }
      this.structuredData.textContent = JSON.stringify(structuredData);
    }
  }

  setLanguage(locale: Locale, route: string): void {
    this.doc.documentElement.lang = locale;
    this.doc.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    const isPrivate = /\/(admin|login|register|forgot-password|reset-password)(\/|$)/.test(route);
    const isHome = /^\/(ar|en)\/?$/.test(route);
    const pageTitle = locale === 'ar'
      ? (isHome ? 'الساعي للمحاماة والاستشارات القانونية | وضوح في الرؤية القانونية' : 'ALSAIARI LAW FIRM | بوابة الإدارة')
      : (isHome ? 'Al Saiari Law Firm | Clear Legal Counsel' : 'ALSAIARI LAW FIRM | Administration');
    const description = locale === 'ar'
      ? 'مكتب الساعي للمحاماة والاستشارات القانونية. مشورة قانونية مهنية تساعد الأفراد وقطاع الأعمال على فهم خياراتهم واتخاذ خطوات واضحة.'
      : 'Al Saiari Law Firm provides considered legal counsel to help individuals and businesses understand their options and take clear next steps.';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: isPrivate ? 'noindex, nofollow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:locale', content: locale === 'ar' ? 'ar_SA' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'ALSAIARI LAW FIRM' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });

    const canonicalUrl = new URL(route || `/${locale}`, environment.publicSiteUrl).toString();
    if (!this.canonical) {
      this.canonical = this.doc.createElement('link');
      this.canonical.rel = 'canonical';
      this.doc.head.appendChild(this.canonical);
    }
    this.canonical.href = canonicalUrl;
    this.setAlternate('ar', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/ar'));
    this.setAlternate('en', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/en'));

    if (isHome) {
      if (!this.structuredData) {
        this.structuredData = this.doc.createElement('script');
        this.structuredData.type = 'application/ld+json';
        this.doc.head.appendChild(this.structuredData);
      }
      this.structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: 'Al Saiari Law Firm',
        alternateName: 'مكتب الساعي للمحاماة والاستشارات القانونية',
        url: new URL(`/${locale}`, environment.publicSiteUrl).toString(),
        description,
        availableLanguage: ['Arabic', 'English'],
      });
    } else if (this.structuredData) {
      this.structuredData.remove();
      this.structuredData = undefined;
    }
  }

  private setAlternate(locale: Locale, href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(`link[hreflang="${locale}"]`);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }
}
