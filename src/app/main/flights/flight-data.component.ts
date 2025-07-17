import { Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { UpperCasePipe } from '@angular/common';
import { Flight } from '../../types';

@Component({
  selector: 'pk-flight-data',
  imports: [NgIcon, UpperCasePipe],
  providers: [],
  styles: `
    .flight {
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;

        &:last-of-type {
          margin-bottom: 0.75rem;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      span:not(.label) {
        font-size: 1.5rem;
        font-family: 'VT323', monospace;
        font-weight: 400;
        font-style: normal;
      }

      .label {
        color: var(--color-text-accent);
        font-family: unset;
        font-size: 0.7rem;
      }

      .from-to {
        > div {
          flex-basis: 33%;
          text-align: center;
        }

        .iata {
          font-size: 2.5rem;
          margin: -6px 0;
        }

        .city {
          font-size: 1rem;
        }
      }
    }
  `,
  template: `
    <div class="flight">
      <div class="row number-dates">
        <div class="info">
          <span class="label">{{ 'flight' | uppercase }}</span>
          <span>{{ flight().flightNumber }}</span>
        </div>
        <div class="info">
          <span class="label">{{ 'date' | uppercase }}</span>
          <span>{{ dayStr() }}</span>
        </div>
        <div class="info">
          <span class="label">{{ 'departure' | uppercase }}</span>
          <span>{{ flight().departureTime.substring(0, 5) }}</span>
        </div>
      </div>
      <div class="row from-to">
        <div class="info">
          <span class="label">{{ 'from' | uppercase }}</span>
          <span class="iata">{{ flight().departureAirport.iata }}</span>
          <span class="city">{{ flight().departureAirport.city | uppercase }}</span>
        </div>
        <ng-icon name="tablerPlane" size="2rem" />
        <div class="info">
          <span class="label">{{ 'to' | uppercase }}</span>
          <span class="iata">{{ flight().arrivalAirport.iata }}</span>
          <span class="city">{{ flight().arrivalAirport.city | uppercase }}</span>
        </div>
      </div>
    </div>
  `,
})
export class FlightDataComponent {
  public flight = input.required<Flight>();
  public dateTime = input.required<Date>();

  public dayStr = computed(() => {
    const dateObj = this.dateTime();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day}${month}`;
  });
}
