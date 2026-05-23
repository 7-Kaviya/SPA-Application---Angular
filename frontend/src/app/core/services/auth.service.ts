// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthState, User, LoginRequest, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'nexus_token';
  private readonly USER_KEY  = 'nexus_user';

  private authState = new BehaviorSubject<AuthState>({
    token: localStorage.getItem(this.TOKEN_KEY),
    user:  JSON.parse(localStorage.getItem(this.USER_KEY) || 'null'),
    isAuthenticated: !!localStorage.getItem(this.TOKEN_KEY),
  });

  authState$ = this.authState.asObservable();
  isAuthenticated$ = this.authState$.pipe(map(s => s.isAuthenticated));
  currentUser$     = this.authState$.pipe(map(s => s.user));

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<ApiResponse<{ token: string; user: User }>> {
    return this.http
      .post<ApiResponse<{ token: string; user: User }>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            this.setSession(res.data.token, res.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authState.next({ token: null, user: null, isAuthenticated: false });
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.authState.value.token;
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  refreshProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`).pipe(
      tap(res => {
        if (res.success && res.data) {
          const current = this.authState.value;
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
          this.authState.next({ ...current, user: res.data });
        }
      })
    );
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authState.next({ token, user, isAuthenticated: true });
  }
}
