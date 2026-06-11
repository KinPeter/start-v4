import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { GoalsComponent } from './goals.component';
import { Activities } from '../../types';

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
        [monthlyProgress]="activitiesData().cycling.thisMonth"
        [weeklyProgress]="activitiesData().cycling.thisWeek" />
    </div>
  `,
})
export class CyclingGoalsCardComponent {
  public activitiesData = input.required<Activities>();
}
