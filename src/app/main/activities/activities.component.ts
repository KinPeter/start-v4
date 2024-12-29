import { Component, Signal } from '@angular/core';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { StravaApiService } from './strava-api.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { NgOptimizedImage } from '@angular/common';
import { ActivitiesService } from './activities.service';

@Component({
  selector: 'pk-activities',
  imports: [PkWidgetDirective, NgIcon, PkIconButtonComponent, PkLoaderComponent, NgOptimizedImage],
  providers: [],
  styles: `
    .container {
      min-height: 300px;
    }

    .loader,
    .not-available,
    .connect {
      margin-top: 25%;
      display: flex;
      justify-content: center;

      p {
        text-align: center;
      }
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Activities</h1>
        <div class="actions">
          <pk-icon-button
            tooltip="Refresh"
            (onClick)="refresh()"
            [disabled]="loading() || needAuth() || disabled()">
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (disabled()) {
          <div class="not-available">
            <p>Strava service is not available.</p>
          </div>
        } @else if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else if (needAuth()) {
          <div class="connect">
            <a [href]="stravaOauthUrl()">
              <img
                ngSrc="assets/connect.png"
                priority
                alt="Connect with Strava"
                height="48"
                width="193" />
            </a>
          </div>
        } @else {
          <p>Logged in!</p>
        }
      </main>
    </div>
  `,
})
export class ActivitiesComponent {
  public disabled: Signal<boolean>;
  public needAuth: Signal<boolean>;
  public loading: Signal<boolean>;
  public stravaOauthUrl: Signal<string>;

  constructor(
    private widgetsBarService: WidgetsBarService,
    private stravaApiService: StravaApiService,
    private activitiesService: ActivitiesService
  ) {
    this.disabled = this.stravaApiService.disabled;
    this.needAuth = this.stravaApiService.needAuth;
    this.loading = this.stravaApiService.loading;
    this.stravaOauthUrl = this.stravaApiService.stravaOauthUrl;
  }

  public close(): void {
    this.widgetsBarService.toggleActivities();
  }

  public refresh() {
    this.stravaApiService.fetchStravaData();
  }
}
