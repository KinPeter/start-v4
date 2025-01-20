import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { StravaAthleteData } from './activities.types';
import { Activities } from '@kinpeter/pk-common';
import { CircularProgressComponent } from '../../common/circular-progress.component';

@Component({
  selector: 'pk-walk-card',
  imports: [PkCardDirective, CircularProgressComponent],
  providers: [],
  styles: ``,
  template: `
    <div pkCard class="card">
      <pk-circular-progress [percentage]="36" [radius]="25"></pk-circular-progress>
      <pk-circular-progress [percentage]="77" [radius]="85"></pk-circular-progress>
    </div>
  `,
})
export class WalkCardComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
