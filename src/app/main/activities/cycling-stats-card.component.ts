import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { StravaAthleteData } from '../../types';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'pk-cycling-stats-card',
  imports: [PkCardDirective, NgIcon],
  providers: [],
  styles: `
    h3 {
      b {
        color: var(--color-primary);
      }

      ng-icon {
        font-size: 1.2rem;
        margin-right: 0.25rem;
      }
    }

    .longest-ride {
      margin-top: 0.25rem;

      b {
        color: var(--color-primary);
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;

      ng-icon {
        color: var(--color-accent);
        position: relative;
        top: 1px;
      }

      .title {
        td {
          padding-top: 0.35rem;
        }
      }

      .data {
        border-bottom: 1px solid var(--color-border);

        td {
          padding-bottom: 0.2rem;
        }
      }
    }
  `,
  template: `
    <div pkCard class="card">
      <h3>
        <ng-icon name="tablerBike" />
        <b>{{ stravaData().primaryBike.name }}</b>
        ({{ stravaData().primaryBike.distance }}km)
      </h3>
      <table>
        @if (stravaData().rideThisMonth.activityCount > 0) {
          <tr class="title">
            <td>This month</td>
          </tr>
          <tr class="data">
            <td><ng-icon name="tablerHash" /> {{ stravaData().rideThisMonth.activityCount }}</td>
            <td><ng-icon name="tablerRoad" /> {{ stravaData().rideThisMonth.distance }}km</td>
            <td>
              <ng-icon name="tablerMountain" /> {{ stravaData().rideThisMonth.elevationGain }}m
            </td>
            <td><ng-icon name="tablerClock" /> {{ stravaData().rideThisMonth.movingTime }}hrs</td>
          </tr>
        }
        @if (stravaData().ytdRideTotals.activityCount > 0) {
          <tr class="title">
            <td>This year</td>
          </tr>
          <tr class="data">
            <td><ng-icon name="tablerHash" /> {{ stravaData().ytdRideTotals.activityCount }}</td>
            <td><ng-icon name="tablerRoad" /> {{ stravaData().ytdRideTotals.distance }}km</td>
            <td>
              <ng-icon name="tablerMountain" /> {{ stravaData().ytdRideTotals.elevationGain }}m
            </td>
            <td><ng-icon name="tablerClock" /> {{ stravaData().ytdRideTotals.movingTime }}hrs</td>
          </tr>
        }
        <tr class="title">
          <td>All times</td>
        </tr>
        <tr class="data">
          <td><ng-icon name="tablerHash" /> {{ stravaData().allRideTotals.activityCount }}</td>
          <td><ng-icon name="tablerRoad" /> {{ stravaData().allRideTotals.distance }}km</td>
          <td><ng-icon name="tablerMountain" /> {{ stravaData().allRideTotals.elevationGain }}m</td>
          <td><ng-icon name="tablerClock" /> {{ stravaData().allRideTotals.movingTime }}hrs</td>
        </tr>
      </table>
      <p class="longest-ride">
        Longest ride: <b>{{ stravaData().longestRideEver }}km</b>
      </p>
    </div>
  `,
})
export class CyclingStatsCardComponent {
  public stravaData = input.required<StravaAthleteData>();
}
