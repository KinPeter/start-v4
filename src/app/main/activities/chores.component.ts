import { Component, input } from '@angular/core';
import { StravaAthleteData } from './activities.types';
import { CyclingChore } from '@kinpeter/pk-common';
import { PkCardDirective } from '../../common/pk-card.directive';
import { CircularProgressComponent } from '../../common/circular-progress.component';

@Component({
  selector: 'pk-chores',
  imports: [PkCardDirective, CircularProgressComponent],
  providers: [],
  styles: `
    .card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h3 {
      font-weight: 500;
    }
  `,
  template: `
    @for (chore of chores(); track chore.id) {
      <div pkCard class="card">
        <div>
          <h3>{{ chore.name }}</h3>
          <p>{{ stravaData().primaryBike.distance - chore.lastKm }} / {{ chore.kmInterval }}km</p>
          < ... buttons >
        </div>
        <div>
          <pk-circular-progress
            [percentage]="
              (stravaData().primaryBike.distance - chore.lastKm) / chore.kmInterval / 100
            "
            [radius]="35" />
        </div>
      </div>
    }
  `,
})
export class ChoresComponent {
  public stravaData = input.required<StravaAthleteData>();
  public chores = input.required<CyclingChore[]>();
}
