import { computed, effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { DatetimeStore } from '../../services/datetime.store';
import { PostMessengerService } from '../../services/post-messenger.service';
import { CurrentWeather } from './weather.types';
import { differenceInMinutes } from 'date-fns';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  public currentWeather: Signal<CurrentWeather | undefined>;
  public location: Signal<string | undefined>;
  public updatedText: WritableSignal<string> = signal('Refresh');

  private updatedTimer = 0;
  private updatedMinutes = 0;

  constructor(
    private datetimeStore: DatetimeStore,
    private postMessengerService: PostMessengerService
  ) {
    effect(() => {
      if (this.postMessengerService.weatherUpdate()) {
        this.datetimeStore.updateToday();
        clearInterval(this.updatedTimer);
        this.updatedMinutes = differenceInMinutes(
          new Date(),
          this.postMessengerService.weatherUpdate()!.lastUpdated
        );
        this.setUpdatedText();
        this.updatedTimer = setInterval(
          () => this.setUpdatedText(),
          1000 * 60
        ) as unknown as number;
      }
    });
    this.currentWeather = computed(() => this.postMessengerService.weatherUpdate()?.currentWeather);
    this.location = computed(() => this.postMessengerService.weatherUpdate()?.location.name);
  }

  private setUpdatedText(): void {
    this.updatedText.set(
      this.updatedMinutes++ < 1 ? 'Updated just now' : `Updated ${this.updatedMinutes} minutes ago`
    );
  }
}
