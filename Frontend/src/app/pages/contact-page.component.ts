import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { LanguageService } from '../core/services/language.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';

interface ContactSettings {
  contact?: { address?: string; email?: string; whatsapp?: string; phones?: { number: string; label?: string }[] };
  workingHours?: { day: string; from?: string; to?: string }[];
  socialLinks?: { platform: string; url: string; isActive?: boolean }[];
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="contact-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      <section class="contact-hero">
        <div class="hero-inner">
          <p class="eyebrow">{{ ar ? 'نحن هنا للمساعدة' : 'WE ARE HERE TO HELP' }}</p>
          <h1>{{ ar ? 'تواصل معنا' : 'Get in touch' }}</h1>
          <p>{{ ar ? 'يسعد فريقنا بمساعدتك والإجابة عن استفساراتك. اختر الطريقة الأنسب للتواصل معنا.' : 'Our team is ready to help and answer your questions. Reach out in the way that works best for you.' }}</p>
        </div>
      </section>

      <section class="contact-content" [attr.aria-label]="ar ? 'معلومات التواصل' : 'Contact information'">
        <div class="contact-layout">
          <div class="contact-details">
            <div class="section-heading">
              <p class="eyebrow">{{ ar ? 'معلومات المكتب' : 'THE FIRM' }}</p>
              <h2>{{ ar ? 'يسعدنا أن نسمع منك' : 'We would be glad to hear from you' }}</h2>
            </div>

            <div class="detail-list">
              @if (phones.length) {
                @for (phone of phones; track phone.number) {
                  <a class="detail-card" [href]="'tel:' + phone.number">
                    <span class="detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10 21 3 14 3 5c0-1.1.9-2 2-2Z"/></svg></span>
                    <span class="detail-copy"><small>{{ phone.label || (ar ? 'الهاتف' : 'Phone') }}</small><strong dir="ltr">{{ phone.number }}</strong></span>
                    <span class="detail-arrow" aria-hidden="true">↗</span>
                  </a>
                }
              }
              @if (email) {
                <a class="detail-card" [href]="'mailto:' + email">
                  <span class="detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>
                  <span class="detail-copy"><small>{{ ar ? 'البريد الإلكتروني' : 'Email' }}</small><strong dir="ltr">{{ email }}</strong></span>
                  <span class="detail-arrow" aria-hidden="true">↗</span>
                </a>
              }
              @if (whatsapp) {
                <a class="detail-card" [href]="whatsappHref" target="_blank" rel="noopener noreferrer">
                  <span class="detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.8 7l-4.2 1 1.1-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.4 2.5 2 4.1 4.5 5"/></svg></span>
                  <span class="detail-copy"><small>WhatsApp</small><strong dir="ltr">{{ whatsapp }}</strong></span>
                  <span class="detail-arrow" aria-hidden="true">↗</span>
                </a>
              }
              @if (!phones.length && !email && !whatsapp) {
                <p class="empty-detail">{{ ar ? 'ستظهر بيانات الهاتف والبريد عند إضافتها من إعدادات الموقع.' : 'Phone and email details will appear here once added in site settings.' }}</p>
              }
            </div>

            <div class="hours-card">
              <div class="hours-title"><span class="detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><small>{{ ar ? 'نرحب بكم' : 'VISIT OR CALL' }}</small><h3>{{ ar ? 'ساعات العمل' : 'Working hours' }}</h3></div></div>
              @if (workingHours.length) {
                <div class="hours-list">@for (hours of workingHours; track hours.day) { <div><span>{{ hours.day }}</span><strong dir="ltr">{{ formatHour(hours.from) }}{{ hours.to ? ' – ' + formatHour(hours.to) : '' }}</strong></div> }</div>
              } @else {
                <p class="hours-unavailable">{{ ar ? 'يرجى التواصل معنا لمعرفة أوقات العمل.' : 'Contact us to confirm our current office hours.' }}</p>
              }
            </div>

<section class="map-section" aria-labelledby="map-title">
          <div class="map-heading"><div><p class="eyebrow">{{ ar ? 'زورونا' : 'FIND US' }}</p><h2 id="map-title">{{ ar ? 'موقع المكتب' : 'Office location' }}</h2><p>{{ address }}</p></div><a class="map-link" [href]="mapLink" target="_blank" rel="noopener noreferrer">{{ ar ? 'افتح في خرائط Google' : 'Open in Google Maps' }} <span aria-hidden="true">↗</span></a></div>
          <div class="map-frame"><iframe [src]="mapEmbed" [title]="ar ? 'خريطة موقع المكتب' : 'Map showing the office location'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
        </section>

