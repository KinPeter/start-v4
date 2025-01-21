import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { StravaAthleteData } from './activities.types';
import { Activities } from '@kinpeter/pk-common';
import { GoalsComponent } from './goals.component';

@Component({
  selector: 'pk-cycling-goals-card',
  imports: [PkCardDirective, GoalsComponent],
  providers: [],
  styles: ``,
  template: `
    <div pkCard class="card">
      <pk-goals
        [iconName]="'tablerBike'"
        [monthlyGoal]="activitiesData().cyclingMonthlyGoal ?? 0"
        [weeklyGoal]="activitiesData().cyclingWeeklyGoal ?? 0"
        [monthlyProgress]="stravaData().rideThisMonth.distance"
        [weeklyProgress]="stravaData().rideThisWeek.distance" />
    </div>
  `,
})
export class CyclingGoalsCardComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
