import { computed, Injectable } from '@angular/core';
import { LocalStore } from '../../utils/store';
import { StepsItem, StepsResponse, StepsSyncResponse } from '../../types';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { ApiRoutes, StoreKeys } from '../../constants';
import { parseError } from '../../utils/parse-error';
import { Subject, take } from 'rxjs';

interface StepsState {
  loading: boolean;
  data: StepsItem[] | null;
}

const initialState: StepsState = {
  loading: true,
  data: null,
};

@Injectable({ providedIn: 'root' })
export class StepsService extends LocalStore<StepsState> {
  private hasSynced = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(StoreKeys.STEPS, initialState);
    this.syncSteps();
    this.hasSynced.pipe(take(1)).subscribe(() => this.fetchSteps());
  }

  public data = computed(() => this.state().data);
  public loading = computed(() => this.state().loading);

  public syncSteps(): void {
    this.setState({ loading: true });
    this.apiService.post<null, StepsSyncResponse>(ApiRoutes.ACTIVITIES_STEPS_SYNC, null).subscribe({
      next: res => {
        this.setState({ loading: false });
        this.hasSynced.next(true);
        this.notificationService.showSuccess(
          res.daysSynced > 0
            ? `Synced ${res.daysSynced} days, total: ${res.totalDays} days.`
            : 'No new days to sync. Total days: ' + res.totalDays
        );
      },
      error: err => {
        this.notificationService.showError('Could not sync steps. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }

  public fetchSteps(): void {
    this.setState({ loading: true });
    this.apiService.get<StepsResponse>(ApiRoutes.ACTIVITIES_STEPS).subscribe({
      next: res => {
        this.setState({
          data: res.entities,
          loading: false,
        });
      },
      error: err => {
        this.notificationService.showError('Could not fetch steps data. ' + parseError(err));
        this.setState({ loading: false });
      },
    });
  }
}
