import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { GoalsComponent } from './goals.component';
import { Activities } from '../../types';

@Component({
  selector: 'pk-steps-goals-card',
  imports: [PkCardDirective, GoalsComponent],
  providers: [],
  styles: ``,
  template: `
    <div pkCard class="card">
      <pk-goals
        [iconName]="'tablerWalk'"
        [showKms]="false"
        [monthlyGoal]="activitiesData().stepsMonthlyGoal ?? 0"
        [weeklyGoal]="activitiesData().stepsWeeklyGoal ?? 0"
        [monthlyProgress]="activitiesData().steps.thisMonth"
        [weeklyProgress]="activitiesData().steps.thisWeek" />
    </div>
  `,
})
export class StepsGoalsCardComponent {
  public activitiesData = input.required<Activities>();
}
