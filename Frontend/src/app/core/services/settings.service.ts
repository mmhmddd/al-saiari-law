import { Injectable, inject } from '@angular/core'; import { API_ENDPOINTS } from '../constants/api-endpoints'; import { ApiService } from './api.service';
@Injectable({ providedIn: 'root' }) export class SettingsService { private api=inject(ApiService); get(){return this.api.get<{settings:unknown}>(API_ENDPOINTS.settings);} save(body:unknown){return this.api.put(API_ENDPOINTS.settings,body);} }
