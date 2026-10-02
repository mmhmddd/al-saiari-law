import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { ConsultationService } from '../core/services/consultation.service';
import { LanguageService } from '../core/services/language.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteNavbarComponent } from './shared/site-navbar.component';

interface PublicServiceOption { _id: string; title: string; }
interface CreatedConsultation { _id?: string; }
interface CalendarDay { value: string; number: number; label: string; disabled: boolean; selected: boolean; }

@Component({
  selector: 'app-consultation-booking-page',
  standalone: true,
  imports: [ReactiveFormsModule, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <main class="booking-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <app-site-navbar />
      <section class="booking-shell">
        <div class="booking-intro">
          <p class="eyebrow">{{ ar ? 'استشارة قانونية' : 'LEGAL CONSULTATION' }}</p>
          <h1>{{ ar ? 'ابدأ بخطوة واضحة.' : 'Start with a clear next step.' }}</h1>
          <p class="booking-lead">{{ ar ? 'اختر الموعد المناسب، وأخبرنا كيف يمكننا مساعدتك. سيتواصل معك فريقنا لتأكيد التفاصيل.' : 'Choose a preferred time and tell us how we can help. Our team will contact you to confirm the details.' }}</p>
          <div class="booking-points">
            <div><span>01</span><p>{{ ar ? 'اختر اليوم والوقت المناسبين' : 'Choose a day and time that works for you' }}</p></div>
            <div><span>02</span><p>{{ ar ? 'أخبرنا ببيانات التواصل والخدمة' : 'Share your contact details and legal service' }}</p></div>
            <div><span>03</span><p>{{ ar ? 'نتواصل معك لتأكيد الموعد' : 'We will contact you to confirm' }}</p></div>
          </div>
          <div class="booking-contact">
            <span>{{ ar ? 'تفضل التواصل مباشرة؟' : 'Prefer to speak with us?' }}</span>
            <a href="https://wa.me/966570907930" target="_blank" rel="noopener noreferrer">{{ ar ? 'تواصل عبر واتساب' : 'Message us on WhatsApp' }} <span aria-hidden="true">↗</span></a>
          </div>
          <img class="booking-watermark" src="assets/consultation-logo-watermark.png" alt="" aria-hidden="true" />
        </div>

        <section class="booking-panel" aria-labelledby="booking-form-title">
          @if (submitted) {
            <div class="booking-success" role="status" aria-live="polite">
              <span class="success-icon" aria-hidden="true">✓</span>
              <p class="eyebrow">{{ ar ? 'تم استلام طلبك' : 'REQUEST RECEIVED' }}</p>
              <h2>{{ ar ? 'شكراً لثقتك بنا.' : 'Thank you for reaching out.' }}</h2>
              <p>{{ ar ? 'وصل طلبك بنجاح. سيتواصل معك فريقنا قريباً لتأكيد الموعد والخطوات التالية.' : 'Your request has been sent. Our team will be in touch shortly to confirm your appointment and next steps.' }}</p>
              @if (confirmationNumber) { <small>{{ ar ? 'رقم الطلب' : 'Request reference' }} · {{ confirmationNumber }}</small> }
              <button type="button" class="submit-button" (click)="startAnother()">{{ ar ? 'إرسال طلب آخر' : 'Send another request' }} <span aria-hidden="true">↗</span></button>
            </div>
          } @else {
            <div class="panel-heading">
              <h2 id="booking-form-title">{{ ar ? 'احجز موعد استشارتك' : 'Book your consultation' }}</h2>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <section class="appointment-picker" [attr.aria-label]="ar ? 'اختيار الموعد' : 'Choose an appointment'">
                <div class="picker-step"><span>01</span><div><strong>{{ ar ? 'اختر اليوم' : 'Choose a day' }}</strong><small>{{ ar ? 'حدد التاريخ المناسب لك' : 'Select a date that works for you' }}</small></div></div>
                <button type="button" class="picker-trigger" (click)="calendarOpen = true" [attr.aria-expanded]="calendarOpen">
                  <span class="picker-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></span>
                  <span class="picker-value" [class.placeholder]="!form.controls.preferredDate.value">{{ form.controls.preferredDate.value ? formatDate(form.controls.preferredDate.value) : (ar ? 'اختر التاريخ' : 'Select a date') }}</span>
                  <span class="picker-chevron" aria-hidden="true">⌄</span>
                </button>

                @if (calendarOpen) {
                  <div class="dialog-backdrop" (click)="calendarOpen = false" (keydown.escape)="calendarOpen = false">
                    <section class="picker-dialog calendar-dialog" role="dialog" aria-modal="true" [attr.aria-label]="ar ? 'اختر التاريخ' : 'Choose a date'" (click)="$event.stopPropagation()">
                      <div class="dialog-heading"><div><small>{{ ar ? 'موعد الاستشارة' : 'CONSULTATION DATE' }}</small><h3>{{ ar ? 'اختر اليوم المناسب' : 'Choose your day' }}</h3></div><button type="button" class="dialog-close" (click)="calendarOpen = false" [attr.aria-label]="ar ? 'إغلاق' : 'Close'">×</button></div>
                      <div class="calendar-nav"><button type="button" (click)="changeMonth(-1)" [disabled]="isCurrentMonth" [attr.aria-label]="ar ? 'الشهر السابق' : 'Previous month'">‹</button><strong>{{ monthLabel }}</strong><button type="button" (click)="changeMonth(1)" [attr.aria-label]="ar ? 'الشهر التالي' : 'Next month'">›</button></div>
                      <div class="calendar-grid" role="grid">
                        @for (weekday of weekdayLabels; track weekday) { <span class="weekday" role="columnheader">{{ weekday }}</span> }
                        @for (day of calendarDays; track $index) {
                          @if (day) { <button type="button" class="calendar-day" [class.selected]="day.selected" [disabled]="day.disabled" (click)="selectDate(day.value)" [attr.aria-label]="day.label" [attr.aria-pressed]="day.selected">{{ day.number }}</button> }
                          @else { <span class="calendar-empty" aria-hidden="true"></span> }
                        }
                      </div>
                      <p class="dialog-hint">{{ ar ? 'الموعد النهائي يخضع لتأكيد المكتب.' : 'Your preferred date will be confirmed by our team.' }}</p>
                    </section>
                  </div>
                }

                <div class="picker-step time-step"><span>02</span><div><strong>{{ ar ? 'اختر الوقت' : 'Choose a time' }}</strong><small>{{ ar ? 'حدد الوقت المفضل لك' : 'Pick a preferred time' }}</small></div></div>
                <button type="button" class="picker-trigger" [class.picker-disabled]="!form.controls.preferredDate.value" [disabled]="!form.controls.preferredDate.value" (click)="timeOpen = true" [attr.aria-expanded]="timeOpen">
                  <span class="picker-icon clock-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
                  <span class="picker-value" [class.placeholder]="!form.controls.preferredTime.value">{{ form.controls.preferredTime.value ? formatTime(form.controls.preferredTime.value) : (ar ? 'اختر الوقت' : 'Select a time') }}</span>
                  <span class="picker-chevron" aria-hidden="true">⌄</span>
                </button>

                @if (timeOpen) {
                  <div class="dialog-backdrop" (click)="timeOpen = false" (keydown.escape)="timeOpen = false">
                    <section class="picker-dialog time-dialog" role="dialog" aria-modal="true" [attr.aria-label]="ar ? 'اختر الوقت' : 'Choose a time'" (click)="$event.stopPropagation()">
                      <div class="dialog-heading"><div><small>{{ selectedDateLabel }}</small><h3>{{ ar ? 'اختر الوقت المناسب' : 'Choose a time' }}</h3></div><button type="button" class="dialog-close" (click)="timeOpen = false" [attr.aria-label]="ar ? 'إغلاق' : 'Close'">×</button></div>
                      <div class="time-options">@for (slot of timeSlots; track slot) { <button type="button" [class.selected]="form.controls.preferredTime.value === slot" (click)="selectTime(slot)">{{ formatTime(slot) }}</button> }</div>
                      <p class="dialog-hint">{{ ar ? 'سيتم تأكيد توفر الوقت من فريقنا.' : 'Our team will confirm your preferred time.' }}</p>
                    </section>
                  </div>
                }
              </section>

              @if (form.controls.preferredDate.value && form.controls.preferredTime.value) {
                <div class="details-divider"><span>03</span><strong>{{ ar ? 'بيانات التواصل والخدمة القانونية' : 'Your details and legal service' }}</strong></div>
                <label class="field">
                  <span>{{ ar ? 'الاسم الكامل' : 'Full name' }} <b>*</b></span>
                  <input formControlName="name" autocomplete="name" [attr.placeholder]="ar ? 'اكتب اسمك الكامل' : 'Enter your full name'" [attr.aria-invalid]="showError('name')" />
                  @if (showError('name')) { <small class="field-error">{{ ar ? 'يرجى إدخال الاسم.' : 'Please enter your name.' }}</small> }
                </label>
                <label class="field">
                  <span>{{ ar ? 'رقم الجوال' : 'Phone number' }} <b>*</b></span>
                  <input formControlName="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+966 5X XXX XXXX" [attr.aria-invalid]="showError('phone')" />
                  @if (showError('phone')) { <small class="field-error">{{ ar ? 'أدخل رقم جوال صحيحاً مع رمز الدولة.' : 'Enter a valid phone number with country code.' }}</small> }
                </label>
                <label class="field">
                  <span>{{ ar ? 'الخدمة القانونية' : 'Legal service' }} <small>{{ ar ? 'اختياري' : 'Optional' }}</small></span>
                  <select formControlName="service">
                    <option value="">{{ ar ? 'اختر الخدمة الأقرب لاحتياجك' : 'Choose the service you need' }}</option>
                    @for (service of services; track service._id) { <option [value]="service._id">{{ service.title }}</option> }
                  </select>
                  @if (loadingServices) { <small class="field-hint">{{ ar ? 'جارٍ تحميل الخدمات…' : 'Loading services…' }}</small> }
                  @else if (serviceLoadError) { <small class="field-hint">{{ serviceLoadMessage }} {{ ar ? 'يمكنك المتابعة دون اختيار خدمة.' : 'You can continue without selecting a service.' }}</small> }
                </label>
                @if (form.touched && form.controls.preferredDate.invalid) { <p class="field-error" role="alert">{{ ar ? 'اختر تاريخاً للموعد.' : 'Select an appointment date.' }}</p> }
                @if (form.touched && form.controls.preferredTime.invalid) { <p class="field-error" role="alert">{{ ar ? 'اختر وقتاً للموعد.' : 'Select an appointment time.' }}</p> }
                @if (submitError) { <p class="submit-error" role="alert">{{ submitError }}</p> }
                <button class="submit-button" type="submit" [disabled]="submitting">
                  <span>{{ submitting ? (ar ? 'جارٍ إرسال الطلب…' : 'Sending your request…') : (ar ? 'احجز استشارتك الآن' : 'Book your consultation') }}</span><span aria-hidden="true">↗</span>
                </button>
                <p class="privacy-note">{{ ar ? 'ستُستخدم بياناتك للتواصل معك بشأن هذا الطلب فقط.' : 'Your details will only be used to follow up on this request.' }}</p>
              }
            </form>
          }
        </section>
      </section>
      <app-site-footer />
    </main>
  `,
  styles: [`
    :host{display:block;--ink:#171717;--muted:#747474;--line:#e5e5e5;--gold:#aa8e5d;color:var(--ink)}
    .booking-page{min-height:100vh;background:#f5f5f4;font-family:var(--font)}
    .booking-shell{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.9fr);gap:clamp(42px,7vw,100px);align-items:center;max-width:1380px;min-height:calc(100vh - 88px);margin:auto;padding:clamp(48px,7vw,96px) clamp(24px,7vw,100px);overflow:hidden}
    .booking-intro{position:relative;isolation:isolate;max-width:650px}.eyebrow{margin:0 0 20px;color:var(--gold);font-size:13px;font-weight:700;letter-spacing:.14em}.booking-intro h1{max-width:650px;margin:0;font-size:clamp(48px,5.5vw,74px);line-height:1.24;letter-spacing:-.035em}.is-ar .booking-intro h1{font-size:clamp(44px,5vw,66px);line-height:1.45;letter-spacing:0}.booking-lead{max-width:560px;margin:20px 0 36px;color:var(--muted);font-size:18px;line-height:1.9}.is-ar .booking-lead{font-size:20px;line-height:1.95}
    .booking-points{display:grid;border-top:1px solid var(--line)}.booking-points>div{display:flex;align-items:center;gap:18px;min-height:62px;border-bottom:1px solid var(--line)}.booking-points span{color:var(--gold);font-size:12px;letter-spacing:.08em}.booking-points p{margin:0;color:#494949;font-size:15px;line-height:1.7}.booking-contact{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin-top:26px;color:var(--muted);font-size:14px}.booking-contact a{display:inline-flex;gap:10px;color:#80683f;font-weight:700}.booking-contact a:hover{text-decoration:underline}.booking-watermark{position:absolute;z-index:-1;inset-inline-end:-35px;bottom:-30px;width:clamp(190px,22vw,300px);opacity:.035;pointer-events:none}
    .booking-panel{padding:clamp(26px,3.5vw,42px);background:#fff;border:1px solid #e6e6e4;border-radius:14px;box-shadow:0 25px 70px #0000000b}.panel-heading{margin-bottom:28px}.step-label{display:inline-flex;align-items:center;gap:10px;color:#8a7047;font-size:12px;font-weight:700;letter-spacing:.12em}.step-label i{width:28px;height:1px;background:#c8b48e}.panel-heading h2,.booking-success h2{margin:14px 0 7px;font-size:clamp(29px,3vw,38px);line-height:1.4}.panel-heading>p,.booking-success>p:not(.eyebrow){margin:0;color:var(--muted);font-size:16px;line-height:1.8}.is-ar .panel-heading h2,.is-ar .booking-success h2{line-height:1.55}
    form{display:grid;gap:17px}.appointment-picker{display:grid;gap:12px}.picker-step{display:flex;align-items:center;gap:13px;margin-top:3px}.picker-step>span,.details-divider>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#f3f0e9;color:#8a7047;font-size:12px;font-weight:700}.picker-step>div{display:grid;gap:1px}.picker-step strong{font-size:15px}.picker-step small{color:#898989;font-size:12px}.time-step{margin-top:9px}.picker-trigger{display:flex;align-items:center;gap:13px;width:100%;min-height:55px;padding:0 13px;border:1px solid #dedede;border-radius:7px;background:#fff;color:#222;text-align:start;cursor:pointer;transition:border-color .18s ease,box-shadow .18s ease}.picker-trigger:hover:not(:disabled){border-color:#b79d70;box-shadow:0 0 0 3px #aa8e5d14}.picker-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:5px;background:#f3f0e9;color:#8a7047}.picker-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.picker-value{flex:1;font-size:15px;font-weight:600}.picker-value.placeholder{color:#999;font-weight:400}.picker-chevron{color:#8c8c8c;font-size:20px}.picker-disabled{opacity:.55;cursor:not-allowed}.details-divider{display:flex;align-items:center;gap:11px;margin:7px 0 0;padding-top:17px;border-top:1px solid #ececec}.details-divider strong{font-size:14px}
    .field{display:grid;gap:7px;min-width:0}.field>span{display:flex;align-items:center;gap:7px;color:#333;font-size:14px;font-weight:700}.field>span b{color:#9c574d}.field>span small{margin-inline-start:auto;color:#999;font-size:11px;font-weight:400}input,select{width:100%;height:51px;padding:0 13px;border:1px solid #dedede;border-radius:7px;background:#fcfcfc;color:#252525;font:inherit;font-size:15px;transition:border-color .2s ease,box-shadow .2s ease,background .2s ease}input::placeholder{color:#aaa}input:focus,select:focus{outline:0;border-color:var(--gold);background:#fff;box-shadow:0 0 0 4px #aa8e5d1c}input[aria-invalid=true]{border-color:#a04436}.field-hint{color:#8b857a;font-size:12px}.field-error,.submit-error{color:#a04436;font-size:13px}.submit-error{margin:0;padding:11px 13px;background:#faf2f0;border-inline-start:2px solid #a04436;line-height:1.6}.submit-button{display:flex;justify-content:space-between;align-items:center;gap:20px;width:100%;min-height:55px;margin-top:3px;padding:0 17px;border:1px solid #171717;border-radius:7px;background:#171717;color:#fff;font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}.submit-button:hover:not(:disabled){transform:translateY(-2px);background:#343434;border-color:#343434}.submit-button:disabled{opacity:.48;cursor:not-allowed}.submit-button>span:last-child{color:#d6bf96;font-size:19px}.privacy-note{margin:0;color:#898989;font-size:12px;line-height:1.65;text-align:center}
    .dialog-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:#11111175;backdrop-filter:blur(4px);animation:fade-in .18s ease}.picker-dialog{width:min(430px,100%);padding:25px;background:#fff;border:1px solid #e7e4dd;border-radius:14px;box-shadow:0 28px 90px #0003;animation:dialog-in .2s ease}.dialog-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.dialog-heading small{color:#947749;font-size:10px;font-weight:700;letter-spacing:.13em}.dialog-heading h3{margin:5px 0 0;font-size:22px}.dialog-close{display:grid;place-items:center;width:34px;height:34px;border:1px solid #e8e8e8;border-radius:50%;background:#fff;color:#555;font-size:23px;line-height:1}.dialog-close:hover{background:#f2f2f2}.calendar-nav{display:grid;grid-template-columns:38px 1fr 38px;align-items:center;margin:23px 0 13px}.calendar-nav strong{text-align:center;font-size:15px}.calendar-nav button{width:36px;height:36px;border:1px solid #e7e7e7;border-radius:6px;background:#fff;color:#252525;font-size:22px}.calendar-nav button:hover:not(:disabled){border-color:var(--gold);color:#8a7047}.calendar-nav button:disabled{opacity:.35;cursor:not-allowed}.calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;text-align:center}.weekday{display:grid;place-items:center;height:34px;color:#888;font-size:11px;font-weight:700}.calendar-day,.calendar-empty{display:grid;place-items:center;aspect-ratio:1;border:0;border-radius:8px;background:transparent;color:#292929;font:inherit;font-size:14px}.calendar-day:not(:disabled):hover{background:#f2eee6;color:#715a35}.calendar-day.selected{background:#1d1d1d;color:#fff;font-weight:700}.calendar-day:disabled{color:#c7c7c7;cursor:not-allowed}.dialog-hint{margin:18px 0 0;padding-top:14px;border-top:1px solid #ededed;color:#838383;font-size:12px;line-height:1.7}.time-dialog{max-width:390px}.time-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:22px}.time-options button{min-height:43px;border:1px solid #e4e4e4;border-radius:7px;background:#fff;color:#333;font:inherit;font-size:14px}.time-options button:hover{border-color:var(--gold);background:#faf8f3}.time-options button.selected{border-color:#171717;background:#171717;color:#fff}
    .booking-success{display:flex;flex-direction:column;align-items:flex-start;min-height:400px;justify-content:center}.success-icon{display:grid;place-items:center;width:54px;height:54px;margin-bottom:23px;border-radius:50%;background:#f2efe8;color:#8a7047;font-size:25px}.booking-success .eyebrow{margin-bottom:3px}.booking-success>p:not(.eyebrow){max-width:440px}.booking-success>small{margin-top:20px;color:#827b6e;font-size:12px;overflow-wrap:anywhere}.booking-success .submit-button{margin-top:28px}
    @keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes dialog-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @media(max-width:960px){.booking-shell{grid-template-columns:minmax(0,1fr) minmax(370px,.95fr);gap:34px;padding-inline:30px}.booking-intro h1{font-size:clamp(43px,5.5vw,60px)}}
    @media(max-width:740px){.booking-shell{grid-template-columns:1fr;gap:34px;min-height:0;padding:46px 20px 64px}.booking-intro{max-width:none}.booking-intro h1{font-size:48px}.booking-page.is-ar .booking-intro h1{font-size:43px}.booking-lead{margin:15px 0 23px;font-size:16px}.booking-points>div{min-height:54px}.booking-watermark{width:145px;inset-inline-end:-25px;bottom:0}.booking-panel{padding:25px 20px;box-shadow:0 15px 45px #0000000a}.panel-heading h2{font-size:30px}.picker-dialog{padding:21px}.booking-success{min-height:320px}}
    @media(max-width:380px){.booking-shell{padding-inline:15px}.booking-panel{padding:22px 16px}.booking-intro h1{font-size:41px}.time-options{grid-template-columns:repeat(2,minmax(0,1fr))}.picker-dialog{padding:17px}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  `],
})
export class ConsultationBookingPageComponent {
  readonly i18n = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly consultations = inject(ConsultationService);
  readonly today = this.localDate(new Date());
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[0-9+\-\s()]{6,30}$/)]],
    service: [''],
    preferredDate: ['', Validators.required],
    preferredTime: ['', Validators.required],
  });
  calendarOpen = false;
  timeOpen = false;
  private displayedMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  services: PublicServiceOption[] = [];
  loadingServices = true;
  serviceLoadError = false;
  serviceLoadMessage = '';
  submitting = false;
  submitted = false;
  submitError = '';
  confirmationNumber = '';
  readonly timeSlots = Array.from({ length: 16 }, (_, index) => {
    const minutes = 9 * 60 + index * 30;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });

  constructor() {
    this.api.get<{ items: PublicServiceOption[] }>('/services').subscribe({
      next: (response) => { this.services = response.data.items ?? []; this.loadingServices = false; },
      error: (error) => { this.loadingServices = false; this.serviceLoadError = true; this.serviceLoadMessage = this.i18n.errorMessage(error); },
    });
  }

  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  get monthLabel(): string { return new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { month: 'long', year: 'numeric' }).format(this.displayedMonth); }
  get weekdayLabels(): string[] {
    const base = new Date(2026, 7, 2);
    return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { weekday: 'short' }).format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + index)));
  }
  get calendarDays(): Array<CalendarDay | null> {
    const year = this.displayedMonth.getFullYear();
    const month = this.displayedMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const chosen = this.form.controls.preferredDate.value;
    const days: Array<CalendarDay | null> = Array.from({ length: firstWeekday }, () => null);
    for (let number = 1; number <= count; number++) {
      const value = this.localDate(new Date(year, month, number));
      const date = new Date(year, month, number);
      days.push({ value, number, label: new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { dateStyle: 'full' }).format(date), disabled: value < this.today, selected: value === chosen });
    }
    return days;
  }
  get isCurrentMonth(): boolean {
    const now = new Date();
    return this.displayedMonth.getFullYear() === now.getFullYear() && this.displayedMonth.getMonth() === now.getMonth();
  }
  get selectedDateLabel(): string {
    const value = this.form.controls.preferredDate.value;
    return value ? this.formatDate(value) : '';
  }
  showError(field: 'name' | 'phone'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }
  changeMonth(amount: number): void {
    this.displayedMonth = new Date(this.displayedMonth.getFullYear(), this.displayedMonth.getMonth() + amount, 1);
  }
  selectDate(value: string): void {
    this.form.controls.preferredDate.setValue(value);
    this.form.controls.preferredTime.reset('');
    this.calendarOpen = false;
    this.timeOpen = true;
  }
  selectTime(value: string): void {
    this.form.controls.preferredTime.setValue(value);
    this.timeOpen = false;
  }
  formatDate(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(year, month - 1, day));
  }
  formatTime(value: string): string {
    const [hour, minute] = value.split(':').map(Number);
    return new Intl.DateTimeFormat(this.ar ? 'ar' : 'en', { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, hour, minute));
  }
  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.submitError = '';
    const value = this.form.getRawValue();
    this.consultations.create({
      name: value.name.trim(),
      phone: value.phone.trim(),
      service: value.service || null,
      preferredDate: value.preferredDate,
      preferredTime: value.preferredTime,
    }).pipe(finalize(() => this.submitting = false)).subscribe({
      next: (response) => {
        this.confirmationNumber = (response.data.consultation as CreatedConsultation | undefined)?._id ?? '';
        this.submitted = true;
        this.form.reset();
      },
      error: (error: { error?: { message?: string } }) => {
        this.submitError = error.error?.message || (this.ar
          ? 'تعذر إرسال الطلب الآن. تحقق من اتصالك وحاول مرة أخرى.'
          : 'We could not send your request. Please check your connection and try again.');
      },
    });
  }
  startAnother(): void {
    this.submitted = false;
    this.confirmationNumber = '';
    this.displayedMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }
  private localDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
