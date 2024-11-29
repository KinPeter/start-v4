import { Component } from '@angular/core';
import { WidgetsBarService } from './widgets-bar.service';
import { WidgetToggleComponent } from './widget-toggle.component';

@Component({
  selector: 'pk-widgets-bar',
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
        widget="Notes"
        [open]="service.notesOpen()"
        (toggle)="service.toggleNotes()" />
      <pk-widget-toggle
        widget="Cycling"
        [open]="service.cyclingOpen()"
        (toggle)="service.toggleCycling()" />
      <pk-widget-toggle
        widget="Personal Data"
        [open]="service.personalDataOpen()"
        (toggle)="service.togglePersonalData()" />
      <pk-widget-toggle
        widget="Birthdays"
        [open]="service.birthdaysOpen()"
        (toggle)="service.toggleBirthdays()" />
      <pk-widget-toggle
        widget="Korean"
        [open]="service.koreanOpen()"
        (toggle)="service.toggleKorean()" />
      <pk-widget-toggle
        widget="Weather"
        [open]="service.weatherOpen()"
        (toggle)="service.toggleWeather()" />
    </div>
  `,
})
export class WidgetsBarComponent {
  constructor(public service: WidgetsBarService) {}
}
