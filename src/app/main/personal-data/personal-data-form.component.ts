import { Component, effect, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalData } from '@kinpeter/pk-common';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { PkButtonComponent } from '../../common/pk-button.component';

@Component({
  selector: 'pk-personal-data-form',
  imports: [PkInputComponent, PkInputDirective, ReactiveFormsModule, PkButtonComponent],
  providers: [],
  styles: `
    .data-form {
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
  template: `
    <h2>{{ data() ? 'Edit personal data' : 'New personal data' }}</h2>
    <form [formGroup]="form">
      <pk-input
        label="Name"
        [withAsterisk]="true"
        [error]="hasError('name') ? 'Name is required' : ''"
        width="100%">
        <input pkInput placeholder="Name" type="text" formControlName="name" />
      </pk-input>
      <pk-input
        label="Identifier"
        [withAsterisk]="true"
        [error]="hasError('identifier') ? 'Identifier is required' : ''"
        width="100%">
        <input pkInput placeholder="Identifier" type="text" formControlName="identifier" />
      </pk-input>
      <pk-input label="Expiry date" width="100%">
        <input pkInput placeholder="YYYY-MM-DD" type="text" formControlName="expiry" />
      </pk-input>
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
export class PersonalDataFormComponent {
  public data = input<PersonalData | null>(null);
  public loading = input<boolean>(false);

  public cancel = output<void>();
  public save = output<PersonalData>();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      identifier: ['', [Validators.required]],
      expiry: [undefined],
    });

    effect(() => {
      const data = this.data();
      if (data) {
        this.form.reset({
          name: data.name,
          identifier: data.identifier,
          expiry: data.expiry,
        });
      }
    });
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }
}
