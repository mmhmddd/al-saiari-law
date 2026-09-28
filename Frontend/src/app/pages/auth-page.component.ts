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
    <main class="auth-screen" [attr.dir]="i18n.direction()"><section class="auth-brand"><img src="assets/brand/al-saiari-logo.png" [alt]="i18n.t('brand.name')"><p>{{i18n.locale()==='ar'?'تميز قانوني مبني على الثقة':'LEGAL EXCELLENCE BUILT ON TRUST'}}</p><span>{{i18n.t('brand.name')}}</span></section>
      <section class="auth-panel"><div class="auth-card"><small class="eyebrow">{{i18n.t('brand.admin')}}</small><h1>{{heading}}</h1><p class="muted">{{subheading}}</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label *ngIf="mode==='register'">{{i18n.t('auth.name')}}<input formControlName="name" autocomplete="name"></label>
          <label *ngIf="mode!=='reset'">{{i18n.t('auth.email')}}<input type="email" formControlName="email" autocomplete="email"></label>
          <label *ngIf="mode==='login'||mode==='register'">{{i18n.t('auth.password')}}<input type="password" formControlName="password" [attr.autocomplete]="mode==='login'?'current-password':'new-password'"></label>
          <label *ngIf="mode==='reset'">{{i18n.t('auth.newPassword')}}<input type="password" formControlName="password" autocomplete="new-password"></label>
          <label *ngIf="mode==='register'||mode==='reset'">{{i18n.t('auth.confirm')}}<input type="password" formControlName="confirm" autocomplete="new-password"></label>
          <div class="form-error" *ngIf="error" role="alert">{{error}}</div><div class="form-success" *ngIf="success" role="status">{{success}}</div>
          <button class="primary-button wide" [disabled]="busy||form.invalid">{{busy?i18n.t('auth.wait'):buttonText}}</button>
        </form>
        <div class="auth-links"><a *ngIf="mode==='login'" [routerLink]="link('forgot-password')">{{i18n.t('auth.forgotLink')}}</a><a *ngIf="mode==='login'" [routerLink]="link('register')">{{i18n.t('auth.createLink')}}</a><a *ngIf="mode!=='login'" [routerLink]="link('login')">{{i18n.t('auth.back')}}</a></div>
      </div></section>
    </main>`,
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder); private readonly auth = inject(AuthService); private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); readonly i18n = inject(LanguageService);
  readonly mode = String(this.route.snapshot.data['mode'] || 'login'); busy = false; error = ''; success = '';
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
  link(path: string): string { return `/${this.i18n.locale()}/${path}`; }
  submit(): void {
    this.error = ''; this.success = ''; this.busy = true; const value = this.form.getRawValue();
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
