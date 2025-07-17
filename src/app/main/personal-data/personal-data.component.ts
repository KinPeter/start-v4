import { Component, effect, signal, Signal, WritableSignal } from '@angular/core';
import { PersonalDataService } from './personal-data.service';
import { NotificationService } from '../../services/notification.service';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PersonalDataCardComponent } from './personal-data-card.component';
import { parseError } from '../../utils/parse-error';
import { PersonalDataFormComponent } from './personal-data-form.component';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import { PersonalData, PersonalDataRequest, UUID } from '../../types';

@Component({
  selector: 'pk-personal-data',
  imports: [
    NgIcon,
    PkIconButtonComponent,
    PkWidgetDirective,
    PkLoaderComponent,
    PersonalDataCardComponent,
    PersonalDataFormComponent,
    PkInputComponent,
    PkInputDirective,
    FocusFirstDirective,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 120px;
    }

    .data-form {
      padding: 2px;
    }

    main .loader {
      margin-top: 5%;
    }

    .search {
      padding: 2px;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Personal Data</h1>
        <div class="actions">
          <pk-icon-button tooltip="Create personal data" (onClick)="startNewData()" pkFocusFirst>
            <ng-icon name="tablerPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (isEditing()) {
          <div class="data-form">
            <pk-personal-data-form
              [data]="dataToEdit()"
              (save)="saveData($event)"
              (cancel)="cancelEditing()" />
          </div>
        } @else if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else {
          <div class="search">
            <pk-input width="100%">
              <input
                pkInput
                title="Search"
                placeholder="Search"
                type="text"
                (input)="search($event)" />
            </pk-input>
          </div>
          @for (item of results(); track item.id) {
            <pk-personal-data-card
              [data]="item"
              (edit)="startEditData($event)"
              (delete)="deleteData($event)" />
          }
        }
      </main>
    </div>
  `,
})
export class PersonalDataComponent {
  public loading: Signal<boolean>;
  public data: Signal<PersonalData[]>;
  public results: WritableSignal<PersonalData[]> = signal([]);
  public isEditing = signal(false);
  public dataToEdit: WritableSignal<PersonalData | null> = signal(null);

  constructor(
    private personalDataService: PersonalDataService,
    private notificationService: NotificationService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.data = this.personalDataService.data;
    this.loading = this.personalDataService.loading;

    effect(() => {
      if (this.data()) {
        this.results.set([]);
      }
    });
  }

  public close(): void {
    this.widgetsBarService.togglePersonalData();
  }

  public startNewData(): void {
    this.dataToEdit.set(null);
    this.isEditing.set(true);
  }

  public startEditData(id: UUID): void {
    const data = this.data().find(d => d.id === id);
    if (!data) return;
    this.dataToEdit.set(data);
    this.isEditing.set(true);
  }

  public cancelEditing(): void {
    this.dataToEdit.set(null);
    this.isEditing.set(false);
    this.results.set([]);
  }

  public search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value === ' ') {
      this.results.set([...this.data()]);
    } else if (value === '') {
      this.results.set([]);
    } else {
      this.results.set(
        this.data().filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()))
      );
    }
  }

  public saveData(values: PersonalDataRequest): void {
    const dataToEdit = this.dataToEdit();
    if (dataToEdit) {
      const data = {
        ...dataToEdit,
        ...values,
        expiry: values.expiry || null,
      };
      this.personalDataService.updatePersonalData(dataToEdit.id, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Personal data has been updated');
          this.personalDataService.fetchData();
          this.cancelEditing();
        },
        error: e =>
          this.notificationService.showError('Failed to update Personal data: ' + parseError(e)),
      });
    } else {
      const data = {
        ...values,
        expiry: values.expiry || null,
      };
      this.personalDataService.createPersonalData(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Personal data has been created');
          this.personalDataService.fetchData();
          this.cancelEditing();
        },
        error: e =>
          this.notificationService.showError('Failed to create Personal data: ' + parseError(e)),
      });
    }
  }

  public deleteData(id: UUID): void {
    const data = this.data().find(d => d.id === id);
    if (!data) return;
    this.personalDataService.deletePersonalData(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Personal data has been deleted');
        this.personalDataService.fetchData();
      },
      error: e => this.notificationService.showError('Failed to update data: ' + parseError(e)),
    });
  }
}
