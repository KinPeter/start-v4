import { Component, effect, input, output } from '@angular/core';
import { PkButtonComponent } from '../../common/pk-button.component';
import { Activities, SetGoalsRequest } from '@kinpeter/pk-common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';

@Component({
  selector: 'pk-goals-form',
  imports: [
    PkButtonComponent,
    FormsModule,
    PkInputComponent,
    PkInputDirective,
    ReactiveFormsModule,
  ],
  providers: [],
  styles: `
    form {
      padding: 2px;

      > div {
        display: flex;
        gap: 1rem;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
  template: `
    <h2>Set goals</h2>
    <form [formGroup]="form">
      <div>
        <pk-input
          label="Walk weekly goal"
          [withAsterisk]="true"
          [error]="hasError('walkWeeklyGoal') ? 'This is required' : ''"
          width="100%">
          <input pkInput placeholder="Goal in km" type="number" formControlName="walkWeeklyGoal" />
        </pk-input>
        <pk-input
          label="Walk monthly goal"
          [withAsterisk]="true"
          [error]="hasError('walkMonthlyGoal') ? 'This is required' : ''"
          width="100%">
          <input pkInput placeholder="Goal in km" type="number" formControlName="walkMonthlyGoal" />
        </pk-input>
      </div>
      <div>
        <pk-input
          label="Cycling weekly goal"
          [withAsterisk]="true"
          [error]="hasError('cyclingWeeklyGoal') ? 'This is required' : ''"
          width="100%">
          <input
            pkInput
            placeholder="Goal in km"
            type="number"
            formControlName="cyclingWeeklyGoal" />
        </pk-input>
        <pk-input
          label="Cycling monthly goal"
          [withAsterisk]="true"
          [error]="hasError('cyclingMonthlyGoal') ? 'This is required' : ''"
          width="100%">
          <input
            pkInput
            placeholder="Goal in km"
            type="number"
            formControlName="cyclingMonthlyGoal" />
        </pk-input>
      </div>
      <div class="actions">
        <pk-button (onClick)="cancel.emit()">Cancel</pk-button>
        <pk-button
          variant="filled"
          [disabled]="form.invalid || loading()"
          [loading]="loading()"
          (onClick)="save.emit(form.value)"
          >Save</pk-button
        >
      </div>
    </form>
  `,
})
export class GoalsFormComponent {
  public data = input<Activities | null>(null);
  public loading = input<boolean>(false);

  public cancel = output<void>();
  public save = output<SetGoalsRequest>();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      walkWeeklyGoal: [0, [Validators.required, Validators.min(0)]],
      walkMonthlyGoal: [0, [Validators.required, Validators.min(0)]],
      cyclingWeeklyGoal: [0, [Validators.required, Validators.min(0)]],
      cyclingMonthlyGoal: [0, [Validators.required, Validators.min(0)]],
    });

    effect(() => {
      const data = this.data();
      if (data) {
        this.form.reset({
          walkWeeklyGoal: data.walkWeeklyGoal,
          walkMonthlyGoal: data.walkMonthlyGoal,
          cyclingWeeklyGoal: data.cyclingWeeklyGoal,
          cyclingMonthlyGoal: data.cyclingMonthlyGoal,
        });
      }
    });
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }
}
