import { Injectable, signal } from '@angular/core';
import { SettingsStore } from '../main/settings/settings.store';
import { NotificationService } from './notification.service';

function isSafeOrigin(url: string): boolean {
  const localUrl = /^http:\/\/localhost:\d{4}$/;
  const prodUrl = /^https:\/\/[a-zA-Z]{3,10}\.p-kin\.com$/;

  const isLocal = localUrl.test(window.location.origin);
  return isLocal ? localUrl.test(url) : prodUrl.test(url);
}

const START_CONTEXT = 'START_V4';

@Injectable({ providedIn: 'root' })
export class PostMessengerService {
  private weatherIframe = signal<Window | null>(null);

  constructor(
    private settingsStore: SettingsStore,
    private notificationService: NotificationService
  ) {
    console.log('[HOST] PostMessengerService is UP');
    window.addEventListener('message', event => {
      if (
        event.origin === window.location.origin ||
        !isSafeOrigin(event.origin) ||
        event.data.context !== START_CONTEXT
      ) {
        return;
      }
      console.log('[HOST] Received message:', event.data.topic, event);

      switch (event.data.topic) {
        case 'weather.handshake':
          this.handleWeatherIframe();
          break;
        case 'weather.errorNotification':
          this.notificationService.showError(event.data.payload);
          break;
        case 'weather.infoNotification':
          this.notificationService.showInfo(event.data.payload);
          break;
      }
    });
  }

  public setWeatherIframe(value: HTMLIFrameElement): void {
    this.weatherIframe.set(value.contentWindow);
  }

  public requestWeatherReload(): void {
    this.sendMessageToWeatherWidget('weather.reload');
  }

  private sendMessageToWeatherWidget(topic: string, payload?: unknown): void {
    if (!this.weatherIframe()) {
      throw new Error('Got handshake but no window object for iframe');
    }
    this.weatherIframe()!.postMessage(
      {
        context: START_CONTEXT,
        topic,
        payload,
      },
      '*'
    );
  }

  private handleWeatherIframe(): void {
    const { weatherApiKey, locationApiKey } = this.settingsStore.apiKeys();
    this.sendMessageToWeatherWidget('weather.apiKeys', { weatherApiKey, locationApiKey });
  }
}
