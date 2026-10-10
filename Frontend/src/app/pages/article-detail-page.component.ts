import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SeoService } from '../core/services/seo.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';

interface PublicArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage?: { url?: string | null };
  imageAlt?: string;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  author?: { name?: string };
  tags?: string[];
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="article-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      @if (loading) { <p class="article-state" role="status">{{ ar ? 'جارٍ تحميل المقال…' : 'Loading article…' }}</p> }
      @else if (article) {
        <header class="article-hero">
          <img [src]="article.featuredImage?.url || fallbackImage" [alt]="article.imageAlt || article.title" />
          <div class="article-shade"></div>
          <div class="article-hero-copy">
            <a class="back-link" [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'جميع المقالات' : 'All articles' }} <span aria-hidden="true">↗</span></a>
            <p class="eyebrow">{{ article.category }}</p>
            <h1>{{ article.title }}</h1>
            @if (article.publishedAt) { <time [attr.datetime]="article.publishedAt">{{ article.publishedAt | date:'longDate' }}</time> }
          </div>
        </header>
        <article class="article-content">
          <div class="article-layout">
            <aside class="related-panel" [attr.aria-label]="ar ? 'مقالات ذات صلة' : 'Related articles'">
              <p class="related-kicker">{{ ar ? 'اقرأ أيضاً' : 'KEEP READING' }}</p>
              <h2>{{ ar ? 'مقالات ذات صلة' : 'Related articles' }}</h2>
              @for (related of relatedArticles; track related.slug) {
                <a class="related-card" [routerLink]="['/', i18n.locale(), 'articles', related.slug]">
                  <img [src]="related.featuredImage?.url || fallbackImage" [alt]="related.imageAlt || related.title" loading="lazy" />
                  <span class="related-copy"><small>{{ related.category }}</small><strong>{{ related.title }}</strong><span>{{ ar ? 'اقرأ المقال' : 'Read article' }} ↗</span></span>
                </a>
              }
              @if (!relatedArticles.length) { <p class="related-empty">{{ ar ? 'تصفح جميع المقالات للاطلاع على المزيد.' : 'Browse all articles for more insights.' }}</p> }
            </aside>
            <div class="article-main">
              <p class="article-excerpt">{{ article.excerpt }}</p>
              @if (article.tags?.length) { <div class="article-tags">@for (tag of article.tags; track tag) { <span>{{ tag }}</span> }</div> }
              <div class="article-body" [innerHTML]="article.content"></div>
            </div>
          </div>
          <section class="consultation-cta">
            <div><p>{{ ar ? 'هل تحتاج إلى توجيه قانوني؟' : 'NEED LEGAL GUIDANCE?' }}</p><h2>{{ ar ? 'احجز استشارتك الخاصة بأمان' : 'Book your private consultation securely' }}</h2><span>{{ ar ? 'ناقش تفاصيل مسألتك بسرية مع فريقنا القانوني.' : 'Discuss your matter confidentially with our legal team.' }}</span></div>
            <a [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'احجز استشارتك' : 'Book a consultation' }} <span aria-hidden="true">↗</span></a>
          </section>
          <a class="back-link-bottom" [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'العودة إلى جميع المقالات' : 'Back to all articles' }} <span aria-hidden="true">↗</span></a>
        </article>
      } @else {
        <section class="article-state"><h1>{{ ar ? 'المقال غير متاح' : 'Article unavailable' }}</h1><a [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'تصفح جميع المقالات' : 'Browse all articles' }}</a></section>
      }
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--gold:#ad8c59;--ink:#191815}.article-page{min-height:100vh;background:#f7f6f3;color:var(--ink);font-family:var(--font)}
    .article-hero{position:relative;isolation:isolate;display:flex;align-items:flex-end;min-height:clamp(430px,55vw,650px);padding:clamp(45px,8vw,100px) clamp(22px,10vw,150px);overflow:hidden;background:#191815;color:#fff}.article-hero>img,.article-shade{position:absolute;z-index:-1;inset:0;width:100%;height:100%}.article-hero>img{object-fit:cover;filter:grayscale(.7)}.article-shade{background:linear-gradient(90deg,#151412ed 0%,#151412bb 55%,#15141240 100%),linear-gradient(0deg,#1119,transparent 75%)}.article-hero-copy{max-width:920px}
    .back-link,.back-link-bottom{display:inline-flex;align-items:center;gap:10px;color:#765e37;font-size:14px}.back-link{margin-bottom:30px;color:#e5d1aa}.eyebrow{margin:0 0 12px;color:#d0b783;font-size:12px}.article-hero h1{margin:0 0 20px;font-size:clamp(38px,6vw,72px);line-height:1.3}.is-ar .article-hero h1{line-height:1.5}.article-hero time{color:#e1ddd5;font-size:13px}
    .article-content{max-width:1320px;margin:auto;padding:clamp(45px,7vw,85px) 24px 95px}.article-layout{display:grid;grid-template-columns:minmax(250px,330px) minmax(0,1fr);gap:clamp(30px,6vw,92px);align-items:start;direction:ltr;min-width:0}.article-main{grid-column:2;min-width:0;max-width:100%;overflow-wrap:anywhere}.article-page.is-ar .article-main,.article-page.is-ar .related-panel{direction:rtl}
    .related-panel{grid-column:1;grid-row:1;position:sticky;top:28px;min-width:0;max-height:calc(100vh - 56px);overflow:auto;padding:22px;background:#f0eee9;border:1px solid #e6e1d7;border-radius:12px;scrollbar-width:thin}.related-kicker{margin:0 0 8px;color:var(--gold);font-size:11px;letter-spacing:.16em;font-weight:800}.related-panel h2{margin:0 0 18px;font-size:25px;line-height:1.4}.related-card{display:grid;grid-template-columns:96px minmax(0,1fr);gap:13px;align-items:stretch;min-width:0;min-height:112px;padding:10px;margin-bottom:12px;overflow:hidden;background:#fff;border:1px solid #e8e2d8;border-radius:9px;color:inherit;text-decoration:none;transition:transform .2s,border-color .2s}.related-card:hover{transform:translateY(-3px);border-color:#c8b28a}.related-card img{display:block;width:96px;height:92px;min-height:0;aspect-ratio:1;object-fit:cover;border-radius:6px}.related-copy{display:flex;min-width:0;flex-direction:column;align-items:flex-start;gap:5px}.related-copy small{color:#987849;font-size:11px}.related-copy strong{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-clamp:3;font-size:14px;line-height:1.55;overflow-wrap:anywhere}.related-copy>span{margin-top:auto;color:#79633f;font-size:12px}.related-empty{color:#777}
    .article-excerpt{margin:0 0 20px;padding:22px 25px;border-inline-start:3px solid var(--gold);background:#fff;color:#302e28;font-size:20px;line-height:1.9}.article-tags{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 30px}.article-tags span{padding:5px 11px;border:1px solid #e4dccd;border-radius:99px;color:#786648;font-size:12px}.article-body{color:#44413b;font-size:17px;line-height:2}
    :host ::ng-deep .article-body h2,:host ::ng-deep .article-body h3{margin:35px 0 13px;color:#201f1b;font-size:27px;line-height:1.5}:host ::ng-deep .article-body p{margin:0 0 19px}:host ::ng-deep .article-body ul,:host ::ng-deep .article-body ol{padding-inline-start:25px}:host ::ng-deep .article-body li{margin:8px 0}:host ::ng-deep .article-body a{color:#765e37;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}
    :host ::ng-deep .article-body img{display:block;width:100%;max-width:100%;height:auto;max-height:460px;object-fit:cover;border-radius:10px}:host ::ng-deep .article-body figure{width:100%;max-width:100%;margin:34px auto;padding:0;overflow:hidden;background:#fff;border:1px solid #ece7de;border-radius:10px}:host ::ng-deep .article-body figure img{aspect-ratio:16/9}:host ::ng-deep .article-body figcaption{padding:10px 14px 12px;color:#716a5c;font-size:13px;line-height:1.6}
    .consultation-cta{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:55px;padding:clamp(25px,4vw,46px);border-radius:12px;background:linear-gradient(125deg,#171612,#30291d);color:#fff}.consultation-cta p{margin:0 0 10px;color:#d4b981;font-size:11px;font-weight:800;letter-spacing:.14em}.consultation-cta h2{margin:0 0 9px;font-size:clamp(22px,3vw,34px)}.consultation-cta div>span{color:#d9d5cc;font-size:14px}.consultation-cta>a{flex:none;padding:13px 19px;border-radius:5px;background:#c0a06c;color:#171612;font-weight:700;text-decoration:none}.back-link-bottom{margin-top:35px;padding:12px 15px;border:1px solid #d9d2c4;border-radius:5px}.article-state{display:grid;min-height:42vh;place-content:center;justify-items:center;gap:14px;padding:40px;text-align:center;color:#6f6a60}.article-state h1{color:var(--ink)}
    @media(max-width:850px){.article-layout{grid-template-columns:minmax(0,1fr);gap:42px}.article-main,.related-panel{grid-column:1}.article-main{grid-row:1}.related-panel{grid-row:2;position:static;max-height:none;overflow:visible}.related-panel h2{font-size:23px}.related-card{grid-template-columns:110px minmax(0,1fr)}.related-card img{width:110px;height:104px}.consultation-cta{align-items:flex-start;flex-direction:column}}
    @media(max-width:650px){.article-hero{min-height:480px;padding:35px 21px 48px}.article-shade{background:linear-gradient(0deg,#151412ed 0%,#151412a8 62%,#15141235 100%)}.article-hero h1{font-size:42px}.article-content{padding:43px 20px 65px}.article-excerpt{font-size:18px}.article-body{font-size:16px}:host ::ng-deep .article-body h2,:host ::ng-deep .article-body h3{font-size:23px}:host ::ng-deep .article-body figure{margin:28px 0}:host ::ng-deep .article-body img{max-height:300px}:host ::ng-deep .article-body figure img{aspect-ratio:4/3}.related-panel{padding:16px}.related-card{grid-template-columns:82px minmax(0,1fr);min-height:98px;padding:8px}.related-card img{width:82px;height:80px}.related-copy strong{-webkit-line-clamp:2;line-clamp:2}.consultation-cta>a{width:100%;text-align:center}}
    .related-panel{padding:24px;background:linear-gradient(145deg,#f1efe9,#eae7df)}.related-card{grid-template-columns:104px minmax(0,1fr);min-height:128px;gap:14px;padding:11px;margin-bottom:13px;border-radius:11px;box-shadow:0 3px 12px #211b0d0a}.related-card img{width:104px;height:104px;align-self:center;border-radius:8px}.related-card:hover,.related-card:focus-visible{transform:translateY(-3px);border-color:#ad8c59;box-shadow:0 9px 20px #211b0d16;outline:none}.related-copy small{padding:3px 8px;border-radius:20px;background:#f3eee3;color:#80643a;font-weight:700}.related-copy strong{font-size:15px;line-height:1.6}.related-copy>span{display:inline-flex;align-items:center;gap:6px;color:#705329;font-weight:700}.consultation-cta>a{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:54px;padding:15px 24px;border:1px solid #ead7ad;border-radius:7px;background:#e0c17f;color:#171612;font-size:15px;font-weight:800;box-shadow:0 8px 20px #0004;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}.consultation-cta>a:hover{transform:translateY(-2px);background:#edd397;box-shadow:0 11px 24px #0005}.consultation-cta>a:focus-visible{outline:3px solid #fff;outline-offset:3px}
  `],
})
export class ArticleDetailPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  readonly fallbackImage = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80';
  article: PublicArticle | null = null;
  relatedArticles: PublicArticle[] = [];
  loading = true;
  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.get<{ items: PublicArticle[] }>('/articles', { lang: this.i18n.locale(), limit: 100 }).subscribe({
      next: (response) => {
        const all = response.data.items || [];
        const currentSlug = this.route.snapshot.paramMap.get('slug');
        const current = all.find((item) => item.slug === currentSlug);
        const related = all.filter((item) => item.slug !== currentSlug);
        const tokens = new Set([...(current?.tags || []), current?.category || ''].map((value) => value.toLowerCase()));
        this.relatedArticles = related.sort((a, b) => {
          const score = (item: PublicArticle) => (item.category === current?.category ? 3 : 0) + (item.tags || []).filter((tag) => tokens.has(tag.toLowerCase())).length;
          return score(b) - score(a);
        }).slice(0, 3);
      },
      error: () => { this.relatedArticles = []; },
    });
    this.api.get<{ article: PublicArticle }>(`/articles/${encodeURIComponent(slug)}`, { lang: this.i18n.locale() }).subscribe({
      next: (response) => { this.article = response.data.article || null; this.loading = false; this.updateSeo(); },
      error: () => { this.article = null; this.loading = false; },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  private updateSeo(): void {
    if (!this.article) return;
    const brand = this.ar ? 'شركة السياري للمحاماة' : 'Al Saiari Law Firm';
    const title = this.article.seo?.metaTitle || `${this.article.title} | ${brand}`;
    const description = this.article.seo?.metaDescription || this.article.excerpt;
    const canonicalRoute = `/${this.i18n.locale()}/articles/${this.article.slug}`;
    this.seo.setPageMetadata(title, description, canonicalRoute, {
      '@context': 'https://schema.org', '@type': 'Article', headline: this.article.title,
      description, image: this.article.featuredImage?.url,
      mainEntityOfPage: new URL(canonicalRoute, location.origin).toString(),
      datePublished: this.article.publishedAt, author: { '@type': 'Organization', name: 'Al Saiari Law Firm' },
      publisher: { '@type': 'Organization', name: 'Al Saiari Law Firm', logo: { '@type': 'ImageObject', url: new URL('/assets/brand/al-saiari-logo.png', location.origin).toString() } },
    }, this.article.seo?.keywords || []);
  }
}
