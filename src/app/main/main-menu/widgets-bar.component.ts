import { Component } from '@angular/core';
import { WidgetsBarService } from './widgets-bar.service';
import { WidgetToggleComponent } from './widget-toggle.component';

@Component({
  selector: 'pk-widgets-bar',
  standalone: true,
  imports: [WidgetToggleComponent],
  providers: [],
  styles: `
    .widgets {
      display: flex;
      align-items: center;
    }
  `,
  template: `
    <div class="widgets">
      <pk-widget-toggle
        widget="notes"
        [open]="service.notesOpen()"
        (toggle)="service.toggleNotes()" />
      <pk-widget-toggle
        widget="cycling"
        [open]="service.cyclingOpen()"
        (toggle)="service.toggleCycling()" />
      <pk-widget-toggle
        widget="personalData"
        [open]="service.personalDataOpen()"
        (toggle)="service.togglePersonalData()" />
      <pk-widget-toggle
        widget="birthdays"
        [open]="service.birthdaysOpen()"
        (toggle)="service.toggleBirthdays()" />
      <pk-widget-toggle
        widget="korean"
        [open]="service.koreanOpen()"
        (toggle)="service.toggleKorean()" />
      <pk-widget-toggle
        widget="weather"
        [open]="service.weatherOpen()"
        (toggle)="service.toggleWeather()" />
    </div>
  `,
})
export class WidgetsBarComponent {
  constructor(public service: WidgetsBarService) {}
}
