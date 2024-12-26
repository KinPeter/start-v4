import { Component, Signal } from '@angular/core';
import { WeatherService } from '../weather/weather.service';
import { CurrentWeather } from '../weather/weather.types';
import { WeatherIconComponent } from '../weather/weather-icon.component';

@Component({
  selector: 'pk-menu-weather',
  imports: [WeatherIconComponent],
  providers: [],
  styles: `
    .container {
      padding: 0 0.5rem;
      font-size: 0.85rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        p:first-child {
          font-weight: bold;
        }

        p span {
          margin-left: 0.5rem;
        }

        pk-weather-icon {
          position: relative;
          top: 2px;
        }
      }

      .right {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;

        p {
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
    }
  `,
  template: `
    <div class="container">
      @if (location() && weather()) {
        <div class="left">
          <p>{{ location() }}</p>
          <p>{{ weather()!.description }}</p>
          <p>
            <pk-weather-icon icon="precip" size="12px" style="color: var(--color-accent)" />
            <span>{{ weather()!.precipitation ?? '-' }}</span>
          </p>
          <p>
            <pk-weather-icon icon="wind" size="12px" style="color: var(--color-accent)" />
            <span>{{ weather()!.wind }}</span>
          </p>
        </div>
        <div class="right">
          <p>{{ weather()!.temperature }}&deg;C</p>
          <pk-weather-icon [icon]="weather()!.icon" size="36px" />
        </div>
      } @else {
        <p>Weather is not available</p>
      }
    </div>
  `,
})
export class MenuWeatherComponent {
  public weather: Signal<CurrentWeather | undefined>;
  public location: Signal<string | undefined>;

  constructor(private weatherService: WeatherService) {
    this.weather = this.weatherService.currentWeather;
    this.location = this.weatherService.location;
  }
}
