// modules/admin/components/create-user-modal.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-create-user-modal',
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <div class="modal-header">
          <h2 id="modal-title">Create New User</h2>
          <button class="btn btn--ghost btn--sm" (click)="close.emit()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

          <div class="grid-2">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input id="name" class="input" formControlName="name" placeholder="Jane Smith"/>
              <span class="form-error" *ngIf="f['name'].touched && f['name'].errors?.['required']">Required</span>
            </div>

            <div class="form-group">
              <label for="userId">User ID *</label>
              <input id="userId" class="input" formControlName="userId" placeholder="jsmith01"/>
              <span class="form-error" *ngIf="f['userId'].touched && f['userId'].errors?.['required']">Required</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address *</label>
            <input id="email" class="input" formControlName="email" type="email" placeholder="jane@nexus.io"/>
            <span class="form-error" *ngIf="f['email'].touched && f['email'].errors?.['email']">Valid email required</span>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="department">Department</label>
              <select id="department" class="select" formControlName="department">
                <option value="Engineering">Engineering</option>
                <option value="Analytics">Analytics</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Product">Product</option>
                <option value="Security">Security</option>
                <option value="Platform Engineering">Platform Engineering</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            <div class="form-group">
              <label for="role">Role *</label>
              <select id="role" class="select" formControlName="role">
                <option value="general_user">General User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Initial Password *</label>
            <div style="position:relative">
              <input id="password" class="input" formControlName="password"
                [type]="showPw ? 'text' : 'password'"
                placeholder="Minimum 8 characters"
                style="padding-right: 40px"/>
              <button type="button" class="pw-toggle"
                style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted)"
                (click)="showPw = !showPw">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>
            <span class="form-error" *ngIf="f['password'].touched && f['password'].errors?.['minlength']">
              Min 8 characters
            </span>
          </div>

          <!-- Error -->
          <div class="error-banner" *ngIf="errorMessage" style="margin-bottom:16px">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
              <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            {{ errorMessage }}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn--secondary" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn btn--primary" [disabled]="submitting">
              <div class="spinner" *ngIf="submitting" style="width:14px;height:14px;border-width:2px"></div>
              {{ submitting ? 'Creating…' : 'Create User' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: var(--rose-soft);
      border: 1px solid rgba(251,113,133,0.25);
      border-radius: var(--radius-md);
      padding: 10px 14px;
      font-size: 13px; color: var(--rose);
    }

    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class CreateUserModalComponent {
  @Output() close   = new EventEmitter<void>();
  @Output() created = new EventEmitter<CreateUserRequest>();

  form: FormGroup;
  submitting = false;
  showPw = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name:       ['', Validators.required],
      userId:     ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      department: ['Engineering'],
      role:       ['general_user', Validators.required],
      password:   ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMessage = '';
    this.created.emit(this.form.value as CreateUserRequest);
  }

  setError(msg: string): void {
    this.errorMessage = msg;
    this.submitting = false;
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
