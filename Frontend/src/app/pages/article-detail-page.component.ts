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
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-body" [innerHTML]="article.content"></div>
          <a class="back-link-bottom" [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'العودة إلى جميع المقالات' : 'Back to all articles' }} <span aria-hidden="true">↗</span></a>
        </article>
      } @else {
        <section class="article-state"><h1>{{ ar ? 'المقال غير متاح' : 'Article unavailable' }}</h1><a [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'تصفح جميع المقالات' : 'Browse all articles' }}</a></section>
      }
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--gold:#ad8c59;--ink:#191815}.article-page{min-height:100vh;background:#f7f6f3;color:var(--ink);font-family:var(--font)}.article-hero{position:relative;isolation:isolate;display:flex;align-items:flex-end;min-height:clamp(430px,55vw,650px);padding:clamp(45px,8vw,100px) clamp(22px,10vw,150px);overflow:hidden;background:#191815;color:#fff}.article-hero>img,.article-shade{position:absolute;z-index:-1;inset:0;width:100%;height:100%}.article-hero>img{object-fit:cover;filter:grayscale(.7)}.article-shade{background:linear-gradient(90deg,#151412ed 0%,#151412bb 55%,#15141240 100%),linear-gradient(0deg,#1119,transparent 75%)}.article-hero-copy{max-width:920px}.back-link,.back-link-bottom{display:inline-flex;align-items:center;gap:10px;color:#e5d1aa;font-size:14px}.back-link{margin-bottom:30px}.eyebrow{margin:0 0 12px;color:#d0b783;font-size:12px}.article-hero h1{margin:0 0 20px;font-size:clamp(38px,6vw,72px);line-height:1.3}.is-ar .article-hero h1{line-height:1.5}.article-hero time{color:#e1ddd5;font-size:13px}.article-content{max-width:900px;margin:auto;padding:clamp(45px,7vw,85px) 24px 95px}.article-excerpt{margin:0 0 32px;padding:22px 25px;border-inline-start:3px solid var(--gold);background:#fff;color:#302e28;font-size:20px;line-height:1.9}.article-body{color:#44413b;font-size:17px;line-height:2}.article-body h2,.article-body h3{margin:35px 0 13px;color:#201f1b;font-size:27px;line-height:1.5}.article-body p{margin:0 0 19px}.article-body ul,.article-body ol{padding-inline-start:25px}.article-body li{margin:8px 0}.article-body a{color:#765e37;text-decoration:underline;text-underline-offset:3px}.article-body a:hover{color:#a88751}.back-link-bottom{margin-top:35px;padding:12px 15px;border:1px solid #d9d2c4;border-radius:5px}.article-state{display:grid;min-height:42vh;place-content:center;justify-items:center;gap:14px;padding:40px;text-align:center;color:#6f6a60}.article-state h1{color:var(--ink)}@media(max-width:650px){.article-hero{min-height:480px;padding:35px 21px 48px}.article-shade{background:linear-gradient(0deg,#151412ed 0%,#151412a8 62%,#15141235 100%)}.article-hero h1{font-size:42px}.article-content{padding:43px 20px 65px}.article-excerpt{font-size:18px}.article-body{font-size:16px}.article-body h2,.article-body h3{font-size:23px}}
  `],
})
export class ArticleDetailPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  readonly fallbackImage = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80';
  article: PublicArticle | null = null;
  loading = true;
  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.api.get<{ article: PublicArticle }>(`/articles/${encodeURIComponent(slug)}`, { lang: this.i18n.locale() }).subscribe({
      next: (response) => { this.article = response.data.article || null; this.loading = false; this.updateSeo(); },
      error: () => { this.article = null; this.loading = false; },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  private updateSeo(): void {
    if (!this.article) return;
    const title = this.article.seo?.metaTitle || `${this.article.title} | Al Saiari Law Firm`;
    const description = this.article.seo?.metaDescription || this.article.excerpt;
    this.seo.setPageMetadata(title, description, `/${this.i18n.locale()}/articles/${this.article.slug}`, {
      '@context': 'https://schema.org', '@type': 'Article', headline: this.article.title,
      description, image: this.article.featuredImage?.url,
      datePublished: this.article.publishedAt, author: { '@type': 'Organization', name: 'Al Saiari Law Firm' },
      publisher: { '@type': 'Organization', name: 'Al Saiari Law Firm' },
    });
  }
}
