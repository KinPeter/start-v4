import { Component, output, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { SettingsService } from './settings.service';
import { parseError } from '../../utils/parse-error';
import { SettingsStore } from './settings.store';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../utils/validators';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { PkButtonComponent } from '../../common/pk-button.component';
import { PkStartSettingsRequest } from '../../types';

@Component({
  selector: 'pk-settings',
  imports: [PkInputComponent, PkInputDirective, ReactiveFormsModule, PkButtonComponent],
  providers: [],
  styles: `
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `,
  template: `
    <div class="container">
      <form [formGroup]="form">
        <pk-input label="Display name" width="100%">
          <input pkInput formControlName="name" type="text" />
        </pk-input>
        <pk-input
          label="Shortcut tiles icon base URL"
          width="100%"
          [error]="form.get('shortcutIconBaseUrl')?.errors ? 'Invalid URL' : ''">
          <input pkInput formControlName="shortcutIconBaseUrl" type="text" />
        </pk-input>
        <pk-input label="Strava OAuth redirect URL" width="100%">
          <input pkInput formControlName="stravaRedirectUri" type="text" />
        </pk-input>
        <div class="actions">
          <pk-button (onClick)="done.emit()">Cancel</pk-button>
          <pk-button
            variant="filled"
            (onClick)="saveSettings()"
            [disabled]="form.invalid || loading()"
            [loading]="loading()"
            >Save</pk-button
          >
        </div>
      </form>
    </div>
  `,
})
export class SettingsComponent {
  public loading = signal(false);
  public done = output();
  public form: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private settingsStore: SettingsStore,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder
  ) {
    const data = this.settingsStore.allState;
    this.form = this.formBuilder.group({
      name: [data.name],
      shortcutIconBaseUrl: [data.shortcutIconBaseUrl, CustomValidators.url],
      stravaRedirectUri: [data.stravaRedirectUri],
    });
  }

  public saveSettings(): void {
    this.loading.set(true);
    const values: PkStartSettingsRequest = {
      name: this.form.get('name')?.value || null,
      shortcutIconBaseUrl: this.form.get('shortcutIconBaseUrl')?.value || null,
      stravaRedirectUri: this.form.get('stravaRedirectUri')?.value || null,
    };

    this.settingsService.saveSettings(values).subscribe({
      next: res => {
        this.settingsStore.setSettings(res);
        this.notificationService.showSuccess('Settings have been saved');
        this.loading.set(false);
        this.done.emit();
      },
      error: err => {
        this.notificationService.showError('Unable to save settings. ' + parseError(err));
        this.loading.set(false);
      },
    });
  }
}
