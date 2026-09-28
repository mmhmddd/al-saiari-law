import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;
  get<T>(path: string, query: Record<string, string | number | boolean | undefined> = {}): Observable<ApiResponse<T>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) if (value !== undefined) params = params.set(key, String(value));
    return this.http.get<ApiResponse<T>>(this.base + path, { params });
  }
  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> { return this.http.post<ApiResponse<T>>(this.base + path, body); }
  put<T>(path: string, body: unknown): Observable<ApiResponse<T>> { return this.http.put<ApiResponse<T>>(this.base + path, body); }
  patch<T>(path: string, body: unknown = {}): Observable<ApiResponse<T>> { return this.http.patch<ApiResponse<T>>(this.base + path, body); }
  delete<T>(path: string): Observable<ApiResponse<T>> { return this.http.delete<ApiResponse<T>>(this.base + path); }
}
