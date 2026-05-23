// shared/components/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  standalone: false,
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="10" fill="#5B8AF5"/>
          <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="white" opacity="0.9"/>
          <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="white" opacity="0.55"/>
        </svg>
        <span class="brand-label">Nexus</span>
      </div>

      <div class="navbar-links">
        <a class="nav-link" [class.nav-link--active]="isActive('/dashboard')" routerLink="/dashboard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Dashboard
        </a>
        <a class="nav-link nav-link--admin" *ngIf="user?.role === 'admin'"
          [class.nav-link--active]="isActive('/admin')" routerLink="/admin">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10.2 5.5L15 6.3L11.5 9.7L12.4 14.5L8 12.2L3.6 14.5L4.5 9.7L1 6.3L5.8 5.5L8 1Z"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          Admin
        </a>
      </div>

      <div class="navbar-user" (click)="menuOpen = !menuOpen" (clickOutside)="menuOpen = false">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-meta">
          <span class="user-name">{{ user?.name }}</span>
          <span class="badge" [ngClass]="'badge--' + user?.role">{{ roleLabel }}</span>
        </div>
        <svg class="chevron" [class.chevron--open]="menuOpen" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <div class="dropdown" *ngIf="menuOpen">
          <div class="dropdown-header">
            <p class="dropdown-name">{{ user?.name }}</p>
            <p class="dropdown-email">{{ user?.email }}</p>
          </div>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-item--danger" (click)="logout()">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-3-3-3M6 7.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 60px;
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 0 28px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .navbar-brand {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-label {
      font-size: 16px; font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text-primary);
    }

    .navbar-links {
      display: flex; align-items: center; gap: 4px;
      flex: 1;
    }

    .nav-link {
      display: flex; align-items: center; gap: 7px;
      padding: 6px 14px;
      border-radius: var(--radius-md);
      font-size: 14px; font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition);

      &:hover { background: var(--bg-elevated); color: var(--text-primary); }

      &--active {
        background: var(--accent-soft);
        color: var(--accent);
      }

      &--admin {
        &.nav-link--active { background: var(--purple-soft); color: var(--purple); }
        &:hover:not(.nav-link--active) { color: var(--purple); }
      }
    }

    .navbar-user {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer;
      position: relative;
      padding: 6px 10px;
      border-radius: var(--radius-md);
      transition: background var(--transition);

      &:hover { background: var(--bg-elevated); }
    }

    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }

    .user-meta {
      display: flex; flex-direction: column; gap: 2px;
    }
    .user-name { font-size: 13.5px; font-weight: 600; line-height: 1; }

    .chevron {
      color: var(--text-muted);
      transition: transform var(--transition);
      flex-shrink: 0;
      &--open { transform: rotate(180deg); }
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px); right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      min-width: 220px;
      box-shadow: var(--shadow-md);
      overflow: hidden;
      animation: fadeUp 0.15s ease;
      z-index: 100;
    }

    .dropdown-header { padding: 14px 16px; }
    .dropdown-name   { font-size: 14px; font-weight: 600; }
    .dropdown-email  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .dropdown-divider { height: 1px; background: var(--border); }

    .dropdown-item {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 16px; width: 100%;
      background: none; border: none; cursor: pointer;
      font-family: var(--font-sans); font-size: 14px;
      color: var(--text-secondary);
      transition: all var(--transition);
      text-align: left;

      &:hover { background: var(--bg-hover); color: var(--text-primary); }
      &--danger:hover { background: var(--rose-soft); color: var(--rose); }
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  menuOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => this.user = u);
  }

  get initials(): string {
    return this.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
  }

  get roleLabel(): string {
    return this.user?.role === 'admin' ? 'Admin' : 'User';
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  logout(): void {
    this.menuOpen = false;
    this.auth.logout();
  }
}
