import { Component, computed, input, signal } from '@angular/core';
import { Flight } from '@kinpeter/pk-common';
import { FlightCardComponent } from './flight-card.component';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'pk-upcoming-flights',
  imports: [FlightCardComponent, PkIconButtonComponent, NgIcon],
  providers: [],
  styles: `
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-primary);

      span {
        position: relative;
        top: -2px;
      }
    }

    .no-flights {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }
  `,
  template: `
    @if (flights().length && selectedFlight()) {
      <pk-flight-card [flight]="selectedFlight()!" />
      <div class="pagination">
        <pk-icon-button tooltip="Previous" [disabled]="current() === 0" (onClick)="showPrevious()">
          <ng-icon name="tablerChevronLeft" size="1rem" />
        </pk-icon-button>
        <span>{{ current() + 1 }} / {{ flights().length }}</span>
        <pk-icon-button
          tooltip="Next"
          [disabled]="current() === flights().length - 1"
          (onClick)="showNext()">
          <ng-icon name="tablerChevronRight" size="1rem" />
        </pk-icon-button>
      </div>
    } @else {
      <div class="no-flights">No upcoming flights</div>
    }
  `,
})
export class UpcomingFlightsComponent {
  public flights = input.required<Flight[]>();
  public current = signal(0);

  public selectedFlight = computed<Flight | null>(() => {
    if (!this.flights().length) return null;
    return this.flights()[this.current()];
  });

  public showPrevious(): void {
    this.current.update(value => value - 1);
  }

  public showNext(): void {
    this.current.update(value => value + 1);
  }
}
