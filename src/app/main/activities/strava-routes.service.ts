import { effect, Injectable, untracked } from '@angular/core';
import { StravaApiService } from './strava-api.service';
import { AuthStore } from '../../auth/auth.store';
import { NotificationService } from '../../services/notification.service';
import { ApiService } from '../../services/api.service';
import { ApiRoutes } from '../../constants';
import { parseError } from '../../utils/parse-error';
import { StravaRoutesSyncResponse } from '../../types';

@Injectable({ providedIn: 'root' })
export class StravaRoutesService {
  private hasSyncedSinceStartup = false;

  constructor(
    private apiService: ApiService,
    private authStore: AuthStore,
    private stravaApiService: StravaApiService,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const stravaToken = this.stravaApiService.stravaToken();
      if (!stravaToken || this.hasSyncedSinceStartup) return;
      untracked(() => {
        this.syncStravaRoutes();
        this.hasSyncedSinceStartup = true;
      });
    });
  }

  public openStravaRoutes(): void {
    const stravaToken = this.stravaApiService.stravaToken();
    const centralToken = this.authStore.current.token;

    if (!stravaToken || !centralToken) {
      this.notificationService.showError(
        'You need to be logged in to Strava to access this feature.'
      );
      return;
    }

    const url = `https://strava.p-kin.com/?stravaToken=${stravaToken}&centralToken=${centralToken}`;
    window.open(url, '_blank');
  }

  public syncStravaRoutes(): void {
    const stravaToken = this.stravaApiService.stravaToken();

    if (!stravaToken) {
      this.notificationService.showError(
        'You need to be logged in to Strava to access this feature.'
      );
      return;
    }

    this.apiService
      .post<undefined, StravaRoutesSyncResponse>(`${ApiRoutes.STRAVA_ROUTES}/sync`, undefined, {
        params: { strava_token: stravaToken },
      })
      .subscribe({
        next: res => {
          this.notificationService.showSuccess(
            res.routesSynced > 0
              ? `Synced ${res.routesSynced} routes, total: ${res.totalRoutes} routes.`
              : 'No new routes to sync. Total routes: ' + res.totalRoutes
          );
        },
        error: err => {
          this.notificationService.showError('Could not sync Strava routes. ' + parseError(err));
        },
      });
  }
}
