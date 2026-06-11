import { Component, input } from '@angular/core';
import { PkCardDirective } from '../../common/pk-card.directive';
import { GoalsComponent } from './goals.component';
import { Activities } from '../../types';

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
        [monthlyProgress]="activitiesData().walk.thisMonth"
        [weeklyProgress]="activitiesData().walk.thisWeek" />
    </div>
  `,
})
export class WalkGoalsCardComponent {
  public activitiesData = input.required<Activities>();
}
