import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SeoService } from '../core/services/seo.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';
import { SERVICE_OFFERINGS } from './service-catalog';
import { getServiceArticle, ServiceArticle } from './service-content';

interface PublicServiceDetail {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  image?: { url?: string | null };
  fallbackImage?: string;
  article?: ServiceArticle;
}

@Component({
  standalone: true,
  imports: [RouterLink, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="service-detail-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      @if (loading) {
        <div class="detail-state" role="status">{{ ar ? 'جارٍ تحميل تفاصيل الخدمة…' : 'Loading service details…' }}</div>
      } @else if (service) {
        <header class="service-hero">
          <img class="service-hero-image" [src]="service.image?.url || service.fallbackImage || 'assets/brand/office.png'" [alt]="service.title" />
          <div class="service-hero-shade"></div>
          <div class="service-hero-content">
            <a class="back-link" [routerLink]="['/', i18n.locale(), 'services']"><span aria-hidden="true">{{ ar ? '→' : '←' }}</span>{{ ar ? 'جميع الخدمات' : 'All services' }}</a>
            <p class="eyebrow">{{ ar ? 'خدمة قانونية متخصصة' : 'SPECIALIST LEGAL SERVICE' }}</p>
            <h1>{{ service.title }}</h1>
            <p class="service-summary">{{ service.shortDescription }}</p>
            <a class="book-link" [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'احجز استشارة' : 'Book a consultation' }} <span aria-hidden="true">↗</span></a>
          </div>
        </header>
        <section class="detail-content">
          <div class="detail-heading"><p class="eyebrow">{{ ar ? 'كيف نساندك' : 'HOW WE SUPPORT YOU' }}</p><h2>{{ service.title }}</h2></div>
          <article class="rich-description">
            @if (service.article; as article) {
              <p class="article-intro">{{ article.intro }}</p>
              @for (section of article.sections; track section.heading) {
                <section class="article-section">
                  <h3>{{ section.heading }}</h3>
                  @for (paragraph of section.paragraphs; track paragraph) { <p [innerHTML]="linkify(paragraph)"></p> }
                  @if (section.points?.length) { <ul>@for (point of section.points; track point) { <li>{{ point }}</li> }</ul> }
                </section>
              }
              <p class="official-resource">{{ ar ? 'مصدر رسمي للمعلومات:' : 'Official information:' }} <a [href]="article.resourceUrl" target="_blank" rel="noopener noreferrer">{{ article.resourceLabel }} <span aria-hidden="true">↗</span></a></p>
            } @else { <div [innerHTML]="service.description || service.shortDescription"></div> }
          </article>
          <nav class="related-services" [attr.aria-label]="ar ? 'خدمات قانونية ذات صلة' : 'Related legal services'"><h2>{{ ar ? 'خدمات قانونية ذات صلة' : 'Related legal services' }}</h2><div>@for (related of relatedServices; track related.id) { <a [routerLink]="['/', i18n.locale(), 'services', related.id]">{{ ar ? related.ar : related.en }} <span aria-hidden="true">↗</span></a> }</div></nav>
          <aside class="detail-cta"><div><p class="eyebrow">{{ ar ? 'هل تحتاج إلى مساعدة؟' : 'NEED LEGAL SUPPORT?' }}</p><h2>{{ ar ? 'ناقش احتياجك مع فريقنا' : 'Talk with our legal team' }}</h2></div><a [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'احجز موعد استشارة' : 'Book a consultation' }} <span aria-hidden="true">↗</span></a></aside>
        </section>
      } @else {
        <section class="detail-state not-found"><p class="eyebrow">{{ ar ? 'الخدمة غير متاحة' : 'SERVICE UNAVAILABLE' }}</p><h1>{{ ar ? 'لم نتمكن من العثور على هذه الخدمة.' : 'We could not find this service.' }}</h1><a [routerLink]="['/', i18n.locale(), 'services']">{{ ar ? 'العودة إلى الخدمات' : 'Back to legal services' }}</a></section>
      }
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--ink:#191919;--gold:#ad8c59;--muted:#6f6f6f;color:var(--ink)}.service-detail-page{min-height:100vh;background:#f7f7f6;font-family:var(--font)}.service-hero{position:relative;isolation:isolate;display:flex;align-items:flex-end;min-height:clamp(470px,58vw,660px);padding:clamp(38px,7vw,86px) clamp(22px,9vw,130px);overflow:hidden;background:#171717;color:#fff}.service-hero-image,.service-hero-shade{position:absolute;z-index:-1;inset:0;width:100%;height:100%}.service-hero-image{object-fit:cover;filter:grayscale(.6)}.service-hero-shade{background:linear-gradient(90deg,#171717eb 0%,#171717c9 47%,#17171745 100%),linear-gradient(0deg,#1118,transparent 65%)}.service-hero-content{max-width:840px}.back-link{display:inline-flex;align-items:center;gap:10px;margin-bottom:35px;color:#e6e3dd;font-size:14px}.back-link:hover{color:#e1c997}.back-link span{color:#d1b67f;font-size:20px}.eyebrow{margin:0 0 12px;color:var(--gold);font-size:12px;font-weight:700;letter-spacing:.14em}.service-hero h1{margin:0;font-size:clamp(42px,6.5vw,76px);font-weight:700;line-height:1.25}.is-ar .service-hero h1{line-height:1.5}.service-summary{max-width:700px;margin:16px 0 24px;color:#e0ded9;font-size:18px;line-height:1.95}.book-link,.detail-cta>a{display:inline-flex;align-items:center;justify-content:space-between;gap:22px;min-height:50px;padding:0 17px;border:1px solid var(--gold);border-radius:6px;background:var(--gold);color:#171717;font-size:14px;font-weight:700;transition:background .2s ease,transform .2s ease}.book-link:hover,.detail-cta>a:hover{transform:translateY(-2px);background:#c3a978}.book-link span,.detail-cta>a span{font-size:18px}
    .detail-content{max-width:1120px;margin:auto;padding:clamp(52px,8vw,100px) clamp(22px,7vw,80px)}.detail-heading{max-width:740px;margin-bottom:25px}.detail-heading h2{margin:0;font-size:clamp(28px,4vw,44px);font-weight:700;line-height:1.45}.rich-description{color:#454545;font-size:17px;line-height:2}.rich-description p{margin:0 0 18px}.rich-description h2,.rich-description h3{margin:28px 0 10px;color:#222;font-size:23px;line-height:1.5}.rich-description ul,.rich-description ol{padding-inline-start:24px}.rich-description li{margin:7px 0}.rich-description .article-intro{padding:22px 25px;border-inline-start:3px solid var(--gold);background:#fff;color:#282722;font-size:19px;line-height:1.9}.article-section{margin-top:34px}.article-section h3{margin:0 0 12px}.official-resource{margin-top:32px;padding-top:18px;border-top:1px solid #dedbd4;font-size:14px}.official-resource a,.related-services a{color:#725b36;text-decoration:underline;text-underline-offset:3px}.related-services{margin-top:42px;padding:25px;border:1px solid #dedbd4;border-radius:9px;background:#fff}.related-services h2{margin:0 0 16px;font-size:19px}.related-services>div{display:flex;flex-wrap:wrap;gap:12px}.related-services a{display:inline-flex;align-items:center;gap:9px;padding:10px 12px;border:1px solid #e8e4dc;border-radius:5px;text-decoration:none}.related-services a:hover{border-color:var(--gold);background:#f7f5f0}.detail-cta{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:55px;padding:clamp(24px,4vw,42px);border:1px solid #dedbd4;border-radius:10px;background:#fff}.detail-cta .eyebrow{margin-bottom:8px}.detail-cta h2{margin:0;font-size:clamp(23px,3vw,32px);font-weight:700}.detail-cta>a{flex:none}.detail-state{display:grid;place-items:center;min-height:55vh;padding:40px 22px;text-align:center;color:var(--muted)}.detail-state h1{max-width:700px;color:var(--ink);font-size:36px}.detail-state a{color:#80683f;text-decoration:underline}.not-found .eyebrow{align-self:end}
    @media(max-width:650px){.service-hero{min-height:520px;padding:32px 20px 48px}.service-hero-shade{background:linear-gradient(0deg,#171717f2 0%,#171717a8 56%,#17171735 100%)}.service-hero h1{font-size:43px}.service-summary{font-size:16px}.back-link{margin-bottom:28px}.detail-content{padding:48px 20px 62px}.rich-description{font-size:16px}.detail-cta{align-items:stretch;flex-direction:column;margin-top:38px}.detail-cta>a{width:100%}}
    @media(prefers-reduced-motion:reduce){.book-link,.detail-cta>a{transition:none}}
  `],
})
export class ServiceDetailPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  service: PublicServiceDetail | null = null;
  loading = true;
  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.get<{ service: PublicServiceDetail }>(`/services/${encodeURIComponent(slug)}`, { lang: this.i18n.locale() }).subscribe({
      next: (response) => { this.service = this.withArticle(response.data.service, slug) || this.catalogFallback(slug); this.loading = false; this.updateSeo(); },
      error: () => { this.service = this.catalogFallback(slug); this.loading = false; },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  get relatedServices() { return SERVICE_OFFERINGS.filter((item) => item.id !== this.service?.slug).slice(0, 3); }
  linkify(text: string): string {
    return text.replace(/\[([^\]]+)\]\((\/(?:ar|en)\/[a-z0-9/-]+)\)/g,
      (_match, label: string, url: string) => `<a href="${url.replace(/^\/(?:ar|en)(?=\/)/, `/${this.i18n.locale()}`)}">${label}</a>`);
  }
  private withArticle(service: PublicServiceDetail | null, slug: string): PublicServiceDetail | null {
    return service ? { ...service, article: getServiceArticle(slug, this.ar ? 'ar' : 'en') || undefined } : null;
  }
  private updateSeo(): void {
    if (!this.service) return;
    const title = `${this.service.title} | Al Saiari Law Firm`;
    const description = this.service.article?.intro || this.service.shortDescription;
    this.seo.setPageMetadata(title, description, `/${this.i18n.locale()}/services/${this.service.slug}`, {
      '@context': 'https://schema.org', '@type': 'LegalService', name: this.service.title,
      description, url: new URL(`/${this.i18n.locale()}/services/${this.service.slug}`, location.origin).toString(),
      provider: { '@type': 'LegalService', name: 'Al Saiari Law Firm' },
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    });
  }
  private catalogFallback(slug: string): PublicServiceDetail | null {
    const item = SERVICE_OFFERINGS.find((service) => service.id === slug);
    return item ? {
      title: this.ar ? item.ar : item.en,
      slug: item.id,
      shortDescription: this.ar ? item.descAr : item.descEn,
      description: this.ar ? item.descAr : item.descEn,
      fallbackImage: item.image,
      article: getServiceArticle(slug, this.ar ? 'ar' : 'en') || undefined,
    } : null;
  }
}
