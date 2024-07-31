import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { differenceInHours, isAfter, parseISO } from 'date-fns';
import { map, switchMap, tap } from 'rxjs/operators';
import { StoreKeys } from '../constants/constants';
// import { AppBarService } from '../main/app-bar/app-bar.service';
import { ApiRoutes } from '../constants/api-routes';
import { ApiService } from '../services/api.service';
// import { NotificationService } from '../shared/services/notification.service';
import { SettingsStore } from '../services/settings.store';
import { AuthState, AuthStore } from './auth.store';
import {
  AuthData,
  EmailRequest,
  LoginVerifyRequest,
  PasswordAuthRequest,
  PkStartSettings,
} from '@kinpeter/pk-common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private refreshTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private authStore: AuthStore,
    private api: ApiService,
    // private appBarService: AppBarService,
    // private notificationService: NotificationService,
    private settingsStore: SettingsStore
  ) {}

  public get store(): AuthState {
    return Object.freeze({ ...this.authStore.current });
  }

  public requestLoginCode(email: string): Observable<void> {
    this.authStore.setEmail(email);
    // for testing purposes, since email authentication is hard to test
    if (email === 'main@test.com') return of(undefined);
    // ---
    return this.api.post<EmailRequest, void>(ApiRoutes.AUTH_LOGIN, { email });
  }

  public verifyLoginCode(loginCode: string): Observable<{ done: boolean }> {
    const email = this.authStore.current.email;
    if (!email) {
      throw new Error('Email was not saved in store!');
    }
    return this.api
      .post<LoginVerifyRequest, AuthData>(ApiRoutes.AUTH_VERIFY_CODE, { email, loginCode })
      .pipe(
        tap((authData: AuthData) => {
          this.authStore.setLogin(authData);
          const expires = parseISO(authData.expiresAt as unknown as string);
          this.scheduleTokenRefresh(expires);
        }),
        switchMap(() => this.api.get<PkStartSettings>(ApiRoutes.SETTINGS)),
        tap((res: PkStartSettings) => {
          this.settingsStore.setSettings(res);
        }),
        map(() => ({ done: true }))
      );
  }

  public verifyPassword(request: PasswordAuthRequest): Observable<{ done: boolean }> {
    return this.api
      .post<PasswordAuthRequest, AuthData>(ApiRoutes.AUTH_PASSWORD_LOGIN, request)
      .pipe(
        tap((authData: AuthData) => {
          this.authStore.setLogin(authData);
          const expires = parseISO(authData.expiresAt as unknown as string);
          this.scheduleTokenRefresh(expires);
        }),
        switchMap(() => this.api.get<PkStartSettings>(ApiRoutes.SETTINGS)),
        tap((res: PkStartSettings) => {
          this.settingsStore.setSettings(res);
        }),
        map(() => ({ done: true }))
      );
  }

  public logout(): void {
    this.authStore.setLogout();
    this.settingsStore.clearSettings();
    // this.appBarService.resetState(); // FIXME
    this.unscheduleTokenRefresh();
    localStorage.removeItem(StoreKeys.BIRTHDAYS);
    localStorage.removeItem(StoreKeys.KOREAN);
    localStorage.removeItem(StoreKeys.LOCATION);
  }

  public autoLogin(): void {
    const { expiresAt, id } = this.authStore.current;
    const expires = parseISO(expiresAt as unknown as string);
    if (!expires || !id || isAfter(new Date(), expires)) {
      this.logout();
      return;
    }
    this.refreshToken();
    this.scheduleTokenRefresh(expires);
  }

  private scheduleTokenRefresh(expiresAt: Date): void {
    this.unscheduleTokenRefresh();
    const now = new Date();
    const hoursLeft = differenceInHours(expiresAt, now);
    if (hoursLeft < 48) {
      this.refreshToken();
    } else {
      this.refreshTimer = setTimeout(
        () => {
          this.refreshToken();
        },
        (hoursLeft - 48) * 60 * 60 * 1000
      );
    }
  }

  private unscheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  private refreshToken(): void {
    this.api.post<void, AuthData>(ApiRoutes.AUTH_TOKEN_REFRESH, undefined).subscribe({
      next: res => {
        this.authStore.setNewToken(res);
        const expires = parseISO(res.expiresAt as unknown as string);
        this.scheduleTokenRefresh(expires);
      },
      error: err => {
        // this.notificationService.showError('Token refresh error: ' + parseError(err)); // FIXME
        console.log(err);
      },
    });
  }
}
