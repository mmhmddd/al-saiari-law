import { Injectable, inject } from '@angular/core'; import { API_ENDPOINTS } from '../constants/api-endpoints'; import { ApiService } from './api.service';
@Injectable({ providedIn: 'root' }) export class HomepageService { private api=inject(ApiService); get(){return this.api.get<{homepage:unknown}>(API_ENDPOINTS.homepage);} save(body:unknown){return this.api.put(API_ENDPOINTS.homepage,body);} }
