import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';
import { SERVICE_OFFERINGS } from './service-catalog';

interface PublicService {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  image?: { url?: string | null };
  fallbackImage?: string;
  id?: string;
}

@Component({
  standalone: true,
  imports: [RouterLink, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="services-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      <header class="services-hero">
        <div class="hero-content">
          <p class="eyebrow">{{ ar ? 'مجالات عملنا' : 'OUR LEGAL SERVICES' }}</p>
          <h1>{{ ar ? 'رؤية قانونية واضحة، لكل خطوة.' : 'Clear legal guidance for every next step.' }}</h1>
          <p>{{ ar ? 'حلول قانونية عملية مصممة لتناسب احتياجاتك وأهدافك.' : 'Practical legal support shaped around your needs, your work and what comes next.' }}</p>
        </div>
        <img src="assets/consultation-logo-watermark.png" alt="" aria-hidden="true" />
      </header>

      <section class="services-content" [attr.aria-label]="ar ? 'الخدمات القانونية' : 'Legal services'">
        <div class="section-intro"><p class="eyebrow">{{ ar ? 'كيف نساعدك' : 'HOW WE CAN HELP' }}</p><h2>{{ ar ? 'خدمات قانونية بخبرة عملية' : 'Focused expertise. Practical support.' }}</h2></div>
        @if (loading) {
          <p class="services-state" role="status">{{ ar ? 'جارٍ تحميل الخدمات…' : 'Loading legal services…' }}</p>
        } @else if (!services.length) {
          <p class="services-state">{{ ar ? 'لا توجد خدمات متاحة حالياً.' : 'No services are available right now.' }}</p>
        } @else {
          <div class="service-grid">
            @for (service of services; track service.slug; let index = $index) {
              <article class="service-card" [id]="service.id || service.slug">
                <a class="service-image" [routerLink]="['/', i18n.locale(), 'services', service.slug]" [attr.aria-label]="(ar ? 'اعرف المزيد عن ' : 'Learn more about ') + service.title">
                  <img [src]="service.image?.url || service.fallbackImage || 'assets/brand/office.png'" [alt]="service.title" loading="lazy" />
                  <span class="service-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
                </a>
                <div class="service-copy">
                  <p class="service-kicker">{{ ar ? 'خدمة قانونية متخصصة' : 'SPECIALIST LEGAL SERVICE' }}</p>
                  <h3><a [routerLink]="['/', i18n.locale(), 'services', service.slug]">{{ service.title }}</a></h3>
                  <p class="service-description">{{ service.shortDescription }}</p>
                  <a class="learn-link" [routerLink]="['/', i18n.locale(), 'services', service.slug]">{{ ar ? 'اعرف المزيد' : 'Learn more' }} <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            }
          </div>
        }
      </section>

      <section class="services-cta">
        <p class="eyebrow">{{ ar ? 'خطوتك القادمة' : 'A CLEARER WAY FORWARD' }}</p>
        <h2>{{ ar ? 'هل تحتاج إلى توجيه قانوني؟' : 'Looking for clear legal guidance?' }}</h2>
        <p>{{ ar ? 'أخبرنا كيف يمكن لفريقنا القانوني مساعدتك.' : 'Tell us what you need and our legal team will help you find the right next step.' }}</p>
        <a [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'احجز استشارة' : 'Book a consultation' }} <span aria-hidden="true">↗</span></a>
      </section>
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--gold:#ad8c59;--ink:#191919;--muted:#707070;--font:'SFMada',Georgia,serif;color:var(--ink)}.services-page{min-height:100vh;background:#f7f7f6;font-family:var(--font)}
    .services-hero{position:relative;isolation:isolate;display:flex;align-items:center;min-height:390px;padding:clamp(58px,8vw,108px) clamp(24px,9vw,130px);overflow:hidden;background:#191919;color:#fff}.services-hero:after{content:'';position:absolute;z-index:-1;width:360px;height:360px;inset-inline-end:10%;top:-240px;border:1px solid #ad8c5940;border-radius:50%;box-shadow:0 0 0 30px #ad8c5912,0 0 0 70px #ad8c5908}.services-hero>img{position:absolute;z-index:-1;inset-inline-end:10%;bottom:-80px;width:clamp(190px,24vw,330px);opacity:.12}.hero-content{max-width:850px}.eyebrow{margin:0 0 14px;color:var(--gold);font-size:12px;font-weight:700;letter-spacing:.14em}.services-hero h1{max-width:830px;margin:0;font-size:clamp(42px,6vw,72px);font-weight:700;line-height:1.25}.is-ar .services-hero h1{line-height:1.5}.services-hero .hero-content>p:last-child{max-width:620px;margin:17px 0 0;color:#cecece;font-size:18px;line-height:1.9}.is-ar .services-hero .hero-content>p:last-child{font-size:20px}
    .services-content{max-width:1380px;margin:auto;padding:clamp(45px,6vw,78px) clamp(22px,7vw,100px) clamp(65px,8vw,110px)}.section-intro{max-width:650px;margin-bottom:30px}.section-intro h2{margin:0;font-size:clamp(27px,3vw,38px);font-weight:700;line-height:1.45}.service-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.service-card{overflow:hidden;border:1px solid #e5e3df;border-radius:10px;background:#fff;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}.service-card:hover{transform:translateY(-4px);border-color:#d3c5aa;box-shadow:0 18px 40px #0000000d}.service-image{position:relative;display:block;height:clamp(220px,25vw,320px);overflow:hidden;background:#dedbd4}.service-image:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#15151555,transparent 45%)}.service-image img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.78);transition:transform .65s ease,filter .4s ease}.service-card:hover .service-image img{transform:scale(1.035);filter:grayscale(.2)}.service-number{position:absolute;z-index:1;top:17px;inset-inline-start:17px;display:grid;place-items:center;width:42px;height:42px;border:1px solid #fff9;border-radius:50%;background:#17171755;color:#fff;font-size:12px}.service-copy{padding:23px 25px 25px}.service-kicker{margin:0 0 8px;color:#947749;font-size:10px;font-weight:700;letter-spacing:.12em}.service-copy h3{margin:0 0 10px;font-size:clamp(22px,2.3vw,29px);font-weight:700;line-height:1.45}.service-copy h3 a{color:inherit;text-decoration:none}.service-description{min-height:62px;margin:0;color:#696969;font-size:15px;font-weight:400;line-height:1.9}.learn-link{display:inline-flex;align-items:center;gap:12px;margin-top:16px;padding-bottom:5px;border-bottom:1px solid #c8b58f;color:#725b36;font-size:14px;font-weight:700;transition:gap .2s ease}.learn-link:hover{gap:18px}.learn-link span{color:var(--gold);font-size:18px}.services-state{padding:45px 20px;text-align:center;color:var(--muted)}
    .services-cta{padding:clamp(48px,7vw,82px) 22px;text-align:center;background:#1a1a1a;color:#fff}.services-cta h2{margin:0 auto;font-size:clamp(30px,4vw,48px);font-weight:700;line-height:1.4}.services-cta>p:not(.eyebrow){max-width:600px;margin:12px auto 24px;color:#c9c9c9;font-size:16px;line-height:1.8}.services-cta>a{display:inline-flex;align-items:center;justify-content:center;gap:25px;min-height:49px;padding:0 19px;border:1px solid var(--gold);border-radius:6px;background:var(--gold);color:#171717;font-size:15px;font-weight:700;transition:background .2s ease,transform .2s ease}.services-cta>a:hover{transform:translateY(-2px);background:#c0a574}.services-cta>a span{font-size:18px}
    @media(max-width:700px){.services-hero{min-height:330px;padding:55px 22px}.services-hero h1{font-size:44px}.services-hero .hero-content>p:last-child{font-size:16px}.services-content{padding:43px 18px 62px}.section-intro h2{font-size:29px}.service-grid{grid-template-columns:1fr;gap:17px}.service-image{height:250px}.service-copy{padding:20px}.service-copy h3{font-size:25px}.service-description{min-height:0}.services-cta{padding:52px 22px}.services-cta>p:not(.eyebrow){font-size:15px}}
    @media(prefers-reduced-motion:reduce){.service-card,.service-image img,.learn-link,.services-cta>a{transition:none}}
  `],
})
export class ServicesPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  services: PublicService[] = [];
  loading = true;
  constructor() {
    this.api.get<{ items: PublicService[] }>('/services', { lang: this.i18n.locale() }).subscribe({
      next: (response) => {
        const items = response.data.items || [];
        this.services = items.length ? items.map((service) => {
          const catalogItem = SERVICE_OFFERINGS.find((item) => item.id === service.slug || item.en === service.title || item.ar === service.title);
          return {
            ...service,
            slug: service.slug || service._id || '',
            id: catalogItem?.id || service.slug,
            fallbackImage: catalogItem?.image,
          };
        }) : this.catalogFallback();
        this.loading = false;
      },
      error: () => { this.services = this.catalogFallback(); this.loading = false; },
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  private catalogFallback(): PublicService[] {
    return SERVICE_OFFERINGS.map((item) => ({
      id: item.id, slug: item.id, title: this.ar ? item.ar : item.en,
      shortDescription: this.ar ? item.descAr : item.descEn, fallbackImage: item.image,
    }));
  }
}
