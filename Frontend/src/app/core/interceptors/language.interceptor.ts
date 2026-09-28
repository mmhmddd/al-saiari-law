import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language.service';
export const languageInterceptor: HttpInterceptorFn = (request, next) => next(request.clone({
  setHeaders: { 'Accept-Language': inject(LanguageService).locale() },
}));
