import { computed, Injectable } from '@angular/core';
import { BirthdayItem } from '@kinpeter/pk-common';
import { differenceInDays, isSameDay, setYear, parseISO } from 'date-fns';
import { StoreKeys, ApiRoutes } from '../../constants';
import { Store } from '../../utils/store';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { SettingsStore } from '../settings/settings.store';
import { DatetimeStore } from '../../services/datetime.store';
import { parseError } from '../../utils/parse-error';
import { filter } from 'rxjs';
import { tap } from 'rxjs/operators';

interface BirthdaysState {
  hasBirthdaysToday: number | undefined;
  today: BirthdayItem[];
  upcoming: BirthdayItem[];
  loading: boolean;
  disabled: boolean;
}

const initialState: BirthdaysState = {
  hasBirthdaysToday: undefined,
  today: [],
  upcoming: [],
  loading: false,
  disabled: false,
};

interface StoredBirthdays {
  birthdays: BirthdayItem[];
  lastFetch: string;
}

@Injectable({ providedIn: 'root' })
export class BirthdaysService extends Store<BirthdaysState> {
  public loading = computed(() => this.state().loading);
  public disabled = computed(() => this.state().disabled);
  public hasBirthdaysToday = computed(() => this.state().hasBirthdaysToday);
  public today = computed(() => this.state().today);
  public upcoming = computed(() => this.state().upcoming);

  constructor(
    private apiService: ApiService,
    private datetimeStore: DatetimeStore,
    private settingsStore: SettingsStore,
    private notificationService: NotificationService
  ) {
    super(initialState);
    if (!this.settingsStore.birthdaysUrl) {
      this.setState({ disabled: true });
      return;
    }
    this.datetimeStore.today$
      .pipe(
        filter(value => Boolean(value)),
        tap(() => {
          const stored = localStorage.getItem(StoreKeys.BIRTHDAYS);
          if (!stored) {
            this.fetchBirthdays();
          } else {
            const parsed = JSON.parse(stored) as StoredBirthdays;
            if (differenceInDays(new Date(), parseISO(parsed.lastFetch)) > 6) {
              this.fetchBirthdays();
            } else {
              this.checkBirthdays(parsed.birthdays);
            }
          }
        })
      )
      .subscribe();
  }

  public fetchBirthdays(): void {
    if (this.state().disabled) {
      return;
    }
    this.setState({ loading: true });
    this.apiService.get<BirthdayItem[]>(ApiRoutes.PROXY_BIRTHDAYS).subscribe({
      next: res => {
        localStorage.setItem(
          StoreKeys.BIRTHDAYS,
          JSON.stringify({
            lastFetch: new Date().toISOString(),
            birthdays: res,
          })
        );
        this.setState({ loading: false });
        this.checkBirthdays(res);
      },
      error: err => {
        this.setState({ loading: false });
        this.notificationService.showError('Failed to fetch birthdays. ' + parseError(err));
      },
    });
  }

  private checkBirthdays(birthdays: BirthdayItem[]): void {
    const today: BirthdayItem[] = [];
    const upcoming: BirthdayItem[] = [];
    const nextYear: BirthdayItem[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const isEndOfYear = now.getMonth() === 11 && now.getDate() > 15;

    birthdays.forEach(item => {
      const date = setYear(new Date(item.date), currentYear);

      if (isSameDay(now, date)) {
        today.push(item);
        return;
      }

      if (!isEndOfYear) {
        const diff = differenceInDays(date, now);
        if (diff >= 0 && diff <= 14) {
          upcoming.push(item);
        }
      } else {
        if (date.getMonth() !== 0) {
          const diff = differenceInDays(date, now);
          if (diff >= 0 && diff <= 14) {
            upcoming.push(item);
          }
        } else {
          const diff = differenceInDays(setYear(date, currentYear + 1), now);
          if (diff >= 0 && diff <= 14) {
            nextYear.push(item);
          }
        }
      }
    });

    this.setState({
      today,
      upcoming: [...upcoming, ...nextYear],
      hasBirthdaysToday: today.length || undefined,
    });
  }
}