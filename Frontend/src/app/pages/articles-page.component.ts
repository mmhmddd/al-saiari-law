import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SeoService } from '../core/services/seo.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';

interface PublicArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featuredImage?: { url?: string | null };
  imageAlt?: string;
  publishedAt?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="articles-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      <header class="articles-hero">
        <p class="eyebrow">{{ ar ? 'رؤى ومقالات قانونية' : 'LEGAL INSIGHTS & ARTICLES' }}</p>
        <h1>{{ ar ? 'معرفة عملية لقراراتك القادمة.' : 'Practical insight for your next decision.' }}</h1>
        <p>{{ ar ? 'مقالات ثنائية اللغة حول مسائل الأعمال والقانون في المملكة.' : 'Bilingual perspectives on business and legal matters in Saudi Arabia.' }}</p>
      </header>
      <section class="articles-content" aria-label="Articles">
        @if (loading) { <p class="articles-state" role="status">{{ ar ? 'جارٍ تحميل المقالات…' : 'Loading articles…' }}</p> }
        @else if (!articles.length) { <p class="articles-state">{{ ar ? 'لا توجد مقالات منشورة حالياً.' : 'No articles are published yet.' }}</p> }
        @else {
          <div class="article-grid">
            @for (article of articles; track article.slug) {
              <article class="article-card">
                <a class="article-image-wrap" [routerLink]="['/', i18n.locale(), 'articles', article.slug]" [attr.aria-label]="(ar ? 'اقرأ المقال: ' : 'Read article: ') + article.title">
                  <img [src]="article.featuredImage?.url || fallbackImage" [alt]="article.imageAlt || article.title" loading="lazy" />
                  <span class="article-image-overlay"><strong>{{ article.title }}</strong><span>{{ ar ? 'اقرأ المقال' : 'Read article' }} ↗</span></span>
                </a>
                <div class="article-card-copy">
                  <div class="article-meta"><span>{{ article.category }}</span>@if (article.publishedAt) { <time [attr.datetime]="article.publishedAt">{{ article.publishedAt | date:'mediumDate' }}</time> }</div>
                  <h2><a [routerLink]="['/', i18n.locale(), 'articles', article.slug]">{{ article.title }}</a></h2>
                  <p>{{ article.excerpt }}</p>
                  <a class="article-read-more" [routerLink]="['/', i18n.locale(), 'articles', article.slug]">{{ ar ? 'اقرأ المقال كاملاً' : 'Read the full article' }} <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            }
          </div>
        }
      </section>
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--gold:#ad8c59;--ink:#191815}.articles-page{min-height:100vh;background:#f7f6f3;color:var(--ink);font-family:var(--font)}.articles-hero{padding:clamp(64px,9vw,120px) clamp(24px,10vw,150px);background:#191815;color:#fff}.eyebrow{margin:0 0 17px;color:#d0b783;font-size:11px;letter-spacing:.14em}.articles-hero h1{max-width:900px;margin:0;font-size:clamp(40px,6vw,72px);line-height:1.25}.is-ar .articles-hero h1{line-height:1.5}.articles-hero>p:last-child{max-width:650px;margin:20px 0 0;color:#d2d0ca;font-size:18px;line-height:1.9}.articles-content{max-width:1480px;min-height:40vh;margin:auto;padding:clamp(48px,7vw,90px) clamp(20px,7vw,100px)}.article-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}.article-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid #e5e1d8;background:#fff;box-shadow:0 8px 26px #1c1a1510;transition:transform .25s ease,box-shadow .25s ease}.article-card:hover{transform:translateY(-4px);box-shadow:0 16px 34px #1c1a151a}.article-image-wrap{position:relative;display:block;height:clamp(210px,21vw,290px);overflow:hidden;background:#d8d1c4}.article-image-wrap img{width:100%;height:100%;object-fit:cover;filter:grayscale(.55);transition:transform .55s ease,filter .35s ease}.article-card:hover img{transform:scale(1.04);filter:grayscale(.1)}.article-image-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;gap:12px;padding:22px;color:#fff;background:linear-gradient(0deg,#171614e8,transparent 88%)}.article-image-overlay strong{font-size:23px;line-height:1.4}.article-image-overlay>span{color:#e5d1aa;font-size:13px}.article-card-copy{display:flex;flex:1;flex-direction:column;align-items:flex-start;padding:20px 22px 24px}.article-meta{display:flex;align-items:center;gap:12px;margin-bottom:13px;color:#8a7047;font-size:11px}.article-meta time{color:#858178}.article-card h2{margin:0 0 10px;font-size:24px;line-height:1.45}.article-card h2 a{color:inherit}.article-card-copy>p{margin:0 0 22px;color:#69665e;font-size:14px;line-height:1.9}.article-read-more{display:inline-flex;gap:11px;margin-top:auto;padding-bottom:5px;border-bottom:1px solid #ad8c59;color:#735d39;font-size:13px}.articles-state{padding:55px 20px;text-align:center;color:#74716a}@media(max-width:900px){.article-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.articles-hero{padding:58px 22px}.articles-hero h1{font-size:42px}.articles-content{padding:42px 18px 60px}.article-grid{grid-template-columns:1fr;gap:18px}.article-image-wrap{height:235px}.article-card h2{font-size:22px}}@media(prefers-reduced-motion:reduce){.article-card,.article-image-wrap img{transition:none}}
  `],
})
export class ArticlesPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  readonly fallbackImage = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80';
  articles: PublicArticle[] = [];
  loading = true;
  constructor() {
    this.seo.setPageMetadata(
      this.ar ? 'المقالات والرؤى القانونية | شركة السياري للمحاماة' : 'Legal Articles & Insights | Al Saiari Law Firm',
      this.ar ? 'اقرأ مقالات قانونية عملية للأفراد والمنشآت في المملكة العربية السعودية.' : 'Read practical legal insights for individuals and businesses in Saudi Arabia.',
      `/${this.i18n.locale()}/articles`,
    );
    this.api.get<{ items: PublicArticle[] }>('/articles', { lang: this.i18n.locale(), limit: 100 }).subscribe({
      next: (response) => { this.articles = response.data.items || []; this.loading = false; },
      error: () => { this.articles = []; this.loading = false; },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
}
