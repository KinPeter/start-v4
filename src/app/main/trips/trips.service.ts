import { computed, Injectable } from '@angular/core';
import { Flight } from '@kinpeter/pk-common';
import { Store } from '../../utils/store';
import { ApiRoutes } from '../../constants';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { parseError } from '../../utils/parse-error';

interface TripsState {
  loading: boolean;
  upcomingFlights: Flight[];
}

const initialState: TripsState = {
  loading: false,
  upcomingFlights: [],
};

@Injectable({ providedIn: 'root' })
export class TripsService extends Store<TripsState> {
  public loading = computed(() => this.state().loading);
  public upcomingFlights = computed(() => this.state().upcomingFlights);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
    this.fetchData();
  }

  public fetchData(): void {
    this.setState({ loading: true });
    this.apiService
      .get<Flight[]>(ApiRoutes.FLIGHTS, { params: { plannedOnly: 'true' } })
      .subscribe({
        next: res => {
          const data = res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          this.setState({
            upcomingFlights: data,
            loading: false,
          });
        },
        error: err => {
          this.notificationService.showError('Could not fetch flights. ' + parseError(err));
          this.setState({ loading: false });
        },
      });
  }
}
