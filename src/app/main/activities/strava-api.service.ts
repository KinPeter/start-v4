import { computed, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { startOfWeek } from 'date-fns';
import { LocalStore } from '../../utils/store';
import { StoreKeys } from '../../constants';
import { NotificationService } from '../../services/notification.service';
import { SettingsStore } from '../settings/settings.store';
import {
  StravaActivityResponse,
  StravaAthleteData,
  StravaAthleteResponse,
  StravaAthleteStatsResponse,
  StravaAuthResponse,
} from './activities.types';
import {
  convertRideStats,
  getPrimaryBikeData,
  getRideStats,
  getWalkStats,
  metersToKms,
} from './activities.utils';

interface StravaApiState {
  loading: boolean;
  disabled: boolean;
  needAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  athleteId: number | null;
  data: StravaAthleteData | null;
}

const initialState: StravaApiState = {
  loading: true,
  disabled: true,
  needAuth: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  athleteId: null,
  data: null,
};

@Injectable({ providedIn: 'root' })
export class StravaApiService extends LocalStore<StravaApiState> {
  private readonly stravaAuthBaseUrl = 'https://www.strava.com/oauth/authorize';
  private readonly stravaAuthTokenUrl = 'https://www.strava.com/oauth/token';
  private readonly stravaApiBaseUrl = 'https://www.strava.com/api/v3';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private settingsStore: SettingsStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(StoreKeys.STRAVA, initialState);
    toObservable(this.settingsStore.stravaSettings).subscribe(settings => {
      if (!settings.stravaClientId || !settings.stravaClientSecret) {
        this.setState({
          loading: false,
          disabled: true,
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          athleteId: null,
          data: null,
        });
        return;
      }
      if (this.state().accessToken && !this.isLoggedInToStrava) {
        this.refreshStravaToken().subscribe();
      } else if (!this.state().accessToken) {
        this.setState({ disabled: false, needAuth: true, loading: false, data: null });
      } else if (this.isLoggedInToStrava) {
        this.setState({ disabled: false, needAuth: false, loading: false });
        this.fetchStravaData();
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params?.['code']) {
        this.exchangeOauthCodeToToken(params['code']).subscribe(() => {
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} }).then();
          this.fetchStravaData();
        });
      }
    });
  }

  public loading = computed(() => this.state().loading);
  public disabled = computed(() => this.state().disabled);
  public data = computed(() => this.state().data);
  public needAuth = computed(() => this.state().needAuth);

  public stravaOauthUrl = computed(() => {
    if (!this.settingsStore.stravaSettings()) return '';
    const { stravaClientId, stravaRedirectUri } = this.settingsStore.stravaSettings();
    const redirectUri = window.location.hostname.includes('localhost')
      ? 'http://localhost:4444'
      : stravaRedirectUri;
    return `${this.stravaAuthBaseUrl}?client_id=${stravaClientId}&redirect_uri=${redirectUri}&response_type=code&scope=read_all,activity:read_all,profile:read_all`;
  });

  public fetchStravaData(): void {
    if (!this.isLoggedInToStrava) {
      this.refreshStravaToken().subscribe(() => {
        this.getAthleteData();
      });
    } else {
      this.getAthleteData();
    }
  }

  private get isLoggedInToStrava(): boolean {
    const { accessToken, tokenExpiresAt } = this.state();
    if (!accessToken || !tokenExpiresAt) return false;
    const now = new Date();
    const expiry = new Date(tokenExpiresAt * 1000);
    return now < expiry;
  }

  private exchangeOauthCodeToToken(code: string): Observable<StravaAuthResponse | null> {
    if (!this.settingsStore.stravaSettings()) return of(null);
    const { stravaClientId, stravaClientSecret } = this.settingsStore.stravaSettings();
    this.setState({ loading: true });
    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&code=${code}&grant_type=authorization_code`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava auth', res);
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              athleteId: res.athlete.id,
              loading: false,
              needAuth: false,
            });
          },
          error: () => {
            this.notificationService.showError('Could not get auth token from Strava');
            this.setState({ loading: false, disabled: true });
          },
        })
      );
  }

  private refreshStravaToken(): Observable<StravaAuthResponse> {
    if (!this.settingsStore.stravaSettings()) throw new Error('No Strava settings found');
    const { stravaClientId, stravaClientSecret } = this.settingsStore.stravaSettings();

    const refreshToken = this.state().refreshToken;
    this.setState({ loading: true });

    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava token refresh', res);
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              loading: false,
              needAuth: false,
            });
          },
          error: () => {
            this.notificationService.showError('Could not refresh token with Strava');
            this.setState({ loading: false, disabled: true, data: null });
          },
        })
      );
  }

  private getAthleteData(): void {
    const token = this.state().accessToken;
    const newData: Partial<StravaAthleteData> = {};
    this.setState({ loading: true, data: null });
    this.http
      .get<StravaAthleteResponse>(`${this.stravaApiBaseUrl}/athlete`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap({
          next: res => {
            newData.id = res.id;
            newData.primaryBike = getPrimaryBikeData(res.bikes);
          },
          error: () => {
            this.notificationService.showError('Could not fetch Athlete data from Strava');
            this.setState({ loading: false });
          },
        }),
        switchMap(({ id }) => {
          return this.http.get<StravaAthleteStatsResponse>(
            `${this.stravaApiBaseUrl}/athletes/${id}/stats`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }),
        tap({
          next: res => {
            newData.longestRideEver = metersToKms(res.biggest_ride_distance);
            newData.allRideTotals = convertRideStats(res.all_ride_totals);
            newData.ytdRideTotals = convertRideStats(res.ytd_ride_totals);
            newData.recentRideTotals = convertRideStats(res.recent_ride_totals);
          },
          error: () => {
            this.notificationService.showError('Could not fetch Athlete stats from Strava');
            this.setState({ loading: false });
          },
        }),
        switchMap(() => {
          const nowDate = new Date();
          const monthStart = Math.floor(
            new Date(nowDate.getFullYear(), nowDate.getMonth(), 1).getTime() / 1000
          );
          const now = Math.floor(nowDate.getTime() / 1000);
          return this.http.get<StravaActivityResponse[]>(
            `${this.stravaApiBaseUrl}/athlete/activities?per_page=100&after=${monthStart}&before=${now}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }),
        tap({
          next: res => {
            newData.rideThisMonth = getRideStats(res);
            newData.walkThisMonth = getWalkStats(res);
          },
          error: () => {
            this.notificationService.showError(
              'Could not fetch Athlete month activities from Strava'
            );
            this.setState({ loading: false });
          },
        }),
        switchMap(() => {
          const nowDate = new Date();
          const weekStart = Math.floor(
            startOfWeek(new Date(), { weekStartsOn: 1 }).getTime() / 1000
          );
          const now = Math.floor(nowDate.getTime() / 1000);
          return this.http.get<StravaActivityResponse[]>(
            `${this.stravaApiBaseUrl}/athlete/activities?per_page=100&after=${weekStart}&before=${now}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }),
        tap({
          next: res => {
            newData.rideThisWeek = getRideStats(res);
            newData.walkThisWeek = getWalkStats(res);
          },
          error: () => {
            this.notificationService.showError(
              'Could not fetch Athlete week activities from Strava'
            );
            this.setState({ loading: false });
          },
        }),
        tap(() => {
          this.setState({ loading: false, data: newData as StravaAthleteData });
        })
      )
      .subscribe();
  }
}
