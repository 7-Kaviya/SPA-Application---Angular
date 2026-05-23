// core/services/records.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, RecordsResponse } from '../models';

export interface RecordFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class RecordsService {
  constructor(private http: HttpClient) {}

  getRecords(filters: RecordFilters = {}): Observable<ApiResponse<RecordsResponse>> {
    let params = new HttpParams();

    if (filters.status)   params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search)   params = params.set('search', filters.search);

    // Async delay parameter — showcases async processing
    const delay = filters.delay ?? environment.apiDelay;
    if (delay > 0) params = params.set('delay', delay.toString());

    return this.http.get<ApiResponse<RecordsResponse>>(`${environment.apiUrl}/records`, { params });
  }
}
