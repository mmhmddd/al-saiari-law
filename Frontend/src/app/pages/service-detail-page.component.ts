import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SeoService } from '../core/services/seo.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';
import { SERVICE_OFFERINGS } from './service-catalog';
import { getServiceArticle, ServiceArticle } from './service-content';

interface PublicArticleCard {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  featuredImage?: { url?: string | null };
  imageAlt?: string;
  tags?: string[];
}

interface PublicServiceDetail {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  image?: { url?: string | null };
  fallbackImage?: string;
  id?: string;
  bodyImageUrl?: string;
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
          <img class="service-hero-image" [src]="service.fallbackImage || service.image?.url || 'assets/brand/office.png'" [alt]="service.title" />
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
          <div class="detail-heading">
            <p class="eyebrow">{{ ar ? 'كيف نساندك' : 'HOW WE SUPPORT YOU' }}</p>
            <h2>{{ service.title }}</h2>
            <div class="keyword-tags" [attr.aria-label]="ar ? 'موضوعات هذه الخدمة' : 'Service topics'">
              @for (tag of serviceTags; track tag) { <span>{{ tag }}</span> }
            </div>
          </div>
          <div class="detail-layout">
            <article class="rich-description" [attr.dir]="i18n.direction()">
              @if (service.article; as article) {
                <p class="article-intro">{{ article.intro }}</p>
                <figure class="article-visual"><img [src]="relatedArticles[0]?.featuredImage?.url || service.bodyImageUrl || service.fallbackImage || service.image?.url || 'assets/brand/office.png'" [alt]="service.title" loading="lazy" /><figcaption>{{ service.title }} — {{ ar ? 'نظرة عملية على نطاق الخدمة' : 'An overview of this area of legal support' }}</figcaption></figure>
                @for (section of article.sections; track section.heading) {
                  <section class="article-section">
                    <h3>{{ section.heading }}</h3>
                    @for (paragraph of section.paragraphs; track paragraph) { <p [innerHTML]="linkify(paragraph)"></p> }
                    @if (section.points?.length) { <ul class="article-points">@for (point of section.points; track point) { <li>{{ point }}</li> }</ul> }
                  </section>
                }
                <section class="service-process">
                  <h3>{{ ar ? 'كيف نرتب العمل على المسألة؟' : 'How we structure the work' }}</h3>
                  <ul>
                    <li>{{ ar ? 'فهم المسألة وأهدافك' : 'Understand the matter and your objectives' }}
                      <ul><li>{{ ar ? 'مراجعة الوقائع والمستندات ذات الصلة' : 'Review relevant facts and documents' }}</li><li>{{ ar ? 'تحديد الأولويات والمواعيد المهمة' : 'Identify priorities and important dates' }}</li></ul>
                    </li>
                    <li>{{ ar ? 'تقييم الخيارات المتاحة' : 'Assess the available options' }}
                      <ul><li>{{ ar ? 'توضيح الاعتبارات القانونية والعملية' : 'Explain legal and practical considerations' }}</li><li>{{ ar ? 'مناقشة الخطوات المناسبة بحسب نطاق التكليف' : 'Discuss next steps within the agreed scope' }}</li></ul>
                    </li>
                  </ul>
                </section>
                <p class="official-resource">{{ ar ? 'مصدر رسمي للمعلومات:' : 'Official information:' }} <a [href]="article.resourceUrl" target="_blank" rel="noopener noreferrer">{{ article.resourceLabel }} <span aria-hidden="true">↗</span></a></p>
              } @else {
                <p class="article-intro">{{ service.shortDescription }}</p>
                <figure class="article-visual"><img [src]="relatedArticles[0]?.featuredImage?.url || service.bodyImageUrl || service.fallbackImage || service.image?.url || 'assets/brand/office.png'" [alt]="service.title" loading="lazy" /><figcaption>{{ service.title }}</figcaption></figure>
                <div [innerHTML]="service.description || service.shortDescription"></div>
              }
            </article>
            <aside class="service-sidebar" [attr.dir]="i18n.direction()">
              <div class="sidebar-heading"><p class="eyebrow">{{ ar ? 'مجالات مترابطة' : 'RELATED EXPERTISE' }}</p><h2>{{ ar ? 'خدمات أخرى' : 'Other services' }}</h2></div>
              @for (related of relatedServices; track related.id) {
                <a class="related-service-card" [routerLink]="['/', i18n.locale(), 'services', related.id]">
                  <img [src]="related.image" [alt]="ar ? related.ar : related.en" loading="lazy" />
                  <span class="related-service-copy"><strong>{{ ar ? related.ar : related.en }}</strong><small>{{ ar ? related.descAr : related.descEn }}</small><span class="card-arrow" aria-hidden="true">↗</span></span>
                </a>
              }
              <a class="sidebar-contact" [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'ناقش احتياجك القانوني' : 'Discuss your legal needs' }} <span aria-hidden="true">↗</span></a>
            </aside>
          </div>
          @if (relatedArticles.length) {
            <section class="related-articles" [attr.aria-label]="ar ? 'مقالات ذات صلة' : 'Related articles'">
              <div class="related-articles-heading"><p class="eyebrow">{{ ar ? 'قراءات مفيدة' : 'FURTHER READING' }}</p><h2>{{ ar ? 'مقالات قد تهمك' : 'Articles related to this service' }}</h2></div>
              <div class="related-article-grid">
                @for (article of relatedArticles; track article.slug) {
                  <article class="related-article-card">
                    <a class="related-article-image" [routerLink]="['/', i18n.locale(), 'articles', article.slug]"><img [src]="article.featuredImage?.url || 'assets/brand/office.png'" [alt]="article.imageAlt || article.title" loading="lazy" /></a>
                    <div class="related-article-copy"><span>{{ article.category }}</span><h3><a [routerLink]="['/', i18n.locale(), 'articles', article.slug]">{{ article.title }}</a></h3><p>{{ article.excerpt }}</p><a class="article-more" [routerLink]="['/', i18n.locale(), 'articles', article.slug]">{{ ar ? 'اقرأ المقال' : 'Read article' }} <span aria-hidden="true">↗</span></a></div>
                  </article>
                }
              </div>
            </section>
          }
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
    .detail-content{max-width:1440px;margin:auto;padding:clamp(52px,7vw,90px) clamp(22px,5vw,72px)}.detail-heading{max-width:880px;margin:0 auto 30px;text-align:center}.detail-heading h2{margin:0;font-size:clamp(30px,4vw,46px);font-weight:700;line-height:1.45}.keyword-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin-top:18px}.keyword-tags span{padding:7px 13px;border:1px solid #c6a66b55;border-radius:999px;background:#fff;color:#695634;font-size:13px;font-weight:600}.detail-layout{display:grid;grid-template-columns:minmax(275px,340px) minmax(0,1fr);gap:clamp(28px,5vw,72px);direction:ltr;align-items:start}.rich-description{grid-column:2;min-width:0;color:#454545;font-size:18px;line-height:2}.rich-description p{margin:0 0 18px}.rich-description h2,.rich-description h3{margin:28px 0 10px;color:#222;font-size:23px;line-height:1.5}.rich-description ul,.rich-description ol{padding-inline-start:24px}.rich-description li{margin:7px 0}.article-visual{margin:30px 0 36px;overflow:hidden;border-radius:14px;background:#e5e1d8}.article-visual img{display:block;width:100%;max-height:430px;aspect-ratio:16/8;object-fit:cover;filter:grayscale(.18)}.article-visual figcaption{padding:11px 16px;color:#777168;font-size:12px}.rich-description .article-intro{padding:22px 25px;border-inline-start:3px solid var(--gold);border-radius:0 10px 10px 0;background:#fff;color:#282722;font-size:20px;line-height:1.95}.rich-description .article-section{margin-top:38px}.rich-description .article-section h3,.service-process h3{font-size:clamp(23px,2.5vw,30px);color:#211f1a}.rich-description .article-points{padding-inline-start:24px}.rich-description .article-points li{padding-inline-start:5px;margin:10px 0}.service-process{margin-top:34px;padding:24px 26px;border:1px solid #e5dfd2;border-radius:12px;background:#fff}.service-process h3{margin:0 0 12px}.service-process>ul{padding-inline-start:22px}.service-process>ul>li{margin:12px 0;font-weight:650}.service-process ul ul{margin-top:6px;padding-inline-start:22px;color:#625f58;font-weight:400}.service-process ul ul li{margin:5px 0}.service-sidebar{grid-column:1;grid-row:1;position:sticky;top:110px;display:grid;gap:13px;min-width:0}.sidebar-heading{margin:0 0 3px}.sidebar-heading .eyebrow{margin-bottom:5px}.sidebar-heading h2{margin:0;font-size:25px}.related-service-card{display:flex;align-items:stretch;min-height:105px;overflow:hidden;border:1px solid #e7e3dc;border-radius:11px;background:#fff;color:#242321;text-decoration:none;box-shadow:0 7px 20px #17161408;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.related-service-card:hover{transform:translateY(-2px);border-color:#c6a66b;box-shadow:0 12px 24px #17161412}.related-service-card>img{flex:0 0 88px;width:88px;min-height:105px;object-fit:cover}.related-service-copy{position:relative;display:flex;flex:1;flex-direction:column;justify-content:center;gap:5px;min-width:0;padding:12px 14px}.related-service-copy strong{font-size:15px;line-height:1.45}.related-service-copy small{display:-webkit-box;overflow:hidden;color:#77736b;font-size:12px;line-height:1.6;-webkit-line-clamp:2;-webkit-box-orient:vertical}.card-arrow{align-self:flex-end;color:#9a7b48}.sidebar-contact{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:4px;padding:14px 16px;border-radius:9px;background:#1c1b19;color:#fff;font-size:14px;font-weight:700;text-decoration:none}.sidebar-contact span{color:#d8bd8e}.related-articles{margin-top:clamp(56px,8vw,96px);padding-top:34px;border-top:1px solid #dedbd4}.related-articles-heading{margin-bottom:22px}.related-articles-heading .eyebrow{margin-bottom:6px}.related-articles-heading h2{margin:0;font-size:clamp(26px,3vw,36px)}.related-article-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.related-article-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid #e7e3dc;border-radius:12px;background:#fff;box-shadow:0 8px 25px #17161408;transition:transform .22s ease,box-shadow .22s ease}.related-article-card:hover{transform:translateY(-4px);box-shadow:0 15px 32px #17161412}.related-article-image{display:block;height:190px;overflow:hidden;background:#dedbd4}.related-article-image img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}.related-article-card:hover .related-article-image img{transform:scale(1.04)}.related-article-copy{display:flex;flex:1;flex-direction:column;align-items:flex-start;padding:17px 18px 20px}.related-article-copy>span{color:#8c7044;font-size:11px;font-weight:700}.related-article-copy h3{margin:8px 0;font-size:19px;line-height:1.5}.related-article-copy h3 a{color:inherit;text-decoration:none}.related-article-copy p{margin:0 0 17px;color:#6a675f;font-size:13px;line-height:1.75}.article-more{display:inline-flex;gap:9px;margin-top:auto;color:#765d34;font-size:13px;font-weight:700;text-decoration:none}.article-section{margin-top:34px}.article-section h3{margin:0 0 12px}.official-resource{margin-top:32px;padding-top:18px;border-top:1px solid #dedbd4;font-size:14px}.official-resource a{color:#725b36;text-decoration:underline;text-underline-offset:3px}.detail-cta{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:55px;padding:clamp(24px,4vw,42px);border:1px solid #dedbd4;border-radius:10px;background:#fff}.detail-cta .eyebrow{margin-bottom:8px}.detail-cta h2{margin:0;font-size:clamp(23px,3vw,32px);font-weight:700}.detail-cta>a{flex:none}.detail-state{display:grid;place-items:center;min-height:55vh;padding:40px 22px;text-align:center;color:var(--muted)}.detail-state h1{max-width:700px;color:var(--ink);font-size:36px}.detail-state a{color:#80683f;text-decoration:underline}.not-found .eyebrow{align-self:end}
    @media(max-width:980px){.detail-layout{grid-template-columns:minmax(240px,300px) minmax(0,1fr);gap:26px}.related-article-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:700px){.detail-layout{grid-template-columns:1fr;direction:ltr}.rich-description,.service-sidebar{grid-column:1;grid-row:auto}.service-sidebar{position:static;grid-template-columns:1fr}.related-article-grid{grid-template-columns:1fr}.related-article-image{height:220px}}
    @media(max-width:650px){.service-hero{min-height:520px;padding:32px 20px 48px}.service-hero-shade{background:linear-gradient(0deg,#171717f2 0%,#171717a8 56%,#17171735 100%)}.service-hero h1{font-size:43px}.service-summary{font-size:16px}.back-link{margin-bottom:28px}.detail-content{padding:48px 20px 62px}.rich-description{font-size:16px}.detail-cta{align-items:stretch;flex-direction:column;margin-top:38px}.detail-cta>a{width:100%}}
    @media(prefers-reduced-motion:reduce){.book-link,.detail-cta>a,.related-service-card,.related-article-card,.related-article-image img{transition:none!important}}
  `],
})
export class ServiceDetailPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  service: PublicServiceDetail | null = null;
  articles: PublicArticleCard[] = [];
  loading = true;
  private readonly articleMatches: Record<string, string[]> = {
    'litigation-advocacy': ['resolving-business-disputes-before-litigation', 'commercial-contract-review-checklist', 'foreign-investment-market-entry-saudi-arabia'],
    'legal-advisory': ['choosing-a-company-structure-in-saudi-arabia', 'commercial-contract-review-checklist', 'resolving-business-disputes-before-litigation'],
    'company-formation': ['choosing-a-company-structure-in-saudi-arabia', 'foreign-investment-market-entry-saudi-arabia', 'commercial-contract-review-checklist'],
    'foreign-investment': ['foreign-investment-market-entry-saudi-arabia', 'choosing-a-company-structure-in-saudi-arabia', 'commercial-contract-review-checklist'],
    franchising: ['franchise-agreement-planning-guide', 'protecting-trademarks-and-business-ip', 'commercial-contract-review-checklist'],
    'intellectual-property': ['protecting-trademarks-and-business-ip', 'franchise-agreement-planning-guide', 'commercial-contract-review-checklist'],
    'contracts-transactions': ['commercial-contract-review-checklist', 'choosing-a-company-structure-in-saudi-arabia', 'resolving-business-disputes-before-litigation'],
  };
  private readonly articleMatchTerms: Record<string, { ar: string[]; en: string[] }> = {
    'litigation-advocacy': { ar: ['النزاعات', 'التقاضي', 'العقود', 'الأعمال'], en: ['disputes', 'litigation', 'contracts', 'business'] },
    'legal-advisory': { ar: ['تأسيس', 'العقود', 'النزاعات'], en: ['company', 'contracts', 'disputes'] },
    'company-formation': { ar: ['تأسيس', 'الاستثمار', 'العقود'], en: ['company', 'investment', 'contracts'] },
    'foreign-investment': { ar: ['الاستثمار', 'تأسيس', 'الأعمال'], en: ['investment', 'company', 'business'] },
    franchising: { ar: ['الامتياز', 'الملكية', 'العلامات', 'العقود'], en: ['franchise', 'intellectual property', 'trademark', 'contracts'] },
    'intellectual-property': { ar: ['الملكية الفكرية', 'العلامات', 'الامتياز', 'العقود'], en: ['intellectual property', 'trademark', 'franchise', 'contracts'] },
    'contracts-transactions': { ar: ['العقود', 'النزاعات', 'تأسيس'], en: ['contracts', 'disputes', 'company'] },
  };
  private readonly keywordsByService: Record<string, { ar: string[]; en: string[] }> = {
    'litigation-advocacy': { ar: ['النزاعات', 'التقاضي', 'العقود', 'الأعمال'], en: ['disputes', 'litigation', 'contracts', 'business'] },
    'legal-advisory': { ar: ['استشارات قانونية', 'رأي قانوني', 'إرشاد قانوني للأعمال', 'السعودية'], en: ['Legal advisory', 'Legal opinions', 'Business legal counsel', 'Saudi Arabia'] },
    'company-formation': { ar: ['تأسيس الشركات', 'حوكمة الشركات', 'تسجيل الشركات', 'الأعمال في السعودية'], en: ['Company formation', 'Corporate governance', 'Business setup', 'Saudi Arabia'] },
    'foreign-investment': { ar: ['الاستثمار الأجنبي', 'تأسيس المستثمرين', 'دخول السوق السعودي', 'التراخيص التجارية'], en: ['Foreign investment', 'Saudi market entry', 'Investor licensing', 'Business setup'] },
    franchising: { ar: ['الامتياز التجاري', 'اتفاقية الامتياز', 'تسجيل الامتياز', 'العلامات التجارية'], en: ['Commercial franchising', 'Franchise agreement', 'Franchise registration', 'Trademarks'] },
    'intellectual-property': { ar: ['الملكية الفكرية', 'تسجيل العلامات التجارية', 'حقوق المؤلف', 'حماية الابتكار'], en: ['Intellectual property', 'Trademark registration', 'Copyright', 'Innovation protection'] },
    'contracts-transactions': { ar: ['العقود التجارية', 'مراجعة العقود', 'الصفقات التجارية', 'التفاوض على العقود'], en: ['Commercial contracts', 'Contract review', 'Commercial transactions', 'Contract negotiation'] },
  };
  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.get<{ items: PublicArticleCard[] }>('/articles', { lang: this.i18n.locale(), limit: 100 }).subscribe({
      next: (response) => this.articles = response.data.items || [],
      error: () => this.articles = [],
    });
    this.api.get<{ service: PublicServiceDetail }>(`/services/${encodeURIComponent(slug)}`, { lang: this.i18n.locale() }).subscribe({
      next: (response) => { this.service = this.withArticle(response.data.service, slug) || this.catalogFallback(slug); this.loading = false; this.updateSeo(); },
      error: () => { this.service = this.catalogFallback(slug); this.loading = false; this.updateSeo(); },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  get relatedServices() {
    const currentId = this.service?.id || this.service?.slug;
    const relatedIds: Record<string, string[]> = {
      'litigation-advocacy': ['legal-advisory', 'contracts-transactions', 'company-formation'],
      'legal-advisory': ['litigation-advocacy', 'company-formation', 'contracts-transactions'],
      'company-formation': ['foreign-investment', 'contracts-transactions', 'franchising'],
      'foreign-investment': ['company-formation', 'contracts-transactions', 'legal-advisory'],
      franchising: ['intellectual-property', 'contracts-transactions', 'company-formation'],
      'intellectual-property': ['franchising', 'contracts-transactions', 'legal-advisory'],
      'contracts-transactions': ['company-formation', 'litigation-advocacy', 'legal-advisory'],
    };
    return (relatedIds[currentId || ''] || []).map((id) => SERVICE_OFFERINGS.find((item) => item.id === id)).filter((item): item is typeof SERVICE_OFFERINGS[number] => !!item);
  }
  get serviceTags(): string[] {
    const entry = this.keywordsByService[this.service?.id || this.service?.slug || ''];
    return entry ? entry[this.ar ? 'ar' : 'en'] : [];
  }
  get relatedArticles(): PublicArticleCard[] {
    const serviceId = this.service?.id || this.service?.slug || '';
    const preferred = this.articleMatches[serviceId] || [];
    const bySlug = new Map(this.articles.map((item) => [item.slug, item]));
    const exact = preferred.map((slug) => bySlug.get(slug)).filter((item): item is PublicArticleCard => !!item);
    const terms = this.articleMatchTerms[serviceId]?.[this.ar ? 'ar' : 'en'] || [];
    const relevant = this.articles.map((article, index) => {
      const text = [article.title, article.excerpt, article.category || '', ...(article.tags || [])].join(' ').toLocaleLowerCase();
      return { article, index, score: terms.filter((term) => text.includes(term.toLocaleLowerCase())).length };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).map((item) => item.article);
    const ordered = [...exact, ...relevant];
    return ordered.filter((item, index) => ordered.findIndex((candidate) => candidate.slug === item.slug) === index).slice(0, 3);
  }
  linkify(text: string): string {
    return text.replace(/\[([^\]]+)\]\((\/(?:ar|en)\/[a-z0-9/-]+)\)/g,
      (_match, label: string, url: string) => `<a href="${url.replace(/^\/(?:ar|en)(?=\/)/, `/${this.i18n.locale()}`)}">${label}</a>`);
  }
  private withArticle(service: PublicServiceDetail | null, slug: string): PublicServiceDetail | null {
    if (!service) return null;
    const catalogItem = SERVICE_OFFERINGS.find((item) => item.id === slug || item.en === service.title || item.ar === service.title);
    const contentId = catalogItem?.id || slug;
    return {
      ...service,
      id: contentId,
      fallbackImage: catalogItem?.image || service.fallbackImage,
      bodyImageUrl: catalogItem?.image,
      article: getServiceArticle(contentId, this.ar ? 'ar' : 'en') || undefined,
    };
  }
  private updateSeo(): void {
    if (!this.service) return;
    const brand = this.ar ? 'شركة السياري للمحاماة' : 'Al Saiari Law Firm';
    const title = `${this.service.title} | ${brand}`;
    const description = (this.service.article?.intro || this.service.shortDescription).slice(0, 160);
    this.seo.setPageMetadata(title, description, `/${this.i18n.locale()}/services/${this.service.slug}`, {
      '@context': 'https://schema.org', '@type': 'LegalService', name: this.service.title,
      description, serviceType: this.service.title, image: this.service.fallbackImage, keywords: this.serviceTags,
      url: new URL(`/${this.i18n.locale()}/services/${this.service.slug}`, location.origin).toString(),
      provider: { '@type': 'LegalService', name: 'Al Saiari Law Firm' },
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    }, this.serviceTags);
  }
  private localizedServiceSlug(title: string): string {
    return title.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
  }
  private catalogFallback(slug: string): PublicServiceDetail | null {
    const item = SERVICE_OFFERINGS.find((service) => service.id === slug || this.localizedServiceSlug(service.ar) === slug);
    return item ? {
      title: this.ar ? item.ar : item.en,
      slug: item.id,
      id: item.id,
      shortDescription: this.ar ? item.descAr : item.descEn,
      description: this.ar ? item.descAr : item.descEn,
      fallbackImage: item.image,
      bodyImageUrl: item.image,
      article: getServiceArticle(item.id, this.ar ? 'ar' : 'en') || undefined,
    } : null;
  }
}
