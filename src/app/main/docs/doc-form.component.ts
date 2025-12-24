import { Component, effect, input, output, Signal, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/pk-button.component';
import { Document, DocumentRequest } from '../../types';
import { MarkedPipe } from '../../common/marked.pipe';
import { DocsService } from './docs.service';

@Component({
  selector: 'pk-doc-form',
  imports: [
    PkIconButtonComponent,
    PkInputComponent,
    PkInputDirective,
    ReactiveFormsModule,
    PkIconButtonComponent,
    NgIcon,
    PkButtonComponent,
    MarkedPipe,
  ],
  providers: [],
  styles: `
    form {
      padding: 2px;
    }

    .first-row {
      display: flex;
      align-items: center;
      gap: 8px;

      pk-input {
        flex: 1;
      }

      pk-icon-button {
        margin-top: -16px;
      }
    }

    .tags {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      pk-button {
        margin-top: 4px;
      }
    }

    .tag-form {
      display: flex;
      align-items: center;

      pk-icon-button {
        position: relative;
        top: -9px;
        margin-left: -31px;
      }
    }

    .preview {
      padding: 1rem 0;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .actions .right {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `,
  template: `
    <form [formGroup]="form">
      <div class="first-row">
        <pk-input width="100%" [error]="hasError('title') ? 'Title is required' : ''">
          <input pkInput title="Title" placeholder="Title" type="text" formControlName="title" />
        </pk-input>
        <pk-icon-button tooltip="Toggle preview" (onClick)="togglePreviewMode()">
          <ng-icon [name]="isPreviewMode() ? 'tablerEyeOff' : 'tablerEye'" size="1.5rem" />
        </pk-icon-button>
      </div>
      @if (isPreviewMode()) {
        <div class="preview markdown-text" [innerHTML]="form.get('content')?.value | marked"></div>
      } @else {
        <pk-input width="100%" [error]="hasError('content') ? 'Content is required' : ''">
          <textarea
            pkInput
            title="Content"
            placeholder="Document content"
            formControlName="content"
            rows="24"></textarea>
        </pk-input>
      }
      <div class="tags">
        <pk-input width="150px" type="select">
          <select pkInput name="Existing tags" (change)="addExistingTag($event)">
            <option value="" disabled selected>Existing tags</option>
            @for (item of existingTags(); track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </pk-input>
        @for (tag of tags; let idx = $index; track idx) {
          <div class="tag-form">
            <pk-input width="150px" [error]="hasTagError(idx) ? 'Tag is required' : ''">
              <input pkInput title="Tag" placeholder="Custom tag" type="text" [formControl]="tag" />
            </pk-input>
            <pk-icon-button tooltip="Remove" (onClick)="removeTag(idx)">
              <ng-icon name="tablerTrash" size="1rem" />
            </pk-icon-button>
          </div>
        }
        <pk-button (onClick)="addTag()" [iconPrefix]="true">
          <ng-icon name="tablerPlus" size="1rem" />
          Tag
        </pk-button>
      </div>
      <div class="actions">
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
export class DocFormComponent {
  public document = input<Document | null>(null);
  public loading = input<boolean>(false);

  public cancel = output<void>();
  public save = output<DocumentRequest>();

  public existingTags: Signal<string[]>;

  public isPreviewMode = signal(false);

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private docsService: DocsService
  ) {
    this.existingTags = this.docsService.tags;

    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      tags: formBuilder.array([]),
      content: ['', [Validators.required, Validators.minLength(1)]],
    });

    effect(() => {
      const document = this.document();
      if (document) {
        this.form.get('content')?.setValue(document.content ?? '');
        this.form.get('title')?.setValue(document.title ?? '');
        const formArray = this.form.get('tags') as FormArray;
        formArray.clear();
        if (document.tags) {
          document.tags.forEach(tag => {
            formArray.push(
              this.formBuilder.control(tag, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(16),
              ])
            );
          });
        }
      }
    });
  }

  public get tags(): FormControl[] {
    return (this.form.get('tags') as FormArray).controls as FormControl[];
  }

  public addTag(): void {
    const tags = this.form.get('tags') as FormArray;
    tags.push(
      this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ])
    );
  }

  public addExistingTag(event: Event): void {
    const tag = (event.target as HTMLSelectElement).value;
    const tags = this.form.get('tags') as FormArray;
    if (tags.controls.some(control => control.value === tag)) {
      return;
    }
    tags.push(
      this.formBuilder.control(tag, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ])
    );
  }

  public removeTag(index: number): void {
    const tags = this.form.get('tags') as FormArray;
    tags.removeAt(index);
  }

  public hasError(formControlName: string): boolean {
    const control = this.form?.get(formControlName);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }

  public hasTagError(index: number): boolean {
    const control = (this.form?.get('tags') as FormArray).at(index);
    return (control?.errors && (control?.dirty || !control?.untouched)) ?? false;
  }

  public togglePreviewMode(): void {
    this.isPreviewMode.set(!this.isPreviewMode());
  }
}
