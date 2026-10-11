import { Injectable, inject, signal } from '@angular/core'; import { tap } from 'rxjs'; import { API_ENDPOINTS } from '../constants/api-endpoints'; import { ApiService } from './api.service'; import { Notice } from '../models/notification.model';
@Injectable({ providedIn: 'root' }) export class NotificationService {
  private api=inject(ApiService);
  readonly unreadCount=signal(0);
  list(){return this.api.get<{items:Notice[];pagination:unknown}>(API_ENDPOINTS.notifications,{page:1,limit:8});}
  count(){return this.api.get<{count:number}>(`${API_ENDPOINTS.notifications}/unread-count`).pipe(tap(result=>this.unreadCount.set(result.data.count||0)));}
  refreshCount():void{this.count().subscribe({error:()=>this.unreadCount.set(0)});}
  read(id:string){return this.api.patch(`${API_ENDPOINTS.notifications}/${id}/read`).pipe(tap(()=>this.refreshCount()));}
  allRead(){return this.api.patch(`${API_ENDPOINTS.notifications}/read-all`).pipe(tap(()=>this.unreadCount.set(0)));}
  remove(id:string){return this.api.delete(`${API_ENDPOINTS.notifications}/${id}`).pipe(tap(()=>this.refreshCount()));}
}
