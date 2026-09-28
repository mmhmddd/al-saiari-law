import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LanguageService } from '../core/services/language.service';
import { NotificationService } from '../core/services/notification.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-shell', standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-frame" [attr.dir]="i18n.direction()">
      <aside class="sidebar" [class.open]="menuOpen()">
        <a class="brand" [routerLink]="link('admin/dashboard')" [attr.aria-label]="i18n.t('brand.name')">
          <img src="assets/brand/al-saiari-logo.png" [alt]="i18n.t('brand.name')"><span>AL SAIARI<small>{{i18n.t('brand.admin')}}</small></span>
        </a>
        <nav [attr.aria-label]="i18n.t('nav.overview')">
          <small class="nav-label">{{i18n.t('nav.overview')}}</small><a [routerLink]="link('admin/dashboard')" routerLinkActive="active"><span class="nav-icon">▦</span>{{i18n.t('nav.dashboard')}}</a>
          <small class="nav-label">{{i18n.t('nav.content')}}</small><a [routerLink]="link('admin/homepage')" routerLinkActive="active"><span class="nav-icon">⌂</span>{{i18n.t('nav.homepage')}}</a><a [routerLink]="link('admin/articles')" routerLinkActive="active"><span class="nav-icon">▤</span>{{i18n.t('nav.articles')}}</a><a [routerLink]="link('admin/services')" routerLinkActive="active"><span class="nav-icon">◇</span>{{i18n.t('nav.services')}}</a>
          <small class="nav-label">{{i18n.t('nav.management')}}</small><a [routerLink]="link('admin/consultations')" routerLinkActive="active"><span class="nav-icon">▣</span>{{i18n.t('nav.consultations')}}</a><a [routerLink]="link('admin/users')" routerLinkActive="active"><span class="nav-icon">♙</span>{{i18n.t('nav.users')}}</a><a [routerLink]="link('admin/notifications')" routerLinkActive="active"><span class="nav-icon">♢</span>{{i18n.t('nav.notifications')}}<b *ngIf="unread()">{{unread()}}</b></a>
          <small class="nav-label">{{i18n.t('nav.system')}}</small><a [routerLink]="link('admin/settings')" routerLinkActive="active"><span class="nav-icon">⚙</span>{{i18n.t('nav.settings')}}</a>
        </nav>
        <div class="sidebar-foot"><div class="avatar">{{auth.currentUser()?.name?.slice(0,1)}}</div><div class="account"><strong>{{auth.currentUser()?.name}}</strong><small>{{i18n.t('nav.admin')}}</small></div><button class="icon-button" [attr.aria-label]="i18n.t('nav.signOut')" (click)="logout()">↪</button></div>
      </aside>
      <section class="workspace"><header class="topbar"><button class="icon-button menu-toggle" (click)="menuOpen.set(!menuOpen())" [attr.aria-label]="i18n.t('nav.overview')">☰</button><div><small class="eyebrow">{{i18n.t('brand.name')}}</small><strong>{{i18n.t('nav.administration')}}</strong></div><div class="top-actions"><a class="text-link" [href]="siteUrl" target="_blank" rel="noopener">{{i18n.t('nav.viewWebsite')}} ↗</a><button class="lang-button" (click)="toggleLanguage()">{{i18n.t('language.switch')}}</button><a class="icon-button bell" [routerLink]="link('admin/notifications')" [attr.aria-label]="i18n.t('nav.notifications')">♢<i *ngIf="unread()"></i></a><span class="avatar top-avatar">{{auth.currentUser()?.name?.slice(0,1)}}</span></div></header><main class="page-area"><router-outlet /></main></section>
    </div>`,
})
export class AdminShellComponent {
  readonly auth = inject(AuthService); readonly i18n = inject(LanguageService); private readonly router = inject(Router);
  private readonly notices = inject(NotificationService); readonly unread = signal(0); readonly menuOpen = signal(false);
  readonly siteUrl = environment.publicSiteUrl;
  constructor() { this.notices.count().subscribe({ next: (result) => this.unread.set(result.data.count), error: () => this.unread.set(0) }); }
  link(path: string): string { return `/${this.i18n.locale()}/${path}`; }
  toggleLanguage(): void { this.i18n.setLocale(this.i18n.locale() === 'ar' ? 'en' : 'ar'); }
  logout(): void { this.auth.logout(); this.router.navigate([this.link('login')]); }
}
