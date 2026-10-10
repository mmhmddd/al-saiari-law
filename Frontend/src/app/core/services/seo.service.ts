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

  setPageMetadata(title: string, description: string, route: string, structuredData?: Record<string, unknown>, keywords?: string[]): void {
    const cleanRoute = route || '/';
    const canonicalUrl = new URL(cleanRoute, environment.publicSiteUrl).toString();
    const isPrivate = /\/(admin|login|register|forgot-password|reset-password)(\/|$)/.test(cleanRoute);
    const schemaImage = structuredData?.['image'];
    const socialImage = typeof schemaImage === 'string' && /^https?:\/\//.test(schemaImage)
      ? schemaImage
      : new URL('/assets/brand/social-cover.jpg', environment.publicSiteUrl).toString();
    const schemaType = structuredData?.['@type'];

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: isPrivate ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    this.meta.updateTag({ property: 'og:site_name', content: 'شركة السياري للمحاماة | Al Saiari Law Firm' });
    this.meta.updateTag({ property: 'og:locale', content: this.doc.documentElement.lang === 'en' ? 'en_US' : 'ar_SA' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: schemaType === 'Article' ? 'article' : 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: socialImage });
    this.meta.updateTag({ property: 'og:image:alt', content: title });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: socialImage });
    if (keywords?.length) this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
    else this.meta.removeTag('name="keywords"');
    this.setCanonical(canonicalUrl);
    this.setAlternate('ar', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/ar'));
    this.setAlternate('en', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/en'));
    this.setAlternateDefault(new URL('/ar', environment.publicSiteUrl).toString());
    if (structuredData) {
      if (!this.structuredData) {
        this.structuredData = this.doc.createElement('script');
        this.structuredData.type = 'application/ld+json';
        this.doc.head.appendChild(this.structuredData);
      }
      this.structuredData.textContent = JSON.stringify(structuredData);
    } else if (this.structuredData) {
      this.structuredData.remove();
      this.structuredData = undefined;
    }
  }

  setLanguage(locale: Locale, route: string): void {
    this.doc.documentElement.lang = locale;
    this.doc.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    const path = route.split(/[?#]/)[0] || `/${locale}`;
    const isPrivate = /\/(admin|login|register|forgot-password|reset-password)(\/|$)/.test(path);
    const isHome = new RegExp(`^/${locale}/?$`).test(path);
    const page = path.replace(new RegExp(`^/${locale}/?`), '').split('/')[0];
    const pages: Record<string, { title: string; description: string; keywords: string[] }> = locale === 'ar' ? {
      home: { title: 'شركة السياري للمحاماة والاستشارات القانونية | السعودية', description: 'خدمات قانونية للأفراد والمنشآت في المملكة العربية السعودية. مشورة عملية في العقود، تأسيس الشركات، التقاضي والملكية الفكرية.', keywords: ['محاماة السعودية', 'استشارات قانونية', 'محامي شركات', 'العقود التجارية'] },
      about: { title: 'من نحن | شركة السياري للمحاماة والاستشارات القانونية', description: 'تعرف على شركة السياري للمحاماة، وفريقها ونهجها في تقديم المشورة القانونية للأفراد وقطاع الأعمال في السعودية.', keywords: ['شركة محاماة سعودية', 'مكتب محاماة', 'استشارات قانونية السعودية'] },
      services: { title: 'الخدمات القانونية | شركة السياري للمحاماة', description: 'استكشف خدمات السياري القانونية في التقاضي، العقود التجارية، تأسيس الشركات، الاستثمار، الامتياز التجاري والملكية الفكرية.', keywords: ['خدمات قانونية السعودية', 'تقاضي', 'عقود تجارية', 'تأسيس شركات'] },
      articles: { title: 'المقالات والرؤى القانونية | شركة السياري للمحاماة', description: 'اقرأ مقالات قانونية عملية للأفراد والمنشآت حول الأعمال والأنظمة في المملكة العربية السعودية.', keywords: ['مقالات قانونية', 'القانون السعودي', 'قانون الأعمال'] },
      consultation: { title: 'حجز استشارة قانونية | شركة السياري للمحاماة', description: 'اطلب استشارة قانونية خاصة من شركة السياري. شارك بياناتك والوقت المناسب وسيتواصل معك الفريق لتأكيد الموعد.', keywords: ['حجز استشارة قانونية', 'استشارات قانونية السعودية'] },
      contact: { title: 'تواصل معنا | شركة السياري للمحاماة والاستشارات', description: 'تواصل مع شركة السياري للمحاماة والاستشارات القانونية في المملكة العربية السعودية للاستفسارات والمواعيد.', keywords: ['التواصل مع محامي', 'شركة السياري للمحاماة'] },
    } : {
      home: { title: 'Al Saiari Law Firm | Legal Counsel in Saudi Arabia', description: 'Legal services for individuals and businesses in Saudi Arabia, with practical counsel on contracts, company formation, disputes and intellectual property.', keywords: ['Saudi law firm', 'legal counsel Saudi Arabia', 'commercial contracts', 'company formation'] },
      about: { title: 'About Us | Al Saiari Law Firm', description: 'Meet Al Saiari Law Firm and learn about our approach to practical legal counsel for individuals and businesses in Saudi Arabia.', keywords: ['Saudi law firm', 'Al Saiari Law Firm', 'legal counsel'] },
      services: { title: 'Legal Services in Saudi Arabia | Al Saiari Law Firm', description: 'Explore legal services for litigation, commercial contracts, company formation, investment, franchising and intellectual property.', keywords: ['legal services Saudi Arabia', 'commercial law', 'litigation', 'company formation'] },
      articles: { title: 'Legal Articles & Insights | Al Saiari Law Firm', description: 'Read practical legal insights for individuals and businesses on commercial matters and Saudi law.', keywords: ['Saudi legal articles', 'business law insights', 'Saudi commercial law'] },
      consultation: { title: 'Book a Legal Consultation | Al Saiari Law Firm', description: 'Request a private legal consultation with Al Saiari Law Firm. Share your details and preferred time for our team to confirm.', keywords: ['book legal consultation Saudi Arabia', 'legal advice'] },
      contact: { title: 'Contact Al Saiari Law Firm | Saudi Arabia', description: 'Contact Al Saiari Law Firm in Saudi Arabia for legal enquiries, office details and consultation appointments.', keywords: ['contact Saudi law firm', 'Al Saiari Law Firm contact'] },
    };
    const current = isPrivate
      ? (locale === 'ar' ? { title: 'بوابة العملاء | شركة السياري للمحاماة', description: 'بوابة آمنة لإدارة الحساب والخدمات.' } : { title: 'Client Portal | Al Saiari Law Firm', description: 'Secure account and service management portal.' })
      : (pages[page] || (locale === 'ar' ? { title: 'الخدمات القانونية | شركة السياري للمحاماة', description: 'خدمات قانونية للأفراد والمنشآت في المملكة العربية السعودية.' } : { title: 'Legal Services | Al Saiari Law Firm', description: 'Legal services for individuals and businesses in Saudi Arabia.' }));

    this.doc.documentElement.lang = locale;
    this.doc.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    const pageTitle = current.title;
    const description = current.description;
    const canonicalUrl = new URL(path, environment.publicSiteUrl).toString();
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: isPrivate ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    if ('keywords' in current && current.keywords.length) {
      this.meta.updateTag({ name: 'keywords', content: current.keywords.join(', ') });
    } else {
      this.meta.removeTag('name="keywords"');
    }
    this.meta.updateTag({ property: 'og:locale', content: locale === 'ar' ? 'ar_SA' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'شركة السياري للمحاماة | Al Saiari Law Firm' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: new URL('/assets/brand/social-cover.jpg', environment.publicSiteUrl).toString() });
    this.meta.updateTag({ property: 'og:image:alt', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: new URL('/assets/brand/social-cover.jpg', environment.publicSiteUrl).toString() });
    this.meta.updateTag({ name: 'twitter:image:alt', content: pageTitle });
    this.setCanonical(canonicalUrl);
    this.setAlternate('ar', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/ar'));
    this.setAlternate('en', canonicalUrl.replace(/\/(?:ar|en)(?=\/|$)/, '/en'));
    this.setAlternateDefault(new URL('/ar', environment.publicSiteUrl).toString());

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
        logo: new URL('/assets/brand/al-saiari-logo.png', environment.publicSiteUrl).toString(),
        image: new URL('/assets/brand/social-cover.jpg', environment.publicSiteUrl).toString(),
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

  private setCanonical(href: string): void {
    if (!this.canonical) {
      this.canonical = this.doc.createElement('link');
      this.canonical.rel = 'canonical';
      this.doc.head.appendChild(this.canonical);
    }
    this.canonical.href = href;
  }

  private setAlternateDefault(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[hreflang="x-default"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'alternate';
      link.hreflang = 'x-default';
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }
}
