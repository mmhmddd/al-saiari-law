import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { LanguageService } from '../services/language.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const storage = inject(StorageService); const token = storage.get('token');
  const i18n = inject(LanguageService);
  const headers = request.headers;
  return next(request.clone({ headers: token ? headers.set('Authorization', `Bearer ${token}`) : headers }))
    .pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) { storage.clear(); inject(Router).navigate(['/ar/login']); }
      const body = error.error && typeof error.error === 'object' ? error.error : {};
      return throwError(() => new HttpErrorResponse({
        error: { ...body, message: i18n.errorMessage(error) },
        headers: error.headers,
        status: error.status,
        statusText: error.statusText,
        url: error.url || undefined,
      }));
    }));
};
