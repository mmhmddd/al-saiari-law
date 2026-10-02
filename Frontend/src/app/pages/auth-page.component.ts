import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { API_ENDPOINTS } from '../core/constants/api-endpoints';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-auth-page', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-screen" [attr.dir]="i18n.direction()">
      <section class="auth-brand">
        <div class="auth-brand-inner">
          <span class="auth-brand-monogram" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /></span>
          <img src="assets/brand/al-saiari-logo.png" [alt]="i18n.t('brand.name')">
          <span class="auth-brand-rule"></span>
          <p>{{i18n.locale()==='ar'?'تميز قانوني مبني على الثقة':'LEGAL EXCELLENCE BUILT ON TRUST'}}</p>
          <small>{{i18n.locale()==='ar'?'بوابة آمنة لإدارة المكتب':'A secure portal for your firm'}}</small>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <header class="auth-heading">
            <span class="auth-kicker"><i></i>{{i18n.t('brand.admin')}}</span>
            <h1>{{heading}}</h1><p class="muted">{{subheading}}</p>
          </header>
          <form [formGroup]="form" (ngSubmit)="submit()" [attr.aria-busy]="busy" novalidate>
            <label *ngIf="mode==='register'">{{i18n.t('auth.name')}}
              <input formControlName="name" autocomplete="name" [class.invalid]="form.controls.name.invalid&&form.controls.name.touched">
              <small class="field-error" *ngIf="form.controls.name.invalid&&form.controls.name.touched">{{fieldRequired}}</small>
            </label>
            <label *ngIf="mode!=='reset'">{{i18n.t('auth.email')}}
              <input type="email" formControlName="email" autocomplete="email" [class.invalid]="form.controls.email.invalid&&form.controls.email.touched">
              <small class="field-error" *ngIf="form.controls.email.touched&&form.controls.email.errors?.['required']">{{fieldRequired}}</small>
              <small class="field-error" *ngIf="form.controls.email.touched&&form.controls.email.errors?.['email']">{{invalidEmail}}</small>
            </label>
            <label *ngIf="mode==='login'||mode==='register'||mode==='reset'">{{mode==='reset'?i18n.t('auth.newPassword'):i18n.t('auth.password')}}
              <span class="password-field"><input [type]="passwordVisible?'text':'password'" formControlName="password" [attr.autocomplete]="mode==='login'?'current-password':'new-password'" [class.invalid]="form.controls.password.invalid&&form.controls.password.touched">
                <button type="button" class="password-toggle" (click)="passwordVisible=!passwordVisible" [attr.aria-label]="passwordVisible?hidePassword:showPassword"><svg *ngIf="!passwordVisible" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><svg *ngIf="passwordVisible" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"/></svg></button>
              </span>
              <small class="field-hint" *ngIf="mode==='register'||mode==='reset'">{{passwordHint}}</small>
              <small class="field-error" *ngIf="form.controls.password.touched&&form.controls.password.errors?.['required']">{{fieldRequired}}</small>
              <small class="field-error" *ngIf="form.controls.password.touched&&form.controls.password.errors?.['minlength']">{{passwordLengthHint}}</small>
              <small class="field-error" *ngIf="form.controls.password.touched&&form.controls.password.errors?.['pattern']">{{passwordNumberHint}}</small>
            </label>
            <label *ngIf="mode==='register'||mode==='reset'">{{i18n.t('auth.confirm')}}
              <span class="password-field"><input [type]="confirmVisible?'text':'password'" formControlName="confirm" autocomplete="new-password" [class.invalid]="form.controls.confirm.invalid&&form.controls.confirm.touched">
                <button type="button" class="password-toggle" (click)="confirmVisible=!confirmVisible" [attr.aria-label]="confirmVisible?hidePassword:showPassword"><svg *ngIf="!confirmVisible" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><svg *ngIf="confirmVisible" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"/></svg></button>
              </span>
              <small class="field-error" *ngIf="form.controls.confirm.touched&&form.controls.confirm.invalid">{{fieldRequired}}</small>
              <small class="field-error" *ngIf="form.controls.confirm.touched&&form.controls.confirm.valid&&form.controls.confirm.value!==form.controls.password.value">{{i18n.t('auth.mismatch')}}</small>
            </label>
            <div class="auth-alert form-error" *ngIf="error" role="alert"><span>!</span>{{error}}</div>
            <div class="auth-alert form-success" *ngIf="success" role="status"><span>✓</span>{{success}}</div>
            <button class="primary-button wide auth-submit" [disabled]="busy"><span>{{busy?i18n.t('auth.wait'):buttonText}}</span><svg *ngIf="!busy" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          </form>
          <div class="auth-links"><a *ngIf="mode==='login'" [routerLink]="link('forgot-password')">{{i18n.t('auth.forgotLink')}}</a><a *ngIf="mode==='login'" [routerLink]="link('register')">{{i18n.t('auth.createLink')}}</a><a *ngIf="mode!=='login'" [routerLink]="link('login')">{{i18n.t('auth.back')}}</a></div>
          <div class="auth-secure"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>{{i18n.locale()==='ar'?'اتصال آمن ومشفّر':'Secure, encrypted sign-in'}}</div>
        </div>
      </section>
    </main>`,
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder); private readonly auth = inject(AuthService); private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); readonly i18n = inject(LanguageService);
  readonly mode = String(this.route.snapshot.data['mode'] || 'login'); busy = false; error = ''; success = ''; passwordVisible = false; confirmVisible = false;
  readonly form = this.fb.group({ name: [''], email: ['', [Validators.required, Validators.email]], password: [''], confirm: [''] });

  constructor() {
    const strongPassword = [Validators.required, Validators.minLength(8), Validators.pattern(/.*\d.*/)];
    if (this.mode === 'register') { this.form.controls.name.addValidators(Validators.required); this.form.controls.password.addValidators(strongPassword); this.form.controls.confirm.addValidators(Validators.required); }
    if (this.mode === 'login') this.form.controls.password.addValidators(Validators.required);
    if (this.mode === 'reset') { this.form.controls.password.addValidators(strongPassword); this.form.controls.confirm.addValidators(Validators.required); }
    this.form.updateValueAndValidity();
  }
  get heading(): string { return this.i18n.t(({ login: 'auth.welcome', register: 'auth.registerTitle', forgot: 'auth.forgotTitle', reset: 'auth.resetTitle' } as Record<string, string>)[this.mode]); }
  get subheading(): string { return this.i18n.t(this.mode === 'login' ? 'auth.loginSub' : 'auth.continueSub'); }
  get buttonText(): string { return this.i18n.t(({ login: 'auth.login', register: 'auth.register', forgot: 'auth.forgot', reset: 'auth.reset' } as Record<string, string>)[this.mode]); }
  get showPassword(): string { return this.i18n.locale() === 'ar' ? 'إظهار كلمة المرور' : 'Show password'; }
  get hidePassword(): string { return this.i18n.locale() === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password'; }
  get fieldRequired(): string { return this.i18n.locale() === 'ar' ? 'هذا الحقل مطلوب.' : 'This field is required.'; }
  get invalidEmail(): string { return this.i18n.locale() === 'ar' ? 'أدخل بريداً إلكترونياً صحيحاً.' : 'Enter a valid email address.'; }
  get passwordHint(): string { return this.i18n.locale() === 'ar' ? 'استخدم 8 أحرف على الأقل ورقماً واحداً.' : 'Use at least 8 characters and include a number.'; }
  get passwordLengthHint(): string { return this.i18n.locale() === 'ar' ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' : 'Use at least 8 characters.'; }
  get passwordNumberHint(): string { return this.i18n.locale() === 'ar' ? 'أضف رقماً واحداً على الأقل.' : 'Include at least one number.'; }
  link(path: string): string { return `/${this.i18n.locale()}/${path}`; }
  submit(): void {
    this.error = ''; this.success = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.busy = true; const value = this.form.getRawValue();
    if (this.mode === 'login') {
      this.auth.login(value.email || '', value.password || '').subscribe({ next: (user) => { this.busy = false; this.router.navigate([this.link(user.role === 'admin' ? 'admin/dashboard' : '')]); }, error: (e) => this.fail(e) }); return;
    }
    if (this.mode === 'register') {
      if (value.password !== value.confirm) { this.fail({ error: { message: this.i18n.t('auth.mismatch') } }); return; }
      this.auth.register({ name: value.name || '', email: value.email || '', password: value.password || '', passwordConfirm: value.confirm || '' }).subscribe({ next: () => { this.busy = false; this.router.navigate([this.link('')]); }, error: (e) => this.fail(e) }); return;
    }
    const request = this.mode === 'forgot'
      ? this.api.post(API_ENDPOINTS.auth.forgot, { email: value.email })
      : this.api.post(`${API_ENDPOINTS.auth.reset}/${this.route.snapshot.paramMap.get('token')}`, { password: value.password, passwordConfirm: value.confirm });
    if (this.mode === 'reset' && value.password !== value.confirm) { this.fail({ error: { message: this.i18n.t('auth.mismatch') } }); return; }
    request.pipe(finalize(() => this.busy = false)).subscribe({ next: (result) => this.success = this.i18n.backendMessage(result.message), error: (e) => this.fail(e) });
  }
  private fail(error: { error?: { message?: string } }): void { this.busy = false; this.error = this.i18n.backendMessage(error.error?.message); }
}
