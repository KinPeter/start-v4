import { Component, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';
import { parseError } from '../utils/parse-error';
import { NgStyle } from '@angular/common';
import { PkInputDirective } from '../common/pk-input.directive';
import { PkInputComponent } from '../common/pk-input.component';
import { PkButtonComponent } from '../common/pk-button.component';
import { PkLoaderComponent } from '../common/pk-loader.component';
import { LOGIN_CODE_REGEX } from '../constants/regex';

@Component({
  selector: 'pk-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    PkInputDirective,
    PkInputComponent,
    PkButtonComponent,
    PkLoaderComponent,
  ],
  providers: [],
  styles: `
    .container {
      height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  `,
  template: `
    <div class="container">
      @if (step() === 0) {
        <pk-input label="Email" [withAsterisk]="true" width="250px">
          <input pkInput type="text" [(ngModel)]="email" (keyup.enter)="onRequestLoginCode()" />
        </pk-input>
        @if (usePassword()) {
          <pk-input label="Password" [withAsterisk]="true" width="250px">
            <input
              pkInput="other"
              type="password"
              [(ngModel)]="password"
              (keyup.enter)="onPasswordLogin()" />
          </pk-input>
          <pk-button
            variant="filled"
            (onClick)="onPasswordLogin()"
            [loading]="loading()"
            [disabled]="loading() || emailInvalid() || passwordInvalid()">
            Log in
          </pk-button>
        } @else {
          <pk-button
            variant="subtle"
            (onClick)="onRequestLoginCode()"
            [loading]="loading()"
            [disabled]="loading() || emailInvalid()">
            Get login code
          </pk-button>
        }
        @if (usePassword()) {
          <pk-button variant="link" (onClick)="usePassword.set(false)">
            Use email login code
          </pk-button>
        } @else {
          <pk-button variant="link" (onClick)="usePassword.set(true)"> Use password </pk-button>
        }
        @if (hasEmailSaved() && !usePassword()) {
          <pk-button variant="link" (onClick)="step.set(1)">
            I already have a login code
          </pk-button>
        } @else {
          <span [ngStyle]="{ opacity: 0 }">placeholder</span>
        }
      } @else if (step() === 1) {
        <pk-input label="Login code" [withAsterisk]="true" width="250px">
          <input
            pkInput
            type="text"
            name="auth-loginCode"
            [(ngModel)]="loginCode"
            (keyup.enter)="onCodeLogin()" />
        </pk-input>
        <pk-button
          variant="filled"
          [loading]="loading()"
          [disabled]="loading() || loginCodeInvalid()"
          (onClick)="onCodeLogin()">
          Log in
        </pk-button>
        <pk-button variant="link" (onClick)="step.set(0)"> I need a new login code </pk-button>
      }
    </div>

    <div
      [ngStyle]="{
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        gap: '8px',
      }">
      <pk-button (onClick)="addMessage('error')">error</pk-button>
      <pk-button (onClick)="addMessage('warning')">warning</pk-button>
      <pk-button (onClick)="addMessage('info')">info</pk-button>
      <pk-button (onClick)="addMessage('success')">success</pk-button>
      <pk-button (onClick)="addMessage('log')">log</pk-button>
    </div>
  `,
})
export class AuthComponent {
  public email = signal('');
  public loginCode = signal('');
  public password = signal('');
  public step = signal(0);
  public usePassword = signal(true);
  public loading = signal(false);
  public hasEmailSaved = computed(() => !!this.authStore.email());
  public emailInvalid = computed(() => !this.email().includes('@'));
  public passwordInvalid = computed(() => this.password().length < 5);
  public loginCodeInvalid = computed(() => !this.loginCode().match(LOGIN_CODE_REGEX));

  constructor(
    private authService: AuthService,
    private authStore: AuthStore,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  public addMessage(type: string) {
    if (type === 'error')
      this.notificationService.showError(
        'An error occurred during your request. We apologize for your inconvenience'
      );
    if (type === 'warning')
      this.notificationService.showWarning('Please be careful when doing this!');
    if (type === 'info') this.notificationService.showInfo('Your request has been sent');
    if (type === 'success')
      this.notificationService.showSuccess('Great! Item has been saved successfully.');
    if (type === 'log')
      this.notificationService.showLog('Just FYI something happened at this point');
  }

  public onRequestLoginCode(): void {
    if (this.usePassword()) {
      return;
    }
    this.loading.set(true);
    this.authService.requestLoginCode(this.email()).subscribe({
      next: () => {
        this.step.set(1);
        this.loading.set(false);
      },
      error: err => {
        this.notificationService.showError('Could not request login code. ' + parseError(err));
        this.loading.set(false);
      },
    });
    this.email.set('');
  }

  public onCodeLogin(): void {
    this.loading.set(true);
    this.authService.verifyLoginCode(this.loginCode()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']).then();
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err));
        this.loading.set(false);
      },
    });
    this.loginCode.set('');
  }

  public onPasswordLogin(): void {
    this.loading.set(true);
    this.authService.verifyPassword({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']).then();
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err));
        this.loading.set(false);
      },
    });
    this.password.set('');
  }
}
