import { AfterViewInit, Component, computed, ElementRef, Signal, viewChild } from '@angular/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostMessengerService } from '../../services/post-messenger.service';
import { WeatherService } from './weather.service';

@Component({
  selector: 'pk-weather',
  imports: [PkWidgetDirective, NgIcon, PkIconButtonComponent],
  providers: [],
  styles: `
    .container {
      height: 632px;
    }

    main {
      display: flex;
      height: 92%;
    }

    iframe {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      border: none;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Weather</h1>
        <div class="actions">
          <pk-icon-button [tooltip]="updatedText()" (onClick)="refresh()">
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        <iframe
          [src]="iframeSrc()"
          title="Weather iframe"
          allow="geolocation *"
          #weatherFrame></iframe>
      </main>
    </div>
  `,
})
export class WeatherComponent implements AfterViewInit {
  public iframeSrc: Signal<SafeResourceUrl>;
  public iframe = viewChild.required<ElementRef<HTMLIFrameElement>>('weatherFrame');
  public updatedText: Signal<string>;

  constructor(
    private widgetsBarService: WidgetsBarService,
    private postMessengerService: PostMessengerService,
    private weatherService: WeatherService,
    private sanitizer: DomSanitizer
  ) {
    this.iframeSrc = computed(() => {
      const url = window.location.hostname.includes('localhost')
        ? 'http://localhost:5173/'
        : 'https://weather.p-kin.com/';
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
    this.updatedText = this.weatherService.updatedText;
  }

  ngAfterViewInit() {
    this.postMessengerService.setWeatherIframe(this.iframe().nativeElement);
  }

  public close(): void {
    this.widgetsBarService.toggleWeather();
  }

  public refresh() {
    this.postMessengerService.requestWeatherReload();
  }
}
