import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ApiService } from '../../core/services/api.service';

interface PublicSiteSettings {
  contact?: { address?: string; email?: string; whatsapp?: string; phones?: { number: string; label?: string }[] };
  socialLinks?: { platform: string; url: string; isActive?: boolean }[];
  workingHours?: { day: string; from?: string; to?: string }[];
}

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand-block">
          <a class="footer-brand" [routerLink]="['/', i18n.locale()]" [attr.aria-label]="ar ? 'العودة إلى الصفحة الرئيسية' : 'Al Saiari Law Firm home'">
            <img src="/assets/brand/al-saiari-logo.png" [alt]="ar ? 'شركة السياري للمحاماة' : 'Al Saiari Law Firm'" />
          </a>
          <p>{{ ar ? 'رأي قانوني واضح، وتمثيل مهني يضع احتياجاتك أولاً.' : 'Clear legal counsel and considered representation, shaped around your needs.' }}</p>
          <span class="footer-location">{{ settings?.contact?.address || (ar ? 'الرياض · المملكة العربية السعودية' : 'Riyadh · Kingdom of Saudi Arabia') }}</span>
        </div>

        <nav class="footer-links" [attr.aria-label]="ar ? 'روابط الموقع' : 'Explore the website'">
          <h2>{{ ar ? 'استكشف الموقع' : 'Explore' }}</h2>
          <a [routerLink]="['/', i18n.locale()]">{{ ar ? 'الرئيسية' : 'Home' }}</a>
          <a [routerLink]="['/', i18n.locale(), 'about']">{{ ar ? 'من نحن' : 'About us' }}</a>
          <a [routerLink]="['/', i18n.locale(), 'services']">{{ ar ? 'خدماتنا القانونية' : 'Legal services' }}</a>
          <a [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'أحدث المقالات' : 'Latest articles' }}</a>
          <a [routerLink]="['/', i18n.locale()]" fragment="faq">{{ ar ? 'الأسئلة الشائعة' : 'Frequently asked questions' }}</a>
        </nav>

        <div class="footer-contact">
          <h2>{{ ar ? 'تواصل معنا' : 'Get in touch' }}</h2>
          <a class="footer-contact-link" [href]="whatsappHref" target="_blank" rel="noopener noreferrer">
            <span class="contact-icon" aria-hidden="true">↗</span>
            <span><small>{{ ar ? 'واتساب' : 'WhatsApp' }}</small><strong dir="ltr">{{ whatsappNumber }}</strong></span>
          </a>
          @if (settings?.contact?.phones?.length) {
            @for (phone of settings?.contact?.phones; track phone.number) {
              <a class="footer-phone" [href]="'tel:' + phone.number">{{ phone.number }}</a>
            }
          }
          @if (settings?.contact?.email; as email) {
            <a class="footer-email" [href]="'mailto:' + email">{{ email }}</a>
          }
          @if (settings?.workingHours?.length) {
            <div class="footer-hours">
              <strong>{{ ar ? 'ساعات العمل' : 'Office hours' }}</strong>
              @for (hours of settings?.workingHours; track hours.day) {
                <span>{{ hours.day }} <b>{{ hours.from }}–{{ hours.to }}</b></span>
              }
            </div>
          }
          <a class="footer-consultation" [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'احجز استشارتك' : 'Request a consultation' }} <span aria-hidden="true">↗</span></a>
          <div class="footer-socials">
            <span>{{ ar ? 'تابع وتواصل' : 'Connect with us' }}</span>
            @for (social of activeSocialLinks; track social.platform) {
              <a [href]="social.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="socialLabel(social.platform)">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  @switch (social.platform) {
                    @case ('facebook') { <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5h1.4V5a18 18 0 0 0-2.1-.1c-2.1 0-3.6 1.3-3.6 3.8V11H8.3v3h2.4v7z" /> }
                    @case ('instagram') { <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" /><circle cx="17.5" cy="6.5" r="1" /> }
                    @case ('linkedin') { <path d="M5 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 10h4v11H3zm7 0h3.8v1.5h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.8v5h-4z" /> }
                    @case ('youtube') { <path d="M23 7.1a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.8 15.5v-7l6 3.5z" /> }
                    @case ('x') { <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.9 5.8 22H2.6l7.3-8.4L2.1 2h6.5l4.5 6.6zm-1.1 18h1.7L7.6 3.9H5.8z" /> }
                    @case ('tiktok') { <path d="M19.6 7.1a6.2 6.2 0 0 1-3.8-1.3v8.4a6.2 6.2 0 1 1-5.4-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3a6.3 6.3 0 0 0 3.8 3.8z" /> }
                    @case ('snapchat') { <path d="M12 2.2c-2.3 0-3.8 1.8-3.8 4.4 0 .8.1 1.6.2 2.4-.6.4-1.4.6-2.3.2-.4-.2-.9-.1-1.1.3-.2.4 0 .9.4 1.1.8.5 1.8.6 2.6.5-.7 1.8-2.1 3.1-4.2 3.8-.4.1-.6.5-.5.9.1.4.5.6.9.6.8 0 1.4.4 1.7 1.2.2.4.5.6.9.5 1.1-.2 2.1 0 3 .7.7.5 1.5.5 2.2 0 .9-.7 1.9-.9 3-.7.4.1.7-.1.9-.5.3-.8.9-1.2 1.7-1.2.4 0 .8-.2.9-.6.1-.4-.1-.8-.5-.9-2.1-.7-3.5-2-4.2-3.8.9.1 1.8 0 2.6-.5.4-.2.6-.7.4-1.1-.2-.4-.7-.5-1.1-.3-.9.4-1.7.2-2.3-.2.1-.8.2-1.6.2-2.4 0-2.6-1.5-4.4-3.8-4.4Z" /> }
                    @default { <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="M8 12h8M12 8v8" fill="none" stroke="currentColor" stroke-width="1.8" /> }
                  }
                </svg>
              </a>
            }
            <a class="whatsapp-social" [href]="whatsappHref" target="_blank" rel="noopener noreferrer" [attr.aria-label]="ar ? 'تواصل معنا عبر واتساب' : 'Message us on WhatsApp'"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12 21Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.4 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6s0-.4-.1-.6-.7-1.7-1-2.3c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4 2.4 3.7 5.8 5c.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4s.3-1.3.2-1.4-.3-.3-.6-.5Z" /></svg></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <small>© {{ year }} ALSAIARI LAW FIRM. {{ ar ? 'جميع الحقوق محفوظة.' : 'All rights reserved.' }}</small>
        <span>{{ ar ? 'المحتوى المنشور لأغراض التوعية العامة ولا يُعد استشارة قانونية.' : 'Website information is general and does not constitute legal advice.' }}</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer .footer-brand{padding:6px 10px;border-radius:4px;background:#fff}.site-footer .footer-brand img{width:220px;height:90px;filter:none!important;opacity:1;object-fit:contain}.site-footer .footer-socials{flex-wrap:wrap}.site-footer .footer-socials>a{width:38px;height:38px;border-color:#ffffff45;color:#f2eee5}.site-footer .footer-socials>a svg{width:18px;height:18px;display:block;fill:currentColor}.site-footer .footer-socials>a:hover{transform:translateY(-2px);background:#ad8c59;border-color:#ad8c59;color:#171614}.site-footer .footer-socials>a:focus-visible{outline:2px solid #dfc38f;outline-offset:3px}.site-footer .whatsapp-social{color:#9ed9ae}
    :host{display:block}.site-footer{padding:clamp(44px,6vw,76px) clamp(24px,8vw,120px) 0;background:#141310;color:#e7e4dc}.footer-main{display:grid;grid-template-columns:minmax(240px,1.35fr) minmax(150px,.7fr) minmax(230px,.95fr);gap:clamp(35px,7vw,100px);max-width:1440px;margin:0 auto;padding-bottom:48px}.footer-brand{display:inline-flex;align-items:center}.footer-brand img{display:block;width:190px;height:82px;object-fit:contain;filter:grayscale(1) brightness(0) invert(1);opacity:.92}.footer-brand-block>p{max-width:350px;margin:20px 0 16px;color:#c4c0b7;font-size:14px;line-height:1.9}.footer-location{color:#a9a59d;font-size:12px}.footer-links,.footer-contact{display:flex;flex-direction:column;align-items:flex-start;gap:13px}.site-footer h2{margin:7px 0 9px;color:#f4f1e9;font-family:inherit;font-size:15px;font-weight:600;line-height:1.4}.footer-links>a,.footer-contact-link,.footer-consultation,.footer-phone,.footer-email{color:#c8c4bb;font-size:13px;text-decoration:none;transition:color .2s ease,transform .2s ease}.footer-links>a:hover,.footer-contact-link:hover,.footer-consultation:hover,.footer-phone:hover,.footer-email:hover{color:#e4c996}.footer-contact-link{display:flex;align-items:center;gap:12px}.contact-icon{display:grid;place-items:center;width:38px;height:38px;border:1px solid #ad8c596e;border-radius:50%;color:#d8be8f}.footer-contact-link span:last-child{display:grid;gap:4px}.footer-contact-link small{color:#a9a59d;font-size:11px}.footer-contact-link strong{color:#f0ede6;font-size:14px;font-weight:600}.footer-hours{display:grid;gap:7px;margin-top:3px;color:#aaa69d;font-size:11px}.footer-hours>strong{color:#e5e1d8;font-size:12px}.footer-hours>span{display:flex;gap:13px}.footer-hours b{color:#d5d0c6;font-weight:500}.footer-consultation{display:inline-flex;align-items:center;gap:18px;margin-top:4px;padding-bottom:5px;border-bottom:1px solid #ad8c59}.footer-consultation span{color:#d8be8f}.footer-socials{display:flex;align-items:center;gap:12px;margin-top:8px;color:#aaa69d;font-size:12px}.footer-socials a{display:grid;place-items:center;width:32px;height:32px;border:1px solid #ffffff36;border-radius:50%;color:#e8e4db;font:700 9px Arial,sans-serif;text-decoration:none;transition:background .2s ease,border-color .2s ease}.footer-socials a:hover{background:#ad8c59;border-color:#ad8c59}.footer-bottom{display:flex;justify-content:space-between;align-items:center;gap:24px;max-width:1440px;margin:0 auto;padding:19px 0;border-top:1px solid #ffffff20;color:#918d85}.footer-bottom small,.footer-bottom>span{font-size:10px;line-height:1.7}.footer-bottom small{letter-spacing:.04em}
    @media(max-width:800px){.footer-main{grid-template-columns:1fr 1fr;gap:38px}.footer-brand-block{grid-column:1/-1}.footer-brand-block>p{max-width:500px}.footer-contact{grid-column:2;grid-row:2}.footer-links{grid-column:1;grid-row:2}}
    @media(max-width:560px){.site-footer{padding:40px 22px 0}.footer-main{grid-template-columns:1fr;gap:30px;padding-bottom:34px}.footer-brand-block,.footer-links,.footer-contact{grid-column:1;grid-row:auto}.site-footer .footer-brand img{width:min(195px,72vw);height:80px}.footer-links{display:grid;grid-template-columns:1fr 1fr;gap:12px}.footer-links h2{grid-column:1/-1}.footer-links>a{font-size:12px}.footer-bottom{align-items:flex-start;flex-direction:column;gap:8px;padding:16px 0}}
    @media(prefers-reduced-motion:reduce){.footer-links>a,.footer-contact-link,.footer-consultation,.footer-socials a{transition:none}}
  `],
})
export class SiteFooterComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  readonly year = new Date().getFullYear();
  settings: PublicSiteSettings | null = null;
  constructor() {
    this.api.get<{ settings: PublicSiteSettings }>('/settings', { lang: this.i18n.locale() }).subscribe({
      next: (response) => this.settings = response.data.settings,
      error: () => undefined,
    });
  }
  get activeSocialLinks(): { platform: string; url: string }[] {
    return (this.settings?.socialLinks || []).filter((item) => item.isActive && item.url);
  }
  get whatsappNumber(): string { return this.settings?.contact?.whatsapp || '+966 57 090 7930'; }
  get whatsappHref(): string { return `https://wa.me/${this.whatsappNumber.replace(/\D/g, '')}`; }
  socialLabel(platform: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      facebook: { en: 'Facebook', ar: 'فيسبوك' }, instagram: { en: 'Instagram', ar: 'إنستغرام' },
      linkedin: { en: 'LinkedIn', ar: 'لينكد إن' }, youtube: { en: 'YouTube', ar: 'يوتيوب' },
      x: { en: 'X', ar: 'إكس' }, tiktok: { en: 'TikTok', ar: 'تيك توك' }, snapchat: { en: 'Snapchat', ar: 'سناب شات' },
    };
    return labels[platform]?.[this.ar ? 'ar' : 'en'] || platform;
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
}
