import { Component, effect, input, output } from '@angular/core';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PkButtonComponent } from '../../common/pk-button.component';
import { CustomValidators } from '../../utils/validators';
import { ShortcutCategory } from '../../constants';
import { Shortcut, ShortcutRequest } from '@kinpeter/pk-common';

@Component({
  selector: 'pk-shortcuts-form',
  imports: [PkInputComponent, PkInputDirective, ReactiveFormsModule, PkButtonComponent],
  providers: [],
  styles: `
    .form-row {
      display: flex;
      gap: 1rem;
      justify-content: space-between;

      > pk-input {
        flex-grow: 1;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `,
  template: `
    <div class="container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <h2>{{ data() ? 'Edit ' + data()?.name : 'New shortcut' }}</h2>
        <div class="form-row ">
          <pk-input
            label="Name"
            width="100%"
            [withAsterisk]="true"
            [error]="hasError('name') ? 'Name is required' : ''">
            <input pkInput formControlName="name" type="text" />
          </pk-input>
          <pk-input
            label="URL"
            width="100%"
            [withAsterisk]="true"
            [error]="hasError('url') ? 'Invalid URL' : ''">
            <input pkInput formControlName="url" type="text" />
          </pk-input>
        </div>
        <div class="form-row ">
          <pk-input
            label="Icon URL"
            width="100%"
            [withAsterisk]="true"
            [error]="hasError('iconUrl') ? 'Icon URL is required' : ''">
            <input pkInput formControlName="iconUrl" type="text" />
          </pk-input>
          <pk-input label="Category" width="100%" type="select">
            <select pkInput name="category" formControlName="category">
              @for (item of categories; track item) {
                <option [value]="item">{{ item }}</option>
              }
            </select>
          </pk-input>
          <pk-input label="Priority" width="100%" type="select">
            <select pkInput name="priority" formControlName="priority">
              @for (item of priorities; track item) {
                <option [value]="item">{{ item }}</option>
              }
            </select>
          </pk-input>
        </div>
        <div class="actions">
          <pk-button (onClick)="onCancel()">Cancel</pk-button>
          <pk-button
            variant="filled"
            type="submit"
            [disabled]="form.invalid || loading()"
            [loading]="loading()"
            >Save</pk-button
          >
        </div>
      </form>
    </div>
  `,
})
export class ShortcutsFormComponent {
  public loading = input(false);
  public data = input<Shortcut | null>();
  public cancel = output<void>();
  public save = output<ShortcutRequest>();
  public form: FormGroup;
  public categories = Object.values(ShortcutCategory);
  public priorities = [1, 2, 3, 4, 5];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', [CustomValidators.strictUrl, Validators.required]],
      iconUrl: ['', Validators.required],
      category: [ShortcutCategory.TOP, Validators.required],
      priority: [1, Validators.required],
    });
    effect(() => {
      if (this.data()) {
        const { name, url, iconUrl, category, priority } = this.data() as Shortcut;
        this.form.setValue({
          name,
          url,
          iconUrl,
          category,
          priority,
        });
      } else {
        this.resetForm();
      }
    });
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }

  public onSubmit(): void {
    this.save.emit(this.form.value);
  }

  public onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      url: '',
      iconUrl: '',
      category: ShortcutCategory.TOP,
      priority: 1,
    });
  }
}
