import { computed, effect, Injectable, untracked } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { LocalStore } from '../../utils/store';
import { ApiRoutes, StoreKeys } from '../../constants';
import { parseError } from '../../utils/parse-error';
import { StravaApiService } from './strava-api.service';
import { Activities, CyclingChoreRequest, SetGoalsRequest, UUID } from '../../types';
import { AuthStore } from '../../auth/auth.store';

interface ActivitiesState {
  loading: boolean;
  data: Activities | null;
}

const initialState: ActivitiesState = {
  loading: true,
  data: null,
};

@Injectable({ providedIn: 'root' })
export class ActivitiesService extends LocalStore<ActivitiesState> {
  constructor(
    private apiService: ApiService,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private stravaApiService: StravaApiService
  ) {
    super(StoreKeys.ACTIVITIES, initialState);
    effect(() => {
      if (this.stravaApiService.isLoggedInToStrava()) {
        untracked(() => this.fetchActivitiesData());
      }
    });
  }

  public data = computed(() => this.state().data);
  public loading = computed(() => this.state().loading);

  public fetchActivitiesData(): void {
    this.setState({ loading: true });
    this.apiService.get<Activities>(ApiRoutes.ACTIVITIES).subscribe({
      next: res => {
        this.setState({
          data: res,
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError('Could not fetch activities data. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public setGoals(goals: SetGoalsRequest): void {
    this.setState({ loading: true });
    this.apiService
      .patch<SetGoalsRequest, Activities>(ApiRoutes.ACTIVITIES_GOALS, goals)
      .subscribe({
        next: res => {
          this.setState({
            data: res,
            loading: false,
          });
          this.notificationService.showSuccess('New goals set!');
        },
        error: err => {
          this.notificationService.showError('Could not update goals. ' + parseError(err));
          this.setState({ loading: false });
        },
      });
  }

  public addNewChore(data: CyclingChoreRequest): void {
    this.setState({ loading: true });
    this.apiService
      .post<CyclingChoreRequest, Activities>(ApiRoutes.ACTIVITIES_CHORE, data)
      .subscribe({
        next: res => {
          this.setState({
            data: res,
            loading: false,
          });
          this.notificationService.showSuccess('New chore added!');
        },
        error: err => {
          this.notificationService.showError('Could not add new cycling chore. ' + parseError(err));
          this.setState({ loading: false });
        },
      });
  }

  public editChore(id: UUID, data: CyclingChoreRequest): void {
    this.setState({ loading: true });
    this.apiService
      .put<CyclingChoreRequest, Activities>(`${ApiRoutes.ACTIVITIES_CHORE}/${id}`, data)
      .subscribe({
        next: res => {
          this.setState({
            data: res,
            loading: false,
          });
          this.notificationService.showSuccess('Chore updated!');
        },
        error: err => {
          this.notificationService.showError('Could not update cycling chore. ' + parseError(err));
          this.setState({ loading: false });
        },
      });
  }

  public deleteChore(id: UUID): void {
    this.setState({ loading: true });
    this.apiService.delete<Activities>(`${ApiRoutes.ACTIVITIES_CHORE}/${id}`).subscribe({
      next: res => {
        this.setState({
          data: res,
          loading: false,
        });
        this.notificationService.showSuccess('Chore deleted!');
      },
      error: err => {
        this.notificationService.showError('Could not delete cycling chore. ' + parseError(err));
        this.setState({ loading: false });
      },
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
}
