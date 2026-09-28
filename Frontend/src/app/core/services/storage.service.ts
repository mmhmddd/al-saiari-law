import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: 'token' | 'user' | 'language'): string | null { return localStorage.getItem(`alsaiari.${key}`); }
  set(key: 'token' | 'user' | 'language', value: string): void { localStorage.setItem(`alsaiari.${key}`, value); }
  clear(): void { localStorage.removeItem('alsaiari.token'); localStorage.removeItem('alsaiari.user'); }
}
