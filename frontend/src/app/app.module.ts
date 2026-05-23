import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthGuard, AdminGuard } from './core/guards/auth.guard';

// Auth
import { LoginComponent } from './modules/auth/components/login.component';

// Dashboard
import { DashboardComponent } from './modules/dashboard/components/dashboard.component';
import { RecordsTableComponent } from './modules/dashboard/components/records-table.component';
import { UserProfileCardComponent } from './modules/dashboard/components/user-profile-card.component';
import { StatsCardComponent } from './modules/dashboard/components/stats-card.component';

// Admin
import { AdminComponent } from './modules/admin/components/admin.component';
import { UserTableComponent } from './modules/admin/components/user-table.component';
import { CreateUserModalComponent } from './modules/admin/components/create-user-modal.component';

// Shared
import { LoadingSkeletonComponent } from './shared/components/loading-skeleton.component';
import { BadgeComponent } from './shared/components/badge.component';
import { NavbarComponent } from './shared/components/navbar.component';

const routes = [
  { path: '',           redirectTo: '/dashboard', pathMatch: 'full' as const },
  { path: 'auth/login', component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent,  canActivate: [AuthGuard] },
  { path: 'admin',      component: AdminComponent,      canActivate: [AuthGuard, AdminGuard] },
  { path: '**',         redirectTo: '/dashboard' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RecordsTableComponent,
    UserProfileCardComponent,
    StatsCardComponent,
    AdminComponent,
    UserTableComponent,
    CreateUserModalComponent,
    LoadingSkeletonComponent,
    BadgeComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}