            @if (socials.length) {
              <div class="social-block">
                <h3>{{ ar ? 'تابعنا على منصات التواصل' : 'Follow us' }}</h3>
                <div class="social-links">
                  @for (social of socials; track social.platform) {
                    <a [href]="social.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.platform" [title]="social.platform">
                      @if (social.platform === 'x') { <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 13.9 4.9 22H1.8l7.3-8.4L1.3 2h6.5l4.4 7.4L18.9 2Zm-1.1 18h1.7L6.8 3.9H5L17.8 20Z"/></svg> }
                      @if (social.platform === 'instagram') { <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.8" r=".8" class="fill-dot"/></svg> }
                      @if (social.platform === 'linkedin') { <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5ZM3 10h4v11H3zm7 0h3.8v1.5h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.8-2.8S14.6 14.5 14.6 16v5h-4z"/></svg> }
                      @if (social.platform !== 'x' && social.platform !== 'instagram' && social.platform !== 'linkedin') { <span>{{ social.platform }}</span> }
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <section class="message-panel" aria-labelledby="message-title">
            @if (sent) {
              <div class="sent-state" role="status" aria-live="polite">
                <span class="sent-mark" aria-hidden="true">✓</span>
                <p class="eyebrow">{{ ar ? 'تم الإرسال' : 'MESSAGE SENT' }}</p>
                <h2>{{ ar ? 'شكراً لتواصلك معنا.' : 'Thank you for contacting us.' }}</h2>
                <p>{{ ar ? 'وصلتنا رسالتك بنجاح، وسيتواصل معك فريقنا قريباً.' : 'Your message was received. Our team will be in touch soon.' }}</p>
                <button type="button" class="send-button" (click)="sendAnother()">{{ ar ? 'إرسال رسالة أخرى' : 'Send another message' }} <span aria-hidden="true">↗</span></button>
              </div>
            } @else {
              <div class="message-heading"><p class="eyebrow">{{ ar ? 'أرسل لنا رسالة' : 'SEND A MESSAGE' }}</p><h2 id="message-title">{{ ar ? 'كيف يمكننا مساعدتك؟' : 'How can we help?' }}</h2><p>{{ ar ? 'أرسل تفاصيل استفسارك وسنعاود التواصل معك.' : 'Share a few details and we will get back to you.' }}</p></div>
              <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                <label><span>{{ ar ? 'الاسم الكامل' : 'Full name' }} <b>*</b></span><input formControlName="name" autocomplete="name" [placeholder]="ar ? 'اكتب اسمك' : 'Your name'" /></label>
                <label><span>{{ ar ? 'البريد الإلكتروني' : 'Email address' }} <b>*</b></span><input formControlName="email" type="email" autocomplete="email" [placeholder]="ar ? 'name@example.com' : 'name@example.com'" /></label>
                <label><span>{{ ar ? 'رقم الهاتف' : 'Phone number' }} <small>{{ ar ? 'اختياري' : 'Optional' }}</small></span><input formControlName="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+966 5X XXX XXXX" /></label>
                <label><span>{{ ar ? 'رسالتك' : 'Your message' }} <b>*</b></span><textarea formControlName="message" rows="5" [placeholder]="ar ? 'اكتب كيف يمكننا مساعدتك…' : 'Tell us how we can help…'"></textarea></label>
                @if (form.touched && form.invalid) {
                  <ul class="form-error" role="alert">
                    @if (form.controls.name.errors?.['required']) { <li>{{ ar ? 'الاسم الكامل مطلوب.' : 'Full name is required.' }}</li> }
                    @if (form.controls.name.errors?.['maxlength']) { <li>{{ ar ? 'يجب ألا يتجاوز الاسم 100 حرف.' : 'Name must be 100 characters or fewer.' }}</li> }
                    @if (form.controls.email.errors?.['required']) { <li>{{ ar ? 'البريد الإلكتروني مطلوب.' : 'Email address is required.' }}</li> }
                    @if (form.controls.email.errors?.['email']) { <li>{{ ar ? 'أدخل عنوان بريد إلكتروني صحيحاً.' : 'Enter a valid email address.' }}</li> }
                    @if (form.controls.phone.errors?.['maxlength']) { <li>{{ ar ? 'يجب ألا يتجاوز رقم الهاتف 30 حرفاً.' : 'Phone number must be 30 characters or fewer.' }}</li> }
                    @if (form.controls.message.errors?.['required']) { <li>{{ ar ? 'الرسالة مطلوبة.' : 'Message is required.' }}</li> }
                    @if (form.controls.message.errors?.['maxlength']) { <li>{{ ar ? 'يجب ألا تتجاوز الرسالة 3000 حرف.' : 'Message must be 3,000 characters or fewer.' }}</li> }
                  </ul>
                }
                @if (submitError) { <p class="form-error" role="alert">{{ submitError }}</p> }
                <button class="send-button" type="submit" [disabled]="sending"><span>{{ sending ? (ar ? 'جارٍ إرسال الرسالة…' : 'Sending your message…') : (ar ? 'إرسال الرسالة' : 'Send message') }}</span><span aria-hidden="true">↗</span></button>
                <p class="privacy-note">{{ ar ? 'نحافظ على خصوصية بياناتك ونستخدمها للرد على رسالتك.' : 'Your details are kept private and used only to respond to your message.' }}</p>
              </form>
            }
          </section>
        </div>
      </section>
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--ink:#191919;--muted:#737373;--gold:#ad8c59;--line:#e7e5e1;color:var(--ink)}.contact-page{min-height:100vh;background:#f7f7f6}
    .contact-hero{position:relative;overflow:hidden;background:#191919;color:#fff}.contact-hero:after{content:'';position:absolute;width:370px;height:370px;inset-inline-end:8%;top:-230px;border:1px solid #ad8c5940;border-radius:50%;box-shadow:0 0 0 30px #ad8c5912,0 0 0 65px #ad8c5909}.hero-inner{position:relative;z-index:1;max-width:1320px;margin:auto;padding:clamp(54px,7vw,92px) clamp(24px,7vw,100px)}.eyebrow{margin:0 0 12px;color:var(--gold);font-size:12px;font-weight:700;letter-spacing:.14em}.contact-hero h1{margin:0;font-size:clamp(44px,6vw,72px);line-height:1.25}.is-ar .contact-hero h1{line-height:1.5}.contact-hero .hero-inner>p:last-child{max-width:620px;margin:14px 0 0;color:#d1d1d1;font-size:18px;line-height:1.9}.is-ar .contact-hero .hero-inner>p:last-child{font-size:20px}
    .contact-content{max-width:1320px;margin:auto;padding:clamp(48px,7vw,88px) clamp(20px,7vw,100px)}.contact-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(380px,1fr);gap:clamp(36px,6vw,82px);align-items:start}.section-heading h2,.message-heading h2,.map-heading h2{margin:0;font-size:clamp(27px,3vw,36px);line-height:1.4}.is-ar .section-heading h2,.is-ar .message-heading h2,.is-ar .map-heading h2{line-height:1.55}.section-heading{margin-bottom:25px}.detail-list{display:grid;gap:11px}.detail-card{display:flex;align-items:center;gap:14px;min-height:76px;padding:13px 15px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease}.detail-card:hover{transform:translateY(-2px);border-color:#cbb88f;box-shadow:0 10px 24px #00000008}.detail-icon{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border:1px solid #ad8c5940;border-radius:50%;color:#8d7042}.detail-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.detail-copy{display:grid;gap:4px;min-width:0;flex:1}.detail-copy small,.hours-title small{color:#888;font-size:12px}.detail-copy strong{overflow-wrap:anywhere;font-size:15px;font-weight:600}.detail-arrow{color:var(--gold);font-size:18px}.empty-detail,.hours-unavailable{margin:0;color:var(--muted);font-size:14px;line-height:1.8}
    .hours-card{margin-top:22px;padding:20px;border:1px solid var(--line);border-radius:9px;background:#fff}.hours-title{display:flex;align-items:center;gap:12px;margin-bottom:15px}.hours-title h3,.social-block h3{margin:2px 0 0;font-size:16px}.hours-list{display:grid;gap:10px;padding-top:13px;border-top:1px solid #efefed}.hours-list>div{display:flex;justify-content:space-between;gap:15px;color:#666;font-size:13px}.hours-list strong{color:#282828;font-size:13px;font-weight:600}.hours-unavailable{padding-top:12px;border-top:1px solid #efefed}.social-block{margin-top:23px}.social-block h3{margin:0 0 13px}.social-links{display:flex;flex-wrap:wrap;gap:10px}.social-links a{display:grid;place-items:center;width:42px;height:42px;border:1px solid #d9d7d2;border-radius:50%;background:#fff;color:#292929;transition:background .18s ease,border-color .18s ease,color .18s ease}.social-links a:hover{border-color:var(--gold);background:#1b1b1b;color:#fff}.social-links svg{width:18px;height:18px;fill:currentColor}.social-links svg rect,.social-links svg circle:not(.fill-dot){fill:none;stroke:currentColor;stroke-width:1.8}.social-links svg .fill-dot{fill:currentColor}
    .message-panel{padding:clamp(23px,3.5vw,38px);border:1px solid #e7e5e1;border-radius:12px;background:#fff;box-shadow:0 18px 50px #00000009}.message-heading{margin-bottom:23px}.message-heading>p:last-child{margin:8px 0 0;color:var(--muted);font-size:15px;line-height:1.75}.message-panel form{display:grid;gap:16px}.message-panel label{display:grid;gap:7px}.message-panel label>span{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700}.message-panel label b{color:#9d5148}.message-panel label small{margin-inline-start:auto;color:#999;font-size:11px;font-weight:400}.message-panel input,.message-panel textarea{width:100%;padding:12px 13px;border:1px solid #dededb;border-radius:7px;background:#fcfcfb;color:#222;font:inherit;font-size:14px;transition:border-color .2s ease,box-shadow .2s ease}.message-panel input{min-height:49px}.message-panel textarea{min-height:125px;resize:vertical;line-height:1.7}.message-panel input::placeholder,.message-panel textarea::placeholder{color:#a2a2a2}.message-panel input:focus,.message-panel textarea:focus{outline:0;border-color:var(--gold);background:#fff;box-shadow:0 0 0 4px #ad8c591c}.form-error{margin:0;color:#a13e37;font-size:13px;line-height:1.6}.send-button{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;min-height:53px;padding:0 17px;border:1px solid #191919;border-radius:7px;background:#191919;color:#fff;font:700 15px var(--font);transition:background .2s ease,border-color .2s ease,transform .2s ease}.send-button:hover:not(:disabled){transform:translateY(-2px);border-color:#3b3b3b;background:#3b3b3b}.send-button>span:last-child{color:#d6bd8c;font-size:19px}.send-button:disabled{opacity:.55;cursor:wait}.privacy-note{margin:0;color:#8b8b8b;font-size:12px;line-height:1.7;text-align:center}.sent-state{display:flex;min-height:460px;flex-direction:column;align-items:flex-start;justify-content:center}.sent-mark{display:grid;place-items:center;width:54px;height:54px;margin-bottom:20px;border-radius:50%;background:#f4f0e7;color:#8a7047;font-size:25px}.sent-state h2{margin:0 0 8px;font-size:29px;line-height:1.5}.sent-state>p:not(.eyebrow){margin:0;color:var(--muted);font-size:15px;line-height:1.8}.sent-state .send-button{margin-top:25px}
    .map-section{margin-top:26px}.map-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:18px}.map-heading .eyebrow{margin-bottom:7px}.map-heading p:last-child{margin:5px 0 0;color:var(--muted);font-size:14px}.map-link{display:inline-flex;align-items:center;gap:12px;flex:none;padding:12px 15px;border:1px solid #d9d5cc;border-radius:7px;background:#fff;color:#252525;font-size:13px;font-weight:700;transition:border-color .2s ease,color .2s ease}.map-link:hover{border-color:var(--gold);color:#80683f}.map-link span{color:var(--gold);font-size:17px}.map-frame{position:relative;height:clamp(270px,38vw,440px);overflow:hidden;border:1px solid #deddd9;border-radius:11px;background:#ecebe8}.map-frame iframe{display:block;width:100%;height:100%;border:0;filter:grayscale(.78) contrast(.95)}.map-pin-link{position:absolute;inset-inline-start:50%;top:50%;display:grid;justify-items:center;gap:1px;transform:translate(-50%,-100%);color:#b23b32;filter:drop-shadow(0 2px 3px #0004);pointer-events:none}.map-pin-link svg{width:40px;height:40px;fill:#c6453b;stroke:#fff;stroke-width:1.5}.map-pin-link svg circle{fill:#fff;stroke:none}.map-pin-link span{padding:3px 8px;border-radius:4px;background:#fff;color:#333;font-size:11px;font-weight:700}
    @media(max-width:850px){.contact-layout{grid-template-columns:1fr;gap:36px}.contact-details{display:grid;grid-template-columns:1fr 1fr;column-gap:22px}.section-heading,.detail-list,.map-section{grid-column:1/-1}.hours-card{margin-top:20px}.social-block{align-self:center}.sent-state{min-height:350px}}
    @media(max-width:560px){.hero-inner{padding:46px 22px}.contact-hero h1{font-size:45px}.contact-hero .hero-inner>p:last-child{font-size:16px}.contact-content{padding:42px 18px 60px}.contact-details{display:block}.section-heading h2,.message-heading h2,.map-heading h2{font-size:28px}.detail-card{min-height:69px;padding:11px}.detail-copy strong{font-size:14px}.hours-card{margin-top:16px;padding:17px}.social-block{margin-top:22px}.message-panel{padding:22px 18px}.map-heading{align-items:flex-start;flex-direction:column}.map-link{width:100%;justify-content:space-between}.map-frame{height:300px}.map-pin-link{pointer-events:auto}}
    @media(prefers-reduced-motion:reduce){.detail-card,.social-links a,.send-button,.map-link{transition:none}}
  `],
})
export class ContactPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  settings: ContactSettings | null = null;
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', Validators.maxLength(30)],
    message: ['', [Validators.required, Validators.maxLength(3000)]],
  });
  sending = false;
  sent = false;
  submitError = '';

  constructor() {
    this.api.get<{ settings: ContactSettings }>('/settings', { lang: this.i18n.locale() }).subscribe({
      next: (response) => this.settings = response.data.settings,
      error: () => this.settings = null,
    });
  }
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  get address(): string { return this.settings?.contact?.address || (this.ar ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'); }
  get phones(): { number: string; label?: string }[] { return this.settings?.contact?.phones || []; }
  get email(): string { return this.settings?.contact?.email || ''; }
  get whatsapp(): string { return this.settings?.contact?.whatsapp || ''; }
  get whatsappHref(): string { return `https://wa.me/${this.whatsapp.replace(/\D/g, '')}`; }
  get workingHours(): { day: string; from?: string; to?: string }[] { return this.settings?.workingHours || []; }
  get socials(): { platform: string; url: string }[] {
    return (this.settings?.socialLinks || []).filter((item) => item.isActive && item.url && ['x', 'instagram', 'linkedin'].includes(item.platform));
  }
  get mapLink(): string { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address)}`; }
  get mapEmbed(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps?q=${encodeURIComponent(this.address)}&output=embed`);
  }
  formatHour(value?: string): string {
    if (!value) return '';
    const [hourText, minute] = value.split(':');
    const hour = Number(hourText);
    return new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, hour, Number(minute || 0)));
  }
  submit(): void {
    if (this.form.invalid || this.sending) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    this.submitError = '';
    this.api.post<{ contactMessage: unknown }>('/contact', this.form.getRawValue()).pipe(finalize(() => this.sending = false)).subscribe({
      next: () => { this.sent = true; this.form.reset(); },
      error: (error: { error?: { message?: string } }) => {
        this.submitError = error.error?.message || (this.ar ? 'تعذر إرسال رسالتك الآن. حاول مرة أخرى.' : 'Your message could not be sent. Please try again.');
      },
    });
  }
  sendAnother(): void { this.sent = false; this.submitError = ''; }
}
