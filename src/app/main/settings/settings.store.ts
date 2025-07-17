import { computed, Injectable } from '@angular/core';
import { StoreKeys } from '../../constants';
import { LocalStore } from '../../utils/store';
import { PkStartSettings } from '../../types';

export type UserSettings = Omit<PkStartSettings, 'userId'>;

const initialState: UserSettings = {
  shortcutIconBaseUrl: null,
  openWeatherApiKey: null,
  locationIqApiKey: null,
  unsplashApiKey: null,
  stravaClientId: null,
  stravaClientSecret: null,
  stravaRedirectUri: null,
  name: null,
  id: '',
};

@Injectable({ providedIn: 'root' })
export class SettingsStore extends LocalStore<UserSettings> {
  constructor() {
    super(StoreKeys.SETTINGS, { ...initialState });
  }

  public apiKeys = computed(() => {
    const { openWeatherApiKey, locationIqApiKey, unsplashApiKey } = this.state();
    return { openWeatherApiKey, locationIqApiKey, unsplashApiKey };
  });

  public stravaSettings = computed(() => {
    const { stravaClientId, stravaClientSecret, stravaRedirectUri } = this.state();
    return { stravaClientId, stravaClientSecret, stravaRedirectUri };
  });

  public get shortcutIconBaseUrl(): string | null {
    return this.state().shortcutIconBaseUrl;
  }

  public get allState(): UserSettings {
    return { ...this.state() };
  }

  public setSettings(settings: UserSettings): void {
    this.setState(settings);
  }

  public clearSettings(): void {
    this.setState({ ...initialState });
  }
}
