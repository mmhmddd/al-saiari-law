import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  constructor() {
    const user = this.storage.get('user');
    if (user) {
      try { this.currentUser.set(JSON.parse(user) as User); this.isAuthenticated.set(!!this.storage.get('token')); }
      catch { this.storage.clear(); }
    }
  }
  login(email: string, password: string): Observable<User> {
    return this.api.post<{ token: string; user: User }>(API_ENDPOINTS.auth.login, { email, password })
      .pipe(tap((result) => this.save(result.data.token, result.data.user)), map((result) => result.data.user));
  }
  register(body: { name: string; email: string; password: string; passwordConfirm: string }): Observable<User> {
    return this.api.post<{ token: string; user: User }>(API_ENDPOINTS.auth.register, body)
      .pipe(tap((result) => this.save(result.data.token, result.data.user)), map((result) => result.data.user));
  }
  refresh(): Observable<User> {
    return this.api.get<{ user: User }>(API_ENDPOINTS.auth.me).pipe(map((result) => result.data.user), tap((user) => {
      this.currentUser.set(user); this.storage.set('user', JSON.stringify(user)); this.isAuthenticated.set(true);
    }));
  }
  logout(): void {
    this.api.post<unknown>(API_ENDPOINTS.auth.logout, {}).subscribe({ error: () => undefined });
    this.storage.clear(); this.currentUser.set(null); this.isAuthenticated.set(false);
  }
  private save(token: string, user: User): void {
    this.storage.set('token', token); this.storage.set('user', JSON.stringify(user));
    this.currentUser.set(user); this.isAuthenticated.set(true);
  }
}
