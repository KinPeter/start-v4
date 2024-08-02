import { computed, Injectable } from '@angular/core';
import { Store } from '../utils/store';
import { isSameDay } from 'date-fns';

interface DatetimeState {
  today: Date;
}

const initialState: DatetimeState = {
  today: new Date(),
};

@Injectable({ providedIn: 'root' })
export class DatetimeStore extends Store<DatetimeState> {
  public today = computed(() => this.state().today);

  constructor() {
    super(initialState);
  }

  public updateToday(): void {
    const now = new Date();
    if (!this.state().today || !isSameDay(now, this.state().today)) {
      this.setState({ today: now });
    }
  }
}
