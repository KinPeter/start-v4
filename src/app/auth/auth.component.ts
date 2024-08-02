import { Component, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';
import { parseError } from '../utils/parse-error';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'pk-auth',
  standalone: true,
  imports: [FormsModule, RouterLink, NgStyle],
  styles: ``,
  template: `
    <p>auth works!</p>
    @if (loading()) {
      <div>loading...</div>
    } @else if (!loading() && step() === 0) {
      <input type="text" [(ngModel)]="email" (keyup.enter)="onRequestLoginCode()" />
      @if (!usePassword()) {
        <button (click)="onRequestLoginCode()" [disabled]="!email.length">Get login code</button>
      } @else {
        <input type="text" [(ngModel)]="password" (keyup.enter)="onPasswordLogin()" />
        <button (click)="onPasswordLogin()" [disabled]="!password.length">Log in</button>
      }
      <p>
        <small>
          @if (!usePassword()) {
            <a data-id="use-password-link" [routerLink]="" (click)="usePassword.set(true)">
              Use password
            </a>
          } @else {
            <a data-id="use-email-login-link" [routerLink]="" (click)="usePassword.set(false)">
              Use email login code
            </a>
          }
        </small>
      </p>
      <p>
        <small>
          @if (hasEmailSaved()) {
            <a data-id="have-login-code-link" [routerLink]="" (click)="step.set(1)">
              I already have a login code
            </a>
          } @else {
            <span [ngStyle]="{ opacity: 0 }">placeholder</span>
          }
        </small>
      </p>
    } @else if (!loading() && step() === 1) {
      <input
        type="text"
        name="auth-loginCode"
        [(ngModel)]="loginCode"
        (keyup.enter)="onCodeLogin()" />
      <button data-id="login-button" [disabled]="loginCode.length !== 6" (click)="onCodeLogin()">
        Log in
      </button>
      <p>
        <small>
          <a data-id="need-login-code-link" [routerLink]="" (click)="step.set(0)">
            I need a new login code
          </a>
        </small>
      </p>
    }
  `,
})
export class AuthComponent {
  public email = '';
  public loginCode = '';
  public password = '';
  public step = signal(0);
  public usePassword = signal(false);
  public loading = signal(false);
  public hasEmailSaved = computed(() => !!this.authStore.email());

  constructor(
    private authService: AuthService,
    private authStore: AuthStore,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  public onRequestLoginCode(): void {
    if (this.usePassword()) {
      return;
    }
    this.loading.set(true);
    this.authService.requestLoginCode(this.email).subscribe({
      next: () => {
        this.step.set(1);
        this.loading.set(false);
      },
      error: err => {
        this.notificationService.showError('Could not request login code. ' + parseError(err));
        this.loading.set(false);
      },
    });
    this.email = '';
  }

  public onCodeLogin(): void {
    this.loading.set(true);
    this.authService.verifyLoginCode(this.loginCode).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']).then();
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err));
        this.loading.set(false);
      },
    });
  }

  public onPasswordLogin(): void {
    this.loading.set(true);
    this.authService.verifyPassword({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']).then();
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err));
        this.loading.set(false);
      },
    });
  }
}
