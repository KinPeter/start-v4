import { Component, effect, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PkButtonComponent } from '../../common/pk-button.component';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { CyclingChore, CyclingChoreRequest } from '../../types';

@Component({
  selector: 'pk-chore-form',
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
    <h2>{{ data() ? 'Edit chore' : 'New cycling chore' }}</h2>
    <form [formGroup]="form">
      <pk-input
        label="Name"
        [withAsterisk]="true"
        [error]="hasError('name') ? 'Name is required' : ''"
        width="100%">
        <input pkInput placeholder="e.g. Wax the chain" type="text" formControlName="name" />
      </pk-input>
      <div>
        <pk-input
          label="Interval"
          [withAsterisk]="true"
          [error]="hasError('kmInterval') ? 'This is required' : ''"
          width="100%">
          <input pkInput placeholder="Interval in km" type="number" formControlName="kmInterval" />
        </pk-input>
        <pk-input
          label="Last km"
          [withAsterisk]="true"
          [error]="hasError('lastKm') ? 'This is required' : ''"
          width="100%">
          <input
            pkInput
            placeholder="Last km when the chore was completed"
            type="number"
            formControlName="lastKm" />
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
export class ChoreFormComponent {
  public data = input<CyclingChore | null>(null);
  public loading = input<boolean>(false);

  public cancel = output<void>();
  public save = output<CyclingChoreRequest>();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      kmInterval: [0, [Validators.required, Validators.min(0)]],
      lastKm: [0, [Validators.required, Validators.min(0)]],
    });

    effect(() => {
      const data = this.data();
      if (data) {
        this.form.reset({
          name: data.name,
          kmInterval: data.kmInterval,
          lastKm: data.lastKm,
        });
      }
    });
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }
}
