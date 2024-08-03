import { Component, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';
import { parseError } from '../utils/parse-error';
import { NgStyle } from '@angular/common';
import { PkInputDirective } from '../common/pk-input.directive';
import { PkInputComponent } from '../common/pk-input.component';
import { PkButtonComponent } from '../common/pk-button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDeviceFloppy } from '@ng-icons/tabler-icons';
import { PkLoaderComponent } from '../common/pk-loader.component';

@Component({
  selector: 'pk-auth',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgStyle,
    PkInputDirective,
    PkInputComponent,
    PkButtonComponent,
    NgIcon,
    PkLoaderComponent,
  ],
  providers: [provideIcons({ tablerDeviceFloppy })],
  styles: ``,
  template: `
    <p>auth works!</p>
    @if (loading()) {
      <div>loading...</div>
    } @else if (!loading() && step() === 0) {
      <pk-input label="Email" [withAsterisk]="true" width="250px">
        <input pkInput type="text" [(ngModel)]="email" (keyup.enter)="onRequestLoginCode()" />
      </pk-input>
      @if (!usePassword()) {
        <button (click)="onRequestLoginCode()" [disabled]="!email.length">Get login code</button>
      } @else {
        <pk-input label="Password" [withAsterisk]="true" width="250px">
          <input
            pkInput="other"
            type="password"
            [(ngModel)]="password"
            (keyup.enter)="onPasswordLogin()" />
        </pk-input>
        <pk-button (onClick)="onPasswordLogin()" [disabled]="!password.length">Log in</pk-button>
        <pk-loader />
        <div
          class="buttons-test"
          style="display: flex; flex-direction: column; gap: 12px; margin: 2rem 0">
          <div style="display: flex; gap: 12px">
            <pk-button [loading]="true">Default</pk-button>
            <pk-button variant="filled">Filled</pk-button>
            <pk-button variant="outline">Outline</pk-button>
            <pk-button variant="subtle">Subtle</pk-button>
            <pk-button variant="link">Link</pk-button>
          </div>

          <div style="display: flex; gap: 70px">
            <pk-button [icon]="true">
              <ng-icon name="tablerDeviceFloppy"></ng-icon>
            </pk-button>
            <pk-button variant="filled" [icon]="true" [loading]="true">
              <ng-icon name="tablerDeviceFloppy"></ng-icon>
            </pk-button>
            <pk-button variant="outline" [icon]="true">
              <ng-icon name="tablerDeviceFloppy"></ng-icon>
            </pk-button>
            <pk-button variant="subtle" [icon]="true">
              <ng-icon name="tablerDeviceFloppy"></ng-icon>
            </pk-button>
          </div>
        </div>
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
      <button (click)="toggleError()">Toggle error</button>
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
      <pk-input label="Login code" [withAsterisk]="true" width="250px">
        <input
          pkInput
          type="text"
          name="auth-loginCode"
          [(ngModel)]="loginCode"
          (keyup.enter)="onCodeLogin()" />
      </pk-input>
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
  public usePassword = signal(true);
  public loading = signal(false);
  public hasEmailSaved = computed(() => !!this.authStore.email());
  public tempError = signal('');

  toggleError(): void {
    if (!this.tempError()) {
      this.tempError.set('something went wrong');
    } else {
      this.tempError.set('');
    }
  }

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

  protected readonly visualViewport = visualViewport;
}
