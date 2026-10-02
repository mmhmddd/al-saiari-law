import { Injectable, inject } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiService } from './api.service';

export interface CreateConsultationRequest {
  name: string;
  phone: string;
  service?: string | null;
  preferredDate?: string;
  preferredTime?: string;
}

export interface ConsultationRecord { _id: string; name: string; phone: string; status: string; }

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private api = inject(ApiService);
  create(body: CreateConsultationRequest) {
    return this.api.post<{ consultation: ConsultationRecord }>('/consultations', body);
  }
  list(q: Record<string, string | number | undefined> = {}) {
    return this.api.get<{ items: unknown[]; pagination: unknown }>(API_ENDPOINTS.consultations, q);
  }
  get(id: string) { return this.api.get<{ consultation: unknown }>(`${API_ENDPOINTS.consultations}/${id}`); }
  updateStatus(id: string, status: string) { return this.api.patch(`${API_ENDPOINTS.consultations}/${id}/status`, { status }); }
  remove(id: string) { return this.api.delete(`${API_ENDPOINTS.consultations}/${id}`); }
}
