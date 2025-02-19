import { Component, Signal } from '@angular/core';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { TripsService } from './trips.service';
import { Flight } from '@kinpeter/pk-common';
import { UpcomingFlightsComponent } from './upcoming-flights.component';

@Component({
  selector: 'pk-trips',
  imports: [
    FocusFirstDirective,
    NgIcon,
    PkIconButtonComponent,
    PkLoaderComponent,
    PkWidgetDirective,
    UpcomingFlightsComponent,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 120px;
    }

    main .loader {
      margin-top: 5%;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Trips</h1>
        <div class="actions">
          <pk-icon-button tooltip="Close" (onClick)="close()" pkFocusFirst>
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else {
          <pk-upcoming-flights [flights]="upcomingFlights()" />
        }
      </main>
    </div>
  `,
})
export class TripsComponent {
  public loading: Signal<boolean>;
  public upcomingFlights: Signal<Flight[]>;

  constructor(
    private tripsService: TripsService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.upcomingFlights = this.tripsService.upcomingFlights;
    this.loading = this.tripsService.loading;
  }

  public close(): void {
    this.widgetsBarService.toggleTrips();
  }
}
