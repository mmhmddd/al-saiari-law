import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SERVICE_OFFERINGS } from '../service-catalog';

@Component({
  selector: 'app-site-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <a class="brand-mark" [routerLink]="['/', i18n.locale()]" [attr.aria-label]="ar ? 'العودة إلى الصفحة الرئيسية' : 'Al Saiari Law Firm home'">
        <img src="assets/brand/al-saiari-logo.png" alt="Al Saiari Law Firm" />
      </a>
      <nav class="main-nav" [class.open]="menuOpen" [attr.aria-label]="ar ? 'التنقل الرئيسي' : 'Main navigation'">
        <a [routerLink]="['/', i18n.locale()]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenus()">{{ ar ? 'الرئيسية' : 'Home' }}</a>
        <a [routerLink]="['/', i18n.locale(), 'about']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenus()">{{ ar ? 'من نحن' : 'About us' }}</a>
        <div class="nav-services" [class.expanded]="servicesOpen" [class.route-active]="onServicesRoute">
          <button class="services-toggle" type="button" (click)="servicesOpen = !servicesOpen" [attr.aria-expanded]="servicesOpen">{{ ar ? 'الخدمات' : 'Services' }} <span aria-hidden="true">⌄</span></button>
          <div class="services-menu" [class.visible]="servicesOpen">
            @for (service of services; track service.id) { <a [routerLink]="['/', i18n.locale(), 'services', service.id]" (click)="closeMenus()">{{ ar ? service.ar : service.en }}</a> }
            <a class="all-services" [routerLink]="['/', i18n.locale(), 'services']" routerLinkActive="active" (click)="closeMenus()">{{ ar ? 'جميع الخدمات' : 'All services' }} <span>↗</span></a>
          </div>
        </div>
        <a [routerLink]="['/', i18n.locale(), 'articles']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenus()">{{ ar ? 'مقالاتنا' : 'Articles' }}</a>
        <a [routerLink]="['/', i18n.locale(), 'contact']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenus()">{{ ar ? 'تواصل معنا' : 'Contact us' }}</a>
      </nav>
      <div class="header-actions">
        <button class="language-switch" type="button" (click)="i18n.setLocale(ar ? 'en' : 'ar')" [attr.aria-label]="ar ? 'Switch to English' : 'التبديل إلى العربية'">{{ ar ? 'EN' : 'عربي' }}</button>
        <a class="booking-nav-link" [routerLink]="['/', i18n.locale(), 'consultation']" routerLinkActive="active" [attr.aria-label]="ar ? 'احجز موعد استشارة' : 'Book an appointment'" (click)="closeMenus()">{{ ar ? 'احجز موعد' : 'Book an appointment' }} <span aria-hidden="true">↗</span></a>
        <button class="menu-toggle" type="button" (click)="menuOpen = !menuOpen" [attr.aria-expanded]="menuOpen" [attr.aria-label]="menuOpen ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')"><span></span><span></span></button>
      </div>
    </header>
  `,
  styles: [`
    :host{display:block;position:sticky;top:0;z-index:100;height:84px}.site-header{position:relative;min-height:84px;padding:0 clamp(20px,5vw,76px);display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2.2vw,34px);border-bottom:1px solid #ad8c5938;background:#fffdfaf2;backdrop-filter:blur(18px);box-shadow:0 7px 28px #17140d0c}
    .brand-mark{display:flex;align-items:center;flex:none}.brand-mark img{display:block;width:142px;height:62px;object-fit:contain;mix-blend-mode:multiply}
    .main-nav{display:flex;align-items:center;justify-content:center;gap:clamp(10px,1.7vw,25px);align-self:stretch}.main-nav>a,.services-toggle{position:relative;display:flex;align-items:center;color:#4a4945;font-size:14px;font-weight:600;white-space:nowrap;transition:color .2s ease}.main-nav>a{height:100%}.main-nav>a:after,.services-toggle:after{content:'';position:absolute;bottom:19px;inset-inline:0;height:2px;border-radius:2px;background:#ad8c59;transform:scaleX(0);transition:transform .22s ease}.main-nav>a:hover,.main-nav>a:focus-visible,.main-nav>a.active,.services-toggle:hover,.nav-services.expanded .services-toggle,.nav-services.route-active .services-toggle{color:#171717}.main-nav>a:hover:after,.main-nav>a:focus-visible:after,.main-nav>a.active:after,.nav-services.route-active .services-toggle:after{transform:scaleX(1)}
    .nav-services{position:relative;display:flex;align-items:center;height:100%}.services-toggle{height:100%;gap:7px;padding:0;border:0;background:none;font-family:inherit;cursor:pointer}.services-toggle span{color:#a48758;font-size:17px;transition:transform .2s ease}.nav-services.expanded .services-toggle span{transform:rotate(180deg)}.services-menu{position:absolute;top:calc(100% - 8px);inset-inline-start:-18px;z-index:10;display:grid;min-width:290px;max-height:min(70vh,540px);overflow-y:auto;padding:8px;border:1px solid #e6e1d7;border-radius:10px;background:#fffdfa;box-shadow:0 20px 50px #17161420;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease}.services-menu.visible{opacity:1;visibility:visible;transform:translateY(0)}.services-menu a{display:flex;align-items:center;min-height:42px;padding:8px 12px;border-radius:5px;color:#48453f;font-size:13px;transition:background .18s ease,color .18s ease}.services-menu a:hover,.services-menu a.active{background:#f1eee7;color:#80683f}.services-menu .all-services{justify-content:space-between;margin-top:5px;padding-top:12px;border-top:1px solid #e7e2d9;border-radius:0;color:#80683f;font-weight:700}.services-menu .all-services span{color:#a48758}
    .header-actions{display:flex;align-items:center;gap:10px;flex:none}.language-switch{min-width:46px;height:40px;padding:0 11px;border:1px solid #dedbd4;border-radius:50px;background:#fff;color:#383630;font-weight:700;font-family:inherit;cursor:pointer;transition:background .2s ease,border-color .2s ease}.language-switch:hover{background:#f1eee7;border-color:#b8a47f}.booking-nav-link{display:inline-flex;align-items:center;justify-content:center;gap:11px;min-height:43px;padding:0 16px;border:1px solid #171717;border-radius:6px;background:#191919;color:#fff;font-size:13px;font-weight:700;white-space:nowrap;transition:background .2s ease,border-color .2s ease,transform .2s ease}.booking-nav-link span{color:#dfc38f;font-size:17px}.booking-nav-link:hover,.booking-nav-link.active{transform:translateY(-1px);border-color:#ad8c59;background:#ad8c59;color:#191919}.booking-nav-link:hover span,.booking-nav-link.active span{color:#191919}.menu-toggle{display:none;width:40px;height:40px;border:1px solid #dedbd4;background:#fff;border-radius:50%;align-items:center;justify-content:center;flex-direction:column;gap:5px;color:#191919;cursor:pointer}.menu-toggle span{width:17px;height:1.5px;background:currentColor}
    @media(max-width:1050px){.site-header{padding-inline:22px;gap:13px}.brand-mark img{width:116px}.main-nav{gap:11px}.main-nav>a,.services-toggle{font-size:12px}.header-actions{gap:7px}.booking-nav-link{padding-inline:12px;font-size:12px}}
    @media(max-width:760px){:host{height:72px}.site-header{min-height:72px;padding:0 15px;gap:10px}.brand-mark img{width:103px;height:54px}.header-actions{gap:6px}.language-switch{min-width:41px;height:37px;padding-inline:8px;font-size:12px}.booking-nav-link{min-height:38px;gap:5px;padding-inline:9px;font-size:12px}.booking-nav-link span{font-size:14px}.menu-toggle{display:flex;width:38px;height:38px}.main-nav{position:absolute;top:100%;inset-inline:10px;z-index:5;display:flex;flex-direction:column;align-items:stretch;gap:0;padding:8px 14px;border:1px solid #e4e0d7;border-radius:0 0 12px 12px;background:#fffdfa;box-shadow:0 16px 34px #17161420;opacity:0;visibility:hidden;transform:translateY(-7px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease}.main-nav.open{opacity:1;visibility:visible;transform:translateY(0)}.main-nav>a,.services-toggle{min-height:47px;height:auto;border-bottom:1px solid #eeece7;font-size:15px}.main-nav>a:after,.services-toggle:after{display:none}.nav-services{display:block;height:auto}.services-toggle{width:100%;justify-content:space-between;text-align:start}.services-menu{position:static;display:none;min-width:0;max-height:300px;padding:3px 0 8px;border:0;border-bottom:1px solid #eeece7;border-radius:0;box-shadow:none;transform:none;opacity:1;visibility:visible}.services-menu.visible{display:grid;transform:none}.services-menu a{min-height:40px;padding-inline:15px}.services-menu .all-services{border-top:1px solid #e7e2d9}}
    @media(max-width:360px){.site-header{padding-inline:10px;gap:6px}.brand-mark img{width:86px}.booking-nav-link{font-size:11px;padding-inline:7px}.menu-toggle{width:35px;height:35px}}
    @media(prefers-reduced-motion:reduce){.main-nav,.main-nav a,.services-menu,.services-toggle,.language-switch,.booking-nav-link{transition:none!important}}
  `],
})
export class SiteNavbarComponent {
  readonly i18n = inject(LanguageService);
  private readonly router = inject(Router);
  readonly services = SERVICE_OFFERINGS;
  menuOpen = false;
  servicesOpen = false;
  get onServicesRoute(): boolean { return this.router.url.includes(`/${this.i18n.locale()}/services`); }
  closeMenus(): void { this.menuOpen = false; this.servicesOpen = false; }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
}
