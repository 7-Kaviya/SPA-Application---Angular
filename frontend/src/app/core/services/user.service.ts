// core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User, CreateUserRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(delay?: number): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();
    if (delay !== undefined) params = params.set('delay', delay.toString());
    return this.http.get<ApiResponse<User[]>>(this.base, { params });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/${id}`);
  }

  createUser(payload: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.base, payload);
  }

  updateUser(id: string, payload: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}`, payload);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  toggleStatus(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}/toggle`, {});
  }
}
