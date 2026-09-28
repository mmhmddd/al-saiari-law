import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { languageGuard } from './core/guards/language.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ar' },
  { path: 'login', pathMatch: 'full', redirectTo: 'ar/login' },
  { path: 'register', pathMatch: 'full', redirectTo: 'ar/register' },
  { path: 'forgot-password', pathMatch: 'full', redirectTo: 'ar/forgot-password' },
  { path: 'reset-password/:token', pathMatch: 'full', redirectTo: 'ar/reset-password/:token' },
  {
    path: ':lang', canActivate: [languageGuard], children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public-page.component').then((m) => m.PublicPageComponent) },
      { path: 'login', canActivate: [guestGuard], data: { mode: 'login' }, loadComponent: () => import('./features/auth/pages/login/login-page.component').then((m) => m.LoginPageComponent) },
      { path: 'register', canActivate: [guestGuard], data: { mode: 'register' }, loadComponent: () => import('./features/auth/pages/register/register-page.component').then((m) => m.RegisterPageComponent) },
      { path: 'forgot-password', canActivate: [guestGuard], data: { mode: 'forgot' }, loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password-page.component').then((m) => m.ForgotPasswordPageComponent) },
      { path: 'reset-password/:token', canActivate: [guestGuard], data: { mode: 'reset' }, loadComponent: () => import('./features/auth/pages/reset-password/reset-password-page.component').then((m) => m.ResetPasswordPageComponent) },
      {
        path: 'admin', canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./layouts/admin-shell.component').then((m) => m.AdminShellComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          { path: 'dashboard', data: { section: 'dashboard' }, loadComponent: () => import('./features/admin/pages/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent) },
          { path: 'users', data: { section: 'users' }, loadComponent: () => import('./features/admin/pages/users/users-page.component').then((m) => m.UsersPageComponent) },
          { path: 'consultations', data: { section: 'consultations' }, loadComponent: () => import('./features/admin/pages/consultations/consultations-page.component').then((m) => m.ConsultationsPageComponent) },
          { path: 'consultations/:id', data: { section: 'consultations' }, loadComponent: () => import('./features/admin/pages/consultations/consultations-page.component').then((m) => m.ConsultationsPageComponent) },
          { path: 'articles', data: { section: 'articles' }, loadComponent: () => import('./features/admin/pages/articles/articles-page.component').then((m) => m.ArticlesPageComponent) },
          { path: 'articles/create', data: { section: 'articles', create: true }, loadComponent: () => import('./features/admin/pages/articles/article-create-page.component').then((m) => m.ArticleCreatePageComponent) },
          { path: 'services', data: { section: 'services' }, loadComponent: () => import('./features/admin/pages/services/services-page.component').then((m) => m.ServicesPageComponent) },
          { path: 'homepage', data: { section: 'homepage' }, loadComponent: () => import('./features/admin/pages/homepage/homepage-page.component').then((m) => m.HomepagePageComponent) },
          { path: 'settings', data: { section: 'settings' }, loadComponent: () => import('./features/admin/pages/settings/settings-page.component').then((m) => m.SettingsPageComponent) },
          { path: 'notifications', data: { section: 'notifications' }, loadComponent: () => import('./features/admin/pages/notifications/notifications-page.component').then((m) => m.NotificationsPageComponent) },
        ],
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: 'ar' },
];
