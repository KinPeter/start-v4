import { Component, effect, input, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '@kinpeter/pk-common';
import { CustomValidators } from '../../utils/validators';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/pk-button.component';

@Component({
  selector: 'pk-note-form',
  imports: [
    PkInputComponent,
    PkInputDirective,
    ReactiveFormsModule,
    PkIconButtonComponent,
    NgIcon,
    PkButtonComponent,
  ],
  providers: [],
  styles: `
    .link-form {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-top: 1px solid var(--color-border);
      padding-top: 0.75rem;

      .inputs {
        flex-grow: 1;
      }

      pk-icon-button {
        position: relative;
        top: -7px;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .actions .right {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `,
  template: `
    <h2>{{ note() ? 'Edit note' : 'New note' }}</h2>
    <form [formGroup]="form">
      <pk-input width="100%">
        <textarea
          pkInput
          title="Text"
          placeholder="Note text"
          formControlName="text"
          rows="4"></textarea>
      </pk-input>
      @for (link of links; let idx = $index; track idx) {
        <div [formGroup]="link" class="link-form">
          <div class="inputs">
            <pk-input width="100%" [error]="hasError(idx, 'name') ? 'Name is required' : ''">
              <input pkInput title="Name" placeholder="Name" type="text" formControlName="name" />
            </pk-input>
            <pk-input width="100%" [error]="hasError(idx, 'url') ? 'Invalid URL' : ''">
              <input pkInput title="Url" placeholder="Url" type="text" formControlName="url" />
            </pk-input>
          </div>
          <pk-icon-button tooltip="Remove" (onClick)="removeLink(idx)">
            <ng-icon name="tablerTrash" size="1rem" />
          </pk-icon-button>
        </div>
      }
      <div class="actions">
        <pk-button (onClick)="addLink()" [iconPrefix]="true">
          <ng-icon name="tablerPlus" size="1rem" />
          Link
        </pk-button>
        <div class="right">
          <pk-button (onClick)="cancel.emit()">Cancel</pk-button>
          <pk-button
            variant="filled"
            [disabled]="form.invalid || loading()"
            [loading]="loading()"
            (onClick)="save.emit(form.value)"
            >Save</pk-button
          >
        </div>
      </div>
    </form>
  `,
})
export class NoteFormComponent {
  public note = input<Note | null>(null);
  public loading = input<boolean>(false);

  public cancel = output<void>();
  public save = output<Note>();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      text: [''],
      links: formBuilder.array([]),
    });

    effect(() => {
      const note = this.note();
      if (note) {
        this.form.get('text')?.setValue(note.text ?? '');
        if (note.links) {
          const formArray = this.form.get('links') as FormArray;
          note.links.forEach(link => {
            formArray.push(
              this.formBuilder.group({
                name: [link.name, Validators.required],
                url: [link.url, [Validators.required, CustomValidators.url]],
              })
            );
          });
        }
      }
    });
  }

  public get links(): FormGroup[] {
    return (this.form.get('links') as FormArray).controls as FormGroup[];
  }

  public addLink(): void {
    const links = this.form.get('links') as FormArray;
    links.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        url: ['', [Validators.required, CustomValidators.url]],
      })
    );
  }

  public removeLink(index: number): void {
    const links = this.form.get('links') as FormArray;
    links.removeAt(index);
  }

  public hasError(index: number, formControlName: string): boolean {
    const control = (this.form?.get('links') as FormArray).at(index).get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }
}
