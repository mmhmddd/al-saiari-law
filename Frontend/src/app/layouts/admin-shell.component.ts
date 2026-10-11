import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LanguageService } from '../core/services/language.service';
import { NotificationService } from '../core/services/notification.service';
import { Notice } from '../core/models/notification.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-shell', standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-frame" [attr.dir]="i18n.direction()">
      <aside class="sidebar" [class.open]="menuOpen()">
        <a class="brand" [routerLink]="link('admin/dashboard')" [attr.aria-label]="i18n.t('brand.name')">
          <img src="assets/brand/al-saiari-logo.png" [alt]="i18n.t('brand.name')"><span>ALSAIARI LAW FIRM<small>{{i18n.t('brand.admin')}}</small></span>
        </a>
        <nav [attr.aria-label]="i18n.t('nav.overview')">
          <small class="nav-label">{{i18n.t('nav.overview')}}</small>
          <a [routerLink]="link('admin/dashboard')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><span>{{i18n.t('nav.dashboard')}}</span></a>
          <small class="nav-label">{{i18n.t('nav.content')}}</small>
          <a [routerLink]="link('admin/articles')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 12h8M8 16h8"/></svg><span>{{i18n.t('nav.articles')}}</span></a>
          <a [routerLink]="link('admin/services')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg><span>{{i18n.t('nav.services')}}</span></a>
          <small class="nav-label">{{i18n.t('nav.management')}}</small>
          <a [routerLink]="link('admin/consultations')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/></svg><span>{{i18n.t('nav.consultations')}}</span></a>
          <a [routerLink]="link('admin/users')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 5"/></svg><span>{{i18n.t('nav.users')}}</span></a>
          <a [routerLink]="link('admin/notifications')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span>{{i18n.t('nav.notifications')}}</span><b class="nav-count" *ngIf="unread()">{{unread()>99?'99+':unread()}}</b></a>
          <small class="nav-label">{{i18n.t('nav.system')}}</small>
          <a [routerLink]="link('admin/settings')" routerLinkActive="active"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" transform="translate(-1 -1)"/></svg><span>{{i18n.t('nav.settings')}}</span></a>
        </nav>
        <div class="sidebar-foot"><div class="avatar">{{auth.currentUser()?.name?.slice(0,1)}}</div><div class="account"><strong>{{auth.currentUser()?.name}}</strong><small>{{i18n.t('nav.admin')}}</small></div><button class="icon-button signout-button" [attr.aria-label]="i18n.t('nav.signOut')" [title]="i18n.t('nav.signOut')" (click)="logout()"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></svg></button></div>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <button class="icon-button menu-toggle" (click)="menuOpen.set(!menuOpen())" [attr.aria-label]="i18n.t('nav.overview')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <div class="topbar-title"><small class="eyebrow">{{i18n.t('brand.name')}}</small><strong>{{i18n.t('nav.administration')}}</strong></div>
          <div class="top-actions"><a class="text-link" [href]="siteUrl" target="_blank" rel="noopener">{{i18n.t('nav.viewWebsite')}}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><button class="lang-button" (click)="toggleLanguage()">{{i18n.t('language.switch')}}</button><div class="notification-menu"><button type="button" class="icon-button bell" (click)="toggleNotifications()" [attr.aria-label]="i18n.t('nav.notifications')" [attr.aria-expanded]="notificationOpen()" aria-haspopup="dialog" [title]="i18n.t('nav.notifications')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span class="unread-count" *ngIf="unread()">{{unread()>99?'99+':unread()}}</span></button><section class="notification-popover" *ngIf="notificationOpen()" role="dialog" [attr.aria-label]="i18n.t('notice.title')"><header class="notification-popover-head"><div><strong>{{i18n.t('notice.title')}}</strong><small>{{unread()}} {{i18n.t('notice.unread')}}</small></div><button type="button" class="notification-refresh" (click)="refreshNotifications()" [attr.aria-label]="i18n.t('action.refresh')">↻</button></header><div *ngIf="notificationLoading()" class="notification-popover-state">{{i18n.t('common.loading')}}</div><div *ngIf="!notificationLoading()&&notificationError()" class="notification-popover-state error-text">{{i18n.t('error.loadFailed')}}</div><div *ngIf="!notificationLoading()&&!notificationError()&&!previewNotifications().length" class="notification-popover-state">{{i18n.t('notice.noItems')}}</div><button type="button" class="notification-preview-item" *ngFor="let item of previewNotifications()" [class.unread]="!item.isRead" (click)="openNotification(item)"><span class="notification-preview-dot" [class.read]="item.isRead"></span><span class="notification-preview-copy"><strong>{{item.title}}</strong><small>{{item.message}}</small><time>{{item.createdAt|date:'short'}}</time></span></button><footer class="notification-popover-foot"><button type="button" class="notification-mark-all" *ngIf="unread()" (click)="markAllNotificationsRead()">{{i18n.t('notice.markAll')}}</button><a [routerLink]="link('admin/notifications')" (click)="notificationOpen.set(false)">{{i18n.t('notice.viewAll')}} <span aria-hidden="true">→</span></a></footer></section></div><span class="avatar top-avatar">{{auth.currentUser()?.name?.slice(0,1)}}</span></div>
        </header>
        <main class="page-area"><router-outlet /></main>
      </section>
    </div>`,
})
export class AdminShellComponent implements OnDestroy {
  readonly auth = inject(AuthService); readonly i18n = inject(LanguageService); private readonly router = inject(Router);
  private readonly notices = inject(NotificationService); readonly unread = this.notices.unreadCount; readonly menuOpen = signal(false);
  readonly notificationOpen=signal(false); readonly notificationLoading=signal(false); readonly notificationError=signal(false); readonly previewNotifications=signal<Notice[]>([]);
  readonly siteUrl = environment.publicSiteUrl;
  private pollTimer:ReturnType<typeof setInterval>;
  constructor() { this.refreshNotifications(); this.pollTimer=setInterval(()=>this.notices.refreshCount(),45000); }
  ngOnDestroy():void{clearInterval(this.pollTimer)}
  @HostListener('document:click',['$event']) closeNotificationOnOutsideClick(event:MouseEvent):void{if(!(event.target as HTMLElement|null)?.closest('.notification-menu'))this.notificationOpen.set(false)}
  @HostListener('document:keydown.escape') closeNotificationOnEscape():void{this.notificationOpen.set(false)}
  toggleNotifications():void{const opening=!this.notificationOpen();this.notificationOpen.set(opening);if(opening)this.refreshNotifications()}
  refreshNotifications():void{this.notices.refreshCount();this.notificationError.set(false);this.notificationLoading.set(true);this.notices.list().subscribe({next:r=>{this.previewNotifications.set(r.data.items||[]);this.notificationLoading.set(false)},error:()=>{this.previewNotifications.set([]);this.notificationError.set(true);this.notificationLoading.set(false)}});}
  openNotification(item:Notice):void{this.notificationOpen.set(false);const open=()=>{if(item.referenceType==='consultation'&&item.referenceId)this.router.navigateByUrl(`${this.link('admin/consultations')}/${item.referenceId}`);else this.router.navigateByUrl(this.link('admin/notifications'))};if(!item.isRead)this.notices.read(item._id).subscribe({next:open,error:open});else open()}
  markAllNotificationsRead():void{this.notices.allRead().subscribe({next:()=>{this.previewNotifications.update(items=>items.map(item=>({...item,isRead:true})))},error:()=>undefined})}
  link(path: string): string { return `/${this.i18n.locale()}/${path}`; }
  toggleLanguage(): void { this.i18n.setLocale(this.i18n.locale() === 'ar' ? 'en' : 'ar'); }
  logout(): void { this.auth.logout(); this.router.navigate([this.link('login')]); }
}
