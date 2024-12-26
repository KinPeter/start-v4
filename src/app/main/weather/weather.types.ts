export interface WeatherUpdate {
  currentWeather: CurrentWeather;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  lastUpdated: Date;
}

export enum WeatherIcons {
  CLEAR_DAY = 'clearDay',
  CLEAR_NIGHT = 'clearNight',
  CLOUDY = 'cloudy',
  FOG = 'fog',
  HAIL = 'hail',
  PARTLY_CLOUDY_DAY = 'partlyCloudyDay',
  PARTLY_CLOUDY_NIGHT = 'partlyCloudyNight',
  RAIN = 'rain',
  SLEET = 'sleet',
  SNOW = 'snow',
  THUNDERSTORM = 'thunderstorm',
  WIND = 'wind',
}

export interface BaseWeather {
  description: string;
  icon: WeatherIcons;
  precipitation?: string;
  wind: string;
}

export interface CurrentWeather extends BaseWeather {
  temperature: number;
  alerts: string[];
}
