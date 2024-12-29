import { effect, Injectable, untracked } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { LocalStore } from '../../utils/store';
import { Activities, CyclingChoreRequest, SetGoalsRequest, UUID } from '@kinpeter/pk-common';
import { ApiRoutes, StoreKeys } from '../../constants';
import { parseError } from '../../utils/parse-error';
import { StravaApiService } from './strava-api.service';

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
    private notificationService: NotificationService,
    private stravaApiService: StravaApiService
  ) {
    super(StoreKeys.ACTIVITIES, initialState);
    effect(() => {
      if (!this.stravaApiService.needAuth() && !this.stravaApiService.disabled()) {
        untracked(() => this.fetchActivitiesData());
      }
    });

    effect(() => {
      const stravaData = this.stravaApiService.data();
      const activities = this.state().data;
      if (stravaData && activities) {
        untracked(() => {
          console.log('do something ', stravaData, activities);
        });
      }
    });
  }

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
}
