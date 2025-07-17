import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { GoalsComponent } from './goals.component';
import { Activities, StravaAthleteData } from '../../types';

@Component({
  selector: 'pk-walk-goals-card',
  imports: [PkCardDirective, GoalsComponent],
  providers: [],
  styles: ``,
  template: `
    <div pkCard class="card">
      <pk-goals
        [iconName]="'tablerWalk'"
        [monthlyGoal]="activitiesData().walkMonthlyGoal ?? 0"
        [weeklyGoal]="activitiesData().walkWeeklyGoal ?? 0"
        [monthlyProgress]="stravaData().walkThisMonth.distance"
        [weeklyProgress]="stravaData().walkThisWeek.distance" />
    </div>
  `,
})
export class WalkGoalsCardComponent {
  public stravaData = input.required<StravaAthleteData>();
  public activitiesData = input.required<Activities>();
}
