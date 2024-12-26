import { Component, input } from '@angular/core';
import { WeatherIcons } from './weather.types';
import {
  clearDay,
  clearNight,
  cloudy,
  fog,
  hail,
  partlyCloudyDay,
  partlyCloudyNight,
  precip,
  rain,
  sleet,
  snow,
  thunderstorm,
  wind,
} from '../../../assets/icons/weather';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'pk-weather-icon',
  imports: [NgStyle],
  providers: [],
  styles: `
    div {
      display: inline-block;
    }
  `,
  template: ` <div [ngStyle]="{ width: size(), height: size() }" [innerHTML]="svgContent"></div> `,
})
export class WeatherIconComponent {
  public icon = input.required<WeatherIcons | 'precip' | 'wind'>();
  public size = input('24px');

  constructor(private sanitizer: DomSanitizer) {}

  public get svgContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getIconSvg(this.icon()));
  }

  private getIconSvg(icon: WeatherIcons | 'precip' | 'wind'): string {
    switch (icon) {
      case WeatherIcons.CLEAR_DAY:
        return clearDay;
      case WeatherIcons.CLEAR_NIGHT:
        return clearNight;
      case WeatherIcons.CLOUDY:
        return cloudy;
      case WeatherIcons.PARTLY_CLOUDY_DAY:
        return partlyCloudyDay;
      case WeatherIcons.PARTLY_CLOUDY_NIGHT:
        return partlyCloudyNight;
      case WeatherIcons.FOG:
        return fog;
      case WeatherIcons.HAIL:
        return hail;
      case WeatherIcons.RAIN:
        return rain;
      case WeatherIcons.SNOW:
        return snow;
      case WeatherIcons.SLEET:
        return sleet;
      case WeatherIcons.WIND:
      case 'wind':
        return wind;
      case WeatherIcons.THUNDERSTORM:
        return thunderstorm;
      case 'precip':
        return precip;
      default:
        return '';
    }
  }
}
