import { Component, input } from '@angular/core';
import { CircularProgressComponent } from '../../common/circular-progress.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'pk-goals',
  imports: [CircularProgressComponent, NgIcon],
  providers: [],
  styles: `
    .goals {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2.5rem;

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
      }
    }

    h3 > ng-icon {
      font-size: 1.2rem;
      margin-right: 0.25rem;
    }

    p > ng-icon {
      color: var(--color-accent);
      margin-right: 0.5rem;
      position: relative;
      top: 3px;
      font-size: 1.1rem;
    }

    .progress {
      margin-bottom: -10px;
    }
  `,
  template: `
    <div class="goals">
      <div class="week">
        <div class="data">
          <h3><ng-icon [name]="iconName()" />Week</h3>
          <p><ng-icon name="tablerProgressCheck" />{{ weeklyProgress() }}km</p>
          <p><ng-icon name="tablerTargetArrow" />{{ weeklyGoal() }}km</p>
        </div>
        <div class="progress">
          <pk-circular-progress
            [percentage]="(weeklyProgress() / weeklyGoal()) * 100"
            [radius]="25" />
        </div>
      </div>
      <div class="month">
        <div class="data">
          <h3><ng-icon [name]="iconName()" />Month</h3>
          <p><ng-icon name="tablerProgressCheck" />{{ monthlyProgress() }}km</p>
          <p><ng-icon name="tablerTargetArrow" />{{ monthlyGoal() }}km</p>
        </div>
        <div class="progress">
          <pk-circular-progress
            [percentage]="(monthlyProgress() / monthlyGoal()) * 100"
            [radius]="25" />
        </div>
      </div>
    </div>
  `,
})
export class GoalsComponent {
  public iconName = input.required<string>();
  public weeklyGoal = input.required<number>();
  public monthlyGoal = input.required<number>();
  public weeklyProgress = input.required<number>();
  public monthlyProgress = input.required<number>();
}
