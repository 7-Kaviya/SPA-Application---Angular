// modules/auth/components/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <div class="login-page">

      <!-- Geometric background -->
      <div class="bg-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <div class="login-container animate-fade-up">

        <!-- Brand -->
        <div class="brand">
          <div class="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="#5B8AF5"/>
              <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="white" opacity="0.9"/>
              <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="white" opacity="0.55"/>
            </svg>
          </div>
          <div>
            <h1 class="brand-name">Nexus Platform</h1>
            <p class="brand-tagline">Enterprise Management Suite</p>
          </div>
        </div>

        <!-- Card -->
        <div class="login-card">
          <div class="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your workspace</p>
          </div>

          <!-- Error banner -->
          <div class="error-banner" *ngIf="errorMessage">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#FB7185" stroke-width="1.5"/>
              <path d="M8 5v3M8 11v.5" stroke="#FB7185" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ errorMessage }}
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>

            <!-- User ID -->
            <div class="form-group">
              <label for="userId">User ID</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input id="userId" class="input input--icon"
                  formControlName="userId"
                  type="text"
                  placeholder="e.g. admin01"
                  autocomplete="username"/>
              </div>
              <span class="form-error" *ngIf="f['userId'].touched && f['userId'].errors?.['required']">
                User ID is required
              </span>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input id="password" class="input input--icon"
                  formControlName="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  autocomplete="current-password"/>
                <button type="button" class="pw-toggle" (click)="showPassword = !showPassword">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path *ngIf="!showPassword" d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                    <circle *ngIf="!showPassword" cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                    <path *ngIf="showPassword" d="M2 2l12 12M6.5 6.6A2 2 0 0110 8a2 2 0 01-.6 1.4M4 4.2C2.5 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <span class="form-error" *ngIf="f['password'].touched && f['password'].errors?.['required']">
                Password is required
              </span>
            </div>

            <!-- Role -->
            <div class="form-group">
              <label>Sign in as</label>
              <div class="role-selector">
                <label class="role-option" [class.role-option--selected]="f['role'].value === 'general_user'">
                  <input type="radio" formControlName="role" value="general_user"/>
                  <div class="role-icon role-icon--user">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="6" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M2 16c0-3.866 3.134-6 7-6s7 2.134 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span>General User</span>
                </label>
                <label class="role-option" [class.role-option--selected]="f['role'].value === 'admin'">
                  <input type="radio" formControlName="role" value="admin"/>
                  <div class="role-icon role-icon--admin">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2l2.5 5.5L17 8.5l-4 3.9.95 5.5L9 15.5l-4.95 2.4.95-5.5-4-3.9 5.5-1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>Administrator</span>
                </label>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn--primary btn--lg w-full" [disabled]="isLoading">
              <div class="spinner" *ngIf="isLoading"></div>
              <span>{{ isLoading ? 'Authenticating…' : 'Sign In' }}</span>
            </button>

          </form>

          <!-- Demo credentials hint -->
          <div class="demo-hint">
            <p class="demo-hint-title">Demo Credentials</p>
            <div class="demo-creds">
              <div class="demo-cred" (click)="fillAdmin()">
                <span class="badge badge--admin">Admin</span>
                <span class="text-mono">admin01 / Admin123</span>
              </div>
              <div class="demo-cred" (click)="fillUser()">
                <span class="badge badge--general_user">User</span>
                <span class="text-mono">user01 / User123</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      position: relative;
      overflow: hidden;
    }

    .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }
    .orb-1 { width: 500px; height: 500px; background: rgba(91,138,245,0.12); top: -150px; right: -100px; }
    .orb-2 { width: 400px; height: 400px; background: rgba(167,139,250,0.1); bottom: -100px; left: -100px; }
    .orb-3 { width: 300px; height: 300px; background: rgba(34,211,238,0.07); top: 40%; left: 40%; }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
      justify-content: center;
    }

    .brand-logo {
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(91,138,245,0.4);
    }

    .brand-name {
      font-size: 20px; font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      line-height: 1;
    }
    .brand-tagline { font-size: 12px; color: var(--text-muted); margin-top: 3px; }

    .login-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 36px;
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(91,138,245,0.06);
    }

    .login-header {
      margin-bottom: 28px;
      h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; }
      p  { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }
    }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: var(--rose-soft);
      border: 1px solid rgba(251,113,133,0.25);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      margin-bottom: 20px;
      font-size: 14px;
      color: var(--rose);
      animation: fadeUp 0.2s ease;
    }

    .input-wrap { position: relative; }
    .input-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      color: var(--text-muted); pointer-events: none;
    }
    .input--icon { padding-left: 38px !important; }
    .pw-toggle {
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); padding: 4px;
      transition: color var(--transition);
      &:hover { color: var(--text-secondary); }
    }

    .role-selector {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
      input[type=radio] { display: none; }
    }

    .role-option {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition);
      font-size: 14px; font-weight: 500;

      &:hover { border-color: var(--accent); background: var(--accent-soft); }

      &--selected {
        border-color: var(--accent);
        background: var(--accent-soft);
        color: var(--accent);
      }
    }

    .role-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;

      &--user  { background: var(--accent-soft); color: var(--accent); }
      &--admin { background: var(--purple-soft); color: var(--purple); }
    }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .demo-hint {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .demo-hint-title {
      font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--text-muted);
      margin-bottom: 10px;
    }
    .demo-creds { display: flex; flex-direction: column; gap: 8px; }
    .demo-cred {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: border-color var(--transition);
      font-size: 13px; color: var(--text-secondary);

      &:hover { border-color: var(--border-strong); color: var(--text-primary); }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.auth.getCurrentUser()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      userId:   ['', Validators.required],
      password: ['', Validators.required],
      role:     ['general_user', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.loginForm.value).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMessage = err.error?.error || 'Authentication failed. Please try again.';
      }
    });
  }

  fillAdmin(): void {
    this.loginForm.patchValue({ userId: 'admin01', password: 'Admin123', role: 'admin' });
  }

  fillUser(): void {
    this.loginForm.patchValue({ userId: 'user01', password: 'User123', role: 'general_user' });
  }
}
