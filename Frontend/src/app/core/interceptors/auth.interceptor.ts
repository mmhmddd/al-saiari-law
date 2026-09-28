import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const storage = inject(StorageService); const token = storage.get('token');
  const headers = request.headers;
  return next(request.clone({ headers: token ? headers.set('Authorization', `Bearer ${token}`) : headers }))
    .pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) { storage.clear(); inject(Router).navigate(['/ar/login']); }
      return throwError(() => error);
    }));
};
